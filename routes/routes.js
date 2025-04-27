//This file is loaded in index.js into /query, all routes are prefixed with /query
const express = require("express");
const router = express.Router();

function transformSqlQuery(query) {
  return query
    .replace(
      /"([^"]*)"(?=\s+AS|\s+FROM|\s+WHERE|\s+ORDER|\s*,|\s*\)|\s*$)/g,
      "'$1'"
    )
    .trim();
}

async function setupDynamicRoutes(pool) {
  try {
    const result = await pool.query("SELECT id, query, method FROM sqlqueries");

    result.rows.forEach((row) => {
      const { id, query, method } = row;

      router[method.toLowerCase()](`/query${id}`, async (req, res) => {
        try {
          const queryResult = await pool.query(transformSqlQuery(query));

          res.json(queryResult.rows);
        } catch (error) {
          console.error(
            `Error executing query for route "/query${id}":`,
            error
          );
          res.status(500).json({ error: "Database query failed" });
        }
      });
      console.log(`Route created: ${method.toUpperCase()}/query${id}`);
    });
    console.log("All dynamic routes have been set up.");
    return router;
  } catch (error) {
    console.error("Failed, to set up dynamic routes:", error);
    throw error;
  }
}

module.exports = setupDynamicRoutes;
// module.exports = (db) => {
//   router.get("/query1", (req, res) => {
//     db.query(
//       `WITH MonthEndDates AS (
//         SELECT
//         DISTINCT
//         DATE_TRUNC('month', date) + INTERVAL '1 month - 1 day' AS month_end_date
//         FROM
//         portfolio_prices
//         WHERE
//         date <= (SELECT MAX(date) FROM portfolio_prices)
//         ORDER BY
//         month_end_date
//         ),
//         LatestPricesByMonth AS (
//         SELECT
//         m.month_end_date,
//         s.ticker,
//         (
//         SELECT pp.close
//           FROM portfolio_prices pp
//           WHERE pp.ticker = s.ticker
//           AND pp.Date <= m.month_end_date
//           ORDER BY pp.Date DESC
//           LIMIT 1
//         ) AS latest_price
//           FROM
//           MonthEndDates m
//           CROSS JOIN (
//             SELECT DISTINCT ticker
//             FROM portfolio_prices
//           ) s
//         )
//         SELECT
//           month_end_date,
//         SUM(latest_price) AS total_portfolio_value
//         FROM
//           LatestPricesByMonth
//         GROUP BY
//           month_end_date
//         ORDER BY
//           Month_end_date;
// `
//     )
//       .then((data) => {
//         res.json(data.rows);
//       })
//       .catch((err) => {
//         res.status(500).json({ error: err.message });
//       });
//   });
//   router.get("/query2", (req, res) => {
//     db.query(
//       `WITH StartPrices AS (
// SELECT p.purchase_date date, p.ticker, close
// FROM portfolio p INNER JOIN portfolio_prices pp
// ON p.ticker = pp.ticker AND p.purchase_date = date
// ),
// EndPrices AS (
// SELECT date,ticker, close
// FROM portfolio_prices
// WHERE date = (SELECT MAX(date) from portfolio_prices)
// ),
// PerShareReturn AS(
// SELECT sp.date as start_date, ep.date as end_date, sp.ticker, (ep.close - sp.close) AS return_per_share, ((ep.close - sp.close)/ep.close * 100) AS return_perc
// FROM EndPrices ep INNER JOIN StartPrices sp
// ON ep.ticker = sp.ticker
// )
// SELECT start_date, end_date, psr.ticker, (p.quantity * psr.return_per_share) as return, return_perc
// FROM PerShareReturn psr INNER JOIN portfolio p
// ON psr.ticker = p.ticker
// ORDER BY return DESC;
// `
//     )
//       .then((data) => {
//         res.json(data.rows);
//       })
//       .catch((err) => {
//         res.status(500).json({ error: err.message });
//       });
//   });
//   return router;
// };
