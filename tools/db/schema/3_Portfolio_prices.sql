DROP TABLE IF EXISTS Portfolio_prices;
CREATE TABLE IF NOT EXISTS Portfolio_prices(
"Date" TEXT,
"Ticker" TEXT,
"Open" REAL,
"High" REAL,
"Low" REAL,
"Close" REAL,
"Adjusted" REAL,
"Returns" REAL,
"Volume" REAL
);
