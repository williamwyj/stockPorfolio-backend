DROP TABLE IF EXISTS Dow_Jones;
CREATE TABLE IF NOT EXISTS Dow_Jones(
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
