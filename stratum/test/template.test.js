const Algorithms = require('../main/algorithms');
const Template = require('../main/template');
const config = require('../../configs/example');
const testdata = require('../../daemon/test/daemon.mock');

config.primary.address = 'aKoefNw7AeYKosEYwjCi4RQpVhBWRwU5Mj';
config.primary.recipients = [];

const jobId = 1;
const extraNonce = Buffer.from('f000000ff111111f', 'hex');

////////////////////////////////////////////////////////////////////////////////

describe('Test template functionality', () => {

  let configCopy, rpcDataCopy;
  beforeEach(() => {
    configCopy = JSON.parse(JSON.stringify(config));
    rpcDataCopy = JSON.parse(JSON.stringify(testdata.getBlockTemplate()));
  });

  test('Test current bigint implementation [1]', () => {
    const template = new Template(jobId.toString(16), configCopy, rpcDataCopy, extraNonce);
    expect(Number(template.target).toFixed(9)).toBe('3.9441409848004035e+74');
  });

  test('Test current bigint implementation [2]', () => {
    rpcDataCopy.target = null;
    const template = new Template(jobId.toString(16), configCopy, rpcDataCopy, extraNonce);
    expect(Number(template.target).toFixed(9)).toBe('3.9441409848004035e+74');
  });

  test('Test if target is not defined', () => {
    const template = new Template(jobId.toString(16), configCopy, rpcDataCopy, extraNonce);
    delete rpcDataCopy.target;
    expect(Number(template.target).toFixed(9)).toBe('3.9441409848004035e+74');
    expect(template.difficulty.toFixed(9)).toBe('0.000000068');
  });

  test('Test template difficulty calculation', () => {
    const template = new Template(jobId.toString(16), configCopy, rpcDataCopy, extraNonce);
    expect(template.difficulty.toFixed(9)).toBe('0.000000068');
  });

  test('Test generation transaction handling', () => {
    const template = new Template(jobId.toString(16), configCopy, rpcDataCopy, extraNonce);
    expect(template.generation.length).toBe(2);
    expect(template.generation[0].slice(0, -5)).toStrictEqual(Buffer.from('03000500010000000000000000000000000000000000000000000000000000000000000000ffffffff0f5104', 'hex'));
    expect(template.generation[1]).toStrictEqual(Buffer.from('0000000004902f5009000000001976a914d165963ef545936fb059e4927df0509a292b2bca88ac205fa012000000001976a9149ec92937568de295e3d93c87afb16254da8efdba88acf0829605000000001976a914daffe12663a94d0bce8afa20458fb2df4745d64a88aca0acb903000000001976a9149e6778ee1011af76f6f800873032ea8e15ada4ca88ac00000000460200797801001464b22fb2e961732d02ad7a41fa3f77cdf7617b8777352e560de0ca78e144573970ef251d855c564e477b08eb5c519750398489851a6925aec3946c026848f7', 'hex'));
  });

  test('Test coinbase serialization [1]', () => {
    const template = new Template(jobId.toString(16), configCopy, rpcDataCopy, extraNonce);
    const extraNonce1 = Buffer.from('01', 'hex');
    const extraNonce2 = Buffer.from('00', 'hex');
    const coinbase = template.handleCoinbase(extraNonce1, extraNonce2);
    expect(coinbase.slice(0, 44)).toStrictEqual(Buffer.from('03000500010000000000000000000000000000000000000000000000000000000000000000ffffffff0f5104', 'hex'));
    expect(coinbase.slice(49, 51)).toStrictEqual(Buffer.from('0100', 'hex'));
    expect(coinbase.slice(51)).toStrictEqual(Buffer.from('00000004902f5009000000001976a914d165963ef545936fb059e4927df0509a292b2bca88ac205fa012000000001976a9149ec92937568de295e3d93c87afb16254da8efdba88acf0829605000000001976a914daffe12663a94d0bce8afa20458fb2df4745d64a88aca0acb903000000001976a9149e6778ee1011af76f6f800873032ea8e15ada4ca88ac00000000460200797801001464b22fb2e961732d02ad7a41fa3f77cdf7617b8777352e560de0ca78e144573970ef251d855c564e477b08eb5c519750398489851a6925aec3946c026848f7', 'hex'));
  });

  test('Test coinbase serialization [2]', () => {
    const coinbaseBuffer = Buffer.from('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff020101ffffffff0100f2052a010000001976a914614ca2f0f4baccdd63f45a0e0e0ff7ffb88041fb88ac00000000', 'hex');
    const hashDigest = Algorithms.sha256d.hash();
    const coinbaseHash = hashDigest(coinbaseBuffer);
    expect(coinbaseHash).toStrictEqual(Buffer.from('afd031100bff85a9ac01f1718be0b3d6c20228592f0242ea1e4d91a519b53031', 'hex'));
  });

  test('Test header serialization [1]', () => {
    const template = new Template(jobId.toString(16), configCopy, rpcDataCopy, extraNonce);
    const merkleRoot = '3130b519a5914d1eea42022f592802c2d6b3e08b71f101aca985ff0b1031d0af';
    const time = '6036c54f'.toString('hex');
    const nonce = 'fe1a0000'.toString('hex');
    const headerBuffer = template.handleHeader(template.rpcData.version, merkleRoot, time, nonce);
    expect(headerBuffer).toStrictEqual(Buffer.from('0000002014869d1d6326d3a7750ddc20f7867517016caa3e67ae80da5cbfbedf6baa78ac00060003000008000701000100010000000908050000000001000301000000004fc536603bdf002001000000', 'hex'));
  });

  test('Test header serialization [2]', () => {
    const headerBuffer = Buffer.from('00000020e22777bc309503ee6be3c65f370ba629b6497dbe8b804cbd8365ef83fbae1997afd031100bff85a9ac01f1718be0b3d6c20228592f0242ea1e4d91a519b530314fc53660f0ff0f1e00001afe', 'hex');
    const hashDigest = Algorithms.sha256d.hash();
    const headerHash = hashDigest(headerBuffer, 1614202191);
    expect(headerHash).toStrictEqual(Buffer.from('6927c80704a1616664c5c91157d895587ac0381976010411cbec9aade2f75a1d', 'hex'));
  });

  test('Test block serialization [1]', () => {
    const template = new Template(jobId.toString(16), configCopy, rpcDataCopy, extraNonce);
    const headerBuffer = Buffer.from('00000020e22777bc309503ee6be3c65f370ba629b6497dbe8b804cbd8365ef83fbae1997afd031100bff85a9ac01f1718be0b3d6c20228592f0242ea1e4d91a519b530314fc53660f0ff0f1e00001afe', 'hex');
    const coinbase = Buffer.from('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff020101ffffffff0100f2052a010000001976a914614ca2f0f4baccdd63f45a0e0e0ff7ffb88041fb88ac00000000', 'hex');
    const mixHashBuffer = Buffer.from('89732e5ff8711c32558a308fc4b8ee77416038a70995670e3eb84cbdead2e337', 'hex');
    const nonceBuffer = Buffer.from('88a23b0033eb959b', 'hex');
    const templateHex = template.handleBlocks(headerBuffer, coinbase, nonceBuffer, mixHashBuffer);
    expect(templateHex).toStrictEqual(Buffer.from('00000020e22777bc309503ee6be3c65f370ba629b6497dbe8b804cbd8365ef83fbae1997afd031100bff85a9ac01f1718be0b3d6c20228592f0242ea1e4d91a519b530314fc53660f0ff0f1e00001afe88a23b0033eb959b37e3d2eabd4cb83e0e679509a738604177eeb8c48f308a55321c71f85f2e73890101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff020101ffffffff0100f2052a010000001976a914614ca2f0f4baccdd63f45a0e0e0ff7ffb88041fb88ac00000000', 'hex'));
  });

  test('Test block serialization [2]', () => {
    const headerBuffer = Buffer.from('00000020e22777bc309503ee6be3c65f370ba629b6497dbe8b804cbd8365ef83fbae1997afd031100bff85a9ac01f1718be0b3d6c20228592f0242ea1e4d91a519b530314fc53660f0ff0f1e00001afe', 'hex');
    const hashDigest = Algorithms.sha256d.hash();
    const blockHash = hashDigest(headerBuffer, 1614202191);
    expect(blockHash).toStrictEqual(Buffer.from('6927c80704a1616664c5c91157d895587ac0381976010411cbec9aade2f75a1d', 'hex'));
  });

  test('Test template submission', () => {
    const template = new Template(jobId.toString(16), configCopy, rpcDataCopy, extraNonce);
    const extraNonce1 = Buffer.from('01', 'hex');
    const extraNonce2 = Buffer.from('00', 'hex');
    const time = '6036c54f'.toString('hex');
    const nonce = 'fe1a0000'.toString('hex');
    const templateSubmitted1 = template.handleSubmissions([extraNonce1, extraNonce2, time, nonce]);
    const templateSubmitted2 = template.handleSubmissions([extraNonce1, extraNonce2, time, nonce]);
    expect(templateSubmitted1).toBe(true);
    expect(templateSubmitted2).toBe(false);
  });

  test('Test current job parameters [1]', () => {
    const template = new Template(jobId.toString(16), configCopy, rpcDataCopy, extraNonce);
    const jobParams = [
      template.jobId,
      null,
      '0000000000000000000000000000000000000000000000000000000000000000',
      '00e063f9f5800000000000000000000000000000000000000000000000000000',
      true,
      template.rpcData.height,
      template.rpcData.bits
    ];
    const currentParams = template.handleParameters({ extraNonce1: '00' }, true);
    currentParams[1] = null;
    expect(currentParams).toStrictEqual(jobParams);
  });

  test('Test current job parameters [2]', () => {
    const template = new Template(jobId.toString(16), configCopy, rpcDataCopy, extraNonce);
    const jobParams = [
      template.jobId,
      null,
      '0000000000000000000000000000000000000000000000000000000000000000',
      '00e063f9f5800000000000000000000000000000000000000000000000000000',
      true,
      template.rpcData.height,
      template.rpcData.bits
    ];
    template.jobParams = jobParams;
    const currentParams = template.handleParameters({}, true);
    currentParams[1] = null;
    expect(currentParams).toStrictEqual(jobParams);
  });
});
