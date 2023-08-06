# Product Price API

The Product Price API is a Node.js application that provides endpoints to fetch product prices and associated information from a MySQL database. The API allows users to retrieve product prices, product names, and user information based on the product ID.

## Setup

### Prerequisites

- Node.js (v14 or later)
- MySQL server

### Installation

1. Clone the repository:
  
2.  Install dependencies:
3. Configure MySQL Database

   - Create a MySQL database and import the provided SQL schema from the `database_schema.sql` file in the root directory of the project.

   - Update the MySQL connection configuration in the `app.js` file to match your database credentials:

   ```javascript
   const pool = mysql.createPool({
     host: 'your_mysql_host',
     user: 'your_mysql_user',
     password: 'your_mysql_password',
     database: 'your_database_name',
   });

   npm start

   API Endpoints
   
1. Get Product Prices and Names by Product ID
URL: /product-prices/:product_id

Method: GET

Params:

product_id: The ID of the product for which prices and names are requested.
Response:

If product prices are found for the specified product_id, the response will include an array of prices along with their product names and associated user information.
If no prices are found or the product_id does not exist, a 404 Not Found error will be returned.
