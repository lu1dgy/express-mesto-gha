const DEFAULT_ALLOWED_METHODS = 'GET,PUT,PATCH,POST,DELETE,HEAD';

const allowedCors = [
  'http://localhost:3000',
  'localhost:3000',
  'https://localhost:3000',
  'http://mesto.lapkes.nomoredomains.work',
  'https://mesto.lapkes.nomoredomains.work',
  'mesto.lapkes.nomoredomains.work',
];

module.exports.cors = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  res.header('Access-Control-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
