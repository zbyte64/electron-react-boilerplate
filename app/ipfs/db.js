// @flow
const ipfsDaemon = require('ipfs-daemon');
const OrbitDB = require('orbit-db');
const storage = require('electron-json-storage');
const promisify = require('promisify-es6');

storage.get = promisify(storage.get);
storage.set = promisify(storage.set);


function constructIPFSService() {
  console.log("Starting IPFS deamon...");
  return storage.get('sessionId').then(data => {
    let sessionId = null;
    if (!data || !data.sessionId) {
      sessionId = Math.floor(Math.random() * 1000);
      storage.set('sessionId', { sessionId });
    } else {
      sessionId = data.sessionId;
    }
    console.log("session id:", sessionId)
    return sessionId;
  }).then(sessionId => {
    const conf = {
      IpfsDataDir: `/tmp/ipfs-session-${sessionId}`,
      Addresses: {
        API: '/ip4/127.0.0.1/tcp/0',
        Swarm: ['/ip4/0.0.0.0/tcp/0'],
        Gateway: '/ip4/0.0.0.0/tcp/0'
      },
    };
    return ipfsDaemon(conf)
  })
}


let _ipfsClient_ = null;
export function getIpfsClient() {
  if (_ipfsClient_) return Promise.resolve(_ipfsClient_);
  return constructIPFSService().then(res => {
    console.log("ipfs-daemon says:", res)
    _ipfsClient_ = res.ipfs;
    return _ipfsClient_;
  });
}

export default function getCounterStore(namespace: string = 'counter') {
  return getIpfsClient().then(ipfs => {
    const orbitdb = new OrbitDB(ipfs);
    const db = orbitdb.counter(namespace);
    // db.events.on('data', (dbname, event) => console.log(dbname, event))
    return db;
  });
}


/*
const creatures = ['🐙', '🐬', '🐋', '🐠', '🐡', '🦀', '🐢', '🐟', '🐳'];

const query = () => {
  const index = Math.floor(Math.random() * creatures.length);
  db.put(userId, { avatar: creatures[index], updated: new Date().getTime() })
    .then(() => {
      const user = db.get(userId);
      let output = `\n`;
      output += `----------------------\n`;
      output += `User\n`;
      output += `----------------------\n`;
      output += `Id: ${userId}\n`;
      output += `Avatar: ${user.avatar}\n`;
      output += `Updated: ${user.updated}\n`;
      output += `----------------------`;
      console.log(output);
      return output;
    })
    .catch((e) => {
      console.error(e.stack);
    });
};

setInterval(query, 1000);
return db;
*/
