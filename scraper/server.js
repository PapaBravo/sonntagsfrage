const axios = require('axios').default;
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const { DateTime } = require("luxon");
const fs = require('fs');

const pollsters = [
    { key: 'fw', url: 'politbarometer' },
    { key: 'aprox', url: '' },
    { key: 'infas', url: '' },
    { key: 'id', url: '' },
    { key: 'info', url: '' },
    { key: 'psephos', url: '' },
    { key: 'allen', url: 'allensbach' },
    { key: 'ipsos', url: 'ipsos' },
    { key: 'emnid', url: 'emnid' },
    { key: 'ifm', url: '' },
    { key: 'gms', url: 'gms' },
    { key: 'insa', url: 'insa' },
    { key: 'dimap', url: 'dimap' },
    { key: 'forsa', url: 'forsa' },
    { key: 'yougov', url: 'yougov' }
]

async function getPollsters() {
    //const res = await axios.get('https://www.wahlrecht.de/umfragen/links.htm');
    //const $ = cheerio.load(res.data);
    //return $('ul', 'tr#prognosen td').nextAll('ul') // second ul in td
    //        .children()
    //        .map((i, el) => el.attribs['id'])
    //        .get();
    return pollsters.filter(p => p.url).map(p => p.url);
}

function parseSample(sampleCell) {
    let matches = /(?:(\w) • )?([0-9\.]+)/g.exec(sampleCell);
    return {
        sample: Number.parseFloat(matches[2].replace('.', '')),
        pollType: matches[1]
    };
}

function parseRow(table, r, header) {
    let poll = {
        date: DateTime.fromFormat(table[header.date][r], 'dd.MM.yyyy').toISODate(),
        timeframe: table[header.timeframe][r],
        sample: table[header.sample][r],
        results: {}
    };
    if (poll.sample === 'Bundestagswahl') return null;

    const { sample, sampleType } = parseSample(poll.sample);
    poll.sample = sample;
    poll.sampleType = sampleType;
    header.parties.forEach(
        el => poll.results[el.party] = Number.parseFloat(table[el.index][r]) / 100.0
    );
    return poll;
}

function getHeader($) {
    const header = {}
    header.date = $('th.dat', 'table.wilko thead tr').index();
    header.sample = $('th.befr', 'table.wilko thead tr').index();
    header.timeframe = $('th.dat2', 'table.wilko thead tr').index();

    header.parties = [];
    $('table.wilko thead tr').children('th')
        .each((i, el) => {
            const txt = $(el).text();
            if ($(el).hasClass('part') || txt === 'Sonstige')
                header.parties.push({ party: txt, index: i })
        });

    return header;
}

async function getResults(pollster) {
    try {
        const url = `https://www.wahlrecht.de/umfragen/${pollster}.htm`;
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);
        cheerioTableparser($);
        const header = getHeader($);
        const table = $('table.wilko tbody').parsetable(false, false, true);
        let polls = [];

        let cntIgnored = 0;
        for (let r = 0; r < table[0].length; r++) {
            try {
                const poll = parseRow(table, r, header);
                if (poll) polls.push(poll);
            } catch (err) {
                cntIgnored++;
            }

        }
        console.log(pollster, polls.length, 'ignored', cntIgnored);
        return polls;
    } catch (err) {
        console.error(pollster, 'scraping error', err.message);
    }
}


async function scrapeResults() {
    const pollsters = await getPollsters();
    const results = {};
    const polls = await Promise.all(pollsters.map(getResults));
    polls.forEach((e, i) => results[pollsters[i]] = e);
    return results;
}

function joinResults(polls) {
    return Object.keys(polls).flatMap(pollster => {
        return polls[pollster].map(poll => {
            poll.pollster = pollster;
            return poll;
        });
    });
}

function sortByDate(polls) {
    return polls.sort((p1, p2) => {
        if (p1.date < p2.date) {
            return -1;
          }
          if (p1.date > p2.date) {
            return 1;
          }
        
          return 0
    })
}

scrapeResults()
    .then(joinResults)
    .then(sortByDate)
    .then(polls => {
        fs.writeFileSync('polls.json', JSON.stringify(polls));
    })

//getResults('yougov');