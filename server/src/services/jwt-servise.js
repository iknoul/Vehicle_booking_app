const jwt = require('jsonwebtoken');
const JWT_SECRET = '@cbdce722v23eiuk231';

exports.createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
