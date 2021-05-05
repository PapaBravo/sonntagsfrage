#!/usr/bin/env node

const { InfluxDB, Point, HttpError } = require('@influxdata/influxdb-client');
const { influxUrl, influxToken, influxOrg, influxBucket } = require('./env');
const { hostname } = require('os');
const { DateTime } = require('luxon');

async function writePolls(polls) {
    console.log(influxUrl)

    const points = polls.map(poll => {
        let point = new Point('sonntagsfrage')
            .timestamp(DateTime.fromISO(poll.date).toJSDate())
            .tag(poll.pollster)
            .intField('sample', poll.sample)
            .stringField('timeframe', poll.timeframe);
        Object.keys(poll.results)
            .filter(r => !isNaN(poll.results[r]))
            // .forEach(r => console.log(poll.results[r]));
            .forEach(r => point.floatField(r, poll.results[r]));
        return point;
    });

    const writeApi = new InfluxDB({ url: influxUrl, token: influxToken })
        .getWriteApi(influxOrg, influxBucket, 's')
    writeApi.useDefaultTags({ location: hostname() });
    writeApi.writePoints(points);

    // flushes all writes
    return writeApi.close();
}

module.exports = {
    writePolls
}