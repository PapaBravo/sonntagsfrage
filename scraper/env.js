const dotenv = require('dotenv');
dotenv.config();

const influxUrl = process.env['INFLUX_URL'] || 'http://localhost:8086';
const influxToken = process.env['INFLUX_TOKEN'] || 'my-token';
const influxOrg = process.env['INFLUX_ORG'] || 'my-org';
const influxBucket = process.env['INFLUX_BUCKET'] || 'my-bucket';

const dbHost = process.env['DB_HOST'] || 'localhost';
const dbPort = process.env['DB_PORT'] || '3306';
const dbUser = process.env['DB_USER'] || 'wahlen_user';
const dbPassword = process.env['DB_PASSWORD'] || 'somepassword';
const dbDatabase = process.env['DB_DATABASE'] || 'wahlen';


module.exports = {
    influxUrl,
    influxToken,
    influxOrg,
    influxBucket,
    dbHost,
    dbPort,
    dbUser,
    dbPassword,
    dbDatabase,
}