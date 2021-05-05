# Run

## Local Setup

### Set up Influx DB
See https://docs.influxdata.com/influxdb/v2.0/get-started

```sh
docker run \
    --name influxdb \
    -p 8086:8086 \
    --volume $PWD:/var/lib/influxdb2 \
    influxdb:2.0.6
```
and set up 
* admin user (`admin:12345678`)
* an organisation `wahlen` 
* and a bucket `sonntagsfrage`
* Create a token with r/w access to bucket


## Scrape
To get the data, run

```sh
cd scraper/
npm install
npm start
```

## View
Serve root directory and browse to `docs/index.html`
