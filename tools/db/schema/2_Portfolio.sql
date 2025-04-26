DROP TABLE IF EXISTS Portfolio;
CREATE TABLE IF NOT EXISTS Portfolio(
"ticker" TEXT,
"quantity" REAL,
"sector" TEXT,
"purchase_date" DATE,
"weight" REAL
);
