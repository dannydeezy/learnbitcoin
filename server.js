const express = require('express');
const bodyparser = require('body-parser');
const favicon = require('express-favicon');
const BitGoJS = require('bitgo')
const app = express();
const port = 3333;
//process.config = require('./config');
//const server = require('./server');
const walletId = '5d1f913ea8f49d7803b9d5e91c1d8ca7';
const walletPassphrase = ''

const bitgo = new BitGoJS.BitGo({env: 'test', accessToken: process.env.ACCESS_TOKEN});
let wallet;


const initWallet = async function() {
  wallet = await bitgo.coin('tbtc').wallets().get({ id: walletId });
}

app.use(bodyparser.json());
app.use(favicon(__dirname + '/client/images/bitcoin.jpg'));

const http = app.listen(port, () => console.log(`Running Learn Bitcoin on port ${port}!`))

const handleSendMoney = async function(req, res) {
  console.log(`Request to send to ${req.body.address}`);
  let params = {
    address: req.body.address,
    amount: '100000',
    walletPassphrase: process.env.PASSPHRASE
  };
  wallet.send(params).then((response) => {
    console.dir(response);
    response.amount = params.amount;
    let entries = response.transfer.entries;
    let vout = -1;
    for(let i=0; i<entries.length; i++) {
      let entry = entries[i];
      if (entry.value > 0) {
        vout++;
        if (entry.address === params.address) {
          break;
        }
      }
    };
    response.vout = vout;
    res.send(response);
  });
};

app.get('/', (req, res) => res.sendFile('/main1.html', { root: 'client' }));
app.get('/lesson1/bundle.js', (req, res) => res.sendFile('/lesson1/bundle.js', { root: 'client' }));
app.get('/style.css', (req, res) => res.sendFile('/style.css', { root: 'client' }));

/*
  OpenNode webhook endpoint
 */
app.post('/send', (req, res) => handleSendMoney(req, res));

initWallet();
