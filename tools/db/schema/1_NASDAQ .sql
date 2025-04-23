DROP TABLE IF EXISTS NASDAQ ;
CREATE TABLE IF NOT EXISTS NASDAQ (
"date" DATE,
"ticker" TEXT,
"open" REAL,
"high" REAL,
"low" REAL,
"close" REAL,
"adjusted" REAL,
"returns" TEXT,
"volume" REAL
);
