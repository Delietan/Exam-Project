var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');
const db = require('../models');
const UserService = require('../services/UserService');
const userService = new UserService(db);
const jwt = require('jsonwebtoken')

const EncodeJWT = (id, username, roleId) => {
    try {
        const token = jwt.sign(
            {
                id,
                username,
                roleId
            }, 
            process.env.TOKEN_SECRET, 
            { expiresIn: '2h' }
        );
        return token;
    } catch (err) {
        console.error('Error creating JWT token:', err);
        return null;
    }
};

async function verifyPassword(password, saltHex, storedPasswordHex) {
	const salt = Buffer.from(saltHex, "hex");
	const storedPassword = Buffer.from(storedPasswordHex, "hex");

	const hashedPassword = await new Promise((resolve, reject) => {
		crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, derivedKey) => {
			if (err) reject(err);
			else resolve(derivedKey);
		});
	});

	return storedPassword.length === hashedPassword.length && crypto.timingSafeEqual(storedPassword, hashedPassword);
}

router.post('/register', async (req, res) => {
    /*
    #swagger.tags = ['Authorization']
    #swagger.summary = 'Register a new user'
    #swagger.description = 'Creates a new user account with provided details and returns a JWT token upon successful registration.'
    
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Request body for user registration.',
        schema: {
            $firstname: 'John',
            $lastname: 'Doe',
            $username: 'johndoe123',
            $email: 'johndoe@example.com',
            $password: 'StrongPassword123!',
            $address: '123 Main St, City, Country',
            $phone: '1234567890'
        }
    }

    #swagger.responses[201] = {
        description: 'User successfully registered',
        schema: {
            status: "success",
            statuscode: 201,
            data: {
                result: "User created successfully",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                userId: 1,
                username: "johndoe123",
                roleId: 2
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Bad request - Invalid input data',
        schema: {
            status: "error",
            statuscode: 400,
            data: { result: "Invalid email format" }
        }
    }
    #swagger.responses[409] = {
        description: 'Conflict - Username or email already in use',
        schema: {
            status: "error",
            statuscode: 409,
            data: { result: "Email already used" }
        }
    }
    */
    const { firstname, lastname, username, email, password, address, phone } = req.body;
    
    try {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    statuscode: 500,
                    data: { result: "Password hashing failed" }
                });
            }

            try {
                const newUser = await userService.create(
                    firstname, lastname, username, email, address, phone, salt, hashedPassword
                );

                const token = EncodeJWT(newUser.dataValues.id, newUser.dataValues.Username, newUser.dataValues.RoleId);

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 2 * 60 * 60 * 1000 // 2 hours
                });

                res.status(201).json({
                    status: "success",
                    statuscode: 201,
                    data: {
                        result: "User created successfully",
                        token,
                        userId: newUser.dataValues.id,
                        username: newUser.dataValues.Username,
                        roleId: newUser.dataValues.RoleId
                    }
                });

            } catch (error) {
                const errorMapping = {
                    "Username already used": 409,
                    "Email already used": 409,
                    "Invalid email format": 400,
                    "Phone must be a number": 400,
                    "firstname is required and cannot be empty": 400,
                    "lastname is required and cannot be empty": 400,
                    "username is required and cannot be empty": 400,
                    "email is required and cannot be empty": 400,
                    "password is required and cannot be empty": 400,
                    "address is required and cannot be empty": 400,
                    "phone is required and cannot be empty": 400
                };
            
                const statusCode = errorMapping[error.message] || 500;
            
                res.status(statusCode).json({
                    status: "error",
                    statuscode: statusCode,
                    data: { result: error.message }
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: err.message }
        });
    }
});

router.post('/login', async (req, res, next) => {
    // #swagger.tags = ['Authorization']
    // #swagger.summary = 'User login'
    // #swagger.description = 'Authenticates a user using their email or username and returns a JWT token upon successful login.'
    /*

    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'User login request body. The user can log in using either their email or username along with their password.',
        schema: {
            $emailOrUsername: 'johndoe@example.com',
            $password: 'StrongPassword123!'
        }
    }

    #swagger.responses[200] = {
        description: 'User successfully logged in',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "You are logged in",
                Id: 1,
                email: "johndoe@example.com",
                username: "johndoe123",
                fullName: "John Doe",
                role: 2,
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
    }
    #swagger.responses[401] = {
        description: 'Unauthorized - User not found or incorrect password',
        schema: {
            status: "error",
            statuscode: 401,
            data: { result: "User not found or password incorrect" }
        }
    }
    #swagger.responses[500] = {
        description: 'Internal Server Error',
        schema: {
            status: "error",
            statuscode: 500,
            data: { result: "Error message from the server" }
        }
    }
    */
	try {
        const { emailOrUsername, password } = req.body; // Identifier can be either email or username
		const dbUser = await userService.getOneByUsernameOrEmail(emailOrUsername);

		if (!dbUser) {
			return res.status(401).json({
				status: "error",
				statuscode: 401,
				data: { result: "User not found or password incorrect" }
			});
		}
        // console.log(dbUser)

		const isPasswordValid = await verifyPassword(password, dbUser.dataValues.Salt, dbUser.dataValues.EncryptedPassword);

		if (!isPasswordValid) {
			return res.status(401).json({
				status: "error",
				statuscode: 401,
				data: { result: "User not found or password incorrect" }
			});
		}

		const token = EncodeJWT(dbUser.dataValues.id, dbUser.dataValues.Username, dbUser.dataValues.RoleId);

		res.cookie("token", token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 2 * 60 * 60 * 1000 //Valid 2 hours
		});
        // console.log(dbUser)
		return res.status(200).json({
			status: "success",
			statuscode: 200,
			data: {
				result: "You are logged in",
                Id: dbUser.dataValues.id,
				email: dbUser.dataValues.Email,
				username: dbUser.dataValues.Username,
                fullName: dbUser.dataValues.FirstName + " " + dbUser.dataValues.LastName,
				role: dbUser.dataValues.RoleId,
                token,
			}
		});
	} catch (err) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: err.message }
        });
	}
});


module.exports = router;