const Algorithms = require('../main/algorithms');

////////////////////////////////////////////////////////////////////////////////

describe('Test algorithm functionality', () => {

  // Firopow Validation [1]
  test('Test implemented firopow algorithm [1]', () => {
    const header = Buffer.from('63543d3913fe56e6720c5e61e8d208d05582875822628f483279a3e8d9c9a8b3', 'hex');
    const mixhash = Buffer.from('3414b7c3105a45426e56e6f4c800f4358334cc7df74d98141bb887185166436d', 'hex');
    const nonce = Buffer.from('9b95eb33003ba288', 'hex');
    const output = Buffer.alloc(32);
    expect(Algorithms.firopow.hash({}).apply(null, [header, nonce, 262523, mixhash, output])).toBe(true);
  });

  // Firopow Validation [2]
  test('Test implemented firopow algorithm [2]', () => {
    const header = Buffer.from('63543d3913fe56e6720c5e61e8d208d05582875822628f483279a3e8d9c9a8b3', 'hex');
    const mixhash = Buffer.from('3414b7c3105a45426e56e6f4c800f4358334cc7df74d98141bb887185166436d', 'hex');
    const nonce = Buffer.from('9b95eb33003ba288', 'hex');
    const output = Buffer.alloc(32);
    expect(Algorithms.firopow.hash({}).apply(null, [header, nonce, 262524, mixhash, output])).toBe(false);
  });

  // Deterministic
  test('Test implemented sha256d algorithm', () => {
    const start = Buffer.from('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
    const output = Buffer.from('dc83687981432eb309f7c96a51f8bd10cec4a4630f47fdca1c2768d34ba9031a', 'hex');
    expect(Algorithms.sha256d.hash({}).apply(null, [start]).length).toBe(32);
    expect(Algorithms.sha256d.hash({}).apply(null, [start])).toStrictEqual(output);
  });
});
