const MISSION_KEY = "stateMonopolySimulation";

function missionClamp(value) {
  return Math.max(0, Math.min(100, value));
}

function missionLoad() {
  const saved = localStorage.getItem(MISSION_KEY);
  if (!saved) return { index: 0, stats: { ...INITIAL_STATS }, decisions: [] };
  try {
    return JSON.parse(saved);
  } catch {
    return { index: 0, stats: { ...INITIAL_STATS }, decisions: [] };
  }
}

function missionSave(state) {
  localStorage.setItem(MISSION_KEY, JSON.stringify(state));
}

function mood(value, goodLabel, badLabel) {
  if (value >= 60) return goodLabel;
  if (value <= 40) return badLabel;
  return "Theo dõi";
}

function renderMissionStats(stats) {
  const target = document.querySelector("#missionStats");
  if (!target) return;
  target.innerHTML = Object.entries(STAT_LABELS).map(([key, label]) => {
    const value = missionClamp(stats[key] ?? 50);
    return `
      <div class="stat-row">
        <div class="stat-meta"><span>${label}</span><strong>${value}</strong></div>
        <div class="bar"><span style="width:${value}%"></span></div>
      </div>
    `;
  }).join("");
}

function applyMissionChoice(state, scenario, choice) {
  const stats = { ...state.stats };
  Object.entries(choice.effects).forEach(([key, value]) => {
    stats[key] = missionClamp((stats[key] ?? 50) + value);
  });
  return {
    index: state.index + 1,
    stats,
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

function renderMission() {
  const title = document.querySelector("#missionTitle");
  if (!title) return;

  const state = missionLoad();
  const step = document.querySelector("#missionStep");
  const brief = document.querySelector("#missionBrief");
  const choices = document.querySelector("#missionChoices");
  const feedback = document.querySelector("#missionFeedback");
  const next = document.querySelector("#missionNext");
  const corpMood = document.querySelector("#corpMood");
  const smallMood = document.querySelector("#smallMood");
  const workerMood = document.querySelector("#workerMood");

  renderMissionStats(state.stats);
  corpMood.textContent = mood(state.stats.corporatePower, "Gia tăng ảnh hưởng", "Suy giảm ảnh hưởng");
  smallMood.textContent = mood(state.stats.smallBusiness, "Có thêm cơ hội", "Bị chèn ép");
  workerMood.textContent = mood(state.stats.employment, "Việc làm cải thiện", "Việc làm rủi ro");
  next.hidden = true;
  feedback.hidden = true;

  if (state.index >= scenarios.length) {
    step.textContent = "Hoàn thành";
    title.textContent = "Bạn đã hoàn thành phiên điều hành";
    brief.textContent = "Hãy chuyển sang trang Kết quả để xem biểu đồ và nhận xét tổng hợp.";
    choices.innerHTML = "";
    next.hidden = true;
    return;
  }

  const scenario = scenarios[state.index];
  step.textContent = `Hồ sơ ${state.index + 1}/${scenarios.length}`;
  title.textContent = scenario.title;
  brief.textContent = scenario.description;
  choices.innerHTML = scenario.choices.map((choice, index) => `
    <button class="policy-card" data-choice="${index}">
      <strong>${choice.text}</strong>
      <span>${Object.entries(choice.effects).map(([key, value]) => `${STAT_LABELS[key]} ${value > 0 ? "+" : ""}${value}`).join(" · ")}</span>
    </button>
  `).join("");

  choices.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = scenario.choices[Number(button.dataset.choice)];
      const nextState = applyMissionChoice(missionLoad(), scenario, choice);
      missionSave(nextState);
      feedback.hidden = false;
      feedback.textContent = choice.explanation;
      renderMissionStats(nextState.stats);
      corpMood.textContent = mood(nextState.stats.corporatePower, "Gia tăng ảnh hưởng", "Suy giảm ảnh hưởng");
      smallMood.textContent = mood(nextState.stats.smallBusiness, "Có thêm cơ hội", "Bị chèn ép");
      workerMood.textContent = mood(nextState.stats.employment, "Việc làm cải thiện", "Việc làm rủi ro");
      choices.querySelectorAll("button").forEach((item) => item.disabled = true);
      next.hidden = false;
      next.textContent = nextState.index >= scenarios.length ? "Hoàn thành phiên điều hành" : "Hồ sơ tiếp theo";
      next.onclick = renderMission;
    });
  });
}

document.querySelector("#missionReset")?.addEventListener("click", () => {
  localStorage.removeItem(MISSION_KEY);
  renderMission();
});

renderMission();
