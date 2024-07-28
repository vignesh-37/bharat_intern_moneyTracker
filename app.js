const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const user = require('./model/user');
const routes = require('./routes');

// Create Express app
const app = express();

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 8000;
const mongourl = process.env.mongoURI;
const sessionkey = process.env.SESSION_SECRET;

// Connect to MongoDB
mongoose.connect(mongourl).then(() => { console.log('Database connected'); });

// Session configuration
app.use(session({
    secret: sessionkey,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user information for session management
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    user.findById(id, (err, user) => {
        done(err, user);
    });
});

// Serve static files
app.use(express.static('public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Use routes
app.use(routes);

// Start the server
app.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`); });
