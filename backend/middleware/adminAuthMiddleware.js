const adminAuth = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
  };
  
  module.exports = adminAuth;
  