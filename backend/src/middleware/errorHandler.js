import multer from 'multer';
export function notFound(req, res) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} was not found.` } }); }
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  let status = error.status || 500;
  let code = error.code || 'INTERNAL_SERVER_ERROR';
  let message = error.message || 'An unexpected server error occurred.';
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') { status = 413; code = 'FILE_TOO_LARGE'; message = `PDF must be no larger than ${process.env.MAX_UPLOAD_MB || 5} MB.`; }
    else { status = 400; code = 'UPLOAD_ERROR'; message = 'The upload form is invalid. Submit one file using the field name resume.'; }
  }
  if (status >= 500 && !error.code) message = 'An unexpected server error occurred.';
  res.status(status).json({ success: false, error: { code, message } });
}
