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