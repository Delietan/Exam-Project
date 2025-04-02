const app = require('../app');
const request = require('supertest');

let brandId;
let categoryId;
let createdItemId;
let createdItemName;

// ADDING TEST_CATEGORY
it('should add a category', async () => {
  const response = await request(app).post('/categories').send({
    "name": "TEST_CATEGORY"
  });

  categoryId = response.body.data.id; // Store category ID
  expect(response.body.statuscode).toBe(200);
  expect(response.body.data).toHaveProperty('result', 'Category created');
});

// ADDING TEST_BRAND
it('should add a brand', async () => {
  const response = await request(app).post('/brands').send({
    "brandname": "TEST_BRAND"
  });

  brandId = response.body.data.id; // Store brand ID
  expect(response.body.statuscode).toBe(200);
  expect(response.body.data).toHaveProperty('result', 'Brand created');
});

// ADDING TEST_PRODUCT
it('should add a product', async () => {
    const response = await request(app).post('/products').send({
        "name": "TEST_PRODUCT",
        "description": "TEST_DESCRIPTION",
        "quantity": "10",
        "unitprice": "99.99",
        "imgurl": "http://images.restapi.co.za/products/product-mxq-tv.png",
        "brandid": brandId,
        "categoryid": categoryId
    });
  
    createdItemId = response.body.data.id
    createdItemName = response.body.data.name
    expect(response.body.statuscode).toBe(200);
    expect(response.body.data).toHaveProperty('result', 'Product created successfully');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name', 'TEST_PRODUCT');
  });

// FINDING THE TEST_PRODUCT
it('should find the product', async () => {
    const response = await request(app).post(`/products/search?search=TEST_PRODUCT`).send();
  
    expect(response.body.statuscode).toBe(200);
    expect(response.body.data).toHaveProperty('result', 'Products found');
    expect(response.body.data).toHaveProperty('products');
    expect(response.body.data.products[0]).toHaveProperty('name', 'TEST_PRODUCT');
    expect(response.body.data.products[0]).toHaveProperty('brand', 'TEST_BRAND');
    expect(response.body.data.products[0]).toHaveProperty('category', 'TEST_CATEGORY');
  });


// UPDATING CATEGORY TO TEST_CATEGORY2
it('should edit the category', async () => {
const response = await request(app).put(`/categories/${categoryId}`).send({
    "name": "TEST_CATEGORY2",
});

expect(response.body.statuscode).toBe(200);
expect(response.body.data).toHaveProperty('result', 'Category updated');
expect(response.body.data).toHaveProperty('id');
expect(response.body.data).toHaveProperty('name', 'TEST_CATEGORY2');
});

// UPDATEING BRAND TO TEST_BRAND2
it('should edit the brand', async () => {
const response = await request(app).put(`/brands/${brandId}`).send({
    "brandname": "TEST_BRAND2",
});

expect(response.body.statuscode).toBe(200);
expect(response.body.data).toHaveProperty('result', 'Brand updated');
expect(response.body.data).toHaveProperty('id');
expect(response.body.data).toHaveProperty('name', 'TEST_BRAND2');
});

// SEARCH FOR THE EDITED TEST_PRODUCT
it('should find the updated product', async () => {
    const response = await request(app).post(`/products/search?search=${createdItemName}`).send();
  
    expect(response.body.statuscode).toBe(200);
    expect(response.body.data).toHaveProperty('result', 'Products found');
    expect(response.body.data).toHaveProperty('products');
    expect(response.body.data.products[0]).toHaveProperty('name', 'TEST_PRODUCT');
    expect(response.body.data.products[0]).toHaveProperty('brand', 'TEST_BRAND2');
    expect(response.body.data.products[0]).toHaveProperty('category', 'TEST_CATEGORY2');
  });


// CLEAN UP - DELETING BRAND, CATEGORY, PRODUCT
it('should delete the product', async () => {
  const response = await request(app).delete(`/products/realdelete/${createdItemId}`);

  expect(response.body.statuscode).toBe(200);
  expect(response.body.data).toHaveProperty('result', 'Product deleted successfully');
});

it('should delete the category', async () => {
  const response = await request(app).delete(`/categories/${categoryId}`);

  expect(response.body.statuscode).toBe(200);
  expect(response.body.data).toHaveProperty('result', 'Category successfully deleted');
});

it('should delete the brand', async () => {
  const response = await request(app).delete(`/brands/${brandId}`);

  expect(response.body.statuscode).toBe(200);
  expect(response.body.data).toHaveProperty('result', 'Brand successfully deleted');
});



// CLEAN UP, EVEN IF TESTS FAIL
afterAll(async () => {
    await request(app).delete(`/products/realdelete/${createdItemId}`);
    await request(app).delete(`/categories/${categoryId}`);
    await request(app).delete(`/brands/${brandId}`);
});