INSERT INTO sqlquery ("id", "title", "description", "query") 
VALUES (1, 'Portfolio Performance over Time', 'Calculate the total value of the portfolio at the end of each month for the past 2 years', 
'WITH MonthEndDates AS (
  SELECT 
    DISTINCT 
    DATE_TRUNC("month", date) + INTERVAL "1 month - 1 day" AS month_end_date 
  FROM 
    portfolio_prices 
  WHERE 
    date <= (SELECT MAX(date) FROM portfolio_prices)
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
),
(
2, 'Individual Stock return', 'Calculate the individual stock return within the portfolio from the time of purchase to now',
'WITH StartPrices AS (
  SELECT p.purchase_date date, p.ticker, close
  FROM portfolio p INNER JOIN portfolio_prices pp
  ON p.ticker = pp.ticker AND p.purchase_date = date
),
EndPrices AS (
  SELECT date,ticker, close
  FROM portfolio_prices 
  WHERE date = (SELECT MAX(date) from portfolio_prices)
),
PerShareReturn AS(
  SELECT sp.date as start_date, ep.date as end_date, sp.ticker, (ep.close - sp.close) AS return_per_share, ((ep.close - sp.close)/ep.close * 100) AS return_perc
  FROM EndPrices ep INNER JOIN StartPrices sp
  ON ep.ticker = sp.ticker
)
  SELECT start_date, end_date, psr.ticker, (p.quantity * psr.return_per_share) as return, return_perc
  FROM PerShareReturn psr INNER JOIN portfolio p
  ON psr.ticker = p.ticker
  ORDER BY return DESC;
'
);