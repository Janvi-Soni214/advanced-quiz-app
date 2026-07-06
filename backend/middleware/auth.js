const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  // This returns the actual middleware function that Express is looking for
  return (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or Expired Token' });
    }
  };
};

module.exports = authMiddleware;