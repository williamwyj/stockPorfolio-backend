INSERT INTO sqlquery ("id", "title", "description", "query") 
VALUES (1, 'Portfolio Performance over Time', 'Calculate the total value of the portfolio at the end of each month for the past 2 years', 
'WITH MonthEndDates AS (
  SELECT 
    DISTINCT 
    DATE_TRUNC("month", date) + INTERVAL "1 month - 1 day" AS month_end_date 
  FROM 
    portfolio_prices 
  WHERE 
    date >= CURRENT_DATE - INTERVAL "2 years" 
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
  Month_end_date;'
);