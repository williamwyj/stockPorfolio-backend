DROP TABLE IF EXISTS Portfolio;
CREATE TABLE IF NOT EXISTS Portfolio(
"ticker" TEXT,
"quantity" REAL,
"sector" TEXT,
"purchase_date" DATE,
"purchase_price" REAL,
"weight" REAL
);
