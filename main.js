'use strict';

let gData;
let gPercentage;
let gStackQuestions;
let gCurrentIndex = 0;
let gCorrectAnswerIndex = 0;
let gNumberOfCorrectAnswers = 0;


function loadJSON(jsonNameFile, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', jsonNameFile, true); 
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
    callback(xobj.responseText);
    }
  };
  xobj.send(null);  
}

function init() {
  loadJSON("birds.json", function(response) {
    gData = JSON.parse(response);
    gStackQuestions = shuffle(gData.q);
    createQuestion();
  });
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
  // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function getNextCandidate(listCandidates, correctAnswer) {
  let found = false;
  let nextCandidate = "";
  while (!found) {
    let randomIndex = Math.floor(Math.random() * gData.q.length);
    nextCandidate = gData.q[randomIndex].a;
    if (nextCandidate !== correctAnswer && listCandidates.indexOf(nextCandidate) == -1) {
      found = true;
      listCandidates.push(nextCandidate);
    }
  }
  return nextCandidate;
}

function createQuestion() {
  let selectedQuestion = gStackQuestions[gCurrentIndex];
  document.getElementById("imgQuestion").setAttribute('src', selectedQuestion.q)

  let listCandidates = [];
  gCorrectAnswerIndex = Math.floor(Math.random() * 4) + 1;

  for (let i = 1; i < 5; ++i) {
    let tempAnswer = null;
    if (i == gCorrectAnswerIndex) {
      tempAnswer = selectedQuestion.a;
    } else {
      tempAnswer = getNextCandidate(listCandidates, selectedQuestion.a);
    }
    document.getElementById("answer" + i).innerHTML = tempAnswer;
  }
}

function createSpanResult(text, isCorrect) {
  var spanAnswer = document.createElement('span')
  spanAnswer.innerHTML = text;
  spanAnswer.setAttribute('class', isCorrect ? "correctAnswer" : "incorrectAnswer");
  document.getElementById("divResultsSpan").appendChild(spanAnswer);
}

function clickOnAnswer(clickedBtn) {
  let clickedButton = clickedBtn.substr(clickedBtn.length - 1);
  let isCorrectAnswer = gCorrectAnswerIndex == clickedButton;
  let text = (gCurrentIndex + 1).toString() + ". ";
  text += (isCorrectAnswer ? gStackQuestions[gCurrentIndex].a : document.getElementById(clickedBtn).innerHTML);

  createSpanResult(text, isCorrectAnswer);

  if (isCorrectAnswer) {
    ++gNumberOfCorrectAnswers;
  }
  ++gCurrentIndex;
  createQuestion();

  gPercentage = (gNumberOfCorrectAnswers / gCurrentIndex) * 100.0;
  gPercentage = Math.round(gPercentage * 100) / 100;
  document.getElementById("idResultsPercentage").innerHTML = "Results: " + gPercentage + "%";
}

function keyPressed(event) {
  if (event.defaultPrevented) {
    return;
  }

  if (event.keyCode === 49) {
    clickOnAnswer("answer1");
  } else if (event.keyCode === 50) {
    clickOnAnswer("answer2");
  } else if (event.keyCode === 51) {
    clickOnAnswer("answer3");
  } else if (event.keyCode === 52) {
    clickOnAnswer("answer4");
  }
}

window.onload = function(){
  init();
}
window.addEventListener('keypress', keyPressed, false);