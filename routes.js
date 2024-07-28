const express = require('express');
const bcrypt = require('bcrypt');
const user = require('./model/user');
const transaction = require('./model/transaction');

const router = express.Router();

// Middleware to check authentication
function checkAuth(req, res, next) {
    try {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        res.status(500).render('login', { error: 'Please login to continue' });
    }
}

// Login Page
router.get('/login(.html)?', (req, res) => {    
    try {
        res.render('login', { error: null });
    } catch (err) {
        console.log(err.message);
    }
});

// Register Page
router.get('/registernew', (req, res) => {
    try {
        res.render('register', { error: null });
    } catch (err) {
        console.log(err.message);
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.render('login', { error: null });
    });
});

// Index Page
router.get('/', checkAuth, async (req, res) => {
    try {
        const user_exist = req.session.user.Username;
        const entries = await transaction.find({ user: user_exist });

        let totalIncome = 0;
        let totalExpense = 0;
        entries.forEach(entry => {
            if (entry.Category.toLowerCase() === 'income') {
                totalIncome += entry.Amount;
            } else if (entry.Category.toLowerCase() === 'expense') {
                totalExpense += entry.Amount;
            }
        });

        let balance = totalIncome - totalExpense;
        if (balance < 0) {
            balance = 0;
        }

        res.render('index', { entries, user_exist, totalIncome, totalExpense, balance });
    } catch (err) {
        res.status(500);
    }
});

// Registration
router.post('/registeration', async (req, res) => {
    const { username, email, phone, gender, password, repassword } = req.body;

    if (!username || !email || !phone || !gender || !password || !repassword) {
        return res.render('register', { error: 'All fields are required' });
    }

    if (password !== repassword) {
        return res.status(500).render('register', { error: 'Passwords do not match' });
    }

    try {
        const existingUser = await user.findOne({ $or: [{ Username: username }, { Email: email }] });

        if (existingUser) {
            if (existingUser.Username === username) {
                return res.status(500).render('register', { error: 'Username already taken. Please enter a different username' });
            }
            if (existingUser.Email === email) {
                return res.status(500).render('register', { error: 'Email already taken. Use a different Email' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await user.create({ Username: username, Email: email, Phone: phone, Gender: gender, Password: hashedPassword });

        res.redirect('/login');
    } catch (err) {
        console.log(err.message);
        res.render('register', { error: 'An error occurred. Please try again.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const User = await user.findOne({ Username: username });

        if (User) {
            if (await bcrypt.compare(password, User.Password)) {
                req.session.user = { Username: User.Username };
                req.session.save(err => {
                    if (err) {
                        return res.render('login', { error: 'Error saving session' });
                    }
                    res.redirect('/');
                });
            } else {
                res.render('login', { error: 'Password incorrect' });
            }
        } else {
            res.render('login', { error: 'User not found' });
        }
    } catch (err) {
        res.render('login', { error: 'Error loading page' });
    }
});

// Add Money (Income/Expense)
router.post('/addMoney', checkAuth, async (req, res) => {
    try {
        const UserName = req.session.user.Username;
        if (!UserName) {
            res.redirect('/');
        }
        const { category, amount, description } = req.body;
        await transaction.create({ user: UserName, Category: category, Amount: amount, Description: description });
        res.redirect('/');
    } catch (err) {
        res.redirect('/');
    }
});

// Delete Entry
router.delete('/delEntry/:id', async (req, res) => {
    try {
        await transaction.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.redirect('/');
    }
});

module.exports = router;
