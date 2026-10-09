const QUESTIONS = [
  { q: "What does HTML stand for?", options: ["HyperText Markup Language", "High Text Machine Language", "HyperTool Multi Language", "Home Text Markup Level"], answer: 0 },
  { q: "Which language styles web pages?", options: ["Python", "CSS", "SQL", "C#"], answer: 1 },
  { q: "Which keyword declares a constant in JavaScript?", options: ["var", "let", "const", "static"], answer: 2 },
  { q: "What does SQL stand for?", options: ["Simple Query Logic", "Structured Query Language", "Sequential Query List", "Stored Query Language"], answer: 1 },
  { q: "Which HTTP method is normally used to create a resource?", options: ["GET", "DELETE", "PUT", "POST"], answer: 3 },
  { q: "Which of these is a relational database?", options: ["MySQL", "Redis", "Chrome", "Git"], answer: 0 },
  { q: "What does API stand for?", options: ["Applied Program Input", "Application Programming Interface", "Active Page Integration", "Automated Process Instruction"], answer: 1 },
  { q: "Which tool is used for version control?", options: ["Docker", "Postman", "Git", "Swagger"], answer: 2 },
  { q: "What is the result of 2 + '2' in JavaScript?", options: ["4", "22", "NaN", "Error"], answer: 1 },
  { q: "Which HTTP status code means 'Not Found'?", options: ["200", "301", "500", "404"], answer: 3 }
];

const TIME_PER_QUESTION = 15;
const STORAGE_KEY = "quiz-best-score";

const $ = (id) => document.getElementById(id);
const screens = { start: $("start-screen"), quiz: $("quiz-screen"), result: $("result-screen") };

let order = [];
let index = 0;
let score = 0;
let timeLeft = TIME_PER_QUESTION;
let timerId = null;
let answered = false;

function getBest() {
  try { return Number(localStorage.getItem(STORAGE_KEY)) || 0; } catch { return 0; }
}
function saveBest(value) {
  try { localStorage.setItem(STORAGE_KEY, String(value)); } catch { /* storage unavailable */ }
}

function show(name) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startQuiz() {
  order = shuffle(QUESTIONS);
  index = 0;
  score = 0;
  show("quiz");
  showQuestion();
}

function showQuestion() {
  answered = false;
  const item = order[index];

  $("counter").textContent = `Question ${index + 1} of ${order.length}`;
  $("progress").style.width = `${(index / order.length) * 100}%`;
  $("question").textContent = item.q;
  $("feedback").textContent = "";
  $("next-btn").classList.add("hidden");
  $("next-btn").textContent = index === order.length - 1 ? "See result" : "Next";

  const box = $("options");
  box.innerHTML = "";
  item.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", () => choose(i));
    box.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = TIME_PER_QUESTION;
  renderTimer();
  timerId = setInterval(() => {
    timeLeft--;
    renderTimer();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      choose(-1); // time ran out
    }
  }, 1000);
}

function renderTimer() {
  const el = $("timer");
  el.textContent = `${timeLeft}s`;
  el.classList.toggle("low", timeLeft <= 5);
}

function choose(selected) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const correct = order[index].answer;
  const buttons = document.querySelectorAll(".option");
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add("correct");
    if (i === selected && i !== correct) btn.classList.add("wrong");
  });

  if (selected === correct) {
    score++;
    $("feedback").textContent = "Correct!";
  } else if (selected === -1) {
    $("feedback").textContent = "Time is up.";
  } else {
    $("feedback").textContent = "Not quite.";
  }

  $("next-btn").classList.remove("hidden");
  $("next-btn").focus();
}

function nextStep() {
  index++;
  if (index < order.length) showQuestion();
  else finish();
}

function finish() {
  clearInterval(timerId);
  $("progress").style.width = "100%";

  const best = Math.max(getBest(), score);
  saveBest(best);

  $("final-score").textContent = score;
  $("total").textContent = order.length;
  $("best-score-end").textContent = best;

  const ratio = score / order.length;
  $("message").textContent =
    ratio === 1 ? "Perfect score. Well done!" :
    ratio >= 0.7 ? "Great job. You know your basics." :
    ratio >= 0.4 ? "Good effort. Try again to improve." :
    "Keep practising. You will get there.";

  show("result");
}

$("start-btn").addEventListener("click", startQuiz);
$("next-btn").addEventListener("click", nextStep);
$("restart-btn").addEventListener("click", startQuiz);
$("best-score").textContent = getBest();
