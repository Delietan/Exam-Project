class CategoryService {
	constructor(db) {
		this.client = db.sequelize;
		this.Category = db.Category;
	}

	async getAll() {
		try {
			const categories = await this.Category.findAll();
			return categories;
		} catch (err) {
			throw new Error('Failed to get categories: ' + err.message);
		}
	}

	async getCategoryByName(inputName) {
		try {
			if (!inputName) throw new Error("Category name required");
			const category = await this.Category.findOne({ where: { name: inputName } });
			return category;
		} catch (err) {
			throw new Error('Failed to find category');
		}
	}

	async getCategoryById(inputId) {
		try {
			if (!inputId || isNaN(inputId)) throw new Error("Valid category ID required");

			const category = await this.Category.findOne({ where: { id: inputId } });
			return category;
		} catch (err) {
			throw new Error("Failed to find category: " + err.message);
		}
	}

	async create(inputName) {
		try {
			const categoryExists = await this.getCategoryByName(inputName);
			if (categoryExists) throw new Error('Category already exists');
			
			const newCategory = await this.Category.create({ name: inputName });
			return newCategory;
		} catch (err) {
			throw new Error('Failed to create category: ' + err.message);
		}
	}

	async update(id, inputName) {
		try {
			// Validate id
			if (!id || isNaN(id)) throw new Error("Valid category ID required");
			
			// Validate inputName
			if (!inputName) throw new Error('Property "name" required');
			if (!isNaN(inputName)) throw new Error("Category name must be a valid string");

			inputName = inputName.trim();
			if (inputName.length === 0) throw new Error("Category name cannot be empty");

			// Check if the category exists
			const category = await this.getCategoryById(id);
			if (!category) throw new Error("Category does not exist");

			// Check if the new name already exists
			const existingCategory = await this.getCategoryByName(inputName);
			if (existingCategory && existingCategory.id !== category.id) throw new Error("A category with this name already exists");

			// Update the category
			await this.Category.update({ name: inputName }, { where: { id } });

			// Fetch updated category
			const updatedCategory = await this.getCategoryById(id);
			return updatedCategory;
		} catch (err) {
			throw new Error("Failed to update category: " + err.message);
		}
	}

	async delete(id) {
		try {
			const category = await this.getCategoryById(id);
			if (!category) throw new Error('Category ID does not exist');

			const deletedRows = await this.Category.destroy({ where: { id } });

			if (deletedRows === 0) throw new Error('Failed to delete category');

			return { message: 'Category successfully deleted', id };
		} catch (err) {
			throw new Error("Failed to delete category: " + err.message);
		}
	}
}

module.exports = CategoryService;
