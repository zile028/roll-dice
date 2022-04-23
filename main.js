let playersBox = document.querySelectorAll(".player");
let controls = document.querySelector(".middle");
let rollDiceBtn = controls.querySelector("#roll-dice");
let holdBtn = controls.querySelector("#hold-dice");
let newGameBtn = controls.querySelector("#new-game");
let diceBox = controls.querySelector("#rolled-dice");
let registerBox = document.querySelector(".register");
let formBox = registerBox.querySelector("form");
let formBtn = formBox.querySelector("form button");
let diceNumber = null;
let winnerBox = null;

newGameBtn.addEventListener("click", newGame);
formBtn.addEventListener("click", validate);

let players = [
  {
    name: "Zika",
    total: 0,
    getDice: [],
  },
  {
    name: "Zika",
    total: 0,
    getDice: [],
  },
];

let currentRound = {
  player: 0,
  dice: [],
  score: 0,
};

let config = {
  dice: [
    "dice-1.png",
    "dice-2.png",
    "dice-3.png",
    "dice-4.png",
    "dice-5.png",
    "dice-6.png",
  ],
  winnLimit: 20,
};

function newGame() {
  registerBox.style.display = "flex";
  winnerBox.remove();
}

function init() {
  rollDiceBtn.addEventListener("click", rollDice);
  holdBtn.addEventListener("click", holdDice);
  players.forEach((player) => {
    player.total = 0;
    player.getDice = [];
  });
  currentRound.player = 0;
  diceBox
    .querySelector(".side-1 img")
    .setAttribute("src", `img/${config.dice[0]}`);
  playersBox.forEach((player, index) => {
    player.querySelector("h2").innerHTML = players[index].name;
    player.querySelector("h3").innerHTML = 0;
    player.querySelector("h4").innerHTML = 0;
  });
  rollDiceBtn.style.display = "block";
  holdBtn.style.display = "block";
  playersBox[0].className = "player active";
  playersBox[1].className = "player";
  registerBox.style.display = "none";
  diceBox.style.display = "block";
}

function rollDice() {
  diceNumber = 0;
  diceBox.classList.add("roll");
  diceNumber = Math.floor(Math.random() * 6);

  setTimeout(() => {
    diceBox
      .querySelector(".side-1 img")
      .setAttribute("src", `img/${config.dice[diceNumber]}`);

    diceBox.classList.remove("roll");
    currentRound.dice.push(diceNumber);
    currentRound.score += diceNumber + 1;
    playersBox[currentRound.player].querySelector("h4").innerHTML =
      currentRound.score;
    if (diceNumber === 0) {
      currentRound.dice = [];
      currentRound.score = 0;
      playersBox[currentRound.player].querySelector("h4").innerHTML =
        currentRound.score;
      changePlayer();
    }
  }, 1000);
}

function holdDice() {
  players[currentRound.player].getDice.push(currentRound.dice);
  players[currentRound.player].total += currentRound.score;
  playersBox[currentRound.player].querySelector("h3").innerHTML =
    players[currentRound.player].total;
  currentRound.dice = [];
  currentRound.score = 0;
  playersBox[currentRound.player].querySelector("h4").innerHTML =
    currentRound.score;
  checkWinner();
}

function changePlayer() {
  if (currentRound.player === 0) {
    currentRound.player = 1;
  } else {
    currentRound.player = 0;
  }
  playersBox.forEach((box) => {
    box.classList.toggle("active");
  });
}

function checkWinner() {
  if (players[currentRound.player].total >= config.winnLimit) {
    endGame();
  } else {
    changePlayer();
  }
}

function endGame() {
  rollDiceBtn.removeEventListener("click", rollDice);
  holdBtn.removeEventListener("click", holdDice);
  rollDiceBtn.style.display = "none";
  holdBtn.style.display = "none";
  displayWinner();
}

function displayWinner() {
  let winPLayer = players[currentRound.player];
  winnerBox = document.createElement("div");
  winnerBox.className = "winner-box";
  let text = ``;
  text += `<h2>Winner is ${winPLayer.name}</h2>`;
  text += `<p>Geting dice per round:</p>`;
  text += `<ul>`;
  winPLayer.getDice.forEach((round, roundNumber) => {
    text += `<li><span>${roundNumber + 1}</span>`;
    round.forEach((dice) => {
      text += `<img src="img/${config.dice[dice]}" alt="" />`;
    });
    text += `</li>`;
  });
  text += `</ul>`;
  text += `<h3>Total: <span>${winPLayer.total}</span></h3>`;

  winnerBox.innerHTML = text.trim();
  diceBox.style.display = "none";
  playersBox[currentRound.player].appendChild(winnerBox);
}

function validate(e) {
  e.preventDefault();
  let err = [];

  let tempData = {
    playerOneName: formBox.querySelector('[name="playerOne"]'),
    playerTwoName: formBox.querySelector('[name="playerTwo"]'),
    adult: formBox.querySelector('[name="adult"]'),
  };

  if (
    tempData.playerOneName.value === "" ||
    tempData.playerOneName.value === null
  ) {
    err.push({
      msg: "Player one name is required!",
      el: tempData.playerOneName,
    });
  }

  if (
    tempData.playerTwoName.value === "" ||
    tempData.playerTwoName.value === null
  ) {
    err.push({
      msg: "Player two name is required!",
      el: tempData.playerTwoName,
    });
  }
  if (!tempData.adult.checked) {
    err.push({
      msg: "To play this game you must be older then 18 year!",
      el: tempData.adult,
    });
  }

  if (err.length === 0) {
    players[0].name = tempData.playerOneName.value.trim().toUpperCase();
    players[1].name = tempData.playerTwoName.value.trim().toUpperCase();
    tempData.playerOneName.value = "";
    tempData.playerTwoName.value = "";
    tempData.adult.checked = false;
    init();
  } else {
    console.log("You have error");
  }
}
