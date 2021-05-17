luxon.Settings.defaultLocale = 'de';
const DateTime = luxon.DateTime;

const parties = [
    { party: "CDU/CSU", color: "black" },
    { party: "SPD", color: "red" },
    { party: "GRÜNE", color: "green" },
    { party: "FDP", color: "yellow" },
    { party: "LINKE", color: "purple" },
    // { party: "PIRATEN", color: "orange" },
    // { party: "FW", color: "orange" },
    { party: "AfD", color: "brown" },
    // { party: "Sonstige", color: "gray" },
];

let DATE_RANGE = { start: DateTime.now().minus({ months: 3 }), end: DateTime.now() };
let raw;
let polls;

const percentFormatter = new Intl.NumberFormat('de-DE', { style: 'percent' });

function formatValue(val) {
    return percentFormatter.format(val);
}

async function getMeanData() {
    if (!raw) {
        const res = await fetch('resampled.json');
        raw = await res.json();
        raw.forEach(r => r.date = DateTime.fromISO(r.date))
    }

    let result = parties.map(party => {
        return {
            label: party.party,
            borderColor: party.color,
            backgroundColor: party.color,
            borderWidth: 2,
            pointRadius: 0,
            data: raw
                .filter(r => r.date >= DATE_RANGE.start && r.date <= DATE_RANGE.end)
                .map(r => ({ x: r.date, y: r.results[party.party] }))
        }
    });

    return result;
}

async function getPollData() {
    if (!polls) {
        const res = await fetch('polls.json');
        polls = await res.json();
        polls.forEach(p => p.date = DateTime.fromISO(p.date))
    }

    let result = parties.map(party => {
        return {
            label: party.party + ' polls',
            borderColor: party.color,
            backgroundColor: party.color,
            borderWidth: 0,
            pointRadius: 1.5,
            data: polls
                .filter(r => r.date >= DATE_RANGE.start && r.date <= DATE_RANGE.end)
                .map(r => ({ x: r.date, y: r.results[party.party] }))
        }
    });

    return result;
}

function renderMean(meanData) {
    let chart = new Chart('chart-mean', {
        type: 'line',
        data: { datasets: meanData },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week',
                        tooltipFormat: 'DD T' // Luxon format string
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: formatValue
                    }
                }
            },
            interaction: {
                intersect: false,
                axis: 'x',
                mode: 'x',
            },

            plugins: {
                tooltip: {
                    filter: item => !item.dataset.label.endsWith('polls'),
                    callbacks: {
                        title: items => items.length > 0 ? items[0].raw.x.toLocaleString({ month: 'long', day: 'numeric' }) : '',
                        label: item => `${item.dataset.label}: ${formatValue(item.raw.y)}`
                    }
                },
                legend: {
                    labels: {
                        filter: item => !item.text.endsWith('polls')
                    }
                },
            }
        }
    });
}

async function renderDocument() {
    const meanData = await getMeanData();
    const pollData = await getPollData();
    meanData.push(...pollData);
    renderMean(meanData);
}

renderDocument();