const osmosis = require('osmosis');

const runwayInfo = {
    'polderbaan': { 
        name: 'Polderbaan', 
        code: '18R - 36L' 
    },
    'zwanenburgbaan': { 
        name: 'Zwanenburgbaan', 
        code: '18C - 36C' 
    },
    'buitenveldertbaan': { 
        name: 'Buitenveldertbaan', 
        code: '09 - 27' 
    },
    'kaagbaan': { 
        name: 'Kaagbaan', 
        code: '06 - 24' 
    },
    'aalsmeerbaan': { 
        name: 'Aalsmeerbaan', 
        code: '18L - 36R' 
    },
    'oostbaan': { 
        name: 'Oostbaan', 
        code: '04 - 22' 
    }
}

module.exports = function runways() {
    let total = [];

    return new Promise((resolve, reject) => {
        osmosis
            .get('https://www.lvnl.nl/nl/airtraffic')
            .find('#runwayVisual li')
            .set({
                'name': '@id',
                'type': '@class'
            })
            .data((listing) => {
                let runway = Object.assign({}, listing, runwayInfo[listing.name]);

                runway.type = listing.type !== '' ? listing.type : null;
                runway.open = !!listing.type;

                total.push(runway);

                return runway;
            })
            .done(() => {
                resolve(total);
            });
    });
}