const jwt = require("jsonwebtoken");

function isAuth(req, res, next) {
    let token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    
    console.log("-- Checking Token --");
    console.log("Headers Authorization:", req.cookies.token);

	if (!token) {
		token = req.cookies.token;
	}

	if (!token) {
		return res.render('forbidden')
		// return res.status(401).json({
		// 	status: "error",
		// 	statusCode: 401,
		// 	result: "You are not logged in. Please login or register to continue.",
		// });
	}

	try {
		const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = { id: decodedToken.id, username: decodedToken.username, roleId: decodedToken.roleId };
		next();
	} catch (err) {
		return res.render('forbidden')
		// return res.status(401).json({
		// 	status: "error",
		// 	statusCode: 401,
		// 	result: "Your session has timed out. Please login again to continue.",
		// });
	}
}

function authIsAdmin(req, res, next) {
	if (req.user.roleId !== 1) {
		return res.status(403).json({
			status: "error",
			statusCode: 403,
			result: "You do not have permission to access this resource.",
		});
	}
	next();
}

module.exports = { isAuth, authIsAdmin };