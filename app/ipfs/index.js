const ipfsDaemon = require('ipfs-daemon');
const OrbitDB = require('orbit-db');
const storage = require('electron-json-storage');


// console.log("Starting IPFS deamon...");


storage.get('user', (error, data) => {
  let userId = null;
  if (error || !data || !data.userId) {
    userId = Math.floor(Math.random() * 1000);
    storage.set('user', { userId }, (setError) => {
      if (setError) throw setError;
    });
  } else {
    userId = data.userId;
  }

  const conf = {
    IpfsDataDir: `/tmp/ipfs-session-${userId}`,
    Addresses: {
      API: '/ip4/127.0.0.1/tcp/0',
      Swarm: ['/ip4/0.0.0.0/tcp/0'],
      Gateway: '/ip4/0.0.0.0/tcp/0'
    },
  };

  ipfsDaemon(conf)
    .then((res) => {
      console.log("ipfs-daemon says:", res)
      const orbitdb = new OrbitDB(res.ipfs);
      const db = orbitdb.kvstore('|orbit-db|examples|kvstore-example');

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
    })
    .catch((err) => console.error(err))
});
