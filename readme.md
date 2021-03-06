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
and set up `influx setup`
* admin user (`admin:12345678`)
* an organisation `wahlen` 
* and a bucket `sonntagsfrage`
* Create a token with r/w access to bucket 
  * Find bucket id `influx bucket list`
  * `influx auth create -o wahlen --write-bucket <bucket-id>`

### Setup MariaDB

```sh
docker run \
      -p 127.0.0.1:3306:3306 \
      --name mariadb-wahlen \
      -e MYSQL_ROOT_PASSWORD=password \
      -e MYSQL_DATABASE=wahlen \
      -e MYSQL_USER=wahlen_user \
      -e MYSQL_PASSWORD=somepassword \
      -d mariadb:10.3
# rerun later
docker start mariadb-wahlen
```

## Remote Setup - Uberspace

```sh
mysql -e "CREATE DATABASE pboeck_wahlen"
```

## Scrape
To get the data, run

```sh
cd scraper/
npm install
npm start
```

## View
Serve root directory and browse to `docs/index.html`
