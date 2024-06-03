let currentQuestion = {};
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
const maxQuestions = 3;

const questions = [
  {
    question: 'What is the capital of Denmark?',
    answers: [
      { text: 'Berlin', isCorrect: false },
      { text: 'Copenhagen', isCorrect: true },
      { text: 'Madrid', isCorrect: false },
      { text: 'Rome', isCorrect: false },
    ],
  },
  {
    question: 'Which planet is known as the Red Planet?',
    answers: [
      { text: 'Earth', isCorrect: false },
      { text: 'Mars', isCorrect: true },
      { text: 'Jupiter', isCorrect: false },
      { text: 'Venus', isCorrect: false },
    ],
  },
  {
    question: 'Who wrote "Romeo and Juliet"?',
    answers: [
      { text: 'Charles Dickens', isCorrect: false },
      { text: 'Mark Twain', isCorrect: false },
      { text: 'William Shakespeare', isCorrect: true },
      { text: 'F. Scott Fitzgerald', isCorrect: false },
    ],
  },
];

const playBtn = document.getElementById('play-btn');
const question = document.getElementById('question');
const answers = Array.from(document.querySelectorAll('.answer-text'));
const usernameInput = document.getElementById('username');
const saveScoreBtn = document.getElementById('save-score');

playBtn.addEventListener('click', startGame);

function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions]; //copy questions
  document.getElementById('game').classList.remove('hidden');
  displayNewQuestion();
}

function displayNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= maxQuestions) {
    localStorage.setItem('latestScore', score);
    //go to the score page
    document.getElementById('result').classList.remove('hidden');
    document.querySelector('.final-score').innerText =
      localStorage.getItem('latestScore');
    window.location.assign('#result');
    return;
  }

  questionCounter++;
  document.getElementById(
    'questionCounter'
  ).innerText = `${questionCounter}/${maxQuestions}`;

  const randomQuestionIndex = Math.floor(
    Math.random() * availableQuestions.length
  );
  currentQuestion = availableQuestions[randomQuestionIndex];
  question.innerText = currentQuestion.question;
  answers.forEach((answer, index) => {
    answer.innerText = currentQuestion.answers[index].text;
  });
  availableQuestions.splice(randomQuestionIndex, 1);
}

answers.forEach((answer) => {
  answer.addEventListener('click', handleAnswerClick);
});

const isAnswerCorrect = (number) => currentQuestion.answers[number].isCorrect;

function handleAnswerClick(event) {
  const selectedAnswer = event.target;
  const selectedAnswerNumber = Number(selectedAnswer.dataset['number']);
  let classForClickedAnswer = 'wrong';
  if (isAnswerCorrect(selectedAnswerNumber)) {
    classForClickedAnswer = 'correct';
    score++;
    document.getElementById('score').innerText = score;
  }

  selectedAnswer.parentElement.classList.add(classForClickedAnswer);

  answers.forEach((answer, index) => {
    if (index !== selectedAnswerNumber) {
      answer.parentElement.classList.add('disabled');
    }
  });

  setTimeout(() => {
    answers.forEach((answer) => {
      answer.parentElement.classList.remove(classForClickedAnswer, 'disabled');
    });
    displayNewQuestion();
  }, 1000);
}

usernameInput.addEventListener('keyup', () => {
  saveScoreBtn.disabled = !usernameInput.value;
});

saveScoreBtn.addEventListener('click', handleSaveScore);

function handleSaveScore(event) {
  event.preventDefault();
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const score = {
    score: localStorage.getItem('latestScore'),
    name: usernameInput.value.trim(),
  };
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5);
  localStorage.setItem('highScores', JSON.stringify(highScores));
  window.location.assign('/');
}
