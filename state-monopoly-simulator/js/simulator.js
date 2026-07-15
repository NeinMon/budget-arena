const STORAGE_KEY = "stateMonopolySimulation";

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function loadSimulation() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return { index: 0, stats: { ...INITIAL_STATS }, decisions: [] };
  }
  try {
    return JSON.parse(saved);
  } catch {
    return { index: 0, stats: { ...INITIAL_STATS }, decisions: [] };
  }
}

function saveSimulation(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderExplore() {
  const grid = document.querySelector("#exploreGrid");
  if (!grid) return;
  grid.innerHTML = manifestations.map((item, index) => `
    <article class="explore-card">
      <p class="eyebrow">Biểu hiện ${index + 1}</p>
      <strong>${item.title}</strong>
      <span>${item.summary}</span>
      <div class="mini-network">
        ${item.diagram.map((part) => `<span>${part}</span>`).join("")}
      </div>
      <div class="quick-check">
        <strong>Câu hỏi nhanh</strong>
        <p class="muted">${item.check}</p>
        <span>${item.answer}</span>
      </div>
    </article>
  `).join("");
}

function renderStats(stats) {
  const statList = document.querySelector("#statList");
  if (!statList) return;
  statList.innerHTML = Object.entries(STAT_LABELS).map(([key, label]) => {
    const value = clamp(stats[key] ?? 50);
    return `
      <div class="stat-row">
        <div class="stat-meta"><span>${label}</span><strong>${value}</strong></div>
        <div class="bar"><span style="width:${value}%"></span></div>
      </div>
    `;
  }).join("");
}

function applyChoice(state, scenario, choice) {
  const nextStats = { ...state.stats };
  Object.entries(choice.effects).forEach(([key, value]) => {
    nextStats[key] = clamp((nextStats[key] ?? 50) + value);
  });
  return {
    index: state.index + 1,
    stats: nextStats,
    decisions: [
      ...state.decisions,
      {
        scenario: scenario.title,
        choice: choice.text,
        explanation: choice.explanation,
        effects: choice.effects
      }
    ]
  };
}

function renderScenario() {
  const title = document.querySelector("#scenarioTitle");
  if (!title) return;
  const state = loadSimulation();
  const step = document.querySelector("#scenarioStep");
  const description = document.querySelector("#scenarioDescription");
  const choiceList = document.querySelector("#choiceList");
  const feedback = document.querySelector("#choiceFeedback");
  const resultLink = document.querySelector("#resultLink");
  const nextScenario = document.querySelector("#nextScenario");

  renderStats(state.stats);
  if (nextScenario) nextScenario.hidden = true;

  if (state.index >= scenarios.length) {
    step.textContent = "Hoàn thành";
    title.textContent = "Bạn đã xử lý xong 5 tình huống";
    description.textContent = "Hãy xem biểu đồ kết quả để phân tích xu hướng lựa chọn của mình.";
    choiceList.innerHTML = "";
    feedback.hidden = true;
    if (nextScenario) nextScenario.hidden = true;
    resultLink.classList.add("primary");
    return;
  }

  const scenario = scenarios[state.index];
  step.textContent = `Tình huống ${state.index + 1}/${scenarios.length}`;
  title.textContent = scenario.title;
  description.textContent = scenario.description;
  resultLink.classList.remove("primary");
  feedback.hidden = true;
  choiceList.innerHTML = scenario.choices.map((choice, index) => `
    <button class="choice-btn" data-choice="${index}">${choice.text}</button>
  `).join("");

  choiceList.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = scenario.choices[Number(button.dataset.choice)];
      const nextState = applyChoice(loadSimulation(), scenario, choice);
      saveSimulation(nextState);
      feedback.textContent = choice.explanation;
      feedback.hidden = false;
      renderStats(nextState.stats);
      choiceList.querySelectorAll("button").forEach((item) => item.disabled = true);
      if (nextScenario) {
        nextScenario.hidden = false;
        nextScenario.textContent = nextState.index >= scenarios.length ? "Hoàn thành mô phỏng" : "Tình huống tiếp theo";
        nextScenario.onclick = renderScenario;
      }
    });
  });
}

function resetSimulation() {
  localStorage.removeItem(STORAGE_KEY);
  renderScenario();
}

renderExplore();
renderScenario();

const resetButton = document.querySelector("#resetSim");
if (resetButton) resetButton.addEventListener("click", resetSimulation);
