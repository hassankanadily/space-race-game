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


const questionBox = document.querySelector('.question-box');
const answers = document.querySelectorAll(".actual-answers");

let sectionList = document.querySelectorAll('section');
function showPage(id){
  sectionList.forEach(section => {
    section.hidden = true;
  });
  document.getElementById(id).hidden = false;
  window.scrollTo(0,0);
}
showPage('select-level-sec');

const gradeLevels = document.querySelectorAll('.grade-btn');
gradeLevels.forEach(grade =>{
  grade.addEventListener('click',()=>{
    showPage('select-subject-sec');
  });
});

const subjectsSelection = document.querySelectorAll('.new-subject');
subjectsSelection.forEach(subject =>{
  subject.addEventListener('click',()=>{
    showPage('start-quiz-sec');
  });
});






let startQuizBtn = document.getElementById("startQuiz");

startQuizBtn.addEventListener('click',()=>{
  showPage('quiz');
});

const playAgainBtn = document.querySelector(".play-again-button");

playAgainBtn.addEventListener('click',()=>{
  quizSection.style.opacity = "1";
  winnerSection.style.transform = "translateY(100%)";
  quizSection.style.transform = "translateY(0)";

  setTimeout(()=>{
    winnerSection.style.opacity = "0";
    winnerSection.style.transform = "translateY(-100%)";
    //winnerSection.style.display = "none";
  },1000);
});


const levels = document.querySelectorAll('.new-level');
let selectedLevel = null;
levels.forEach(level =>{
  level.addEventListener('click',()=>{
    selectedLevel = level.value;
    console.log(level.value);
    tryFetchQuestions();
  });
});

const subjects = document.querySelectorAll('.new-subject');
let selectedSubject = null;
subjectsSelection.forEach(subject => {
  subject.addEventListener('click', ()=>{
    selectedSubject = subject.getAttribute('value');
    console.log(subject.getAttribute('value'));
    tryFetchQuestions();
  });
});


let questionsSent = [];
function tryFetchQuestions(){
  if(selectedLevel && selectedSubject){
    console.log("hi");
    fetch(`/questions/${selectedLevel}/${selectedSubject}`)
    .then(res => res.json())
    .then(data =>{
      questionsSent = data;
      console.log("Questions received:", data);
      selectedLevel = null;
      selectedSubject = null;
    });
  }
}

let currentIndex = 0;
function displayQuestions(data){
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
      if(currentIndex < 7){
        currentIndex++;
      }
      else{
        console.log("Questions Completed");
      }
}

startQuizBtn.addEventListener('click',()=>{
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

socket.on('answer-detected', (data) => {
  console.log('received');
  console.log(data);

  if(letter === null){
    if(counter === currentIndex - 1 && data.sensor !== null){
      checkAnswer(data);
    }
  }
});

let car1Score = 0;
let car2Score = 0;

function checkAnswer(data){
  console.log('hi');
  if(data.sensor === null){
    return;
  }
  if(letter === null){
    letter = data.sensor;
    carId = data.uid;
    let answer = questionsSent[currentIndex - 1]['answer'];
    console.log(answer);
    console.log(letter);
    console.log(currentIndex);
    if(letter === answer){
      counter++;
      if(carId === '03C5EF2C'){
        car1Score++;
        document.getElementById('person1-points').textContent = car1Score;
        console.log('Car 1 Score: ',car1Score);
        if(counter === 7){
          showPage('winner');
        }
      }
      else{
        car2Score++;
        document.getElementById('person2-points').textContent = car2Score;
        console.log('Car 2 Score: ',car2Score);
      }
      if(currentIndex<=6){
        fetch('/reset-answer', {
          method: 'POST'
        })
        .then(res =>res.json())
        .then(data=>{
          data.sensor = null;
          data.uid = null;
        })

        console.log("Correct Answer");
        correctAnswer(letter);
        letter = null;
        carId = null;
      }
    }
    else{
      console.log('Incorrect Answer');
      wrongAnswer(letter);
      letter = null;
      carId = null;
      fetch('/reset-answer', {
          method: 'POST'
      })
      .then(res =>res.json())
      .then(data=>{
        data.sensor = null;
        data.uid = null;
      })
    } 
  }
}

function correctAnswer(answer){
  const lowerAnswer = answer.toLowerCase();
  const currentAnswer = document.getElementById(lowerAnswer);
  console.log(currentAnswer.className);
  console.log(lowerAnswer);
  currentAnswer.classList.add('correct');
  setTimeout(()=>{
    currentAnswer.classList.remove('correct');
    displayQuestions(questionsSent);
  },2000);
}

function wrongAnswer(answer){
  const lowerAnswer = answer.toLowerCase();
  const currentAnswer = document.getElementById(lowerAnswer);
  console.log(currentAnswer.className);
  console.log(lowerAnswer);2
  currentAnswer.classList.add('wrong');
  setTimeout(()=>{
    currentAnswer.classList.remove('wrong');
  },2000);
}
