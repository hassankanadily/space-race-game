/*let currentSection = document.querySelector(".quiz-section").classList.add(".active");

document.querySelector(".winner-section").classList.add(".exit-right");*/

/*function newPage(id){
  let nextSection = document.getElementById(id);
  currentSection.classList.remove(".active");
  currentSection.classList.add(".exit-right");

  nextSection.classList.remove(".exit-right");
  currentSection.classList.add(".active");

  setTimeout(()=>{
    currentSection.classList.remove(".exit-right");
    currentSection.style.translateY="transform(100)%";
    currentSection = nextSection;
  },1000);
  
  
  sections.forEach(section =>{
    section.hidden = true;
  });
  document.getElementById(id).hidden = false;
}*/
/*const sections = document.querySelectorAll("section");
const filledSection = document.querySelector(".filled-section");
const quizSection = document.getElementById("quiz");
filledSection.appendChild(quizSection);
const winnerSection = document.getElementById("winner");
let nextQuestionbtn = document.getElementById("nextQ");*/

/*winnerSection.style.transform = "translateY(-110%)";
const questionBox = document.querySelector(".question-box");

questionBox.addEventListener('click',()=>{
  winnerSection.style.opacity = "1";
  quizSection.style.transform = "translateY(100%)";
  winnerSection.style.transform = "translateY(0)";

  setTimeout(()=>{
    quizSection.style.opacity = "0";
    quizSection.style.transform = "translateY(-100%)";
    //quizSection.style.display = "none";
  },1000);
});*/
/*const starsEl = document.getElementById('stars');
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.opacity = (Math.random() * 0.5 + 0.2).toFixed(2);
      const size = (Math.random() * 2.5 + 1).toFixed(1) + 'px';
      s.style.width = size;
      s.style.height = size;
      starsEl.appendChild(s);
  }*/

const questionBox = document.querySelector(".question-box");
const answers = document.querySelectorAll(".actual-answers");

let sectionList = document.querySelectorAll("section");
function showPage(id) {
  sectionList.forEach((section) => {
    section.hidden = true;
  });
  document.getElementById(id).hidden = false;
  window.scrollTo(0, 0);
}
showPage("select-level-sec");

const gradeLevels = document.querySelectorAll(".grade-btn");
gradeLevels.forEach((grade) => {
  grade.addEventListener("click", () => {
    showPage("select-subject-sec");
  });
});

const subjectsSelection = document.querySelectorAll(".new-subject");
subjectsSelection.forEach((subject) => {
  subject.addEventListener("click", () => {
    showPage("start-quiz-sec");
  });
});

let startQuizBtn = document.getElementById("startQuiz");

startQuizBtn.addEventListener("click", () => {
  showPage("quiz");
});

const playAgainBtn = document.querySelector(".play-again-button");

playAgainBtn.addEventListener("click", () => {
  showPage("select-level-sec");
});

/*playAgainBtn.addEventListener("click", () => {
  quizSection.style.opacity = "1";
  winnerSection.style.transform = "translateY(100%)";
  quizSection.style.transform = "translateY(0)";

  setTimeout(() => {
    winnerSection.style.opacity = "0";
    winnerSection.style.transform = "translateY(-100%)";
    //winnerSection.style.display = "none";
  }, 1000);
});*/

const levels = document.querySelectorAll(".new-level");
let selectedLevel = null;
levels.forEach((level) => {
  level.addEventListener("click", () => {
    selectedLevel = level.value;
    console.log(level.value);
    tryFetchQuestions();
  });
});

const subjects = document.querySelectorAll(".new-subject");
let selectedSubject = null;
subjectsSelection.forEach((subject) => {
  subject.addEventListener("click", () => {
    selectedSubject = subject.getAttribute("value");
    console.log(subject.getAttribute("value"));
    tryFetchQuestions();
  });
});

let questionsSent = [];
function tryFetchQuestions() {
  if (selectedLevel && selectedSubject) {
    console.log("hi");
    fetch(`/questions/${selectedLevel}/${selectedSubject}`)
      .then((res) => res.json())
      .then((data) => {
        questionsSent = data;
        console.log("Questions received:", data);
        selectedLevel = null;
        selectedSubject = null;
      });
  }
}

let currentIndex = 0;
function displayQuestions(data) {
  console.log("eshtaghal");
  let currentQuestion = data[currentIndex]["question"];
  let A = data[currentIndex]["options"]["A"];
  let B = data[currentIndex]["options"]["B"];
  let C = data[currentIndex]["options"]["C"];
  let D = data[currentIndex]["options"]["D"];

  document.getElementById("displayed-question").textContent = currentQuestion;
  document.getElementById("a").textContent = A;
  document.getElementById("b").textContent = B;
  document.getElementById("c").textContent = C;
  document.getElementById("d").textContent = D;
  if (currentIndex < 7) {
    currentIndex++;
  } else {
    console.log("Questions Completed");
  }
}

startQuizBtn.addEventListener("click", () => {
  displayQuestions(questionsSent);
});

/*const options = document.querySelectorAll(".answers-box p");
let clickedOption;
options.forEach(option => {
  option.addEventListener('click',()=>{
    let answer = questionsSent[currentIndex-1]["answer"];
    console.log(currentIndex);
    console.log(answer);
    clickedOption = option.dataset.value;
    
    console.log(clickedOption);
    if (clickedOption === answer){
      if (currentIndex <=6){
        displayQuestions(questionsSent);
      }
      console.log("Correct!!");
    }
  });
});*/

let letter = null;
let carId = null;
let answerData = null;
let counter = 0;
/*setInterval(()=>{
  if(letter === null){
    fetch('/answers')
    .then(res=>res.json())
    .then(data=>{
      if(counter === currentIndex - 1 && data.sensor !== null){
        console.log('received');
        answerData = data;
        console.log(answerData);
        checkAnswer(answerData);
      }
    })
  }
},1000);*/

const socket = io();

socket.on("answer-detected", (data) => {
  console.log("received");
  console.log(data);

  if (letter === null) {
    if (counter === currentIndex - 1 && data.sensor !== null) {
      currentQuestionNumber.textContent = counter;
      checkAnswer(data);
    }
  }
});

let car1Score = 0;
let car2Score = 0;
let progressWidth = 0;

function checkAnswer(data) {
  console.log("hi");
  if (data.sensor === null) {
    return;
  }
  if (letter === null) {
    letter = data.sensor;
    carId = data.uid;
    let answer = questionsSent[currentIndex - 1]["answer"];
    console.log(answer);
    console.log(letter);
    console.log(currentIndex);
    if (letter === answer) {
      counter++;
      if (carId === "532B86357301") {
        car1Score++;
        document.getElementById("person1-points").textContent = car1Score;
        console.log("Car 1 Score: ", car1Score);
        if (counter === 7) {
          checkWinner(car1Score, car2Score);
          showPage("winner");
        }
      } else {
        car2Score++;
        document.getElementById("person2-points").textContent = car2Score;
        console.log("Car 2 Score: ", car2Score);
        if (counter === 7) {
          checkWinner(car1Score, car2Score);
          showPage("winner");
        }
      }
      if (currentIndex <= 6) {
        fetch("/reset-answer", {
          method: "POST",
        })
          .then((res) => res.json())
          .then((data) => {
            data.sensor = null;
            data.uid = null;
          });

        console.log("Correct Answer");
        correctAnswer(letter);
        progressWidth += 15;
        progress.style.width = progressWidth.toString() + "%";
        letter = null;
        carId = null;
      }
    } else {
      console.log("Incorrect Answer");
      wrongAnswer(letter);
      letter = null;
      carId = null;
      fetch("/reset-answer", {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          data.sensor = null;
          data.uid = null;
        });
    }
  }
}

function correctAnswer(answer) {
  const lowerAnswer = answer.toLowerCase();
  const currentAnswer = document.getElementById(lowerAnswer);
  console.log(currentAnswer.className);
  console.log(lowerAnswer);
  currentAnswer.classList.add("correct");
  setTimeout(() => {
    currentAnswer.classList.remove("correct");
    displayQuestions(questionsSent);
  }, 2000);
}

function wrongAnswer(answer) {
  const lowerAnswer = answer.toLowerCase();
  const currentAnswer = document.getElementById(lowerAnswer);
  console.log(currentAnswer.className);
  console.log(lowerAnswer);
  2;
  currentAnswer.classList.add("wrong");
  setTimeout(() => {
    currentAnswer.classList.remove("wrong");
  }, 2000);
}

const char1Buttons = document.querySelectorAll(".char1-button");
const char1Character = document.querySelector(".person1-img p");
char1Buttons.forEach((button) => {
  button.addEventListener("click", () => {
    char1Character.textContent = button.textContent;
  });
});
const char2Buttons = document.querySelectorAll(".char2-button");
const char2Character = document.querySelector(".person2-img p");
char2Buttons.forEach((button) => {
  button.addEventListener("click", () => {
    char2Character.textContent = button.textContent;
  });
});

const person1Value = document.getElementById("player-1-name");
const person2Value = document.getElementById("player-2-name");

const name1 = document.querySelector(".person1-name");
const name2 = document.querySelector(".person2-name");

startQuizBtn.addEventListener("click", () => {
  const person1Name = person1Value.value;
  const person2Name = person2Value.value;

  name1.textContent = person1Name;
  name2.textContent = person2Name;
});

const progress = document.querySelector(".progress-filler");
const winnerName = document.querySelector(".winner-score-name");
const winnerPoints = document.querySelector(".winner-points");
const secondName = document.querySelector(".second-score-name");
const secondPoints = document.querySelector(".second-points");

function checkWinner(player1Points, player2Points) {
  if (player1Points > player2Points) {
    /*const points1 = parseInt(
      document.getElementById("person1-points").textContent,
    );
    const points2 = parseInt(
      document.getElementById("person1-points").textContent,
    );*/

    winnerName.textContent = name1.textContent;
    winnerPoints.textContent = player1Points;
    secondName.textContent = name2.textContent;
    secondPoints.textContent = player2Points;
  } else {
    winnerName.textContent = name2.textContent;
    winnerPoints.textContent = player2Points;
    secondName.textContent = name1.textContent;
    secondPoints.textContent = player1Points;
  }
}

const currentQuestionNumber = document.getElementById(
  "current-question-number",
);
