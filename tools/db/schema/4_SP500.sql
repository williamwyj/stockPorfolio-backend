DROP TABLE IF EXISTS SP500;
CREATE TABLE IF NOT EXISTS SP500(
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
