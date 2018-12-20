function createError(code, error, message) {
  const err = new Error();
  (err.statusCode = code), (err.error = error), (err.message = message);
  return err;
}

class HttpError {
  static BadRequest(message) {
    return createError(400, "BadRequest", message);
  }

  static Unauthorized(message) {
    return createError(401, "Unauthorized", message);
  }

  static Forbidden(message) {
    return createError(403, "Forbidden", message);
  }

  static NotFound(message) {
    return createError(404, "NotFound", message);
  }
}

module.exports = HttpError;
