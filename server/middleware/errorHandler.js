/**
 * Global Express error handler middleware
 * Must be the last middleware registered in the app
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'خطأ داخلي في الخادم';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
    });
  } else {
    console.error(`❌ ${err.name}: ${err.message}`);
  }

  // Mongoose Validation Error (400)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join('. ');
  }

  // Mongoose CastError — invalid ObjectId (400)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'المورد غير موجود — معرّف غير صالح';
  }

  // MongoDB Duplicate Key Error (409)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'الحقل';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `القيمة "${value}" مسجّلة بالفعل لحقل "${field}"`;
  }

  // JWT Invalid Signature / Malformed (401)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'رمز التحقق غير صالح — يرجى تسجيل الدخول مرة أخرى';
  }

  // JWT Expired (401)
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'انتهت صلاحية الجلسة — يرجى تسجيل الدخول مرة أخرى';
  }

  // Express-validator errors passed through next(error)
  if (err.name === 'ValidationErrors' && Array.isArray(err.errors)) {
    statusCode = 400;
    message = err.errors.map((e) => e.msg).join('. ');
  }

  // Hide internal server error details in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'خطأ داخلي في الخادم — يرجى المحاولة لاحقاً';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      name: err.name,
    }),
  });
};

module.exports = errorHandler;
