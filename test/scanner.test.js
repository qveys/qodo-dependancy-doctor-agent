const { scanDependencies } = require('../src/scanner');
const path = require('path');

test('scanDependencies detects outdated dependencies', async () => {
  const result = await scanDependencies(path.join(__dirname, 'package.json'));
  console.log(result);
  expect(result.length).toBeGreaterThan(0);
  expect(result[0]).toHaveProperty('risk');
});
