const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'staffsync_super_secret_jwt_key_2026_modern_hrm');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is expired or invalid. Please login again.' });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Access requires one of the following roles: [${allowedRoles.join(', ')}]. Your current role is '${req.user?.role}'.`
      });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  requireRole
};
