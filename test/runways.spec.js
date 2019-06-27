const test = require('tape');
const schipholRunways = require('../dist/runways');

test('runways(): should pass runways', async (t) => {
  let runways = await schipholRunways();

  console.log('data', runways);

  console.log('');
  console.log('');
  console.log('----------------');
  console.log('');





  t.end();
});