// Tiny auth gate for admin routes
exports.requireAuth = (req, res, next) => {
  // Debug log to confirm session persistence
  console.log('Auth check, session user:', req.session.user);

  if (!req.session || !req.session.user) {
    // Not logged in → redirect to login
    return res.redirect('/auth/login');
  }

  // Logged in → continue
  next();
};
