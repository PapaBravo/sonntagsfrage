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
const percentFormatter = new Intl.NumberFormat('de-DE', {style: 'percent'});

function formatValue(val) {
    return percentFormatter.format(val);
}

function filterAndFormat(party) {
    return raw
        .filter(r => r.date >= DATE_RANGE.start && r.date <= DATE_RANGE.end)
        .map(r => ({ x: r.date, y: r.results[party] }));
}


async function getMeanData() {
    if (!raw) {
        const res = await fetch('../data/resampled.json');
        raw = await res.json();
        raw.forEach(r => r.date = DateTime.fromISO(r.date))
    }

    let result = {
        datasets: parties.map(party => {
            return {
                label: party.party,
                borderColor: party.color,
                backgroundColor: party.color,
                borderWidth: 2,
                pointRadius: 0,
                data: filterAndFormat(party.party)
            }
        })
    }

    return result;
}

function renderMean(meanData) {
    let chart = new Chart('chart-mean', {
        type: 'line',
        data: meanData,
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
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
                mode: 'index',
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: items => items[0].raw.x.toLocaleString({ month: 'long', day: 'numeric' }),
                        label: item => `${item.dataset.label}: ${formatValue(item.raw.y)}`
                    }
                }
            }
        }
    });
}

async function renderDocument() {
    const meanData = await getMeanData();
    renderMean(meanData);
}

renderDocument();