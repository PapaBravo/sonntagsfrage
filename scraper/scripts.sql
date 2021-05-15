-- create database

-- create the databases
CREATE DATABASE IF NOT EXISTS wahlen;

-- create the users for each database
CREATE USER 'wahlen_user'@'%' IDENTIFIED BY 'somepassword';
GRANT CREATE, ALTER, INDEX, LOCK TABLES, REFERENCES, UPDATE, DELETE, DROP, SELECT, INSERT ON `wahlen`.* TO 'wahlen_user'@'%';

FLUSH PRIVILEGES;
USE wahlen;

-- create table
CREATE TABLE IF NOT EXISTS sonntagsfrage (
    poll_id INT AUTO_INCREMENT PRIMARY KEY,
    poll_date DATE,
    timeframe VARCHAR(255),
    sample INT,
    pollster VARCHAR(255) NOT NULL,
    CDU_CSU REAL,
    SPD REAL,
    GRUENE REAL,
    FDP REAL,
    LINKE REAL,
    PIRATEN REAL,
    FW REAL,
    AfD REAL,
    Sonstige REAL
);

-- Rolling average

SELECT t_outer.poll_date, 
    (
    SELECT AVG(CDU_CSU) as cdu_avg
    FROM sonntagsfrage t_inner
    WHERE t_inner.poll_date BETWEEN 
        DATE_SUB(t_outer.poll_date, INTERVAL 1 WEEK) 
        AND DATE_ADD(t_outer.poll_date, INTERVAL 1 WEEK)
    )
FROM sonntagsfrage t_outer

-- Rolling Arverage Grafana
SELECT
    $__timeGroupAlias(t_outer.poll_date,$__interval),
    (
    SELECT AVG(GRUENE)
    FROM sonntagsfrage t_inner
    WHERE t_inner.poll_date BETWEEN 
        DATE_SUB(FROM_UNIXTIME($__timeGroup(t_outer.poll_date,$__interval)), INTERVAL 1 WEEK) 
        AND DATE_ADD(FROM_UNIXTIME($__timeGroup(t_outer.poll_date,$__interval)), INTERVAL 1 WEEK)
    ) AS "Grüne Average"
FROM sonntagsfrage t_outer
WHERE
  $__timeFilter(t_outer.poll_date)
GROUP BY 1
ORDER BY $__timeGroup(t_outer.poll_date,$__interval)

