// Express app configuration (middleware, views, routes)
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');   // Security middleware
const { connectDB } = require('./src/config/db');

const app = express();

// Connect DB first
connectDB();

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Method override for DELETE/PUT from forms
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'src/public')));

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Security headers
app.use(helmet());

// ✅ Sessions (adjusted for localhost)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // forced false for localhost (was NODE_ENV check)
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

// Make session user available to all views automatically
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
const indexRoutes = require('./src/routes/index');
const authRoutes = require('./src/routes/auth');
const campaignRoutes = require('./src/routes/campaigns');
const donationRoutes = require('./src/routes/donations');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/donations', donationRoutes);

module.exports = app;
