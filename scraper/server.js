const fs = require('fs');
const scraper = require('./scraper');
const modeller = require('./modeller');
const influxWriter = require('./influx_writer');

scraper.scrapeSonntagsfrage()
    .then(polls => {
        fs.writeFileSync('polls.json', JSON.stringify(polls));
        fs.writeFileSync('resampled.json', JSON.stringify(modeller.resample(polls)));

        return influxWriter.writePolls(polls);
    })
