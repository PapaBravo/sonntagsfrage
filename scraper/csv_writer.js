#!/usr/bin/env node

const stringify = require('csv-stringify/lib/sync');
const { DateTime } = require('luxon');

function flatten(poll) {
    let result = {};
    Object.keys(poll).forEach(key => {
        if (typeof (poll[key]) !== 'object') {
            result[key] = poll[key]
        } else {
            Object.keys(poll[key]).forEach(subKey => {
                result[`${key}.${subKey}`] = poll[key][subKey]
            });
        }
    });
    return result;
}

function toCsv(polls) {
    const header = Object.keys(flatten(polls[0]));
    const data = polls.map(flatten)
        .map(p => Object.keys(p).map(k => p[k]));
    return stringify(data, { header: true, columns: header });
}

module.exports = {
    toCsv
}