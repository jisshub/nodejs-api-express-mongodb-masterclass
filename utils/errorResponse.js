// create a class that extends Error class
class ErrorResponse extends Error {
  // when instantiating the object takes two parameters
  constructor(message, statusCode) {
    //   call Error xlass constructor. use super() - pass message to it.
    super(message);
    this.statusCode = statusCode;
  }
}
// export this class
module.exports = ErrorResponse;
