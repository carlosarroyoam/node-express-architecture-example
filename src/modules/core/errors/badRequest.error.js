/**
 * Error thrown when a user request is malformed.
 */
class BadRequestError extends Error {
  constructor({ message = 'The request data is not valid', errors }) {
    super(message);
    this.name = 'Bad request';
    this.status = 400;
    this.errors = errors;
  }
}

module.exports = BadRequestError;
