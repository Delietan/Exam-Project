const { Op } = require("sequelize");
const crypto = require('crypto');  // Import crypto module

class UserService {
	constructor(db) {
		this.client = db.sequelize;
		this.User = db.User;
	}

	async addAdmin() {
		let adminData = {
			Username: "Admin",
			InputPassword: "P@ssword2023",
			Email: "admin@noroff.no",
			FirstName: "Admin",
			LastName: "Support",
			Address: "Online",
			Telephone: "911",
			MembershipId: 1,
			RoleId: 1
		};
	
		try {
	
			// Generate salt and hash the password
			const Salt = crypto.randomBytes(16);
			const passwordHashed = crypto.pbkdf2Sync(adminData.InputPassword, Salt, 310000, 32, 'sha256');
	
			let EncryptedPasswordHex = passwordHashed.toString('hex');
			let SaltHex = Salt.toString('hex');

			// Create the admin user
			await this.User.create({
				FirstName: adminData.FirstName,
				LastName: adminData.LastName,
				Username: adminData.Username,
				Email: adminData.Email,
				Address: adminData.Address,
				Telephone: adminData.Telephone,
				Salt: SaltHex,
				EncryptedPassword: EncryptedPasswordHex,
				MembershipId: adminData.MembershipId,
				RoleId: adminData.RoleId
			});
	
			console.log("Admin user created successfully");
	
		} catch (err) {
			console.error("Error creating admin user:", err.message);
		}
	}

	// Check if username or email already exists
	async checkIfTaken(username, email) {
		const user = await this.User.findOne({
			where: {
				[Op.or]: [{ Username: username }, { Email: email }]
			}
		});

		if (user) {
			if (user.Username === username) throw new Error('Username already used');
			if (user.Email === email) throw new Error('Email already used');
		}
	}

	async create(firstname, lastname, username, email, address, phone, salt, encryptedPassword) {
		
		const fields = { firstname, lastname, username, email, address, phone, salt, encryptedPassword };

		// Check for missing or empty fields
		for (const [key, value] of Object.entries(fields)) {
			if (!value || value.toString().trim() === '') {
				throw new Error(`${key} is required and cannot be empty`);
			}
		}
		
		// Check if username or email is already taken
		await this.checkIfTaken(username, email);

		let EncryptedPassword = encryptedPassword.toString('hex');
		let Salt = salt.toString('hex');

		if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) throw new Error('Invalid email format');
		if (isNaN(phone)) throw new Error('Phone must be a number');

		return await this.User.create({
			FirstName: firstname,
			LastName: lastname,
			Username: username,
			Email: email,
			Address: address,
			Telephone: phone,
			Salt,
			EncryptedPassword,
			// MembershipId: membershipId,
			MembershipId: 1,
			// RoleId: roleId
			RoleId: username.toLowerCase() === "admin" ? 1 : 2
		});
	}

	async getAll() {
		try {
			const [users] = await this.client.query(`SELECT 
			users.*,
			roles.Role AS RoleName,
			memberships.name AS MembershipName,
			COALESCE(SUM(op.quantity), 0) AS TotalItemsPurchased
			FROM users
			LEFT JOIN roles ON users.RoleId = roles.id
			LEFT JOIN memberships ON users.MembershipId = memberships.id
			LEFT JOIN orders o ON users.id = o.UserId
			LEFT JOIN orderproducts op ON o.id = op.OrderId
			GROUP BY users.id, roles.Role, memberships.name;`
		);
			return users;
		} catch (err) {
			throw new Error('Failed to get users: ' + err.message);
		}
	}

	async getOne(username) {
		try {
			if (!username) throw new Error("Missing argument");

			const user = await this.User.findOne({ where: { username } });
			// if (!user) throw new Error(`User with username '${username}' not found`);
			return user;
		} catch (err) {
			throw new Error('Failed to get user: ' + err.message);
		}
	}

	async getOneByUsernameOrEmail(emailOrUsername) {
		try {
			if (!emailOrUsername) throw new Error("Missing argument");

			// const user = await this.User.findOne({ where: { username } });
			const user = await this.User.findOne({
				where: {
					[Op.or]: [
						{ Username: emailOrUsername },
						{ Email: emailOrUsername }
					]
				}
			});
			return user;
		} catch (err) {
			throw new Error('Failed to get user: ' + err.message);
		}
	}
	
	async getOneById(id) {
		try {
			if (!id || isNaN(id)) throw new Error("Valid user ID is required");
			
			const user = await this.User.findOne({ where: { id } });
			if (!user) throw new Error(`User with ID '${id}' not found`);
			
			return user;
		} catch (err) {
			throw new Error('Failed to get user by ID: ' + err.message);
		}
	}
	
	async deleteById(id) {
		try {
			// Check if user exists before attempting deletion
			await this.getOneById(id);
	
			const deletedCount = await this.User.destroy({ where: { id } });
			if (deletedCount === 0) throw new Error(`User with ID '${id}' not found`);
	
			return { message: `User with ID '${id}' deleted successfully` };
		} catch (err) {
			throw new Error('Failed to delete user: ' + err.message);
		}
	}
	
	async updateById(id, newValues) {
		try {
			if (!id || isNaN(id)) {
				throw new Error("Invalid user ID");
			}

			const user = await this.getOneById(id);

			// Check if all fields are included
			const requiredFields = [
				"firstname", "lastname", "username", "email",
				"address", "telephone", "membershipId", "roleId"
			];
			for (const field of requiredFields) {
				if (!newValues[field]) {
					throw new Error(`Missing required field: ${field}`);
				}
			}

			// Validate email format
			if (!/^\S+@\S+\.\S+$/.test(newValues.email)) {
				throw new Error("Invalid email format");
			}
	
			// Validate phone number (numeric check)
			if (isNaN(newValues.telephone)) {
				throw new Error("Phone number must be numeric");
			}
	
			// Ensure membershipId and roleId are valid numbers
			if (isNaN(newValues.membershipId) || isNaN(newValues.roleId)) {
				throw new Error("Invalid membershipId or roleId");
			}

			// await this.checkIfTaken(newValues.username, newValues.email);

			user.FirstName = newValues.firstname
			user.LastName = newValues.lastname
			user.Username = newValues.username
			user.Email = newValues.email
			user.Address = newValues.address
			user.Telephone = newValues.telephone
			user.MembershipId = newValues.membershipId
			user.RoleId = newValues.roleId

			const result = await user.save();
			// console.log(result)
			return { message: `User with ID '${id}' updated successfully` };
		} catch (err) {
			throw new Error('Failed to update user: ' + err.message + ". Username or email might be in use.");
		}
	}
}
module.exports = UserService;