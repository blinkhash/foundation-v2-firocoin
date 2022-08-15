const utils = require('./utils');

////////////////////////////////////////////////////////////////////////////////

// Main Transactions Function
const Transactions = function(config, rpcData) {

  const _this = this;
  this.config = config;
  this.rpcData = rpcData;

  // Mainnet Configuration
  this.configMainnet = {
    bech32: '',
    bip32: {
      public: Buffer.from('0488B21E', 'hex').readUInt32LE(0),
      private: Buffer.from('0488ADE4', 'hex').readUInt32LE(0),
    },
    peerMagic: 'e3d9fef1',
    pubKeyHash: Buffer.from('52', 'hex').readUInt8(0),
    scriptHash: Buffer.from('07', 'hex').readUInt8(0),
    wif: Buffer.from('D2', 'hex').readUInt8(0),
    coin: 'firo',
  };

  // Mainnet Founder Rewards
  this.founderMainnet = [
    { address: 'aLgRaYSFk6iVw2FqY1oei8Tdn2aTsGPVmP', amount: 93750000 },
    { address: 'aFA2TbqG9cnhhzX5Yny2pBJRK5EaEqLCH7', amount: 62500000 }];

  // Testnet Configuration
  this.configTestnet = {
    bech32: '',
    bip32: {
      public: Buffer.from('043587CF', 'hex').readUInt32LE(0),
      private: Buffer.from('04358394', 'hex').readUInt32LE(0),
    },
    peerMagic: 'cffcbeea',
    pubKeyHash: Buffer.from('41', 'hex').readUInt8(0),
    scriptHash: Buffer.from('B2', 'hex').readUInt8(0),
    wif: Buffer.from('B9', 'hex').readUInt8(0),
    coin: 'firo',
  };

  // Testnet Founder Rewards
  this.founderTestnet = [
    { address: 'TWDxLLKsFp6qcV1LL4U2uNmW4HwMcapmMU', amount: 93750000 },
    { address: 'TCkC4uoErEyCB4MK3d6ouyJELoXnuyqe9L', amount: 62500000 }];

  // Calculate Generation Transaction
  this.handleGeneration = function(placeholder) {

    const txLockTime = 0;
    const txInSequence = 0;
    const txInPrevOutHash = '';
    const txInPrevOutIndex = Math.pow(2, 32) - 1;
    const txOutputBuffers = [];

    let txExtraPayload;
    let txVersion = 3;
    const network = !_this.config.settings.testnet ?
      _this.configMainnet :
      _this.configTestnet;

    // Use Version Found in CoinbaseTxn
    if (_this.rpcData.coinbasetxn && _this.rpcData.coinbasetxn.data) {
      txVersion = parseInt(utils.reverseHex(_this.rpcData.coinbasetxn.data.slice(0, 8)), 16);
    }

    // Support Coinbase v3 Block Template
    if (_this.rpcData.coinbase_payload && _this.rpcData.coinbase_payload.length > 0) {
      txExtraPayload = Buffer.from(_this.rpcData.coinbase_payload, 'hex');
      txVersion = txVersion + (5 << 16);
    }

    // Calculate Coin Block Reward
    let reward = _this.rpcData.coinbasevalue;
    const founder = !_this.config.settings.testnet ?
      _this.founderMainnet :
      _this.founderTestnet;

    // Handle Pool/Coinbase Addr/Flags
    const poolAddressScript = utils.addressToScript(_this.config.primary.address, network);
    const coinbaseAux = _this.rpcData.coinbaseaux && _this.rpcData.coinbaseaux.flags ?
      Buffer.from(_this.rpcData.coinbaseaux.flags, 'hex') :
      Buffer.from([]);

    // Build Initial ScriptSig
    let scriptSig = Buffer.concat([
      utils.serializeNumber(_this.rpcData.height),
      coinbaseAux,
      utils.serializeNumber(Date.now() / 1000 | 0),
      Buffer.from([placeholder.length]),
    ]);

    // Add Auxiliary Data to ScriptSig
    if (_this.config.auxiliary && _this.config.auxiliary.enabled && _this.rpcData.auxData) {
      scriptSig = Buffer.concat([
        scriptSig,
        Buffer.from(_this.config.auxiliary.coin.header, 'hex'),
        Buffer.from(_this.rpcData.auxData.hash, 'hex'),
        utils.packUInt32LE(1),
        utils.packUInt32LE(0)
      ]);
    }

    // Build First Part of Generation Transaction
    const p1 = Buffer.concat([
      utils.packUInt32LE(txVersion),
      utils.varIntBuffer(1),
      utils.uint256BufferFromHash(txInPrevOutHash),
      utils.packUInt32LE(txInPrevOutIndex),
      utils.varIntBuffer(scriptSig.length + placeholder.length),
      scriptSig,
    ]);

    // Handle ZNodes (Evo Nodes)
    if (_this.rpcData.znode_payments_started && _this.rpcData.znode_payments_enforced) {
      _this.rpcData.znode.forEach((payee) => {
        const payeeReward = payee.amount;
        let payeeScript;
        if (payee.script) payeeScript = Buffer.from(payee.script, 'hex');
        else payeeScript = utils.addressToScript(payee.payee, network);
        txOutputBuffers.push(Buffer.concat([
          utils.packUInt64LE(payeeReward),
          utils.varIntBuffer(payeeScript.length),
          payeeScript,
        ]));
      });
    }

    // Handle Founder Rewards
    founder.forEach((payee) => {
      const founderReward = payee.amount;
      const founderScript = utils.addressToScript(payee.address, network);
      txOutputBuffers.push(Buffer.concat([
        utils.packUInt64LE(founderReward),
        utils.varIntBuffer(founderScript.length),
        founderScript,
      ]));
    });

    // Handle Recipient Transactions
    let recipientTotal = 0;
    _this.config.primary.recipients.forEach((recipient) => {
      const recipientReward = Math.floor(recipient.percentage * reward);
      const recipientScript = utils.addressToScript(recipient.address, network);
      recipientTotal += recipientReward;
      txOutputBuffers.push(Buffer.concat([
        utils.packUInt64LE(recipientReward),
        utils.varIntBuffer(recipientScript.length),
        recipientScript,
      ]));
    });


    // Handle Pool Transaction
    reward -= recipientTotal;
    txOutputBuffers.unshift(Buffer.concat([
      utils.packUInt64LE(reward),
      utils.varIntBuffer(poolAddressScript.length),
      poolAddressScript
    ]));

    // Build Second Part of Generation Transaction
    const p2 = Buffer.concat([
      utils.packUInt32LE(txInSequence),
      utils.varIntBuffer(txOutputBuffers.length),
      Buffer.concat(txOutputBuffers),
      utils.packUInt32LE(txLockTime),
      utils.varIntBuffer(txExtraPayload.length),
      txExtraPayload
    ]);

    return [p1, p2];
  };
};

module.exports = Transactions;
