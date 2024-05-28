let currentQuestion = {};
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

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
const nextBtn = document.getElementById('next-button');
const question = document.getElementById('question');
const answers = Array.from(document.getElementsByName('answer'));

playBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', handleNextButtonClick);

function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions]; //copy questions
  document.getElementById('game').classList.remove('hidden');

  renderNewQuestion();
}

function renderNewQuestion() {
  questionCounter++;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;
  currentQuestion.answers.forEach((answer, index) => {
    const labelElement = document.getElementById(`label${index}`);
    //to save span inside label
    while (
      labelElement.lastChild &&
      labelElement.lastChild.nodeType === Node.TEXT_NODE
    ) {
      labelElement.removeChild(labelElement.lastChild);
    }
    const newAnswer = document.createTextNode(answer.text);
    labelElement.appendChild(newAnswer);
    document.getElementById(`answer${index}`).checked = false;
  });
  availableQuestions.splice(questionIndex, 1);
}

function getSelectedOption() {
  for (const answer of answers) {
    if (answer.checked) {
      return parseInt(answer.value);
    }
  }
  return -1; // No option selected
}

function handleNextButtonClick() {
  const selectedOption = getSelectedOption();
  if (selectedOption !== -1) {
    if (currentQuestion.answers[selectedOption].isCorrect) {
      score++;
    }
    questionCounter++;
    if (availableQuestions.length > 0) {
      renderNewQuestion();
      removeColor();
    } else {
      document.getElementById(
        'quiz-container'
      ).innerHTML = `<h2>You scored ${score} out of ${questions.length}!</h2>`;
    }
  } else {
    const messageSelectOption = document.createElement('p');
    messageSelectOption.innerHTML = 'Please select an option!';
    messageSelectOption.classList.add('message');
    document.getElementById('quiz-container').appendChild(messageSelectOption);
    setTimeout(() => {
      messageSelectOption.remove();
    }, 2000);
  }
}

answers.forEach((answer) => {
  answer.addEventListener('click', handleRadioButtonClick);
});

function handleRadioButtonClick(event) {
  removeColor();
  const selectedChoice = event.target.value;
  if (currentQuestion.answers[selectedChoice].isCorrect) {
    document.getElementById(`label${selectedChoice}`).classList.add('correct');
  } else {
    document.getElementById(`label${selectedChoice}`).classList.add('wrong');
  }
}

function removeColor() {
  Array.from(document.getElementsByTagName('label')).forEach((label) => {
    label.classList.remove('wrong', 'correct');
  });
}
