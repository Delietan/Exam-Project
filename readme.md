## ABOUT THE PROJECT

### General

- This was my final exam project for my Professional Degree in Backend Development
    - The project received grade A
- The project consists of:
    - Complete API for E-commerce using Node with Express.js
    - MySQL Database
    - Sequelize ORM
    - JWT Authentication
    - Jest And Supertest for Integration Testing
    - Swagger Documentation
    - Admin Dashboard Frontend with EJS and Bootstrap

### Functionality of the software

- Lipsum

## HOW TO USE

- Clone repository
- Open repository in code editor, for example VSCode.
- Open two terminals
    - In one terminal, go to destination /front-end/
    - In the other terminal, go to destination /back-end/
    - In both terminals, execute the command "npm install" to automatically install dependencies
- In both destinations, front-end and back-end, create a .env file to use for configuration
    - Check env_example file in each folder to see what the config file should look like.
    - The front-end .env file does only need a TOKEN_SECRET value, but it has to match the TOKEN_SECRET in your back-end .env file

- After completing configuration, start the both servers by running "npm start" in both terminals.

- The front-end runs on http://localhost:3000/
- The back-end runs on http://localhost:3001/

- To access the Admin Dashboard, go to http://localhost:3000/
- To access Back-end Documentation, go to http://localhost:3001/doc
    - Documentation is already generated, and will not be regenerated with each start of the back-end server.
    - The raw documentation is stored in the swagger-output.json file, and can be regenerated with command "node swagger" or "npm run doc"

- To populate the database, send a POST request to http://localhost:3001/init

- The application uses JWT as authentication. Login in to authenticate. The user will receive both a Token and a Cookie on succesful authentication.
    - Note that while testing the API in Postman, a Cookie is set on successful authentication. Due to Postmans native Cookie funcionality, this Cookie will automatically be stored in Postman and used for Authentication. "Bearer Token" authentication works as normal if you paste in the valid token. If the "Bearer Token" field is cleared, Postman uses the Cookie instead, and endpoints which require authentication will still be accessed successfully.
    - To force a negative authentication, please clear the stored Cookie, or enter an invalid "Bearer Token"

## HOW TO TEST

- In the terminal, go to the back-end folder. To run the test, execute command "npm test".
    - Tests I have run myself, pass every time. In the unfortunate case that a test fails, try to "flush" the database. 
    This can be done by setting db.sequelize.sync({ force: true }) in the /back-end/bin/www file, and the executing "npm start".

## REFERENCES

### Login page
Login page originates form this source, and it tweaked to my project's needs
https://mdbootstrap.com/docs/standard/extended/login/#section-5

### JWT authentication
JWT authentication originates from module Server Deployment Module 3.4 ("SRV - Module 3 - TDD lesson").
Code is reused, tweaked and edited to my project's needs.
This includes files: 
- /front-end/middleware/middleware.js/,
- /back-end/middleware/middleware.js/,
- /back-end/routes/auth.js/

### Documentation for Sequelize associations

- https://sequelize.org/docs/v6/core-concepts/assocs/

### Additional information about Sequelize associations - written by "eliette" in 2017

- https://gist.github.com/elliette/20ddc4e827efd9d62bc98752e7a62610

### AI assistance

- AI has played a valuable role in the development of the project. It has mainly contributed to correcting syntax errors and suggesting solutions. It has definitely not been as helpful as one would think, because it can't comprehend a repository with so many files. It is best for solving small localised problems, where you yourself decide the logic and progression, while the AI assists implementing it.
