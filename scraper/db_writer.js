#!/usr/bin/env node

const { DateTime } = require('luxon');
const mysql = require('mysql2/promise');
const { dbHost, dbPort, dbUser, dbPassword, dbDatabase } = require('./env');

const columns = [
    { column: 'poll_date', field: 'date', isNumber: false },
    { column: 'timeframe', field: 'timeframe', isNumber: false },
    { column: 'sample', field: 'sample', isNumber: true },
    { column: 'pollster', field: 'pollster', isNumber: false },
    { column: 'CDU_CSU', field: 'results.CDU/CSU', isNumber: true },
    { column: 'SPD', field: 'results.SPD', isNumber: true },
    { column: 'GRUENE', field: 'results.GRÜNE', isNumber: true },
    { column: 'FDP', field: 'results.FDP', isNumber: true },
    { column: 'LINKE', field: 'results.LINKE', isNumber: true },
    { column: 'PIRATEN', field: 'results.PIRATEN', isNumber: true },
    { column: 'FW', field: 'results.FW', isNumber: true },
    { column: 'AfD', field: 'results.AfD', isNumber: true },
    { column: 'Sonstige', field: 'results.Sonstige', isNumber: true },
]

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

function formatData(polls) {
    return polls
        .map(flatten)
        .map(poll => columns.map(c => {
            const val = poll[c.field];
            if (c.isNumber && Number.isNaN(val))
                return null;
            else {
                return val;
            }
        }));
}

async function writeToDB(polls) {
    const values = formatData(polls);

    let connection = await mysql.createConnection({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });

    await connection.query(`TRUNCATE TABLE sonntagsfrage`);

    const sql = `INSERT INTO sonntagsfrage (
        poll_date, timeframe, sample, pollster, 
        CDU_CSU, SPD, GRUENE, FDP, LINKE, PIRATEN, FW, AfD, Sonstige
        ) VALUES ?`;
    await connection.query(sql, [values]);
    return connection.end();


    // connection.connect(function (err) {
    //     if (err) { throw err; }

    //     connection.beginTransaction(function (err) {
    //         // TODO drop all data    

    //         const sql = `INSERT INTO sonntagsfrage (
    //             poll_date, timeframe, sample, pollster, 
    //             CDU_CSU, SPD, GRUENE, FDP, LINKE, PIRATEN, FW, AfD, Sonstige
    //             ) VALUES ?`;
    //         connection.query(sql, [values], function(err) {
    //             if (err) { throw err; }
    //             connection.commit(function (err) {
    //                 if (err) {
    //                     return connection.rollback(function () {
    //                         throw err;
    //                     });
    //                 }
    //                 console.log('success!');
    //                 connection.end(function (err) {
    //                     if (err) { throw err; }
    //                 });
    //             });
    //         });
    //     });
    // });
}

module.exports = {
    writeToDB
}