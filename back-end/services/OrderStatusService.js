class OrderStatusService {
	constructor(db) {
		this.client = db.sequelize;
		this.OrderStatus = db.OrderStatus;
	}

	async getAll() {
		try {
			const statuses = await this.OrderStatus.findAll()

			return statuses
		} catch (err) {
			throw new Error('Failed to get orderstatus: ' + err.message);
		}
	}

	async populateOrderStatuses() {
		try {
			const statuses = ["In Progress", "Ordered", "Completed"];

			const createdStatuses = await Promise.all(
				statuses.map(orderstatus => 
					this.OrderStatus.findOrCreate({
						where: { OrderStatus: orderstatus }
					})
				)
			);

			return true
		} catch (err) {
			throw new Error('Failed to populate orderstatuses: ' + err.message);
		}
	}
	
	async getOrderstatusnameByName(inputName){
		try {
			if (!inputName) throw new Error ("inputName required")
			const orderstatus = await this.OrderStatus.findOne({where: {OrderStatus: inputName}})
			return orderstatus
		} catch (err) {
			throw new Error('Failed to find orderstatus')
		}
	}

	async getOrderstatusnameById(inputId) {
		try {
			if (!inputId || isNaN(inputId)) throw new Error("Valid orderstatus ID required");
	
			const orderstatus = await this.OrderStatus.findOne({ where: { id: inputId } });
			return orderstatus;
		} catch (err) {
			throw new Error("Failed to find orderstatus: " + err.message);
		}
	}

	async create(inputName) {
		try {
			const orderstatusExists = await this.getOrderstatusnameByName(inputName)
			if (orderstatusExists) throw new Error ('Orderstatus exists already')
			const newOrderstatus = await this.OrderStatus.create({OrderStatus: inputName})

			return newOrderstatus
		} catch (err) {
			throw new Error('Failed to create orderstatus: ' + err.message);
		}
	}

	async update(id, inputName) {
		try {
			// Validate id
			if (!id || isNaN(id)) throw new Error("Valid orderstatus ID required");
	
			// Validate inputName
			if (!inputName || typeof inputName !== "string") throw new Error("Orderstatusname must be a valid string");
	
			inputName = inputName.trim();
			if (inputName.length === 0) throw new Error("Orderstatusname cannot be empty");
	
			// Check if the orderstatus exists
			const orderstatus = await this.getOrderstatusnameById(id);
			if (!orderstatus) throw new Error("Orderstatus does not exist");
	
			// Check if the new name already exists
			const existingOrderstatus = await this.getOrderstatusnameByName(inputName);
			if (existingOrderstatus && existingOrderstatus.id !== orderstatus.id) throw new Error("A orderstatus with this name already exists");
	
			// Update the orderstatus
			await this.OrderStatus.update({ OrderStatus: inputName }, { where: { id } });
	
			// Fetch updated orderstatus
			const updatedOrderstatus = await this.getOrderstatusnameById(id);
			return updatedOrderstatus;
		} catch (err) {
			throw new Error("Failed to update orderstatus: " + err.message);
		}
	}

	async delete(id) {
		try {
			const orderstatus = await this.getOrderstatusnameById(id);
			if (!orderstatus) throw new Error('Orderstatus ID does not exist');
	
			const deletedRows = await this.OrderStatus.destroy({ where: { id } });
	
			if (deletedRows === 0) throw new Error('Failed to delete orderstatus');
	
			return { message: 'Orderstatus successfully deleted', id };
		} catch (err) {
			throw new Error("Failed to delete orderstatus: " + err.message);
		}
	}
}
module.exports = OrderStatusService;