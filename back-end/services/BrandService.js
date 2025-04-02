class BrandService {
	constructor(db) {
		this.client = db.sequelize;
		this.Brand = db.Brand;
	}

	async getAll() {
		try {
			const brands = await this.Brand.findAll()

			return brands
		} catch (err) {
			throw new Error('Failed to get brands: ' + err.message);
		}
	}

	async getBrandnameByName(inputName){
		try {
			if (!inputName) throw new Error ("inputName required")
			const brand = await this.Brand.findOne({where: {name: inputName}})
			return brand
		} catch (err) {
			throw new Error('Failed to find brand')
		}
	}

	async getBrandnameById(inputId) {
		try {
			if (!inputId || isNaN(inputId)) throw new Error("Valid brand ID required");
	
			const brand = await this.Brand.findOne({ where: { id: inputId } });
			return brand;
		} catch (err) {
			throw new Error("Failed to find brand: " + err.message);
		}
	}

	async create(inputName) {
		try {
			const brandExists = await this.getBrandnameByName(inputName)
			if (brandExists) throw new Error ('Brand exists already')
			const newBrand = await this.Brand.create({name: inputName})

			return newBrand
		} catch (err) {
			throw new Error('Failed to create brand: ' + err.message);
		}
	}

	async update(id, inputName) {
		try {
			// Validate id
			if (!id || isNaN(id)) throw new Error("Valid brand ID required");
	
			// Validate inputName
			if (!inputName || typeof inputName !== "string") throw new Error("Brand name must be a valid string");
	
			inputName = inputName.trim();
			if (inputName.length === 0) throw new Error("Brand name cannot be empty");
	
			// Check if the brand exists
			const brand = await this.getBrandnameById(id);
			if (!brand) throw new Error("Brand does not exist");
	
			// Check if the new name already exists
			const existingBrand = await this.getBrandnameByName(inputName);
			if (existingBrand && existingBrand.id !== brand.id) throw new Error("A brand with this name already exists");
	
			// Update the brand
			await this.Brand.update({ name: inputName }, { where: { id } });
	
			// Fetch updated brand
			const updatedBrand = await this.getBrandnameById(id);
			return updatedBrand;
		} catch (err) {
			throw new Error("Failed to update brand: " + err.message);
		}
	}

	async delete(id) {
		try {
			const brand = await this.getBrandnameById(id);
			if (!brand) throw new Error('Brand ID does not exist');
	
			const deletedRows = await this.Brand.destroy({ where: { id } });
	
			if (deletedRows === 0) throw new Error('Failed to delete brand');
	
			return { message: 'Brand successfully deleted', id };
		} catch (err) {
			throw new Error("Failed to delete brand: " + err.message);
		}
	}
}
module.exports = BrandService;