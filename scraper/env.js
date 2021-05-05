const dotenv = require('dotenv');
dotenv.config();

const influxUrl = process.env['INFLUX_URL'] || 'http://localhost:8086'
const influxToken = process.env['INFLUX_TOKEN'] || 'my-token'
const influxOrg = process.env['INFLUX_ORG'] || 'my-org'
const influxBucket = process.env['INFLUX_BUCKET'] || 'my-bucket'

module.exports = {
    influxUrl,
    influxToken,
    influxOrg,
    influxBucket,
}