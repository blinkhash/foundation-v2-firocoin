// Mock Daemon GetBlockTemplate Data
exports.getBlockTemplate = function() {
  return {
    'capabilities': [
      'proposal'
    ],
    'version': 536870912,
    'rules': [],
    'vbavailable': {},
    'vbrequired': 0,
    'previousblockhash': 'ac78aa6bdfbebf5cda80ae673eaa6c01177586f720dc0d75a7d326631d9d8614',
    'transactions': [{
      'data': '0100000001cba672d0bfdbcc441d171ef0723a191bf050932c6f8adc8a05b0cac2d1eb022f010000006c493046022100a23472410d8fd7eabf5c739bdbee5b6151ff31e10d5cb2b52abeebd5e9c06977022100c2cdde5c632eaaa1029dff2640158aaf9aab73fa021ed4a48b52b33ba416351801210212ee0e9c79a72d88db7af3fed18ae2b7ca48eaed995d9293ae0f94967a70cdf6ffffffff02905f0100000000001976a91482db4e03886ee1225fefaac3ee4f6738eb50df9188ac00f8a093000000001976a914c94f5142dd7e35f5645735788d0fe1343baf146288ac00000000',
      'hash': '7c90a5087ac4d5b9361d47655812c89b4ad0dee6ecd5e08814d00ce7385aa317',
      'depends': [],
      'fee': 10000,
      'sigops': 2
    }],
    'coinbaseaux': {
      'flags': ''
    },
    'coinbasevalue': 156250000,
    'longpollid': 'ac78aa6bdfbebf5cda80ae673eaa6c01177586f720dc0d75a7d326631d9d861496683',
    'target': '00df3b0000000000000000000000000000000000000000000000000000000000',
    'mintime': 1655317378,
    'mutable': [
      'time',
      'transactions',
      'prevblock'
    ],
    'noncerange': '00000000ffffffff',
    'sigoplimit': 400000,
    'sizelimit': 2000000,
    'weightlimit': 2000000,
    'curtime': 1655318189,
    'bits': '2000df3b',
    'height': 1,
    'znode': [
      {
        'payee': 'aKoefNw7AeYKosEYwjCi4RQpVhBWRwU5Mj',
        'script': '76a9149ec92937568de295e3d93c87afb16254da8efdba88ac',
        'amount': 312500000
      }
    ],
    'znode_payments_started': true,
    'znode_payments_enforced': true,
    'coinbase_payload': '0200797801001464b22fb2e961732d02ad7a41fa3f77cdf7617b8777352e560de0ca78e144573970ef251d855c564e477b08eb5c519750398489851a6925aec3946c026848f7',
    'pprpcheader': '9cb8668d02e8aecfd7d34d4ed18d8fad9930b4fb340dd88eae3169ec092b4554',
    'pprpcepoch': 74
  };
};

// Mock Daemon GetAuxBlock Data
exports.getAuxBlock = function() {
  return {
    'chainid': 1,
    'height': 1,
    'hash': '8719aefb83ef6583bd4c808bbe7d49b629a60b375fc6e36bee039530bc7727e2',
    'target': Buffer.from('00000ffff0000000000000000000000000000000000000000000000000000000', 'hex'),
  };
};

// Mock Daemon GetBlockchainInfo Data
exports.getBlockchainInfo = function() {
  return {
    'chain': 'main',
    'blocks': 1,
    'headers': 1,
    'bestblockhash': '1d5af7e2ad9aeccb110401761938c07a5895d85711c9c5646661a10407c82769',
    'difficulty': 0.000244140625,
    'mediantime': 1614202191,
    'verificationprogress': 3.580678270509504e-08,
    'initialblockdownload': false,
    'chainwork': '0000000000000000000000000000000000000000000000000000000000200020',
    'size_on_disk': 472,
    'pruned': false,
    'softforks': [
      {
        'id': 'bip34',
        'version': 2,
        'reject': {
          'status': false
        }
      },
      {
        'id': 'bip66',
        'version': 3,
        'reject': {
          'status': false
        }
      },
      {
        'id': 'bip65',
        'version': 4,
        'reject': {
          'status': false
        }
      }
    ],
    'bip9_softforks': {
      'csv': {
        'status': 'defined',
        'startTime': 1485561600,
        'timeout': 1517356801,
        'since': 0
      },
      'segwit': {
        'status': 'defined',
        'startTime': 1485561600,
        'timeout': 1517356801,
        'since': 0
      }
    },
    'warnings': ''
  };
};

// Mock Daemon GetInfo Data
exports.getInfo = function() {
  return {
    'version' : 89900,
    'protocolversion' : 70002,
    'walletversion' : 60000,
    'balance' : 0.00000000,
    'blocks' : 1,
    'timeoffset' : -2,
    'connections' : 8,
    'proxy' : '',
    'difficulty' : 510929738.01615179,
    'testnet' : false,
    'keypoololdest' : 1386220819,
    'keypoolsize' : 101,
    'paytxfee' : 0.00000000,
    'errors' : 'This is a pre-release test build - use at your own risk - do not use for mining or merchant applications'
  };
};

// Mock Daemon GetPeerInfo Data
exports.getPeerInfo = function() {
  return {
    'id': 20,
    'addr': '18.213.13.51:9333',
    'addrlocal': '173.73.155.96:61108',
    'addrbind': '192.168.1.155:61108',
    'services': '000000000000040d',
    'relaytxes': true,
    'lastsend': 1615676709,
    'lastrecv': 1615676709,
    'bytessent': 1793,
    'bytesrecv': 1782,
    'conntime': 1615674308,
    'timeoffset': 0,
    'pingtime': 0.007751,
    'minping': 0.00522,
    'version': 70015,
    'subver': '/LitecoinCore:0.18.1/',
    'inbound': false,
    'addnode': false,
    'startingheight': 1,
    'banscore': 0,
    'synced_headers': 1,
    'synced_blocks': 1,
    'inflight': [],
    'whitelisted': false,
    'minfeefilter': 0.00001000,
    'bytessent_per_msg': {
      'addr': 55,
      'feefilter': 32,
      'getaddr': 24,
      'getheaders': 93,
      'ping': 672,
      'pong': 672,
      'sendcmpct': 66,
      'sendheaders': 24,
      'verack': 24,
      'version': 131
    },
    'bytesrecv_per_msg': {
      'addr': 55,
      'feefilter': 32,
      'headers': 106,
      'ping': 672,
      'pong': 672,
      'sendcmpct': 66,
      'sendheaders': 24,
      'verack': 24,
      'version': 131
    }
  };
};
