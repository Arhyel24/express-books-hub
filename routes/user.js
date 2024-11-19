const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

// Registration
router.get('/register', (req, res) => {
    if (req.session.user) {
	res.redirect('/books');
    }

	//console.log(req.session)
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.redirect('/login');
});

// Login
router.get('/login', (req, res) => {

	//console.log(req.session);

	if (req.session.user) { 
		res.redirect('/books');
	}
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = { username: user.username, userId: user._id}

        //console.log(req.session)
	res.redirect('/books');
    } else {
        res.redirect('/login');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;
