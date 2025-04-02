class RoleService {
	constructor(db) {
		this.client = db.sequelize;
		this.Role = db.Role;
	}

	async populateRoles() {
		try {
			const roles = ["Admin", "User"];

			const createdRoles = await Promise.all(
				roles.map(role => 
					this.Role.findOrCreate({
						where: { Role: role }
					})
				)
			);

			return true
		} catch (err) {
			throw new Error('Failed to populate roles: ' + err.message);
		}
	}

	async getAll() {
		try {
			const roles = await this.Role.findAll();
			return roles;
		} catch (err) {
			throw new Error('Failed to get roles: ' + err.message);
		}
	}

	async getRoleByName(inputName) {
		try {
			if (!inputName) throw new Error("Role name required");
			const role = await this.Role.findOne({ where: { Role: inputName } });
			return role;
		} catch (err) {
			throw new Error('Failed to find role');
		}
	}

	async getRoleById(inputId) {
		try {
			if (!inputId || isNaN(inputId)) throw new Error("Valid role ID required");

			const role = await this.Role.findOne({ where: { id: inputId } });
			return role;
		} catch (err) {
			throw new Error("Failed to find role: " + err.message);
		}
	}

	async create(inputName) {
		try {
			const roleExists = await this.getRoleByName(inputName);
			if (roleExists) throw new Error('Role already exists');
			
			const newRole = await this.Role.create({ Role: inputName });
			return newRole;
		} catch (err) {
			throw new Error('Failed to create role: ' + err.message);
		}
	}

	async update(id, inputName) {
		try {
			// Validate id
			if (!id || isNaN(id)) throw new Error("Valid role ID required");

			// Validate inputName
			if (!inputName || typeof inputName !== "string") throw new Error("Role name must be a valid string");

			inputName = inputName.trim();
			if (inputName.length === 0) throw new Error("Role name cannot be empty");

			// Check if the role exists
			const role = await this.getRoleById(id);
			if (!role) throw new Error("Role does not exist");

			// Check if the new name already exists
			const existingRole = await this.getRoleByName(inputName);
			if (existingRole && existingRole.id !== role.id) throw new Error("A role with this name already exists");

			// Update the role
			await this.Role.update({ Role: inputName }, { where: { id } });

			// Fetch updated role
			const updatedRole = await this.getRoleById(id);
			return updatedRole;
		} catch (err) {
			throw new Error("Failed to update role: " + err.message);
		}
	}

	async delete(id) {
		try {
			const role = await this.getRoleById(id);
			if (!role) throw new Error('Role ID does not exist');

			const deletedRows = await this.Role.destroy({ where: { id } });

			if (deletedRows === 0) throw new Error('Failed to delete role');

			return { message: 'Role successfully deleted', id };
		} catch (err) {
			throw new Error("Failed to delete role: " + err.message);
		}
	}
}

module.exports = RoleService;