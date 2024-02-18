// Object to define status code
exports.STATUSCODE = {
  OK: 200,
  BADREQUEST: 400,
  UNAUTH: 401,
  NOTFOUND: 404,
  SERVERERROR: 500,
};

/**
 * @function successResponse
 * @description function to return API success response
 
 */
exports.successResponse = (res, message, result = []) => {
  return res
    .status(this.STATUSCODE.OK)
    .json({ success: true, message, result });
};

/**
 * @function clientErrorResponse
 * @description function to return API client error response
 
 */
exports.clientErrorResponse = (
  res,
  message,
  statusCode = this.STATUSCODE.BADREQUEST
) => {
  return res.status(statusCode).json({ success: false, message });
};

/**
 * @function unAuthResponse
 * @description function to return unauth response
 
 */
exports.unAuthResponse = (res) => {
  return res
    .status(this.STATUSCODE.UNAUTH)
    .json({ success: false, message: "Invalid Token!" });
};

/**
 * @function serverErrorResponse
 * @description function to return API server error response
 
 */
exports.serverErrorResponse = (res) => {
  return res
    .status(this.STATUSCODE.SERVERERROR)
    .json({ success: false, message: "Try again later!" });
};
