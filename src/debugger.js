class Debugger {
  constructor() {
    this.enabled = false;
    this.debugLevel = 'info'; // 'info', 'verbose', 'error'
  }

  // Enable/disable debug mode
  enable(level = 'info') {
    this.enabled = true;
    this.debugLevel = level;
    this.log('🔧 Debug mode enabled', { level });
  }

  disable() {
    this.enabled = false;
    console.log('🔧 Debug mode disabled');
  }

  // Check if debug is enabled
  isEnabled() {
    return this.enabled;
  }

  // Log debug message
  log(message, data = null) {
    if (!this.enabled) return;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = `[${timestamp}] 🔍 DEBUG:`;
    
    if (data) {
      console.log(`${prefix} ${message}`, this.sanitizeObject(data));
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  // Log verbose debug message
  verbose(message, data = null) {
    if (!this.enabled || this.debugLevel !== 'verbose') return;
    this.log(`[VERBOSE] ${message}`, data);
  }

  // Log error debug message
  error(message, error = null) {
    if (!this.enabled) return;
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = `[${timestamp}] ❌ DEBUG ERROR:`;
    
    if (error) {
      // Extract useful error information
      const errorInfo = this.extractErrorInfo(error);
      console.log(`${prefix} ${message}`, errorInfo);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  // Log success debug message
  success(message, data = null) {
    if (!this.enabled) return;
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = `[${timestamp}] ✅ DEBUG SUCCESS:`;
    
    if (data) {
      console.log(`${prefix} ${message}`, this.sanitizeObject(data));
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  // Log HTTP request details (simplified)
  logHttpRequest(url, method, headers, body = null) {
    if (!this.enabled) return;
    
    const requestInfo = {
      url,
      method,
      headers: this.sanitizeHeaders(headers),
      bodySize: body ? JSON.stringify(body).length : 0,
      bodyPreview: body ? this.getBodyPreview(body) : null
    };
    
    this.log('HTTP Request:', requestInfo);
  }

  // Log HTTP response details (simplified)
  logHttpResponse(status, headers, body = null) {
    if (!this.enabled) return;
    
    const responseInfo = {
      status,
      headers: this.sanitizeHeaders(headers),
      bodySize: body ? JSON.stringify(body).length : 0,
      bodyPreview: body ? this.getBodyPreview(body) : null
    };
    
    this.log('HTTP Response:', responseInfo);
  }

  // Get a preview of the request/response body
  getBodyPreview(body) {
    if (!body) return null;
    
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    if (bodyStr.length > 200) {
      return bodyStr.substring(0, 200) + '...';
    }
    return bodyStr;
  }

  // Extract useful error information
  extractErrorInfo(error) {
    if (!error) return null;
    
    const info = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      responseData: error.response?.data
    };
    
    // Clean up the response data if it's an error object
    if (info.responseData && info.responseData.error) {
      info.responseData = {
        error: {
          code: info.responseData.error.code,
          message: info.responseData.error.message,
          status: info.responseData.error.status
        }
      };
    }
    
    return info;
  }

  // Sanitize headers (remove sensitive data)
  sanitizeHeaders(headers) {
    if (!headers) return {};
    
    const sanitized = { ...headers };
    if (sanitized['X-goog-api-key']) {
      sanitized['X-goog-api-key'] = sanitized['X-goog-api-key'].substring(0, 10) + '...';
    }
    if (sanitized['Authorization']) {
      sanitized['Authorization'] = '***HIDDEN***';
    }
    return sanitized;
  }

  // Sanitize object (remove sensitive fields and simplify)
  sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = { ...obj };
    const sensitiveKeys = ['key', 'token', 'password', 'secret', 'api_key'];
    
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        if (typeof sanitized[key] === 'string') {
          sanitized[key] = sanitized[key].substring(0, 10) + '...';
        } else {
          sanitized[key] = '***HIDDEN***';
        }
      }
    }
    
    return sanitized;
  }
}

// Create singleton instance
const debuggerInstance = new Debugger();

module.exports = debuggerInstance; 