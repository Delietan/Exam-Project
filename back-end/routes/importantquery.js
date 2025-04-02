const query = ` SELECT 
p.name, 
p.id, 
p.description, 
p.price AS unitprice, 
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
LEFT JOIN categories c ON p.CategoryId = c.id; `

const query2 = ` SELECT 
p.name, 
p.id, 
p.description, 
p.price AS unitprice, 
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
WHERE p.name LIKE '%iPad% `

const query3 = ` SELECT 
p.name, 
p.id, 
p.description, 
p.price AS unitprice, 
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
p.name LIKE '%Apple%'
OR p.description LIKE '%Apple%' 
OR b.name LIKE '%Apple%' 
OR c.name LIKE '%Apple%'; `

const query4 = `SELECT SUM(op.quantity) AS total
FROM orderproducts op
JOIN orders o ON op.OrderId = o.id
WHERE o.UserId = :UserId`

