DROP TABLE IF EXISTS Portfolio_prices;
CREATE TABLE IF NOT EXISTS Portfolio_prices(
"date" DATE,
"ticker" TEXT,
"open" REAL,
"high" REAL,
"low" REAL,
"close" REAL,
"adjusted" REAL,
"returns" REAL,
"volume" REAL
);
