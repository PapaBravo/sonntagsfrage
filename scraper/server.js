const fs = require('fs');
const scraper = require('./scraper');
const modeller = require('./modeller');

scraper.scrapeSonntagsfrage()
    .then(polls => {
        fs.writeFileSync('polls.json', JSON.stringify(polls));
        fs.writeFileSync('resampled.json', JSON.stringify(modeller.resample(polls)));
    })
