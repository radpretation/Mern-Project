/**
 * Formats backend exceptions and database errors into clean, polite, human-understandable messages.
 */
export function formatErrorMessage(error: any, fallbackMessage: string = 'An unexpected issue occurred while processing your request. Please try again.'): string {
  if (!error) return fallbackMessage;

  // Mongoose CastError (e.g. invalid ObjectId format)
  if (error.name === 'CastError') {
    return 'The requested record or item could not be found. Please refresh and try again.';
  }

  // Mongoose ValidationError
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors || {}).map((e: any) => e.message);
    if (messages.length > 0) {
      return `Please check the submitted information: ${messages.join(', ')}`;
    }
    return 'Some required fields are missing or contain invalid values.';
  }

  // MongoDB Duplicate Key Error (E11000)
  if (error.code === 11000 || error.name === 'MongoServerError') {
    if (error.keyPattern) {
      const keys = Object.keys(error.keyPattern).join(', ');
      return `A record with this ${keys} already exists in the system.`;
    }
    return 'A duplicate entry already exists in the system.';
  }

  // JWT Errors
  if (error.name === 'TokenExpiredError') {
    return 'Your session has expired. Please sign in again to continue.';
  }
  if (error.name === 'JsonWebTokenError') {
    return 'Invalid session authentication. Please sign in again.';
  }

  // File System Errors (ENOENT)
  if (error.code === 'ENOENT') {
    return 'The requested file or attachment is currently unavailable on the server.';
  }

  // If already a clean user-facing message string
  if (typeof error.message === 'string' && error.message.length > 0) {
    // Hide raw database or internal stack messages
    const rawPatterns = [
      /MongoServerError/i,
      /Cast to ObjectId/i,
      /E11000/i,
      /BSONError/i,
      /connection <monitor>/i,
      /topology/i,
      /ECONNREFUSED/i,
      /stack/i,
    ];

    const isRawTechnical = rawPatterns.some((pattern) => pattern.test(error.message));
    if (isRawTechnical) {
      return fallbackMessage;
    }

    return error.message;
  }

  return fallbackMessage;
}
