const parties = [
    { party: "CDU/CSU", color: "black" },
    { party: "SPD", color: "red" },
    { party: "GRÜNE", color: "green" },
    { party: "FDP", color: "yellow" },
    { party: "LINKE", color: "purple" },
    { party: "PIRATEN", color: "orange" },
    { party: "FW", color: "orange" },
    { party: "AfD", color: "brown" },
    { party: "Sonstige", color: "gray" },
];

async function getMeanData() {
    const res = await fetch('../scraper/resampled.json');
    const raw = await res.json();

    let result = {
        datasets: parties.map(party => {
            return {
                label: party.party,
                borderColor: party.color,
                data: raw.map(r => ({x: r.date, y: r.results[party.party]}))
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
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    console.log('rendered chart')

}

async function renderDocument() {
    const meanData = await getMeanData();
    renderMean(meanData);
}

renderDocument();