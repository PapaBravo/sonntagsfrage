const fs = require('fs');
const scraper = require('./scraper');
const modeller = require('./modeller');
const influxWriter = require('./influx_writer');
const csvWriter = require('./csv_writer');
const dbWriter = require('./db_writer');

scraper.scrapeSonntagsfrage()
    .then(polls => {
        fs.writeFileSync('../data/polls.json', JSON.stringify(polls));
        fs.writeFileSync('../data/resampled.json', JSON.stringify(modeller.resample(polls)));
        // fs.writeFileSync('../data/polls.csv', csvWriter.toCsv(polls));
        dbWriter.writeToDB(polls);
        // return influxWriter.writePolls(polls);
    });
