class OrderService {
	constructor(db) {
		this.client = db.sequelize;
		this.Product = db.Product;
		this.Brand = db.Brand;
		this.Category = db.Category;
		this.CartProducts = db.CartProducts;
		this.Order = db.Order;
        this.OrderProducts = db.OrderProducts;
	}

	// async getAll() {
	// 	try {
	// 		const orders = await this.Order.findAll()

	// 		return orders
	// 	} catch (err) {
	// 		throw new Error('Failed to get brands: ' + err.message);
	// 	}
	// }

	async getAll() {
		try {
			const [orders] = await this.client.query(`SELECT 
				orders.*,
				orderstatuses.OrderStatus AS OrderStatusName,
				COALESCE(SUM(orderproducts.quantity), 0) AS TotalQuantity,
				COALESCE(SUM(orderproducts.quantity * orderproducts.CapturedPricePerItem), 0) AS TotalPrice,
				COALESCE(SUM(orderproducts.quantity * products.Price), 0) AS OriginalPrice
			FROM aexamdb.orders
			LEFT JOIN aexamdb.orderstatuses ON orders.OrderStatusId = orderstatuses.id
			LEFT JOIN aexamdb.memberships ON orders.capturedMembershipId = memberships.id
			LEFT JOIN aexamdb.orderproducts ON orders.id = orderproducts.OrderId
			LEFT JOIN aexamdb.products ON orderproducts.ProductId = products.id
			GROUP BY orders.id, orderstatuses.OrderStatus, memberships.Name, memberships.Discount;`
			)
			return orders
		} catch (err) {
			throw new Error('Failed to get orders: ' + err.message);
		}
	}

	async getOne(orderId) {
		try {
			const [orders] = await this.client.query(`SELECT 
				orders.*,
				orderstatuses.OrderStatus AS OrderStatusName,
				COALESCE(SUM(orderproducts.quantity), 0) AS TotalQuantity,
				COALESCE(SUM(orderproducts.quantity * orderproducts.CapturedPricePerItem), 0) AS TotalPrice,
				COALESCE(SUM(orderproducts.quantity * products.Price), 0) AS OriginalPrice
			FROM aexamdb.orders
			LEFT JOIN aexamdb.orderstatuses ON orders.OrderStatusId = orderstatuses.id
			LEFT JOIN aexamdb.memberships ON orders.capturedMembershipId = memberships.id
			LEFT JOIN aexamdb.orderproducts ON orders.id = orderproducts.OrderId
			LEFT JOIN aexamdb.products ON orderproducts.ProductId = products.id
			WHERE orders.id = ${orderId}
			GROUP BY orders.id, orderstatuses.OrderStatus, memberships.Name, memberships.Discount;`
			)
			return orders
		} catch (err) {
			throw new Error('Failed to get orders: ' + err.message);
		}
	}

	async getMyOrders(UserId) {
		try {
			const [orders] = await this.client.query(`
				SELECT 
					orders.*,
					orderstatuses.OrderStatus AS OrderStatusName,
					COALESCE(SUM(orderproducts.quantity), 0) AS TotalQuantity,
					COALESCE(SUM(orderproducts.quantity * orderproducts.CapturedPricePerItem), 0) AS TotalPrice
				FROM aexamdb.orders
				LEFT JOIN aexamdb.orderstatuses ON orders.OrderStatusId = orderstatuses.id
				LEFT JOIN aexamdb.memberships ON orders.capturedMembershipId = memberships.id
				LEFT JOIN aexamdb.orderproducts ON orders.id = orderproducts.OrderId
				WHERE orders.UserId = ${UserId}
				GROUP BY orders.id, orderstatuses.OrderStatus, memberships.Name, memberships.Discount;
			`);
	
			return orders;
		} catch (err) {
			throw new Error('Failed to get orders: ' + err.message);
		}
	}

	async getOrderItems(UserId, OrderId) {
		try {
			const [orderItems] = await this.client.query(`SELECT 
				op.OrderId,
				op.ProductId,
				p.Name AS ProductName,
				op.quantity,
				op.CapturedPricePerItem
				FROM aexamdb.orderproducts op
				JOIN aexamdb.orders o ON op.OrderId = o.id
				JOIN aexamdb.products p ON op.ProductId = p.id
				WHERE o.UserId = ${UserId} AND OrderId = ${OrderId};
			`);
	
			return orderItems;
		} catch (err) {
			throw new Error('Failed to get products: ' + err.message);
		}
	}

	async adminInspectOrder(OrderId) {
		try {
			const [orderItems] = await this.client.query(`SELECT 
				op.OrderId,
				op.ProductId,
				p.Name AS ProductName,
				op.quantity,
				op.CapturedPricePerItem,
				o.UserId
				FROM aexamdb.orderproducts op
				JOIN aexamdb.orders o ON op.OrderId = o.id
				JOIN aexamdb.products p ON op.ProductId = p.id
				WHERE OrderId = ${OrderId};
			`);
	
			return orderItems;
		} catch (err) {
			throw new Error('Failed to get products: ' + err.message);
		}
	}

	async update(id, newStatusId) {
		try {
			if (!id || isNaN(id)) throw new Error("Invalid or missing ID");
	
			const [updatedRows] = await this.Order.update(
				{ OrderStatusId: newStatusId },  // Update the OrderStatusId field
				{ where: { id } } // Condition to update the correct order
			);
	
			if (updatedRows === 0) {
				throw new Error("Order not found or no changes made");
			}
	
			return { message: "Order status updated successfully", updatedRows };
		} catch (error) {
			throw new Error("Could not update order: " + error.message);
		}
	}

	async delete(id) {
		try {
			if (!id || isNaN(id)) throw new Error("Invalid or missing ID");
	
			const deletedRows = await this.Order.destroy({ where: { id } });
	
			if (deletedRows === 0) {
				throw new Error("Order not found or already deleted");
			}
	
			return { message: "Order deleted successfully", deletedRows };
		} catch (error) {
			throw new Error("Could not delete order: " + error.message);
		}
	}
	
}


module.exports = OrderService;