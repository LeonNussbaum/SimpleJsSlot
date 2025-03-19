var bet = 10;
var balance = 1000;
var spinning = false;
var userInput = '';

const symbolsList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const spins = 16;
const reels = document.querySelectorAll('.reel');
const betsound = document.getElementById('betsound');
const winSound = document.getElementById('win-sound');
const startsound = document.getElementById('start-sound');
const monneyaddsound = document.getElementById('monneyadd-sound');
const spinsound = document.getElementById('spin-sound');

function resetsounds() {
  winSound.pause();
  winSound.currentTime = 0;
  spinsound.pause();
  spinsound.currentTime = 0;
}

function hidewinlines() {
  var elements = document.querySelectorAll('.lines');
  elements.forEach(function (element) {
    element.classList.add('hidden');
  });
}

function showwinlines() {
  var elements = document.querySelectorAll('.lines');

  elements.forEach(function (element) {
    element.classList.remove('hidden');
  });
}

function showinlinebyid(lineids) {
  for (let index = 0; index < lineids.length; index++) {
    setTimeout(() => {
      var element = document.getElementById("l" + lineids[index]);
      if (element) {
        element.classList.remove('hidden');
      }
    }, index * 1);
  }
}


function spinReel(reel) {
  const symbols = reel.querySelectorAll('.symbol');
  symbols.forEach((symbol, index) => {
    symbol.style.transition = 'transform 1s ease-out';
    symbol.style.transform = `translateY(${symbol.clientHeight * spins}px)`;
    setTimeout(() => {
      symbol.style.transition = 'none';
      symbol.style.transform = 'translateY(0)';
    }, 950);
  });
}

function setSymbolById(id, symbol) {
  const element = document.getElementById(id);
  if (element) {
    element.src = `images/${symbol}.png`;
  }
}

function setsymbols(symbolIds, symbolsFromBackend) {
  symbolIds.forEach((symbolId, index) => {
    const column = Math.floor(index / 3);
    const row = index % 3;
    setSymbolById(symbolId, symbolsFromBackend[row][column]);
  })
}

function setrollthroughsymbols() {
  const cyclesymbols = ["104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116",
    "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216",
    "304", "305", "306", "307", "308", "309", "310", "311", "312", "313", "314", "315", "316",
    "404", "405", "406", "407", "408", "409", "410", "411", "412", "413", "414", "415", "416",
    "504", "505", "506", "507", "508", "509", "510", "511", "512", "513", "514", "515", "516"];
  cyclesymbols.forEach(symbol => {
    setSymbolById(symbol, symbolsList[Math.floor(Math.random() * symbolsList.length)])
  });
}

function updatebetcheck(isright, bet) {
  if (isright) {
    if (bet + 10 > balance) {
      bet = 10;
    }
    else {
      bet = bet + 10;
    }
  }
  else {
    if (bet - 10 <= 0) {
      bet = 10;
    }
    else {
      bet = bet - 10;
    }
  }
  updatebet(bet);
  return bet;
}

function updatebalance(balance) {
  var balanceelement = document.getElementById("balance");
  balanceelement.textContent = balance;
}

function updatebet(bet) {
  var wagerElement = document.getElementById("wager");
  wagerElement.textContent = bet;
}

function Generator(){
  let gensymbols = [];
  for (let j = 0; j < 3; j++) {
    gensymbols[j] = generateRandomNumbers();
  }

  let calculation = checkLines(gensymbols);
  console.log(gensymbols);
  console.log(calculation.matchingLines);
  
  let matchingLines = calculation.matchingLines;
  let moneywin = calculation.monneywin;

  return {gensymbols,matchingLines,moneywin};
}

function checkLines(array) {
  const matchingLines = [];
  let monneywin = 0;

  for (let i = array.length - 1; i >= 0; i--) {
    const row = array[i];
    let target = row.find(e => e !== 10); // Find first non-wild element
    
    // Handle case where all elements are wild (10)
    const allWild = row.every(e => e === 10);
    const isValid = allWild || row.every(e => 
      e === target ||  // Match target symbol
      e === 10         // Allow wildcards
    );

    if (isValid){
      if (i == 0) {
        matchingLines.push(3);
      }
      else if (i == 1) {
        matchingLines.push(2);
      }
      else if (i == 2) {
        matchingLines.push(1);
      }
      monneywin = calculateWin(bet,target);
    } 
  }
  console.log(monneywin);
  return {matchingLines,monneywin};
}
function calculateWin(bet, number) {
  let moneywin = 0;

  switch (number) {
      case 1:
          moneywin += bet * 1;
          break;
      case 2:
          moneywin += bet * 2;
          break;
      case 3:
          moneywin += bet * 3;
          break;
      case 4:
          moneywin += bet * 4;
          break;
      case 5:
          moneywin += bet * 5;
          break;
      case 6:
          moneywin += bet * 6;
          break;
      case 7:
          moneywin += bet * 7;
          break;
      case 8:
          moneywin += bet * 8;
          break;
      case 9:
          moneywin += bet * 9;
          break;
      case 10:
          moneywin += bet * 9;
          break;
      default:
          console.log("Invalid number");
  }

  return moneywin;
}

function generateRandomNumbers(count = 5) {
  const chanceForSame = 0.1; // 10% chance that all numbers will be the same
  let numbers = [];

  // Decide if all numbers should be the same based on the chance
  if (Math.random() < chanceForSame) {
      // Generate one random number and use it for all
      const num = Math.floor(Math.random() * 10) + 1;
      numbers = Array(count).fill(num);
  } else {
      // Otherwise, generate random numbers
      for (let i = 0; i < count; i++) {
          numbers.push(Math.floor(Math.random() * 10) + 1);
      }
  }

  return numbers;
}

async function playgame() {

    resetsounds();
    let gamegen = Generator();

    startsound.play();
    spinning = true;
    setrollthroughsymbols();
    const symbolIds = ["117", "118", "119", "217", "218", "219", "317", "318", "319", "417", "418", "419", "517", "518", "519"];
    setsymbols(symbolIds, gamegen.gensymbols);

    spinsound.play();
    balance = balance - bet;
    updatebalance(balance);
    reels.forEach((reel, index) => {
      setTimeout(() => {
        spinReel(reel);
        if (index === 4) {
          const secondSetIds = ["101", "102", "103", "201", "202", "203", "301", "302", "303", "401", "402", "403", "501", "502", "503"];
          setsymbols(secondSetIds, gamegen.gensymbols);
        }
      }, index * 100);
    });

    setTimeout(() => {
      
      if (gamegen.moneywin > 0) {
        
        showinlinebyid(gamegen.matchingLines);
        winSound.play();
        monneyaddsound.play();
        document.getElementById("wwin").textContent = gamegen.moneywin;
        balance = balance + gamegen.moneywin;
        updatebalance(balance);
      }
      spinning = false;
    }, 1400);
}

document.addEventListener("DOMContentLoaded", function () {

  updatebalance(balance);
  var linesElement = document.querySelector('.lines');
  linesElement.classList.add('fade-in');
});

document.addEventListener('keydown', async (event) => {
  if (spinning) return;
  document.getElementById("wwin").textContent = "";
  if (event.key === ' ' || event.key === 'Spacebar') {
    userInput = '';
    hidewinlines();
    playgame();
  }
  if (event.key === 'ArrowLeft') {
    userInput = "";
    betsound.play();
    bet = updatebetcheck(false, bet);
  } else if (event.key === 'ArrowRight') {
    userInput = "";
    betsound.play();
    bet = updatebetcheck(true, bet);
  }
});