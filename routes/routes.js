//This file is loaded in index.js into /query, all routes are prefixed with /query
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/query1", (req, res) => {
    db.query(
      `WITH MonthEndDates AS (
        SELECT 
        DISTINCT 
        DATE_TRUNC('month', date) + INTERVAL '1 month - 1 day' AS month_end_date 
        FROM 
        portfolio_prices 
        WHERE 
        date >= CURRENT_DATE - INTERVAL '2 years' 
        ORDER BY 
        month_end_date
        ),
        LatestPricesByMonth AS (
        SELECT 
        m.month_end_date, 
        s.ticker, 
        ( 
        SELECT pp.close 
          FROM portfolio_prices pp
          WHERE pp.ticker = s.ticker
          AND pp.Date <= m.month_end_date 
          ORDER BY pp.Date DESC
          LIMIT 1 
        ) AS latest_price 
          FROM 
          MonthEndDates m 
          CROSS JOIN ( 
            SELECT DISTINCT ticker
            FROM portfolio_prices
          ) s 
        ) 
        SELECT 
          month_end_date, 
        SUM(latest_price) AS total_portfolio_value 
        FROM 
          LatestPricesByMonth 
        GROUP BY 
          month_end_date 
        ORDER BY
          Month_end_date;
`
    )
      .then((data) => {
        res.json(data.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
