
class CartService {
	constructor(db) {
		this.client = db.sequelize;
		this.Product = db.Product;
		this.Brand = db.Brand;
		this.Category = db.Category;
		this.CartProducts = db.CartProducts;
		this.User = db.User;
		this.Order = db.Order;
        this.OrderProducts = db.OrderProducts;
        this.Membership = db.Membership;
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

	async getCart(UserId) {
		try {
			const cartProducts = await this.CartProducts.findAll({where: {UserId}})
			return cartProducts
		} catch (err) {
			throw new Error('Failed to get products: ' + err.message);
		}
	}

    // async addItem(UserId, ProductId, quantity = 1) {
    //     try {
    //         // Get the product to check available stock
    //         const product = await this.Product.findByPk(ProductId);
    //         if (!product) {
    //             throw new Error("Product not found");
    //         }
    
    //         // Get current quantity in the user's cart
    //         const existingItem = await this.CartProducts.findOne({
    //             where: { UserId, ProductId }
    //         });
    
    //         const currentCartQuantity = existingItem ? existingItem.quantity : 0;
    //         const totalRequestedQuantity = currentCartQuantity + quantity;
    
    //         // Check if requested quantity exceeds available stock
    //         if (totalRequestedQuantity > product.Quantity) {
    //             throw new Error(`Only ${product.Quantity} units are available in stock.`);
    //         }
    
    //         if (existingItem) {
    //             // If the product is already in the cart, increase the quantity
    //             existingItem.quantity = totalRequestedQuantity;
    //             await existingItem.save();
    //         } else {
    //             // Otherwise, add a new row to the cart
    //           await this.CartProducts.create({ UserId, ProductId, quantity });
              
    //         }
    
    //         return { message: "Product added to cart successfully" };
    //     } catch (err) {
    //         throw new Error("Failed to add product to cart: " + err.message);
    //     }
    // }

    async addItem(UserId, ProductId, quantity) {
        try {
            
            if (!quantity) throw new Error ("Quantity required")
            if (quantity < 1 ) throw new Error ("Quantity must be 1 or greater")

            const product = await this.Product.findByPk(ProductId);
            if (!product) {
                return {
                    status: "error",
                    statuscode: 400,
                    data: { message: "Product not found" }
                };
            }
    
            // Check if user has item in cart already
            const existingItem = await this.CartProducts.findOne({
                where: { UserId, ProductId }
            });
    
            const currentCartQuantity = existingItem ? existingItem.quantity : 0;
            const totalRequestedQuantity = currentCartQuantity + quantity;
    
            // Check if requested quantity exceeds available stock
            if (totalRequestedQuantity > product.Quantity) {
                return {
                    status: "error",
                    statuscode: 400,
                    data: {
                        message: `Only ${product.Quantity} units are available in stock.`,
                        availableStock: product.Quantity
                    }
                };
            }
    
            let updatedCartQuantity;
            if (existingItem) {
                // Update quantity if the product is already in the cart
                existingItem.quantity = totalRequestedQuantity;
                await existingItem.save();
                updatedCartQuantity = existingItem.quantity;
            } else {
                // Add a new row to the cart
                const newCartItem = await this.CartProducts.create({ UserId, ProductId, quantity });
                updatedCartQuantity = newCartItem.quantity;
            }
    
            return {
                status: "success",
                statuscode: 200,
                data: {
                    message: "Product added to cart successfully",
                    product: {
                        id: product.id,
                        name: product.name,
                        price: product.price
                    },
                    cartQuantity: updatedCartQuantity,
                    remainingStock: product.Quantity - updatedCartQuantity
                }
            };
        } catch (err) {
            return {
                status: "error",
                statuscode: 500,
                data: { message: "Failed to add product to cart", error: err.message }
            };
        }
    }   

    // async makeOrder(UserId) {
    //     try {
    //         const discountStr = await this.getUserDiscount(UserId);
    //         const discount = Number(discountStr) / 100; // Convert to decimal (for example 15% → 0.15)
    //         const [cartProducts] = await this.client.query(`
    //             SELECT 
    //                 cp.id AS CartProductId,
    //                 cp.ProductId,
    //                 cp.quantity,
    //                 p.price AS PriceWithoutDiscount,
    //                 p.price * (1 - COALESCE(${discount}, 0)) AS PriceWithDiscount
    //             FROM cartproducts cp
    //             JOIN products p ON cp.ProductId = p.id
    //             LEFT JOIN users u ON cp.UserId = u.id
    //             LEFT JOIN memberships m ON u.MembershipId = m.id
    //             WHERE cp.UserId = ${UserId};
    //         `);
    
    //         if (cartProducts.length === 0) {
    //             return { emptyCart: true };
    //         }
    
    //         const user = await this.User.findByPk(UserId);
    //         if (!user) {
    //             throw new Error("User not found");
    //         }
    
    //         // GET QUANTITY OF ITEMS USER HAS IN CART
    //         const getTotalQuantityInCart = await this.client.query(
    //             `SELECT SUM(quantity) AS total
    //              FROM cartproducts
    //              WHERE UserId = ${UserId}`, { plain: true }
    //         );
    //         const quantityInCart = Number(getTotalQuantityInCart.total) || 0;
    
    //         // GET QUANTITY USER HAS ORDERED BEFORE
    //         const getTotalOrderedBefore = await this.client.query(
    //             `SELECT SUM(op.quantity) AS total
    //              FROM orderproducts op
    //              JOIN orders o ON op.OrderId = o.id
    //              WHERE o.UserId = ${UserId}`, { plain: true }
    //         );
    //         const totalOrderedBefore = Number(getTotalOrderedBefore.total) || 0;
    
    //         const totalOrderedNow = quantityInCart + totalOrderedBefore;
    
    //         const [memberships] = await this.client.query(
    //             `SELECT * FROM memberships
    //             ORDER BY Threshold ASC;`
    //         );
    
    //         let membershipRank = user.MembershipId;
    
    //         for (const membership of memberships) {
    //             if (membership.Threshold <= totalOrderedNow) {
    //                 membershipRank = membership.id;
    //             } else {
    //                 break;
    //             }
    //         }
    
    //         console.log(`User's membership is now set to ${membershipRank}`);
    
    //         if (user.MembershipId !== membershipRank) {
    //             user.MembershipId = membershipRank;
    //             await user.save();
    //         }
    
    //         const order = await this.Order.create({
    //             OrderStatusId: 1,
    //             UserId,
    //             capturedMembershipId: user.MembershipId,
    //             capturedMembershipName: memberships.find(m => m.id === user.MembershipId)?.Name || "Unknown",
    //             capturedMembershipDiscount: memberships.find(m => m.id === user.MembershipId)?.Discount || 0
    //         });
    
    //         // Reduce amount in stock
    //         for (const cartProduct of cartProducts) {
    //             const product = await this.Product.findByPk(cartProduct.ProductId);
    //             if (!product) {
    //                 throw new Error(`Product with ID ${cartProduct.ProductId} not found`);
    //             }
    //             if (product.Quantity < cartProduct.quantity) {
    //                 throw new Error(`Not enough stock for product ID ${cartProduct.ProductId}`);
    //             }
    
    //             product.Quantity -= cartProduct.quantity;
    //             await product.save();
    //         }
    
    //         const orderProductsData = await Promise.all(
    //             cartProducts.map(async (cartProduct) => {
    //                 const latestDiscountStr = await this.getUserDiscount(UserId);
    //                 const latestDiscount = Number(latestDiscountStr) / 100;
    //                 const latestProduct = await this.Product.findByPk(cartProduct.ProductId);

    //                 return {
    //                     OrderId: order.id,
    //                     ProductId: cartProduct.ProductId,
    //                     quantity: cartProduct.quantity,
    //                     CapturedPricePerItem: latestProduct.Price * (1 - latestDiscount),
    //                 };
    //             })
    //         );
    
    //         await this.OrderProducts.bulkCreate(orderProductsData);
    
    //         await this.CartProducts.destroy({ where: { UserId } });
    
    //         return { message: "Order created successfully", orderId: order.id };
    //     } catch (err) {
    //         throw new Error("Failed to create order: " + err.message);
    //     }
    // }





    // This function was definitely the hardest of all to get right.
    // After many iterations and bug fixes, it finally works.
    // I had to wrap it in a transaction to make sure all these steps get reverted if one of them do not succeed.
    
    /* 
        I had a bug which worked like this:
            User A placed 5 iPhones in cart. User B also places 5 iPhones in cart.
            User A now purchases the 5 iPhones in their cart successfully.
            iPhones are now sold out.
            User B still has 5 iPhones in their cart.
            User B tries to purchase these 5 iPhones, but it is out of stock.
            Error is thrown, since stock is checked and it returns invalid amount.
            Order was still generated with the Order.create() call.
            orderProducts fails to generate, I think.
            Order has been created, but contains 0 items in it, because the action was incomplete.
            Implemented transaction to rollback actions if something fails.

        The bug as been resolved by implementing transactions.
    */
   
    async makeOrder(UserId) {
        const t = await this.client.transaction(); // Start transaction
        try {
            const discountStr = await this.getUserDiscount(UserId);
            const discount = Number(discountStr) / 100;
    
            const [cartProducts] = await this.client.query(`
                SELECT 
                    cp.id AS CartProductId,
                    cp.ProductId,
                    cp.quantity,
                    p.price AS PriceWithoutDiscount,
                    p.price * (1 - COALESCE(${discount}, 0)) AS PriceWithDiscount,
                    p.Quantity AS Stock
                FROM cartproducts cp
                JOIN products p ON cp.ProductId = p.id
                WHERE cp.UserId = ${UserId};
            `, { transaction: t });
    
            if (cartProducts.length === 0) {
                await t.rollback();
                return { emptyCart: true };
            }
    
            const user = await this.User.findByPk(UserId, { transaction: t });
            if (!user) {
                await t.rollback();
                throw new Error("User not found");
            }
    
            // Check if all products are in stock before creating order
            for (const cartProduct of cartProducts) {
                if (cartProduct.Stock < cartProduct.quantity) {
                    await t.rollback();
                    return { emptyStock: true };
                    // return { error: `Not enough stock for product ID ${cartProduct.ProductId}` };
                }
            }
    
            // Get total quantity in cart and previously ordered quantity
            const [[{ total: quantityInCart }]] = await this.client.query(
                `SELECT SUM(quantity) AS total FROM cartproducts WHERE UserId = ${UserId}`,
                { transaction: t }
            );
    
            const [[{ total: totalOrderedBefore }]] = await this.client.query(
                `SELECT SUM(op.quantity) AS total 
                 FROM orderproducts op
                 JOIN orders o ON op.OrderId = o.id
                 WHERE o.UserId = ${UserId}`,
                { transaction: t }
            );
            console.log("-- TOTAL ORDERED BEFORE: " + totalOrderedBefore)

    
            const totalOrderedNow = Number((quantityInCart || 0)) + Number((totalOrderedBefore || 0));

            console.log(totalOrderedNow)
    
            // Determine new membership
            const [memberships] = await this.client.query(
                `SELECT * FROM memberships ORDER BY Threshold ASC;`,
                { transaction: t }
            );
    
            let membershipRank = user.MembershipId;
            for (const membership of memberships) {
                if (membership.Threshold <= totalOrderedNow) {
                    membershipRank = membership.id;
                } else {
                    break;
                }
            }
    
            if (user.MembershipId !== membershipRank) {
                user.MembershipId = membershipRank;
                await user.save({ transaction: t });
                // await user.save();
            }
    
            // Create order
            const order = await this.Order.create({
                OrderStatusId: 1,
                UserId,
                capturedMembershipId: user.MembershipId,
                capturedMembershipName: memberships.find(m => m.id === user.MembershipId)?.Name || "Unknown",
                capturedMembershipDiscount: memberships.find(m => m.id === user.MembershipId)?.Discount || 0
            }, { transaction: t });
    
            // Reduce stock
            for (const cartProduct of cartProducts) {
                await this.Product.update(
                    { Quantity: cartProduct.Stock - cartProduct.quantity },
                    { where: { id: cartProduct.ProductId }, transaction: t }
                );
            }
    
            // VERSION 1
            // Prepare orderProducts data
            // const orderProductsData = cartProducts.map(cartProduct => ({
            //     OrderId: order.id,
            //     ProductId: cartProduct.ProductId,
            //     quantity: cartProduct.quantity,
            //     CapturedPricePerItem: cartProduct.PriceWithDiscount
            // }));

            // VERSION 2
            // const orderProductsData = await Promise.all(
            //     cartProducts.map(async (cartProduct) => {
            //         const latestDiscountStr = await this.getUserDiscount(UserId);
            //         const latestDiscount = Number(latestDiscountStr) / 100;
            //         const latestProduct = await this.Product.findByPk(cartProduct.ProductId);

            //         return {
            //             OrderId: order.id,
            //             ProductId: cartProduct.ProductId,
            //             quantity: cartProduct.quantity,
            //             CapturedPricePerItem: latestProduct.Price * (1 - latestDiscount),
            //         };
            //     })
            // );

            // VERSION 3
            //GET percentage, like 0%, 15% or 30%
            let percentage = order.capturedMembershipDiscount

            //REMOVE % mark of the end and be left with 0, 15, or 30
            let trimmedPercentage = percentage.slice(0,-1)

            //ENSURE it is a number and divide by hunder to get a multiplier, like 0, 0.15 or 0.3
            const capturedDiscount = Number(trimmedPercentage) / 100;

            const orderProductsData = cartProducts.map(cartProduct => ({
                OrderId: order.id,
                ProductId: cartProduct.ProductId,
                quantity: cartProduct.quantity,
                CapturedPricePerItem: cartProduct.PriceWithoutDiscount * (1 - capturedDiscount),
            }));
                
            await this.OrderProducts.bulkCreate(orderProductsData, { transaction: t });
    
            // Clear user's cart
            await this.CartProducts.destroy({ where: { UserId }, transaction: t });
    
            await t.commit(); // Commit transaction
            return { message: "Order created successfully", orderId: order.id };
    
        } catch (err) {
            await t.rollback(); // Rollback transaction on error
            throw new Error("Failed to create order: " + err.message);
        }
    }    
}
module.exports = CartService;