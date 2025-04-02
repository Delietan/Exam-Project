class MembershipService {
	constructor(db) {
		this.client = db.sequelize;
		this.Membership = db.Membership;
	}

	async populateMemberships() {
		try {
			const memberships = [
				{ Name: 'Bronze', Discount: "0%", Threshold: 0 },
				{ Name: 'Silver', Discount: "15%", Threshold: 15 },
				{ Name: 'Gold', Discount: "30%", Threshold: 30 }
			];

			for (const membership of memberships) {
				await this.Membership.findOrCreate({
					where: { Name: membership.Name },
					defaults: {
						Discount: membership.Discount,
						Threshold: membership.Threshold
					}
				});
			}

			console.log('Memberships populated successfully');
		} catch (err) {
			console.error('Error populating memberships:', err.message);
			throw new Error(err);
		}
	}

	async getAll() {
		try {
			const memberships = await this.Membership.findAll();
			return memberships;
		} catch (err) {
			throw new Error('Failed to get memberships: ' + err.message);
		}
	}

	async getMembershipById(id) {
		try {
			if (!id || isNaN(id)) throw new Error("Valid membership ID required");
			const membership = await this.Membership.findOne({ where: { id } });
			return membership;
		} catch (err) {
			throw new Error("Failed to find membership: " + err.message);
		}
	}

	async getMembershipByName(name) {
		try {
			if (!name) throw new Error("Membership name is required");
			const membership = await this.Membership.findOne({ where: { Name: name } });
			return membership;
		} catch (err) {
			throw new Error("Failed to find membership: " + err.message);
		}
	}

	async create(name, discount, threshold) {
		try {
			// if (!name || typeof name !== "string") throw new Error("Membership name must be a valid string");
			if (!name) throw new Error("Membership name must be a valid string");
			// if (discount == null || isNaN(discount) || discount < 0) throw new Error("Valid discount value required");
			if (discount == null ) throw new Error("Valid discount value required");
			if (threshold == null || isNaN(threshold) || threshold < 0) throw new Error("Valid threshold value required");

			const existingMembership = await this.getMembershipByName(name);
			if (existingMembership) throw new Error("Membership with this name already exists");

			const newMembership = await this.Membership.create({ Name: name, Discount: discount, Threshold: threshold });
			return newMembership;
		} catch (err) {
			throw new Error("Failed to create membership: " + err.message);
		}
	}

	// async update(id, name, discount, threshold) {
	// 	try {
	// 		if (!id || isNaN(id)) throw new Error("Valid membership ID required");

	// 		const membership = await this.getMembershipById(id);
	// 		if (!membership) throw new Error("Membership does not exist");

	// 		if (name) {
	// 			const existingMembership = await this.getMembershipByName(name);
	// 			if (existingMembership && existingMembership.id !== id) throw new Error("A membership with this name already exists");
	// 		}

	// 		await this.Membership.update(
	// 			{ Name: name , Discount: discount, Threshold: threshold },
	// 			{ where: { id } }
	// 		);

	// 		const updatedMembership = await this.getMembershipById(id);
	// 		return updatedMembership;
	// 	} catch (err) {
	// 		throw new Error("Failed to update membership: " + err.message);
	// 	}
	// }

	async updateById(id, newValues) {
		try {
			if (!id || isNaN(id)) {
				throw new Error("Invalid membership ID");
			}
	
			const membership = await this.getMembershipById(id);
			if (!membership) {
				throw new Error(`Membership with ID '${id}' not found`);
			}
	
			const requiredFields = [
				"name", "discount", "threshold"
			];
			for (const field of requiredFields) {
				if (!newValues[field]) {
					throw new Error(`Missing required field: ${field}`);
				}
			}
	
			// Update fields
			membership.Name = newValues.name;
			membership.Discount = newValues.discount;
			membership.Threshold = newValues.threshold;
	
			await membership.save();
	
			return { message: `Membership with ID '${id}' updated successfully` };
		} catch (err) {
			throw new Error("Failed to update membership: " + err.message);
		}
	}

	async delete(id) {
		try {
			const membership = await this.getMembershipById(id);
			if (!membership) throw new Error("Membership ID does not exist");

			const deletedRows = await this.Membership.destroy({ where: { id } });
			if (deletedRows === 0) throw new Error("Failed to delete membership");

			return { message: "Membership successfully deleted", id };
		} catch (err) {
			throw new Error("Failed to delete membership: " + err.message);
		}
	}
}

module.exports = MembershipService;