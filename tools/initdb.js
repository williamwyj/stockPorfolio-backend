const { Client } = require("pg");
const fsp = require("fs/promises");
require("dotenv").config();
const initDb = async () => {
  const client = new Client({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    database: process.env.PGDATABASE || "stockportfolio",
    password: process.env.PGPASSWORD || "password",
    port: process.env.PGPORT || 5432,
  });
  try {
    // connect to the local database server
    await client.connect();
    // Loads the schema files from db/schema
    console.log(`-> Loading Schema Files ...`);
    const schemaFilenames = await fsp.readdir("./tools/db/schema");

    for (const fn of schemaFilenames) {
      const sql = await fsp.readFile(`./tools/db/schema/${fn}`, "utf8");
      console.log(`\t-> Running ${fn}`);
      await client.query(sql);
    }
    // Loads seed files from db/seeds
    console.log(`-> Loading Seeds ...`);
    const seedFilenames = await fsp.readdir("./tools/db/seeds");

    for (const fn of seedFilenames) {
      const sql = await fsp.readFile(`./tools/db/seeds/${fn}`, "utf8");
      console.log(`\t-> Running ${fn}`);
      await client.query(sql);
    }
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    await client.end();
  }
};
initDb()
  .then(() => {
    console.log("finished");
  })
  .catch(() => {
    console.log("finished with errors");
  });
