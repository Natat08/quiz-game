let currentQuestion = {};
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
const maxQuestions = 10;
const maxHighScores = 5;

let questions = [];

const playBtn = document.getElementById('play-btn');
const playAgainBtn = document.getElementById('play-again');
const question = document.getElementById('question');
const answers = Array.from(document.querySelectorAll('.answer-text'));
const usernameInput = document.getElementById('username');
const saveScoreBtn = document.getElementById('save-score');
const highScoresBtn = document.getElementById('high-scores-btn');

playBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

fetch(
  'https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple'
)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then((loadedQuestions) => {
    questions = formatLoadedQuestions(loadedQuestions.results);
  })
  .catch((error) => {
    console.error('There has been a problem with your fetch operation:', error);

    alert('Failed to load questions. Please try again later.');
  });

function formatLoadedQuestions(loadedQuestions) {
  const formattedQuestions = loadedQuestions.map((loadedQuestion) => {
    const formattedQuestion = {
      question: loadedQuestion.question,
      answers: [],
    };
    const loadedAnswers = [
      ...loadedQuestion.incorrect_answers,
      loadedQuestion.correct_answer,
    ].sort(() => Math.random() - 0.5);
    loadedAnswers.forEach((loadedAnswer) => {
      const answer = {
        text: loadedAnswer,
        isCorrect: loadedAnswer === loadedQuestion.correct_answer,
      };
      formattedQuestion.answers.push(answer);
    });
    return formattedQuestion;
  });
  return formattedQuestions;
}

function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function startGame() {
  console.log(questions);
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
  document.getElementById('score').innerText = score;

  const randomQuestionIndex = Math.floor(
    Math.random() * availableQuestions.length
  );
  currentQuestion = availableQuestions[randomQuestionIndex];
  question.innerHTML = currentQuestion.question;
  answers.forEach((answer, index) => {
    answer.innerHTML = currentQuestion.answers[index].text;
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
  highScores.splice(maxHighScores);
  localStorage.setItem('highScores', JSON.stringify(highScores));
  window.location.assign('/');
}

highScoresBtn.addEventListener('click', handleHighScores);

function handleHighScores() {
  document.getElementById('highScores').classList.remove('hidden');
  const highScoresList = document.getElementById('highScoresList');
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  console.log(!highScores);
  if (highScores.length === 0) {
    highScoresList.innerHTML = '<li><h3>No scores saved</h3></li>';
  } else {
    highScoresList.innerHTML = highScores
      .map(
        (score, index) =>
          `<li><h3>${index + 1}. ${score.name}</h3><p>${score.score}</p></li>`
      )
      .join('');
  }
}
