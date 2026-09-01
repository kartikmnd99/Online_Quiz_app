const questions = [
  {
    question: "What is the primary color used on GitHub?",
    options: ["<i class='fas fa-code-branch'></i> Blue", "<i class='fas fa-book'></i> Purple", "<i class='fas fa-paint-brush'></i> Green", "<i class='fas fa-code'></i> Yellow"],
    answer: 2
  },
  {
    question: "Which of these is NOT a frontend framework?",
    options: ["<i class='fab fa-react'></i> React", "<i class='fab fa-angular'></i> Angular", "<i class='fab fa-node'></i> Node.js", "<i class='fab fa-vuejs'></i> Vue.js"],
    answer: 2
  }
];

let currentIdx = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const currentScoreEl = document.getElementById("current-score");
const totalQuestionsEl = document.getElementById("total-questions");
const finalScoreTextEl = document.getElementById("final-score-text");

function loadQuestion() {
  resetState();
  
  const current = questions[currentIdx];
  // Add fade effect for next question
  questionEl.classList.add("fade");
  questionEl.innerHTML = current.question; // changed to innerHTML to support possible tags/br
  
  current.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.innerHTML = opt; // changed to innerHTML to render icons
    btn.onclick = () => selectOption(btn, index);
    optionsEl.appendChild(btn);
  });
  
  totalQuestionsEl.innerText = questions.length;
}

function resetState() {
  nextBtn.classList.add("hide");
  optionsEl.innerHTML = "";
  // Remove fade effect after next question loads
  setTimeout(() => questionEl.classList.remove("fade"), 400);
}

function selectOption(selectedBtn, selectedIndex) {
  const correctIndex = questions[currentIdx].answer;
  const buttons = optionsEl.querySelectorAll("button");
  
  buttons.forEach(btn => btn.disabled = true);

  if (selectedIndex === correctIndex) {
    selectedBtn.classList.add("correct");
    selectedBtn.innerHTML += " <i class='fas fa-check-circle'></i>";
    score++;
    currentScoreEl.innerText = score;
  } else {
    selectedBtn.classList.add("incorrect");
    selectedBtn.innerHTML += " <i class='fas fa-times-circle'></i>";
    buttons[correctIndex].classList.add("correct");
    buttons[correctIndex].innerHTML += " <i class='fas fa-check-circle'></i>";
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
    finalScoreTextEl.innerText = `${score} / ${questions.length}`;
  }
});

// Start the quiz
loadQuestion();