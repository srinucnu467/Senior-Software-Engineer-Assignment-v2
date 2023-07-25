const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fs = require('fs');
dotenv.config();

const privateKey = fs.readFileSync('private_key.pem');
const publicKey = fs.readFileSync('public_key.pem');

// Function to generate JWT access token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '100d' });
};
// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if(token){
    token = token.replace('Bearer ', '');
  }
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, user) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });;
    req.user = user;
    next();
  });
};

const verifyRefreshToken = (refreshToken) => {
  try {
    // Verify and decode the refresh token
    const decodedToken = jwt.verify(refreshToken, privateKey, { algorithms: ['RS256'] });
    return decodedToken;
  } catch (error) {
    // Handle token verification errors (e.g., token expired or invalid signature)
    throw new Error('Invalid refresh token.');
  }
};

const generateRefreshToken = (payload) => {
  // Refresh token will expire in 30 days (you can adjust the expiration as needed)
  const refreshTokenExpiresIn = '30d';

  // Sign the refresh token with the payload, private key, and expiration time
  const refreshToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: refreshTokenExpiresIn });

  return refreshToken;
};


module.exports = {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
};
