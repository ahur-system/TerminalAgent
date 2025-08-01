const debug = require('../debugger');

class RetryManager {
  constructor(maxRetries = 5, baseDelay = 1000, timeout = 30000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
    this.timeout = timeout; // 30 seconds timeout
  }

  // Classify error type to determine if retry is appropriate
  classifyError(error) {
    // Handle timeout errors
    if (error.message === 'Request timeout') {
      return 'connection';
    }
    
    if (!error.response) {
      // Network error (connection issue, proxy problem)
      return 'connection';
    }

    const status = error.response.status;
    const errorMessage = error.response.data?.error?.message || '';

    // 429 = Rate limit/quota exceeded - don't retry
    if (status === 429) {
      return 'quota';
    }

    // 401 = Invalid API key - don't retry
    if (status === 401) {
      return 'auth';
    }

    // 403 = Could be connection issue, quota issue, or auth issue
    if (status === 403) {
      // Check if it's a quota issue disguised as 403
      if (errorMessage.toLowerCase().includes('quota') || 
          errorMessage.toLowerCase().includes('rate limit') ||
          errorMessage.toLowerCase().includes('billing')) {
        return 'quota';
      }
      // Check if it's an auth issue
      if (errorMessage.toLowerCase().includes('invalid') ||
          errorMessage.toLowerCase().includes('unauthorized') ||
          errorMessage.toLowerCase().includes('authentication')) {
        return 'auth';
      }
      // Otherwise, likely connection issue
      return 'connection';
    }

    // 400 = Bad request, could be connection issue or malformed request
    if (status === 400) {
      // Check if it's a malformed request (don't retry)
      if (errorMessage.toLowerCase().includes('invalid') ||
          errorMessage.toLowerCase().includes('malformed') ||
          errorMessage.toLowerCase().includes('bad request')) {
        return 'other';
      }
      // Otherwise, likely connection issue
      return 'connection';
    }

    // 502, 503, 504 = Gateway/Service errors, retry
    if (status === 502 || status === 503 || status === 504) {
      return 'server';
    }

    // 5xx errors = Server issues, retry
    if (status >= 500) {
      return 'server';
    }

    // Other errors - don't retry
    return 'other';
  }

  // Calculate delay with exponential backoff
  calculateDelay(attempt) {
    return this.baseDelay * Math.pow(2, attempt - 1);
  }

  // Get user-friendly error message
  getErrorMessage(errorType, attempt = 0, maxRetries = 0) {
    switch (errorType) {
      case 'connection':
        if (attempt === 0) {
          return 'Connection problem detected. Retrying...'
        }
        return `Retry ${attempt}/${maxRetries} - Connection issue, trying again...`;
      
      case 'server':
        if (attempt === 0) {
          return 'Server error detected. Retrying...';
        }
        return `Retry ${attempt}/${maxRetries} - Server issue, trying again...`;
      
      case 'quota':
        return 'API quota exceeded. Please upgrade your plan or switch providers.';
      
      case 'auth':
        return 'Invalid API key. Please check your key in settings.';
      
      case 'other':
        return 'Request failed. Please try again later.';
      
      default:
        return 'An unexpected error occurred.';
    }
  }

  // Get final error message after all retries exhausted
  getFinalErrorMessage(errorType) {
    switch (errorType) {
      case 'connection':
        return 'Connection failed after multiple attempts. Please check your internet connection or proxy settings.';
      
      case 'server':
        return 'Server is currently unavailable. Please try again later.';
      
      case 'quota':
        return 'API quota exceeded. Please upgrade your plan or switch providers.';
      
      case 'auth':
        return 'Invalid API key. Please check your key in settings.';
      
      case 'other':
        return 'Request failed. Please try again later.';
      
      default:
        return 'An unexpected error occurred.';
    }
  }

  // Execute function with retry logic
  async executeWithRetry(operation, onRetry = null) {
    let lastError = null;
    let errorType = 'other';

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        // Add timeout to the operation
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), this.timeout);
        });
        
        const result = await Promise.race([operation(), timeoutPromise]);
        return result;
      } catch (error) {
        lastError = error;
        errorType = this.classifyError(error);
        
        debug.error(`Attempt ${attempt}/${this.maxRetries} failed`, {
          errorType,
          status: error.response?.status,
          message: error.message
        });

        // Don't retry for certain error types
        if (errorType === 'quota' || errorType === 'auth' || errorType === 'other') {
          break;
        }

        // If this is the last attempt, don't retry
        if (attempt === this.maxRetries) {
          break;
        }

        // Calculate delay for next retry
        const delay = this.calculateDelay(attempt);
        
        // Call retry callback if provided
        if (onRetry) {
          onRetry(attempt, this.maxRetries, errorType, delay);
        }

        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // All retries exhausted, throw final error
    const finalMessage = this.getFinalErrorMessage(errorType);
    const enhancedError = new Error(finalMessage);
    enhancedError.originalError = lastError;
    enhancedError.errorType = errorType;
    enhancedError.attempts = this.maxRetries;
    
    throw enhancedError;
  }
}

module.exports = RetryManager; 