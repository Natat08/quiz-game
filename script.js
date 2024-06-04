let currentQuestion = {};
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
const maxQuestions = 10;
const maxHighScores = 5;

let questions = [];

const question = document.getElementById('question');
const playBtn = document.getElementById('play-btn');
const answers = Array.from(document.querySelectorAll('.answer-text'));
const usernameInput = document.getElementById('username');
const saveScoreBtn = document.getElementById('save-score');
const highScoresBtn = document.getElementById('high-scores-btn');
const settingForm = document.querySelector('.settings-form');
const categoryRadios = settingForm.elements['category'];
const difficultyRadios = settingForm.elements['difficulty'];

categoryRadios.forEach((radio) => {
  radio.addEventListener('change', checkRadios);
});
difficultyRadios.forEach((radio) => {
  radio.addEventListener('change', checkRadios);
});

playBtn.addEventListener('click', startGame);

function checkRadios() {
  const isCategorySelected = [...categoryRadios].some((radio) => radio.checked);
  const isDifficultySelected = [...difficultyRadios].some(
    (radio) => radio.checked
  );
  playBtn.disabled = !(isCategorySelected && isDifficultySelected);
}

function getSettings() {
  const selectedCategory = document.querySelector(
    'input[name="category"]:checked'
  ).value;
  const selectedDifficulty = document.querySelector(
    'input[name="difficulty"]:checked'
  ).value;
  return { selectedCategory, selectedDifficulty };
}

function createTriviaAPIUrl(category, difficulty) {
  const baseUrl = 'https://opentdb.com/api.php';
  const params = new URLSearchParams({
    amount: maxQuestions,
    category,
    difficulty,
    type: 'multiple',
  });
  return `${baseUrl}?${params.toString()}`;
}

function fetchQuestions() {
  const { selectedCategory, selectedDifficulty } = getSettings();
  const fetchUrl = createTriviaAPIUrl(selectedCategory, selectedDifficulty);

  return fetch(fetchUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((loadedQuestions) => {
      questions = formatLoadedQuestions(loadedQuestions.results);
    });
}

function startGame(event) {
  event.preventDefault();
  fetchQuestions()
    .then(() => {
      questionCounter = 0;
      score = 0;
      availableQuestions = [...questions];
      document.getElementById('game').classList.remove('hidden');
      window.location.assign('#game');
      document.getElementById('result').classList.add('hidden');
      displayNewQuestion();
    })
    .catch((error) => {
      console.error(error);
      alert('Failed to load questions. Please try again later.');
    });
}

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

function displayNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= maxQuestions) {
    localStorage.setItem('latestScore', score);

    document.getElementById('result').classList.remove('hidden');
    document.querySelector('.final-score').innerText =
      localStorage.getItem('latestScore');
    window.location.assign('#result');
    return;
  }

  questionCounter++;

  document.getElementById(
    'question-counter'
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
      if (isAnswerCorrect(index)) {
        answer.parentElement.classList.add('correct-answer');
      }
    }
  });

  setTimeout(() => {
    answers.forEach((answer) => {
      answer.parentElement.classList.remove(
        classForClickedAnswer,
        'disabled',
        'correct-answer'
      );
    });
    displayNewQuestion();
  }, 1500);
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
  window.location.assign('#home');
}

highScoresBtn.addEventListener('click', handleHighScores);

function handleHighScores() {
  document.getElementById('highScores').classList.remove('hidden');
  const highScoresList = document.getElementById('high-scores-list');
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  if (highScores.length === 0) {
    const listItem = document.createElement('li');
    listItem.classList.add('center');
    const heading = document.createElement('h3');
    heading.textContent = 'No scores saved';
    listItem.appendChild(heading);
    highScoresList.appendChild(listItem);
  } else {
    highScoresList.innerHTML = highScores
      .map(
        (score, index) =>
          `<li><h3>${index + 1}. ${score.name}</h3><p>${score.score}</p></li>`
      )
      .join('');
  }
}
