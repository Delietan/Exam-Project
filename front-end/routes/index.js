var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');

router.get('/index', function(req, res, next) {
  // #swagger.summary = 'Check that server is running'
  res.render('index', {title: "Hello"});
});

router.get('/', function(req, res, next) {
  // #swagger.summary = 'View login page'
  res.render('adminlogin', {error: ""});
});

router.get('/admin', function(req, res, next) {
  // #swagger.summary = 'Redirect to login page'
  res.redirect('/');
});

router.get('/login', function(req, res, next) {
  // #swagger.summary = 'Redirect to login page'
  res.redirect('/');
});

router.post('/login', async (req, res) => {
  // #swagger.summary = 'Sends login request and redirects to products'
  const { emailOrUsername, password } = req.body;

  try {
      const response = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ emailOrUsername, password })
      });

      const data = await response.json();
      console.log(data)
      if (data.data.role === 1) {
          res.cookie('token', data.data.token, { httpOnly: true });
          return res.redirect('/admin/products');
      } else if ((data.status === "success") && (data.data.role !== 1)) {
          return res.render('adminlogin', { error: 'Must be an admin to log in.' });
      } else {
          return res.render('adminlogin', { error: data.data.result });
      }
  } catch (error) {
      console.error('Error:', error);
      res.render('adminlogin', { error: 'An error occurred while logging in.' });
  }
});

router.get('/logout', (req, res) => {
  // #swagger.summary = 'Removes cookie and redirects to login page'
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;