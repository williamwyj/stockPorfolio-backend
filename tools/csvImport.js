const fs = require("fs");
const csv = require("csv-parser");

const results = [];

const csvFilenames = fs.readdirSync("./tools/db/csv");

function removeSuffix(filename) {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return filename;
  }
  return filename.substring(0, lastDotIndex);
}

csvFilenames.forEach((fn, i) => {
  const inputfn = fn;
  const inputPath = `./tools/db/csv/${inputfn}`;

  const tableName = removeSuffix(inputfn);

  const schemafn = i + "_" + tableName + ".sql";
  const seedfn = i + "_" + tableName + "Data.sql";

  const createStream = fs.createWriteStream(`./tools/db/schema/${schemafn}`);
  const insertStream = fs.createWriteStream(`./tools/db/seeds/${seedfn}`);

  // Keep track of whether we've inferred and written the CREATE TABLE statement
  let headerWritten = false;
  let headers = [];
  let columnTypes = {};

  function isValidDateFormat(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
  }

  function checkDataType(value) {
    if (!isNaN(value) && value.trim() !== "") {
      return "REAL";
    } else {
      if (isValidDateFormat(value)) {
        return "DATE";
      } else return "TEXT";
    }
  }

  fs.createReadStream(inputPath)
    .pipe(csv())
    .on("data", (row) => {
      if (!headerWritten) {
        //First row: infer headers and types
        headers = Object.keys(row);
        columnTypes = {};
        headers.forEach((header) => {
          const val = row[header];
          columnTypes[header] = checkDataType(val);
        });
        //Write CREATE TABLE statement once
        const createSQL =
          `DROP TABLE IF EXISTS ${tableName};\nCREATE TABLE IF NOT EXISTS ${tableName}(\n` +
          headers.map((h) => `"${h}" ${columnTypes[h]}`).join(",\n") +
          `\n);\n`;
        createStream.write(createSQL);
        createStream.end();

        headerWritten = true;
      }

      // write Insert Line by line
      const columns = headers.map((h) => `"${h}"`).join(", ");
      const values = headers
        .map((h) => {
          const val = row[h];
          if (columnTypes[h] === "REAL") return val;
          return `'${val.replace(/'/g, "''")}'`;
        })
        .join(", ");
      insertStream.write(
        `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`
      );
    })
    .on("end", () => {
      insertStream.end();
      console.log(
        "✅ Finished writing create.sql and inserts.sql using streaming."
      );
    })
    .on("error", (err) => {
      console.error("❌ CSV Read Error:", err);
    });
});
