const request = require('async-request');

async function sendUpdate(c) {
  try {
    console.log('Actively monitoring Neo Services: Neoscan MainNet');

    var result = await request('https://neoscan.io/api/main_net/v1/get_height');

    const neoscanBlockHeight = JSON.parse(result.body).height;

    result = await request('https://neoscan.io/api/main_net/v1/get_block/' + neoscanBlockHeight);

    const neoscanBlock = JSON.parse(result.body)

    const neoscanBlockTime = new Date(neoscanBlock.time * 1000).toLocaleString()

    let msg = '';
    msg += ` Neoscan Height: ${neoscanBlockTime}`;
    msg += ` Neoscan Last Block Time: ${neoscanBlockHeight}`;

    console.log(msg);

    c.send(msg);
  } catch(e) {
    console.log('ERROR', e.message);
  }
}

module.exports = async (channel) => {
  await sendUpdate(channel);
  setInterval(async (c) => {
    await sendUpdate(c);
  }, 200000, channel);
};
