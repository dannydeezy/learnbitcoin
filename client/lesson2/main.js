window.bitcoin = require('bitcoinjs-lib');
window.bip39 = require('bip39');
window.bip32 = require('bip32');
window.instructions = document.getElementById("content");


window.next = function() {
  checkGoalsAndUpdate();
  updateInstructions(step, step + 1);
  step++;
  localStorage.setItem('step', step);
}

window.back = function() {
  updateInstructions(step, step - 1);
  step--;
  localStorage.setItem('step', step);
}

checkGoalsAndUpdate = function() {
  if (step === 1) {
    document.getElementById('words_span').innerHTML = window.words;
    localStorage.setItem('words', window.words);
  } else if (step === 2) {
    localStorage.setItem('seed', window.seed.toString('hex'));
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
  let currentWords = localStorage.getItem('words');
  if (currentWords) {
    window.words = currentWords;
    document.getElementById('words_span').innerHTML = window.words;
  }
  let seed = localStorage.getItem('seed');
  if (seed) {
    window.seed = Buffer.from(seed, 'hex');
  }
}

loadOldValues();
document.getElementById(`step${step}`).setAttribute("style", "display:block");
