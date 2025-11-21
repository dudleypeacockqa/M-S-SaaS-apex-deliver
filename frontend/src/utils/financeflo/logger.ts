// Structured logging utility
// Provides consistent logging across the application

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
  }

  private formatLog(entry: LogEntry): void {
    const { level, message, timestamp, context, error } = entry;
    
    if (this.isDevelopment) {
      // Development: Use console methods for better debugging
      const logMethod = console[level] || console.log;
      
      if (context || error) {
        logMethod(`[${timestamp}] ${message}`, { context, error });
      } else {
        logMethod(`[${timestamp}] ${message}`);
      }
    } else {
      // Production: Structured logging for monitoring
      const logObject = {
        level,
        message,
        timestamp,
        ...(context && { context }),
        ...(error && { 
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack
          }
        })
      };
      
      // In production, you might want to send logs to a service
      console.log(JSON.stringify(logObject));
    }
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.formatLog({
        level: 'debug',
        message,
        timestamp: new Date().toISOString(),
        context
      });
    }
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.formatLog({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      context
    });
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.formatLog({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      context
    });
  }

  public error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.formatLog({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    });
  }

  // Specialized methods for common use cases
  public apiError(endpoint: string, error: Error, context?: Record<string, unknown>): void {
    this.error(`API request failed: ${endpoint}`, error, {
      endpoint,
      ...context
    });
  }

  public userAction(action: string, context?: Record<string, unknown>): void {
    this.info(`User action: ${action}`, context);
  }

  public performanceLog(operation: string, duration: number, context?: Record<string, unknown>): void {
    this.info(`Performance: ${operation}`, {
      duration,
      ...context
    });
  }
}

// Export singleton instance
export const logger = new Logger();
export default Logger;