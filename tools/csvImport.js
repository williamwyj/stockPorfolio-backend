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
  console.log("fn", fn);
  const inputfn = fn;
  const inputPath = `./tools/db/csv/${inputfn}`;
  console.log("inputfn", inputfn);

  const tableName = removeSuffix(inputfn);

  const schemafn = i + "_" + tableName + ".sql";
  const seedfn = i + "_" + tableName + "Data.sql";

  console.log("seedfn", seedfn);
  console.log("schemafn", schemafn);

  // const readStream = fs.createReadStream(`./tools/db/csv/${fn}`);

  const createStream = fs.createWriteStream(`./tools/db/schema/${schemafn}`);
  const insertStream = fs.createWriteStream(`./tools/db/seeds/${seedfn}`);

  // Keep track of whether we've inferred and written the CREATE TABLE statement
  let headerWritten = false;
  let headers = [];
  let columnTypes = {};

  fs.createReadStream(inputPath)
    .pipe(csv())
    .on("data", (row) => {
      if (!headerWritten) {
        console.log("row", row);
        //First row: infer headers and types
        headers = Object.keys(row);
        columnTypes = {};
        headers.forEach((header) => {
          const val = row[header];
          columnTypes[header] =
            !isNaN(val) && val.trim() !== "" ? "REAL" : "TEXT";
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

// const dataImport = async () => {
//   const csvFilenames = await fsp.readdir("./tools/db/csv");
//   csvFilenames.forEach((fn, i) => {
//     console.log("fn", fn);
//     fsp.writeFile(`${i}_${fn}.sql`)
//   });
// };
// dataImport()
//   .then(() => {
//     console.log("finished import");
//   })
//   .catch(() => {
//     console.log("finished with errors");
//   });

// fs.createReadStream("./tools/db/csv/Portfolio.csv")
//   .pipe(csv())
//   .on("data", (data) => results.push(data))
//   .on("end", () => {
//     console.log(results);
//   })
//   .on("error", (error) => {
//     console.error(error);
//   });
