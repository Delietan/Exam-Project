const swaggerAutogen = require('swagger-autogen')()
const doc = {
    info: {
        version: "1.0.0",
        title: "BED EP1 API - Martinus Nordgård",
        description: "Simple doc for the frontend"
    },
    host: "localhost:3001",
    // definitions: {
    //     Category: {
    //         $id: "1",
    //         $name: "Phones"
    //     },
    //     Saft: {
    //         $name: "Hobby"
    //     },
    //     Status: {
    //         $name: "Completed",
    //     },
    //     User: {
    //         $name: "John Doe",
    //         $email: "johndoe@example.com",
    //         $password: "password123"
    //     }
    // },
    // tags: [
    //     { name: "Deployment and Maintenance", description: "Operations related app deployment and troubleshooting" },
    //     { name: "Authorization", description: "Operations related to signup and login." },
    //     { name: "Brands", description: "Operations related to brands." },
    //     { name: "Carts", description: "Operations related to carts." },
    //     { name: "Categories", description: "Operations related to categories." },
    //     { name: "Memberships", description: "Operations related to memberships." },
    //     { name: "Orders", description: "Operations related to orders." },
    //     { name: "Products", description: "Operations related to products." },
    //     { name: "Roles", description: "Operations related to roles." },
    //     { name: "Users", description: "Operations related to users." }
    // ]
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']




swaggerAutogen(outputFile, endpointsFiles, doc)
.then(() => {
    require('./bin/www')
    }
)