const { DateTime } = require("luxon");

const parties = ["CDU/CSU", "SPD", "GRÜNE", "FDP", "LINKE", "PIRATEN", "FW", "AfD", "Sonstige"];

function getPollCopy(polls) {
    return JSON.parse(JSON.stringify(polls))
        .map(p => {
            p.date = DateTime.fromISO(p.date);
            return p;
        });
}

/**
 * 
 * @param {Poll[]} polls 
 * @param {DateTime} currentDate 
 * @param windowSize
 */
function getNeighborhood(polls, currentDate, windowSize) {
    const left = currentDate.minus(windowSize);
    const right = currentDate.plus(windowSize);

    const neighborhood = [];

    let i = 0;
    while (i < polls.length && polls[i].date <= right) {
        if (polls[i].date >= left) {
            neighborhood.push(polls[i]);
        }
        i++;
    }
    return neighborhood;
}

function calculateSample(currentDate, neighborhood) {
    //TODO use sample size
    //TODO use distance to current date

    let poll = {
        date: currentDate.toISODate(),
        results: {}
    };

    parties.forEach(party => {
        const partyResults = neighborhood
            .map(n => n.results[party])
            .filter(n => typeof (n) === 'number');

        poll.results[party] = partyResults.reduce((acc, cur) => acc + cur, 0);
        poll.results[party] /= partyResults.length;
        poll.results[party] = Math.round(poll.results[party] * 1000) / 1000;
    });
    return poll;
}

function resample(pollsInput) {

    const polls = getPollCopy(pollsInput);
    const samplingRate = { days: 1 };
    const windowSize = { weeks: 1 };
    let startDate = polls[0].date;
    let results = [];
    let currentDate = startDate;

    do {
        const neighborhood = getNeighborhood(polls, currentDate, windowSize);
        if (neighborhood.length > 0) {
            results.push(calculateSample(currentDate, neighborhood));
        } // else skip
        currentDate = currentDate.plus(samplingRate);
    } while (currentDate < polls[polls.length - 1].date);
    return results;
}

module.exports = {
    resample
}