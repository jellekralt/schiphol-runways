const https = require('https');

const runwayInfo = {
  '18R-36L': {
    name: 'Polderbaan',
    code: '18R - 36L'
  },
  '18C-36C': {
    name: 'Zwanenburgbaan',
    code: '18C - 36C'
  },
  '09-27': {
    name: 'Buitenveldertbaan',
    code: '09 - 27'
  },
  '06-24': {
    name: 'Kaagbaan',
    code: '06 - 24'
  },
  '18L-36R': {
    name: 'Aalsmeerbaan',
    code: '18L - 36R'
  },
  '04-22': {
    name: 'Oostbaan',
    code: '04 - 22'
  }
};
const RUNWAY_URL = 'https://flighttracking.casper.aero/ams/runway/use';
const RUNWAY_URL_PARAMS = '?initial=true';

module.exports = function runways() {
  return new Promise((resolve, reject) => {
    const now = new Date().getTime();

    const url =
      RUNWAY_URL +
      RUNWAY_URL_PARAMS +
      `&from=${now}&upto=${now}&status[0]=CALCULATED`;

    https
      .get(url, resp => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(parseData(JSON.parse(data)));
        });
      })
      .on('error', err => {
        reject(err);
      });
  });
};

function parseData(data) {
  let landing = parseRunways(data[0], 'landing');
  let takeoff = parseRunways(data[0], 'takeoff');  
  
  return mapObject(runwayInfo, (runway) => {
    let [runwayKey, runwayData] = runway;
    const isLanding = landing.some(r=> runwayKey.split('-').includes(r));
    const isTakeoff = takeoff.some(r=> runwayKey.split('-').includes(r));

    runwayData.open = false;
    runwayData.type = null;

    if (isLanding) {
      runwayData.type = 'landing';
      runwayData.open = true;
    }
    if (isTakeoff) {
      runwayData.type = 'takeoff';
      runwayData.open = true;
    }
    
    return runway;
  });
}

function parseRunways(data, type) {
  return Object.keys(data).map((key) => {    
    if (key.substr(0,7) === type) {
      return data[key];
    }
  }).filter(runway => runway);
}

function mapObject(input, cb) {
  return Object.entries(input)
    .map(cb)
    .reduce((acc, item) => {
      acc[item[0]] = item[1];
      return acc;
    }, {});
}