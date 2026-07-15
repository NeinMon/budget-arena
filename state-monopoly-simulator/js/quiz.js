let quizIndex = 0;
let quizScore = 0;
let answered = false;

function renderQuiz() {
  const progress = document.querySelector("#quizProgress");
  const question = document.querySelector("#quizQuestion");
  const options = document.querySelector("#quizOptions");
  const feedback = document.querySelector("#quizFeedback");
  const next = document.querySelector("#nextQuestion");
  if (!question) return;

  answered = false;
  feedback.hidden = true;

  if (quizIndex >= quizQuestions.length) {
    progress.textContent = "Hoàn thành";
    question.textContent = `Bạn đạt ${quizScore}/${quizQuestions.length} câu đúng`;
    options.innerHTML = `<p class="muted">Quiz giúp củng cố lại các khái niệm xuất hiện trong mô phỏng. Điểm từ 6/8 trở lên là khá ổn để thuyết trình.</p>`;
    next.textContent = "Xem kết quả mô phỏng";
    next.onclick = () => location.href = "result.html";
    return;
  }

  const item = quizQuestions[quizIndex];
  progress.textContent = `Câu ${quizIndex + 1}/${quizQuestions.length}`;
  question.textContent = item.question;
  next.textContent = "Câu tiếp theo";
  next.onclick = nextQuestion;
  options.innerHTML = item.options.map((option, index) => `
    <button class="choice-btn" data-answer="${index}">${option}</button>
  `).join("");

  options.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const selected = Number(button.dataset.answer);
      const correct = selected === item.answer;
      if (correct) quizScore += 1;
      options.querySelectorAll("button").forEach((btn) => {
        btn.disabled = true;
        const idx = Number(btn.dataset.answer);
        if (idx === item.answer) btn.classList.add("correct");
        if (idx === selected && !correct) btn.classList.add("incorrect");
      });
      feedback.textContent = `${correct ? "Đúng." : "Chưa đúng."} ${item.explanation}`;
      feedback.hidden = false;
    });
  });
}

function nextQuestion() {
  if (!answered && quizIndex < quizQuestions.length) {
    const feedback = document.querySelector("#quizFeedback");
    if (feedback) {
      feedback.textContent = "Hãy chọn một đáp án trước khi chuyển sang câu tiếp theo.";
      feedback.hidden = false;
    }
    return;
  }
  quizIndex += 1;
  renderQuiz();
}

function restartQuiz() {
  quizIndex = 0;
  quizScore = 0;
  renderQuiz();
}

document.querySelector("#nextQuestion")?.addEventListener("click", nextQuestion);
document.querySelector("#restartQuiz")?.addEventListener("click", restartQuiz);
renderQuiz();
