#!/usr/bin/env node

const { InfluxDB, Point, HttpError } = require('@influxdata/influxdb-client');
const { influxUrl, influxToken, influxOrg, influxBucket } = require('./env');
const { hostname } = require('os');
const { DateTime } = require('luxon');

async function writePolls(polls) {
    console.log(influxUrl)

    const writeApi = new InfluxDB({ url: influxUrl, token: influxToken })
        .getWriteApi(influxOrg, influxBucket, 's', { batchSize: 100, flushInterval: 100});
    writeApi.useDefaultTags({ location: hostname() });

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
    }).forEach(point => writeApi.writePoint(point));

    // flushes all writes
    return writeApi.close();
}

module.exports = {
    writePolls
}