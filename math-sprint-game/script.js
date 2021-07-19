// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';
// Scroll
let valueY = 0;

//refresh Splash page Best Score
function bestScoresToDOM(){
 bestScores.forEach((bestScore,index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScores}s`;
 });
}

//Check local Storage for best Scores,set bestScoreArray
function getSavedBestScores(){
  if(localStorage.getItem('bestScores')){
    bestScoreArray = JSON.parse(localStorage.bestScores);
  }else{
    bestScoreArray = [
      {questions: 10, bestScores: finalTimeDisplay},
      {questions: 25, bestScores: finalTimeDisplay},
      {questions: 50, bestScores: finalTimeDisplay},
      {questions: 99, bestScores: finalTimeDisplay},
    ];
    localStorage.setItem('bestScores',JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

//Update best scores
function updateBestScore(){
 bestScoreArray.forEach((score, index) => {
   //Select correct Best Score to update
   if(questionAmount ==  score.questions){
    //return Best Score as number with one decimal
    const SavedBestScore = Number(bestScoreArray[index].bestScores);
    //update if the new final score is less or replacing zero
    if(SavedBestScore === 0 || SavedBestScore > finalTime){
      bestScoreArray[index].bestScores = finalTimeDisplay;
    }
   }
 });
bestScoresToDOM(); 
 //save to local Storage
 localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}


//Reset Game
function playAgain(){
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;

}


//Show Score Page
function showScorePage(){
 //show play again button after 1 second
 setTimeout(() => {
  playAgainBtn.hidden = false;
 }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;

}

//Format & Display Time in DOM
function scoresToDOM(){
 finalTimeDisplay = finalTime.toFixed(1);
 penaltyTime = penaltyTime.toFixed(1);
 baseTime = timePlayed.toFixed(1);
 baseTimeEl.textContent = `Base Time: ${baseTime}s`;
 penaltyTimeEl.textContent = `penalty: +${penaltyTime}s`;
 finalTimeEl.textContent = `${finalTimeDisplay}s`;
 updateBestScore();
 itemContainer.scrollTo({top: 0, behavior: 'instant' });
 showScorePage();
}



function checkScore(playerGuessArray){
   equationsArray.forEach((equation, index)=> {
    if(equation.evaluated === playerGuessArray[index]){
      //correct answer
    } else{
      //Incorrect guess,Add penalty
      penaltyTime += 0.5;
     };
  }); 
  finalTime = timePlayed + penaltyTime;
  console.log('time',finalTime, 'penaltyTime', penaltyTime);
}


//Stop timer, Proccess Result go to Score Page
function checkTime(){
  //console.log(timePlayed);
  if(playerGuessArray.length == questionAmount){
     // console.log('player guess array:', playerGuessArray);
      clearInterval(timer);
      checkScore(playerGuessArray);
      scoresToDOM();
  }
}

//Add a tenth of a second to timePlayed
function addTime(){
  timePlayed += 0.1;
  checkTime();
}

//start timer when game page  is clicked
function startTimer(){
  //Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click',startTimer);
}

//Scroll,Store user selection in playerGuess
function select(guessedTrue){

  //Scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0,valueY);
  //Add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

//displays Game page
function displayGamePage(){
  countdownPage.hidden = true;
   gamePage.hidden = false;
}

function equationsToDOM(){
  equationsArray.forEach((equation) => {
   //item
   const item = document.createElement('div');
   item.classList.add('item');
   const h1 = document.createElement('h1');
   h1.textContent = equation.value;
   item.append(h1);
   itemContainer.append(item);
   return itemContainer;
 });
}

//Get Random Number up to a max number
function getRandomInt(max){
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('correct equations:', correctEquations);
  // Set amount of wrong equations
   const wrongEquations = questionAmount - correctEquations;
   console.log('wrong equation:', wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}



// // Dynamically adding correct/incorrect equations
 function populateGamePage() {
// //   // Reset DOM, Set Blank Space Above
    itemContainer.textContent = '';
// //   // Spacer
   const topSpacer = document.createElement('div');
    topSpacer.classList.add('height-240');
// //   // Selected Item
    const selectedItem = document.createElement('div');
   selectedItem.classList.add('selected-item');
// //   // Append/
    itemContainer.append(topSpacer, selectedItem);

// //   // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();
// //   // Set Blank Space Below
   const bottomSpacer = document.createElement('div');
    bottomSpacer.classList.add('height-500');
    itemContainer.appendChild(bottomSpacer);
 }

//Displays 3,2,1 Go!
function countdownStart(){
  countdown.textContent = '3';
  setTimeout(function(){
    countdown.textContent = '2';
    },1000)  
  setTimeout(function(){
    countdown.textContent = '1';
    },2000)  
  setTimeout(function(){
    countdown.textContent = 'Go!';
    },3000)  
}


function showCountdown(){
    splashPage.hidden = true;
    countdownPage.hidden = false;
    countdownStart();
    populateGamePage();
    setTimeout(displayGamePage,3300);
 }



//Get the value from selected radio button
function getRadioValue(){
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if(radioInput.checked){
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}


//Form that decides amount of questions
function selectQuestionAmount(e){
  e.preventDefault();
 questionAmount = getRadioValue();
 console.log('question amount!', questionAmount);
  if(questionAmount){ 
      showCountdown();
    }
 }

startForm.addEventListener('click',()=>{
 radioContainers.forEach((radioEl) => {
  //Remove Selected Label Styling
   radioEl.classList.remove('selected-label');
   //add it back if radio input is checked
  if(radioEl.children[1].checked){
    radioEl.classList.add('selected-label');
   }  
  })
});

//Event Listeners
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

//on Load
getSavedBestScores();