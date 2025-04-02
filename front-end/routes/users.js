var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');

router.get('/', isAuth, authIsAdmin, async function(req, res, next) {
  // #swagger.summary = 'View users'
  let token = req.cookies.token
  console.log("-- TOKEN USED:" + token)
  try {
    const response = await fetch('http://localhost:3001/users/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const roles = await fetch('http://localhost:3001/roles/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

    const memberships = await fetch('http://localhost:3001/memberships/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

    const data = await response.json();
    const rolesData = await roles.json();
    const membershipsData = await memberships.json();

    if (data.statusCode ===  403 || data.statusCode ===  401) {
      console.log("-- UNAUTHORIZED --")
      return res.render('forbidden');
    }
    console.log(data.data.users)

    res.render('users', { 
        users: data.data.users || [],
        roles: rolesData.data.roles,
        memberships: membershipsData.data.memberships
     });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.send('error. unhandled condition');
  }
});

module.exports = router;