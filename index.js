const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

// MySQL Configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "node-express-mysql",
};

const pool = mysql.createPool(dbConfig);

// Create 'user', 'product', and 'price' tables if they don't exist
async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS product (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id)
      );

      CREATE TABLE IF NOT EXISTS price (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES product(id)
      );
    `);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

// Route to create all tables
app.post("/create-tables", async (req, res) => {
  try {
    await createTables();
    res.json({ message: "Tables created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error creating tables" });
  }
});

// Route to insert data into 'user' table
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    await pool.query("INSERT INTO user (name, email) VALUES (?, ?)", [
      name,
      email,
    ]);
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error inserting data into the user table" });
  }
});

// Route to insert data into 'product' table
app.post("/products", async (req, res) => {
  const { name, user_id } = req.body;
  if (!name || !user_id) {
    return res.status(400).json({ error: "Name and user_id are required" });
  }

  try {
    await pool.query("INSERT INTO product (name, user_id) VALUES (?, ?)", [
      name,
      user_id,
    ]);
    res
      .status(201)
      .json({ success: true, message: "Product created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error inserting data into the product table" });
  }
});

// Route to insert data into 'price' table
app.post("/prices", async (req, res) => {
  const { product_id, price } = req.body;
  if (!product_id || !price) {
    return res.status(400).json({ error: "product_id and price are required" });
  }

  try {
    await pool.query("INSERT INTO price (product_id, price) VALUES (?, ?)", [
      product_id,
      price,
    ]);
    res.status(201).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error inserting data into the price table" });
  }
});

app.get('/products', async (req, res) => {
    const { user_id, search, min_price } = req.query;
  
    try {
      let query = `
        SELECT p.*, u.name as user_name, u.email as user_email, SUM(price.price) as total_price
        FROM product p
        JOIN user u ON p.user_id = u.id
        LEFT JOIN price ON p.id = price.product_id
      `;
  
      if (user_id) {
        query += `WHERE p.user_id = ${user_id}`;
      }
  
      if (search) {
        query += user_id ? ` AND p.name LIKE '%${search}%'` : ` WHERE p.name LIKE '%${search}%'`;
      }
  
      query += ' GROUP BY p.id, u.name, u.email';
  
      if (min_price) {
        query += ` HAVING total_price >= ${min_price}`;
      }
  
      const [rows, fields] = await pool.query(query);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching products from the database' });
    }
  });

  // Route to get the price of a product by product ID
  app.get('/product-prices/:product_id', async (req, res) => {
    const { product_id } = req.params;
  
    try {
      const query = `
        SELECT price.price, product.name as product_name, user.name as user_name, user.email as user_email
        FROM price
        JOIN product ON price.product_id = product.id
        JOIN user ON product.user_id = user.id
        WHERE price.product_id = ?;
      `;
      const [rows, fields] = await pool.query(query, [product_id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Product prices not found' });
      }
  
      const prices = rows.map(row => ({
        price: row.price,
        product_name: row.product_name,
        user_name: row.user_name,
        user_email: row.user_email
      }));
      res.json({ prices });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching product prices from the database' });
    }
  });
  



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listen on port ${PORT}`);
});
