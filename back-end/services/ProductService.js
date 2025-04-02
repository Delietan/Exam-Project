const { Op } = require("sequelize");

class ProductService {
	constructor(db) {
		this.client = db.sequelize;
		this.Product = db.Product;
		this.Brand = db.Brand;
		this.Category = db.Category;
	}

    async getUserDiscount(userId) {
        const [result] = await this.client.query(`
            SELECT 
                u.id AS userId, 
                m.Discount
            FROM users u
            LEFT JOIN memberships m ON u.MembershipId = m.id
            WHERE u.id = ${userId};
        `);
    
        // Extract discount value
        if (result.length > 0) {
            return result[0].Discount.replace('%', ''); // Remove '%' if it's stored as a string
        }
        return 0; // Default discount if user has no membership
    }
    
    async getAllAdmin(userId) {
        try {
            const discountStr = await this.getUserDiscount(userId);
            const discount = Number(discountStr) / 100; // Convert to decimal (e.g., 15% → 0.15)
            
            const [products] = await this.client.query(`
                SELECT 
                    p.id, 
                    p.name, 
                    p.description, 
                    p.price AS PriceWithoutDiscount, 
                    p.price * (1 - ${discount}) AS unitprice,
                    p.DateAdded AS date_added, 
                    p.imgurl, 
                    p.quantity, 
                    p.isDeleted as isdeleted, 
                    p.createdAt, 
                    p.BrandId, 
                    p.CategoryId, 
                    b.name AS brand, 
                    c.name AS category
                FROM products p
                LEFT JOIN brands b ON p.BrandId = b.id
                LEFT JOIN categories c ON p.CategoryId = c.id;
            `);
    
            return products;
        } catch (err) {
            throw new Error('Failed to get products: ' + err.message);
        }
    }

	async getAll(userId) {
        try {
            const discountStr = await this.getUserDiscount(userId);
            const discount = Number(discountStr) / 100; // Convert to decimal (e.g., 15% → 0.15)
           
            const [products] = await this.client.query(`
                SELECT 
                    p.id, 
                    p.name, 
                    p.description, 
                    p.price AS PriceWithoutDiscount, 
                    p.price * (1 - ${discount}) AS unitprice,
                    p.DateAdded AS date_added, 
                    p.imgurl, 
                    p.quantity, 
                    p.isDeleted as isdeleted, 
                    p.createdAt, 
                    p.BrandId, 
                    p.CategoryId, 
                    b.name AS brand, 
                    c.name AS category
                FROM products p
                LEFT JOIN brands b ON p.BrandId = b.id
                LEFT JOIN categories c ON p.CategoryId = c.id
                WHERE p.isDeleted != 1;    `
            )

			return products
		} catch (err) {
			throw new Error('Failed to get products: ' + err.message);
		}
	}

    async addProductsFromAPI() {
        try {
            const response = await fetch('http://backend.restapi.co.za/items/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status} - ${response.statusText}`);
            }
    
            const result = await response.json();
            let productArray = result.data;
            let results = [];
    
            for (let json of productArray) {
                try {
                    // Find or create Brand
                    const [brand] = await this.Brand.findOrCreate({
                        where: { name: json.brand },
                        defaults: { name: json.brand }
                    });

                    // Find or create Category
                    const [category] = await this.Category.findOrCreate({
                        where: { name: json.category },
                        defaults: { name: json.category }
                    });

                    // Find or create Product
                    const [product, created] = await this.Product.findOrCreate({
                        where: { Name: json.name },
                        defaults: {
                            Name: json.name,
                            Description: json.description,
                            Price: json.price,
                            Quantity: json.quantity,
                            DateAdded: json.date_added,
                            imgurl: json.imgurl,
                            CategoryId: category.id,
                            BrandId: brand.id
                        }
                    });

                    results.push({
                        name: product.Name,
                        status: created ? "Added successfully" : "Already exists"
                    });
    
                } catch (err) {
                    console.error(`Error processing product "${json.name}":`, err.message);
                    results.push({
                        name: json.name,
                        status: "Error occurred",
                        error: err.message
                    });
                }
            }
    
            return results;
    
        } catch (err) {
            console.error("Error fetching products:", err.message);
            throw new Error(`Product import failed: ${err.message}`);
        }
    }

    async fakeAddProductsFromAPI() {
        
        const data = require('../data/fakeApiData.js')

        const productArray = data.data;

        let results = [];
    
        for (let json of productArray) {
            try {
                // Find or create the brand
                const [brand] = await this.Brand.findOrCreate({
                    where: { name: json.brand },
                    defaults: { name: json.brand }
                });
    
                // Find or create the category
                const [category] = await this.Category.findOrCreate({
                    where: { name: json.category },
                    defaults: { name: json.category }
                });
    
                // Find or create the product
                const [product, created] = await this.Product.findOrCreate({
                    where: { Name: json.name },
                    defaults: {
                        Name: json.name,
                        Description: json.description,
                        Price: json.price,
                        Quantity: json.quantity,
                        DateAdded: json.date_added,
                        imgurl: json.imgurl,
                        CategoryId: category.id,
                        BrandId: brand.id
                    }
                });
    
                results.push({
                    name: product.Name,
                    status: created ? "Added successfully" : "Already exists"
                });
    
            } catch (err) {
                console.error(`Error processing product "${json.name}":`, err.message);
                results.push({
                    name: json.name,
                    status: "Error occurred",
                    error: err.message
                });
            }
        }
    
        return results;
    }

    async search(query, userId) {
        try {
            let discount = 0; // Default discount for guests
            if (userId) { // Only fetch discount if user is logged in
                const discountStr = await this.getUserDiscount(userId);
                discount = Number(discountStr) / 100; // Convert to decimal
            }
            const [results] = await this.client.query(`
                SELECT 
                    p.name, 
                    p.id, 
                    p.description, 
                    p.price AS PriceWithoutDiscount, 
                    p.price * (1 - ${discount}) AS unitprice,
                    p.DateAdded AS date_added, 
                    p.imgurl, 
                    p.quantity, 
                    p.isDeleted AS isdeleted, 
                    p.createdAt, 
                    p.BrandId, 
                    p.CategoryId, 
                    b.name AS brand, 
                    c.name AS category
                FROM products p
                LEFT JOIN brands b ON p.BrandId = b.id
                LEFT JOIN categories c ON p.CategoryId = c.id
                WHERE 
                (p.name LIKE '%${query}%'
                OR p.description LIKE '%${query}%' 
                OR b.name LIKE '%${query}%' 
                OR c.name LIKE '%${query}%')
                AND p.isDeleted != 1;
            `);
    
            return results;
        } catch (err) {
            throw new Error("Failed to search products: " + err.message);
        }
    }

    async searchAdmin(query, userId) {
        try {
            let discount = 0; // Default discount for guests
            if (userId) { // Only fetch discount if user is logged in
                const discountStr = await this.getUserDiscount(userId);
                discount = Number(discountStr) / 100; // Convert to decimal
            }
            const [results] = await this.client.query(`
                SELECT 
                p.name, 
                p.id, 
                p.description, 
                p.price AS PriceWithoutDiscount, 
                p.price * (1 - ${discount}) AS unitprice,
                p.DateAdded AS date_added, 
                p.imgurl, 
                p.quantity, 
                p.isDeleted AS isdeleted, 
                p.createdAt, 
                p.BrandId, 
                p.CategoryId, 
                b.name AS brand, 
                c.name AS category
                FROM products p
                LEFT JOIN brands b ON p.BrandId = b.id
                LEFT JOIN categories c ON p.CategoryId = c.id
                WHERE 
                p.name LIKE '%${query}%'
                OR p.description LIKE '%${query}%' 
                OR b.name LIKE '%${query}%' 
                OR c.name LIKE '%${query}%';
                `);
    
            return results;
        } catch (err) {
            throw new Error("Failed to search products: " + err.message);
        }
    }

    async getOneById(id) {
		try {
			if (!id || isNaN(id)) throw new Error("Valid Product ID is required");
			
			const Product = await this.Product.findOne({ where: { id } });
			if (!Product) throw new Error(`Product with ID '${id}' not found`);
			
			return Product;
		} catch (err) {
			throw new Error('Failed to get Product by ID: ' + err.message);
		}
	}
	
	async deleteById(id) {
		try {
			// Check if product exists before attempting deletion
			await this.getOneById(id);
	
			const deletedCount = await this.Product.destroy({ where: { id } });
			if (deletedCount === 0) throw new Error(`Product with ID '${id}' not found`);
	
			return { message: `Product with ID '${id}' deleted successfully` };
		} catch (err) {
			throw new Error('Failed to delete Product: ' + err.message);
		}
	}

    async updateById(id, newValues) {
		try {
			if (!id || isNaN(id)) {
				throw new Error("Invalid product ID");
			}

			const product = await this.getOneById(id);

			// Check if all fields are included
			const requiredFields = [
				"name", "description", "quantity", "unitprice",
				"brandid", "categoryid", "imgurl"
			];
			for (const field of requiredFields) {
				if (!newValues[field]) {
					throw new Error(`Missing required field: ${field}`);
				}
			}

			// // Validate email format
			// if (!/^\S+@\S+\.\S+$/.test(newValues.email)) {
			// 	throw new Error("Invalid email format");
			// }
	
			// // Validate phone number (numeric check)
			// if (isNaN(newValues.telephone)) {
			// 	throw new Error("Phone number must be numeric");
			// }
	
			// // Ensure membershipId and roleId are valid numbers
			// if (isNaN(newValues.membershipId) || isNaN(newValues.roleId)) {
			// 	throw new Error("Invalid membershipId or roleId");
			// }

			product.Name = newValues.name
			product.Description = newValues.description
			product.Quantity = newValues.quantity
			product.Price = newValues.unitprice
			product.imgurl = newValues.imgurl
			product.BrandId = newValues.brandid
			product.CategoryId = newValues.categoryid

			const result = await product.save();
			// console.log(result)
			return { message: `Product with ID '${id}' updated successfully` };
		} catch (err) {
			throw new Error('Failed to update product: ' + err.message);
		}
	}

    async getOneByName(inputName) {
        try {
            if (!inputName) throw new Error("Product name required");
            
            const product = await this.Product.findOne({ where: { Name: inputName } });
    
            return product;
        } catch (err) {
            throw new Error('Failed to find product: ' + err.message);
        }
	}

    async create(inputData) {
        try {
            const product = await this.getOneByName(inputData.name);
    
            if (product) throw new Error("Product with that name already exists");
    
            // Check if all fields are included
            const requiredFields = [
                "name", "description", "quantity", "unitprice",
                "brandid", "categoryid", "imgurl"
            ];
            for (const field of requiredFields) {
                if (!inputData[field]) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }
    
            const newProduct = await this.Product.create({
                Name: inputData.name,
                Description: inputData.description,
                Quantity: inputData.quantity,
                Price: inputData.unitprice,
                imgurl: inputData.imgurl,
                BrandId: inputData.brandid,
                CategoryId: inputData.categoryid,
                DateAdded: new Date().toISOString().split(".")[0]
            });
            
            return newProduct;
        } catch (err) {
            throw new Error("Failed to create product: " + err.message);
        }
    }

    async fakeDelete(id) {
        try {
   
            const product = await this.getOneById(id);
    
            if (!product) {
                throw new Error("Product not found");
            }
        
            product.isDeleted = product.isDeleted === 1 ? 0 : 1;
            await product.save();
    
            return { 
                message: `Product with ID '${id}' has been ${product.isDeleted === 1 ? 'deleted' : 'restored'}` 
            };
        } catch (err) {
            throw new Error('Failed to toggle product deletion: ' + err.message);
        }
    }

    async getSingleAdmin(id, userId) {
        try {
            const discountStr = await this.getUserDiscount(userId);
            const discount = Number(discountStr) / 100;
    
            const [product] = await this.client.query(`
                SELECT 
                    p.id, 
                    p.name, 
                    p.description, 
                    p.price AS PriceWithoutDiscount, 
                    p.price * (1 - ${discount}) AS unitprice,
                    p.DateAdded AS date_added, 
                    p.imgurl, 
                    p.quantity, 
                    p.isDeleted as isdeleted, 
                    p.createdAt, 
                    p.BrandId, 
                    p.CategoryId, 
                    b.name AS brand, 
                    c.name AS category
                FROM products p
                LEFT JOIN brands b ON p.BrandId = b.id
                LEFT JOIN categories c ON p.CategoryId = c.id
                WHERE p.id = ${id};
            `);
    
            return product.length ? product[0] : null;
        } catch (err) {
            throw new Error('Failed to get product: ' + err.message);
        }
    }
    
    async getSingle(id, userId) {
        try {
            const discountStr = await this.getUserDiscount(userId);
            const discount = Number(discountStr) / 100;
    
            const [product] = await this.client.query(`
                SELECT 
                    p.id, 
                    p.name, 
                    p.description, 
                    p.price AS PriceWithoutDiscount, 
                    p.price * (1 - ${discount}) AS unitprice,
                    p.DateAdded AS date_added, 
                    p.imgurl, 
                    p.quantity, 
                    p.isDeleted as isdeleted, 
                    p.createdAt, 
                    p.BrandId, 
                    p.CategoryId, 
                    b.name AS brand, 
                    c.name AS category
                FROM products p
                LEFT JOIN brands b ON p.BrandId = b.id
                LEFT JOIN categories c ON p.CategoryId = c.id
                WHERE p.id = ${id} AND p.isDeleted != 1;
            `);
    
            return product.length ? product[0] : null;
        } catch (err) {
            throw new Error('Failed to get product: ' + err.message);
        }
    }
}
module.exports = ProductService;