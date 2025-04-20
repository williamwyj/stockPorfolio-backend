DROP TABLE IF EXISTS SP500;
CREATE TABLE IF NOT EXISTS SP500(
"Date" TEXT,
"Ticker" TEXT,
"Open" REAL,
"High" REAL,
"Low" REAL,
"Close" REAL,
"Adjusted" REAL,
"Returns" TEXT,
"Volume" REAL
);
