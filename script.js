const questions = [
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: 3
  },
  {
    question: "What does CSS stand for?",
    options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Cars SUVs Sailboats"],
    answer: 1
  }
];

let currentIdx = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const scoreText = document.getElementById("score-text");

function loadQuestion() {
  resetState();
  const current = questions[currentIdx];
  questionEl.innerText = `${currentIdx + 1}. ${current.question}`;
  
  current.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => selectOption(btn, index);
    optionsEl.appendChild(btn);
  });
}

function resetState() {
  nextBtn.classList.add("hide");
  optionsEl.innerHTML = "";
}

function selectOption(selectedBtn, selectedIndex) {
  const correctIndex = questions[currentIdx].answer;
  const buttons = optionsEl.querySelectorAll("button");
  
  buttons.forEach(btn => btn.disabled = true);

  if (selectedIndex === correctIndex) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
    buttons[correctIndex].classList.add("correct");
  }
  nextBtn.classList.remove("hide");
}

nextBtn.addEventListener("click", () => {
  currentIdx++;
  if (currentIdx < questions.length) {
    loadQuestion();
  } else {
    quizBox.classList.add("hide");
    resultBox.classList.remove("hide");
    scoreText.innerText = `You scored ${score} out of ${questions.length}!`;
  }
});

loadQuestion();