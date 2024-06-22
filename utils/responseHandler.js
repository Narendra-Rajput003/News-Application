const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({ message, data });
  };
  
  const errorResponse = (res, error, message = 'Error', statusCode = 500) => {
    res.status(statusCode).json({ message, error });
  };
  
  export { successResponse, errorResponse };