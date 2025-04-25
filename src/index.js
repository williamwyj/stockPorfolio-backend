const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "stockportfolio",
  password: process.env.PGPASSWORD || "password",
  port: process.env.PGPORT || 5432,
});
app.use(cors());
app.use(bodyParser.json());

const routes = require("../routes/routes");

pool
  .connect()
  .then((res) => {
    console.log("database connected");
  })
  .catch((err) => console.error("query error", err.stack));

app.use("/query", routes(pool));
//CREATE
app.post("/items", async (req, res) => {
  const { name } = req.body;
  const result = await pool.query(
    "INSERT INTO items (name) VALUES ($1) RETURNING *",
    [name]
  );
  res.json(result.rows[0]);
});

//READ
app.get("/portfolio", async (req, res) => {
  const result = await pool.query("SELECT * FROM portfolio");
  res.json(result.rows);
});

app.get("/sqlqueries", async (req, res) => {
  const result = await pool.query("SELECT * FROM sqlquery");
  res.json(result.rows);
});
//UPDATE
app.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await pool.query(
    "UPDATE items SET name = $1 WHERE id = $2 RETURNING *",
    [name, id]
  );
  res.json(result.rows[0]);
});

//DELETE
app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM items WHERE id = $1", [id]);
  res.json({ message: "Item deleted" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// Create an async main function to properly handle async/await
