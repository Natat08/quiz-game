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
    question: 'Which planet is known as the Red Planetaaaaaaaaaaaaaaaa?',
    answers: [
      { text: 'Earth', isCorrect: false },
      { text: 'Mars', isCorrect: true },
      { text: 'Jupiter', isCorrect: false },
      { text: 'Venus', isCorrect: false },
    ],
  },
  {
    question: 'Who wrote "Romeo and Julietaaaaaaaaaaaaaa"?',
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
    document.getElementById(
      'game'
    ).innerHTML = `<h3>You scored ${score} out of ${questions.length}!</h3>`;
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
  availableQuestions.splice(randomQuestionIndex, 1); //remove taken question from array
}

answers.forEach((answer) => {
  answer.addEventListener('click', handleAnswerClick);
});

const isAnswerCorrect = (number) => currentQuestion.answers[number].isCorrect;

function handleAnswerClick(event) {
  //finding a selected answer
  const selectedAnswer = event.target;
  const selectedAnswerNumber = Number(selectedAnswer.dataset['number']);
  //applying a class and increasing score according to correctness
  let classForClickedAnswer = 'wrong';
  if (isAnswerCorrect(selectedAnswerNumber)) {
    classForClickedAnswer = 'correct';
    score++;
    document.getElementById('score').innerText = score;
  }

  selectedAnswer.parentElement.classList.add(classForClickedAnswer);
  //applying class "disabled" to unselected answer
  answers.forEach((answer, index) => {
    if (index !== selectedAnswerNumber) {
      answer.parentElement.classList.add('disabled');
    }
  });
  //removing all classes and displaying a new question after 1.5 sec
  setTimeout(() => {
    answers.forEach((answer) => {
      answer.parentElement.classList.remove(classForClickedAnswer, 'disabled');
    });
    displayNewQuestion();
  }, 1500);
}
