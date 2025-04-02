var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');

router.get('/', isAuth, authIsAdmin, async function(req, res, next) {
  // #swagger.summary = 'View memberships'
  let token = req.cookies.token
  console.log("-- TOKEN USED:" + token)
  try {
    const response = await fetch('http://localhost:3001/memberships/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    console.log(data)

    if (data.statusCode ===  403 || data.statusCode ===  401) {
      console.log("-- UNAUTHORIZED --")
      return res.render('forbidden');
    }

    res.render('memberships', { memberships: data.data.memberships || [] });
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.send('error. unhandled condition');
  }
});

module.exports = router;