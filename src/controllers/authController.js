// Basic email/password login + registration
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Show login page
exports.showLogin = (req, res) => {
  res.render('pages/login', { 
    title: 'Login', 
    req,
    error: null // ensures error is always defined
  });
};

// Handle login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).render('pages/login', { 
      title: 'Login', 
      error: 'Invalid credentials', 
      req 
    });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).render('pages/login', { 
      title: 'Login', 
      error: 'Invalid credentials', 
      req 
    });
  }
  // keep minimal info in session
  req.session.user = { id: user._id, name: user.name, email: user.email };
  res.redirect('/campaigns');
};

// Show register page
exports.showRegister = (req, res) => {
  res.render('pages/register', { 
    title: 'Register', 
    req,
    error: null 
  });
};

// Handle registration
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).render('pages/register', { 
      title: 'Register', 
      error: 'Email already in use', 
      req 
    });
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Save new user
  const user = new User({ name, email, passwordHash: hash });
  await user.save();

  // Log them in immediately
  req.session.user = { id: user._id, name: user.name, email: user.email };
  res.redirect('/campaigns');
};

// Handle logout
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
