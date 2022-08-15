const Transactions = require('../main/transactions');
const config = require('../../configs/example');
const testdata = require('../../daemon/test/daemon.mock');

config.primary.address = 'aKoefNw7AeYKosEYwjCi4RQpVhBWRwU5Mj';
config.primary.recipients = [];

const auxiliaryConfig = {
  'enabled': false,
  'coin': {
    'header': 'fabe6d6d',
  }
};

const auxiliaryData = {
  'chainid': 1,
  'hash': '17a35a38e70cd01488e0d5ece6ded04a9bc8125865471d36b9d5c47a08a5907c',
};

const extraNonce = Buffer.from('f000000ff111111f', 'hex');

////////////////////////////////////////////////////////////////////////////////

describe('Test transactions functionality', () => {

  let configCopy, rpcDataCopy;
  beforeEach(() => {
    configCopy = JSON.parse(JSON.stringify(config));
    rpcDataCopy = JSON.parse(JSON.stringify(testdata.getBlockTemplate()));
  });

  test('Test main transaction builder [1]', () => {
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('03000500010000000000000000000000000000000000000000000000000000000000000000ffffffff0f5104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('0000000004902f5009000000001976a914d165963ef545936fb059e4927df0509a292b2bca88ac205fa012000000001976a9149ec92937568de295e3d93c87afb16254da8efdba88acf0829605000000001976a914daffe12663a94d0bce8afa20458fb2df4745d64a88aca0acb903000000001976a9149e6778ee1011af76f6f800873032ea8e15ada4ca88ac00000000460200797801001464b22fb2e961732d02ad7a41fa3f77cdf7617b8777352e560de0ca78e144573970ef251d855c564e477b08eb5c519750398489851a6925aec3946c026848f7', 'hex'));
  });

  test('Test main transaction builder [2]', () => {
    rpcDataCopy.coinbasetxn = {};
    rpcDataCopy.coinbasetxn.data = '0500008085202';
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('05000580010000000000000000000000000000000000000000000000000000000000000000ffffffff0f5104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('0000000004902f5009000000001976a914d165963ef545936fb059e4927df0509a292b2bca88ac205fa012000000001976a9149ec92937568de295e3d93c87afb16254da8efdba88acf0829605000000001976a914daffe12663a94d0bce8afa20458fb2df4745d64a88aca0acb903000000001976a9149e6778ee1011af76f6f800873032ea8e15ada4ca88ac00000000460200797801001464b22fb2e961732d02ad7a41fa3f77cdf7617b8777352e560de0ca78e144573970ef251d855c564e477b08eb5c519750398489851a6925aec3946c026848f7', 'hex'));
  });

  test('Test main transaction builder [3]', () => {
    configCopy.primary.recipients.push({ address: 'aKoefNw7AeYKosEYwjCi4RQpVhBWRwU5Mj', percentage: 0.05 });
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('03000500010000000000000000000000000000000000000000000000000000000000000000ffffffff0f5104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('0000000005fcf9d808000000001976a914d165963ef545936fb059e4927df0509a292b2bca88ac205fa012000000001976a9149ec92937568de295e3d93c87afb16254da8efdba88acf0829605000000001976a914daffe12663a94d0bce8afa20458fb2df4745d64a88aca0acb903000000001976a9149e6778ee1011af76f6f800873032ea8e15ada4ca88ac94357700000000001976a914d165963ef545936fb059e4927df0509a292b2bca88ac00000000460200797801001464b22fb2e961732d02ad7a41fa3f77cdf7617b8777352e560de0ca78e144573970ef251d855c564e477b08eb5c519750398489851a6925aec3946c026848f7', 'hex'));
  });

  test('Test main transaction builder [4]', () => {
    configCopy.primary.recipients.push({ address: 'aKoefNw7AeYKosEYwjCi4RQpVhBWRwU5Mj', percentage: 0.05 });
    configCopy.primary.recipients.push({ address: 'aKoefNw7AeYKosEYwjCi4RQpVhBWRwU5Mj', percentage: 0.05 });
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('03000500010000000000000000000000000000000000000000000000000000000000000000ffffffff0f5104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('000000000668c46108000000001976a914d165963ef545936fb059e4927df0509a292b2bca88ac205fa012000000001976a9149ec92937568de295e3d93c87afb16254da8efdba88acf0829605000000001976a914daffe12663a94d0bce8afa20458fb2df4745d64a88aca0acb903000000001976a9149e6778ee1011af76f6f800873032ea8e15ada4ca88ac94357700000000001976a914d165963ef545936fb059e4927df0509a292b2bca88ac94357700000000001976a914d165963ef545936fb059e4927df0509a292b2bca88ac00000000460200797801001464b22fb2e961732d02ad7a41fa3f77cdf7617b8777352e560de0ca78e144573970ef251d855c564e477b08eb5c519750398489851a6925aec3946c026848f7', 'hex'));
  });

  test('Test main transaction builder [5]', () => {
    rpcDataCopy.coinbaseaux.flags = 'test';
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('03000500010000000000000000000000000000000000000000000000000000000000000000ffffffff0f5104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('0000000004902f5009000000001976a914d165963ef545936fb059e4927df0509a292b2bca88ac205fa012000000001976a9149ec92937568de295e3d93c87afb16254da8efdba88acf0829605000000001976a914daffe12663a94d0bce8afa20458fb2df4745d64a88aca0acb903000000001976a9149e6778ee1011af76f6f800873032ea8e15ada4ca88ac00000000460200797801001464b22fb2e961732d02ad7a41fa3f77cdf7617b8777352e560de0ca78e144573970ef251d855c564e477b08eb5c519750398489851a6925aec3946c026848f7', 'hex'));
  });

  test('Test main transaction builder [6]', () => {
    rpcDataCopy.auxData = auxiliaryData;
    configCopy.auxiliary = auxiliaryConfig;
    configCopy.auxiliary.enabled = true;
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, 44)).toStrictEqual(Buffer.from('03000500010000000000000000000000000000000000000000000000000000000000000000ffffffff3b5104', 'hex'));
    expect(transaction[0].slice(49, 53)).toStrictEqual(Buffer.from('fabe6d6d', 'hex'));
    expect(transaction[0].slice(53)).toStrictEqual(Buffer.from('17a35a38e70cd01488e0d5ece6ded04a9bc8125865471d36b9d5c47a08a5907c0100000000000000', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('0000000004902f5009000000001976a914d165963ef545936fb059e4927df0509a292b2bca88ac205fa012000000001976a9149ec92937568de295e3d93c87afb16254da8efdba88acf0829605000000001976a914daffe12663a94d0bce8afa20458fb2df4745d64a88aca0acb903000000001976a9149e6778ee1011af76f6f800873032ea8e15ada4ca88ac00000000460200797801001464b22fb2e961732d02ad7a41fa3f77cdf7617b8777352e560de0ca78e144573970ef251d855c564e477b08eb5c519750398489851a6925aec3946c026848f7', 'hex'));
  });

  test('Test main transaction builder [7]', () => {
    configCopy.settings.testnet = true;
    configCopy.primary.address = 'TFid1T8DkSkcojRrJYeivSBUJjWw6jYnA4';
    const transaction = new Transactions(configCopy, rpcDataCopy).handleGeneration(extraNonce);
    expect(transaction[0].slice(0, -5)).toStrictEqual(Buffer.from('03000500010000000000000000000000000000000000000000000000000000000000000000ffffffff0f5104', 'hex'));
    expect(transaction[1]).toStrictEqual(Buffer.from('0000000004902f5009000000001976a9143f0e8e1bd4c252149a7c17358d4ad58c60dde73588ac205fa012000000001976a9149ec92937568de295e3d93c87afb16254da8efdba88acf0829605000000001976a914de2c82da7abcb742662e1b7a47b7d1861e319a8c88aca0acb903000000001976a9141e7230c6a70831d8b5f1559e9a337855cb33cde188ac00000000460200797801001464b22fb2e961732d02ad7a41fa3f77cdf7617b8777352e560de0ca78e144573970ef251d855c564e477b08eb5c519750398489851a6925aec3946c026848f7', 'hex'));
  });
});
