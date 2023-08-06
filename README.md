Product Price API
The Product Price API is a Node.js application that provides endpoints to fetch product prices and associated information from a MySQL database. The API allows users to retrieve product prices, product names, and user information based on the product ID.

Setup
Prerequisites
Node.js (v14 or later)
MySQL server
Installation
Clone the repository:
bash
Copy code
git clone https://github.com/your-username/product-price-api.git
cd product-price-api
Install dependencies:
Copy code
npm install
Configure MySQL Database

Create a MySQL database and import the provided SQL schema from the database_schema.sql file in the root directory of the project.

Update the MySQL connection configuration in the app.js file to match your database credentials:

javascript
Copy code
const pool = mysql.createPool({
  host: 'your_mysql_host',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'your_database_name',
});
Running the Application
sql
Copy code
npm start
The server should now be running on http://localhost:3000.

API Endpoints
1. Get Product Prices and Names by Product ID
URL: /product-prices/:product_id

Method: GET

Params:

product_id: The ID of the product for which prices and names are requested.
Response:

If product prices are found for the specified product_id, the response will include an array of prices along with their product names and associated user information.
If no prices are found or the product_id does not exist, a 404 Not Found error will be returned.
json
Copy code
{
  "prices": [
    {
      "price": 10.99,
      "product_name": "Product 1",
      "user_name": "John Doe",
      "user_email": "john@example.com"
    },
    {
      "price": 19.99,
      "product_name": "Product 1",
      "user_name": "John Doe",
      "user_email": "john@example.com"
    }
  ]
}
2. Get Price of a Product by Product ID
URL: /product-price/:product_id

Method: GET

Params:

product_id: The ID of the product for which the price is requested.
Response:

If a price is found for the specified product_id, the response will include the price of the product.
If no price is found or the product_id does not exist, a 404 Not Found error will be returned.
json
Copy code
{
  "price": 10.99
}
Error Handling
If there is an error while fetching data from the database or any other internal server error, a 500 Internal Server Error response will be returned.
