exports.success = (res, message, data = {}, statuscode = 200) => {
  return res.status(statuscode).json({
    status: "ok",
    statuscode,
    message,
    data,
  });
};

exports.error = (res, message, statuscode = 500, data = {}) => {
  return res.status(statuscode).json({
    status: "error",
    statuscode,
    message,
    data,
  });
};
