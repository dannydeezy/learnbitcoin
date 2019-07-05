window.bitcoin = require('bitcoinjs-lib');
window.bip39 = require('bip39');
window.bip32 = require('bip32');
window.instructions = document.getElementById("content");

const url = 'http://localhost:3333/send';

window.next = function() {
  checkGoalsAndUpdate();
  updateInstructions(step, step + 1);
  step++;
  localStorage.setItem('step', step);
  localStorage.setItem('address', window.address);
  localStorage.setItem('txid', window.txid);
  localStorage.setItem('link', window.link);
  localStorage.setItem('received', window.received);
  localStorage.setItem('receivedvout', window.receivedvout);
}

window.back = function() {
  updateInstructions(step, step - 1);
  step--;
  localStorage.setItem('step', step);
}

checkGoalsAndUpdate = function() {
  if (step >= 2) {
    document.getElementById(`my_address`).innerHTML = window.address;
    let url = `https://blockstream.info/testnet/address/${window.address}`;
    document.getElementById(`my_address`).setAttribute('href', url);
  }
  if (step === 6) {
    document.getElementById(`finishedtx`).innerHTML = window.final_tx;
  }
}

updateInstructions = function(prev, next) {
  document.getElementById(`step${prev}`).setAttribute("style", "display:none");
  document.getElementById(`step${next}`).setAttribute("style", "display:block");
}


loadOldValues = function() {
  window.step = parseInt(localStorage.getItem('step'));
  if (!window.step) {
    window.step = 0;
  }
  window.address = localStorage.getItem('address');
  window.txid = localStorage.getItem('txid');
  window.received = parseFloat(localStorage.getItem('received'));
  window.receivedvout = parseInt(localStorage.getItem('receivedvout'));
  window.link = `https://blockstream.info/testnet/tx/${window.txid}`;
}

loadTxInfo = function() {
  document.getElementById('received_tx_link').setAttribute("href", window.link);
  //document.getElementById('received_tx_link_2').setAttribute("href", window.link);
  document.getElementById('received_tx_link').setAttribute("onclick", "clickedTxLink()");
  document.getElementById('received_tx_link').innerHTML = "View the transaction here";
  document.getElementById('received_amt').innerHTML = window.received;
  document.getElementById('received_vout').innerHTML = window.receivedvout;
}

window.sendMeSomeTestnetBtc = function() {
  let data = {
    address: window.address
  };
  console.log('Your request is being processed...');
  postData(url, data).then((response) => {
    console.log('Payment delivered!');
    window.txid = response.txid;
    window.link = `https://blockstream.info/testnet/tx/${window.txid}`;
    //     link = 'https://blockstream.info/testnet/tx/' + txid; ${window.txid}`;
    let txhex = response.tx;
    let tx = bitcoin.Transaction.fromHex(txhex);
    // get received amt
    window.received = response.amount / 100000000.0;
    window.receivedvout = response.vout;
    loadTxInfo();
    document.getElementById('received_tx').setAttribute("style", "display:block");
  });
}

window.clickedTxLink = function() {
  //document.getElementById('tx_inspect_next').setAttribute('style', 'display:block');
}

loadOldValues();
if (window.step >= 3 ) loadTxInfo();
checkGoalsAndUpdate();
document.getElementById(`step${step}`).setAttribute("style", "display:block");

const postData = function(url = ``, data = {}) {
  // Default options are marked with *
  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then(response => response.json());
}
