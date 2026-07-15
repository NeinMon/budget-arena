const CITY_KEY = "stateMonopolySimulation";
const COINS_PER_ROUND = 6;

const cityZones = {
  bigCorp: {
    label: "Tập đoàn lớn",
    note: "Hỗ trợ doanh nghiệp lớn chỉ trở thành biểu hiện đáng chú ý của quan hệ nhà nước - độc quyền khi nguồn lực công làm tăng vị thế chi phối và sự phụ thuộc chính sách.",
    effects: { corporatePower: 7, marketConcentration: 5, stateBudget: -4, employment: 3, smallBusiness: -3, consumerWelfare: -1 }
  },
  smallBiz: {
    label: "Doanh nghiệp nhỏ",
    note: "Hỗ trợ doanh nghiệp nhỏ giúp cạnh tranh lan tỏa hơn và hạn chế ưu thế tuyệt đối của tập đoàn lớn.",
    effects: { smallBusiness: 6, marketConcentration: -4, corporatePower: -2, stateBudget: -3, employment: 2, consumerWelfare: 2 }
  },
  consumers: {
    label: "Người tiêu dùng",
    note: "Trợ giá và kiểm soát giá có thể tăng phúc lợi xã hội nhưng tiêu tốn ngân sách.",
    effects: { consumerWelfare: 6, stateBudget: -3, marketConcentration: -2, corporatePower: -1, employment: 1 }
  },
  publicInvest: {
    label: "R&D / Hạ tầng",
    note: "Đầu tư công tạo nền tảng dài hạn, nhưng cũng có thể mở cơ hội lợi nhuận cho nhà thầu lớn.",
    effects: { employment: 3, consumerWelfare: 3, smallBusiness: 2, stateBudget: -5, corporatePower: 1 }
  },
  reserve: {
    label: "Điều tiết & dự phòng",
    note: "Điều tiết và dự phòng được hiểu là không chi hết ngay, mà giữ nguồn lực cho kiểm toán, minh bạch và khủng hoảng sau.",
    effects: { stateBudget: 3, corporatePower: -3, marketConcentration: -2, consumerWelfare: 1, smallBusiness: 1 }
  }
};

const metricOrder = [
  "marketConcentration",
  "corporatePower",
  "stateBudget",
  "consumerWelfare",
  "smallBusiness",
  "employment"
];

let selectedCoin = null;

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function loadCity() {
  const saved = localStorage.getItem(CITY_KEY);
  if (!saved) return { index: 0, stats: { ...INITIAL_STATS }, decisions: [] };
  try {
    return JSON.parse(saved);
  } catch {
    return { index: 0, stats: { ...INITIAL_STATS }, decisions: [] };
  }
}

function saveCity(state) {
  localStorage.setItem(CITY_KEY, JSON.stringify(state));
}

function score(stats) {
  const socialGain = (stats.consumerWelfare - 50) * 0.25
    + (stats.smallBusiness - 50) * 0.2
    + (stats.employment - 50) * 0.2
    + (stats.stateBudget - 100) * 0.18;
  const concentrationRisk = Math.max(0, ((stats.marketConcentration + stats.corporatePower) / 2) - 50) * 0.45;
  return clamp(Math.round(50 + socialGain - concentrationRisk));
}

function currentScenario(state) {
  return scenarios[Math.min(state.index, scenarios.length - 1)];
}

function counts() {
  const result = {};
  Object.keys(cityZones).forEach((zone) => {
    result[zone] = document.querySelector(`[data-zone="${zone}"]`)?.querySelectorAll(".coin").length ?? 0;
  });
  return result;
}

function combinedEffects(allocation) {
  const effects = {};
  Object.entries(allocation).forEach(([zone, count]) => {
    Object.entries(cityZones[zone].effects).forEach(([key, value]) => {
      for (let index = 0; index < count; index += 1) {
        const diminishing = [1, 0.75, 0.5, 0.3, 0.15, 0.05][index] ?? 0.05;
        effects[key] = (effects[key] ?? 0) + Math.round(value * diminishing);
      }
    });
  });
  return effects;
}

function topEffects(effects, limit = 3) {
  return Object.entries(effects)
    .filter(([, value]) => value !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, limit)
    .map(([key, value]) => `${STAT_LABELS[key]} ${value > 0 ? "+" : ""}${value}`)
    .join(" | ");
}

function buildPolicyEvent(allocation, effects) {
  if ((allocation.bigCorp ?? 0) >= 4) {
    return "Bản tin: Doanh nghiệp nhỏ yêu cầu công khai điều kiện hỗ trợ vì lo ngại ưu đãi tập trung vào tập đoàn lớn.";
  }
  if ((allocation.reserve ?? 0) >= 3) {
    return "Bản tin: Cơ quan điều tiết công bố kiểm toán và điều kiện minh bạch đối với các gói hỗ trợ.";
  }
  if ((allocation.consumers ?? 0) >= 3) {
    return "Bản tin: Người tiêu dùng giảm áp lực ngắn hạn, nhưng ngân sách cần được theo dõi trong các vòng sau.";
  }
  if ((allocation.publicInvest ?? 0) >= 3) {
    return "Bản tin: Dự án hạ tầng tạo kỳ vọng dài hạn, song cần giám sát nhà thầu để tránh phụ thuộc vào một tập đoàn.";
  }
  if ((allocation.smallBiz ?? 0) >= 3) {
    return "Bản tin: Nhiều doanh nghiệp nhỏ có thêm cơ hội tham gia thị trường và chuỗi cung ứng.";
  }
  if ((effects.stateBudget ?? 0) < -8) {
    return "Bản tin: Áp lực ngân sách tăng, nhóm điều hành cần cân nhắc hiệu quả sử dụng nguồn lực công.";
  }
  return "Bản tin: Chính sách tạo tác động vừa phải, chưa có cú sốc lớn nhưng cần tiếp tục theo dõi các chỉ số.";
}

function buildRoundFeedback(state, allocation, effects, zone) {
  const scenario = currentScenario(state);
  return {
    immediate: topEffects(effects) || "Các chỉ số thay đổi nhẹ, chưa xuất hiện tác động nổi bật.",
    longTerm: cityZones[zone].note,
    theory: scenario.theory || "Tình huống minh họa cách nguồn lực nhà nước, lợi ích xã hội và ảnh hưởng của các tổ chức kinh tế lớn có thể đan xen trong điều tiết kinh tế.",
    event: buildPolicyEvent(allocation, effects)
  };
}

function renderRoundFeedback(feedback) {
  const target = document.querySelector("#roundFeedback");
  if (!target || !feedback) return;
  target.hidden = false;
  target.innerHTML = `
    <article>
      <strong>Tác động tức thời</strong>
      <span>${feedback.immediate}</span>
    </article>
    <article>
      <strong>Tác động dài hạn</strong>
      <span>${feedback.longTerm}</span>
    </article>
    <article>
      <strong>Liên hệ bài học</strong>
      <span>${feedback.theory}</span>
    </article>
    <article class="news">
      <strong>Bản tin kinh tế</strong>
      <span>${feedback.event}</span>
    </article>
  `;
}

function updateScenarioVisual(scenario, index) {
  const image = document.querySelector("#scenarioImage");
  const title = document.querySelector("#scenarioTitle");
  const round = document.querySelector("#scenarioRound");
  const status = document.querySelector("#scenarioStatus");
  if (!image || !scenario) return;
  image.classList.add("scenario-image-changing");
  setTimeout(() => {
    image.src = scenario.image || "assets/images/round-1-bank.webp";
    image.alt = scenario.alt || scenario.title;
    if (title) title.textContent = scenario.title;
    if (round) round.textContent = `Vòng ${index + 1}/${scenarios.length}`;
    image.classList.remove("scenario-image-changing");
  }, 180);
  if (status) status.className = "scenario-status";
}

function updateScenarioMood(stats) {
  const status = document.querySelector("#scenarioStatus");
  if (!status) return;
  status.className = "scenario-status";
  const influence = ((stats.corporatePower ?? 50) + (stats.marketConcentration ?? 50)) / 2;
  if (influence >= 70) {
    status.classList.add("corporate");
  } else if ((stats.consumerWelfare ?? 50) <= 35 || (stats.employment ?? 50) <= 35) {
    status.classList.add("warning");
  } else {
    status.classList.add("success");
  }
}

function previewStats(baseStats, allocation = counts()) {
  const effects = combinedEffects(allocation);
  const next = { ...baseStats };
  Object.entries(effects).forEach(([key, value]) => {
    next[key] = clamp((next[key] ?? 50) + value);
  });
  return { next, effects };
}

function renderMetrics(baseStats, allocation = counts()) {
  const target = document.querySelector("#cityMetrics");
  if (!target) return;
  const { next, effects } = previewStats(baseStats, allocation);
  target.innerHTML = metricOrder.map((key) => {
    const current = baseStats[key] ?? 50;
    const projected = next[key] ?? current;
    const delta = effects[key] ?? 0;
  const stress = (["marketConcentration", "corporatePower"].includes(key) && projected >= 70) || projected <= 25;
    return `
      <div class="city-metric ${stress ? "stress" : ""}">
        <div>
          <span>${STAT_LABELS[key]}</span>
          <strong>${current}</strong>
        </div>
        <div class="city-meter"><i style="width:${projected}%"></i></div>
        <em class="${delta >= 0 ? "up" : "down"}">${delta > 0 ? "+" : ""}${delta}</em>
      </div>
    `;
  }).join("");
  const cityScore = document.querySelector("#cityScore");
  if (cityScore) cityScore.textContent = score(next);
}

function renderCoins() {
  const bank = document.querySelector("#coinBank");
  if (!bank) return;
  bank.innerHTML = Array.from({ length: COINS_PER_ROUND }, (_, index) => (
    `<button class="coin" draggable="true" data-coin="${index}" title="Ngân sách">$</button>`
  )).join("");
  bindCoins();
  updateBudgetLeft();
}

function bindCoins() {
  document.querySelectorAll(".coin").forEach((coin) => {
    coin.addEventListener("click", (event) => {
      event.stopPropagation();
      document.querySelectorAll(".coin").forEach((item) => item.classList.remove("selected"));
      selectedCoin = coin;
      coin.classList.add("selected");
    });
    coin.addEventListener("dragstart", () => {
      selectedCoin = coin;
      coin.classList.add("selected");
    });
    coin.addEventListener("dragend", () => coin.classList.remove("selected"));
  });

  document.querySelectorAll(".district, #coinBank").forEach((target) => {
    target.addEventListener("dragover", (event) => {
      event.preventDefault();
      target.classList.add("over");
    });
    target.addEventListener("dragleave", () => target.classList.remove("over"));
    target.addEventListener("drop", (event) => {
      event.preventDefault();
      target.classList.remove("over");
      placeCoin(target);
    });
    target.addEventListener("click", () => placeCoin(target));
  });
}

function placeCoin(target) {
  if (!selectedCoin) return;
  const destination = target.classList.contains("district")
    ? target.querySelector(".district-coins")
    : target;
  destination.appendChild(selectedCoin);
  selectedCoin.classList.remove("selected");
  selectedCoin = null;
  pulse(target);
  updateBudgetLeft();
  renderMetrics(loadCity().stats);
}

function updateBudgetLeft() {
  const left = document.querySelector("#coinBank")?.querySelectorAll(".coin").length ?? 0;
  const label = document.querySelector("#budgetLeft");
  if (label) label.textContent = left;
}

function pulse(target) {
  if (!target.classList?.contains("district")) return;
  target.classList.add("pulse");
  setTimeout(() => target.classList.remove("pulse"), 420);
}

function resetRoundCoins() {
  document.querySelectorAll(".district-coins").forEach((zone) => zone.innerHTML = "");
  renderCoins();
}

function renderRound() {
  const state = loadCity();
  const title = document.querySelector("#cityTitle");
  if (!title) return;
  const round = document.querySelector("#cityRound");
  const brief = document.querySelector("#cityBrief");
  const message = document.querySelector("#cityMessage");
  const run = document.querySelector("#runPolicy");
  const feedback = document.querySelector("#roundFeedback");

  renderMetrics(state.stats, {});
  if (run) {
    run.textContent = "Xác nhận chính sách";
    run.disabled = false;
  }
  if (feedback) {
    feedback.hidden = true;
    feedback.innerHTML = "";
  }
  selectedCoin = null;
  if (state.index >= scenarios.length) {
    round.textContent = "Hoàn thành";
    title.textContent = "Thành phố đã qua 5 vòng khủng hoảng";
    brief.textContent = "Mở trang Kết quả để xem báo cáo cuối phiên.";
    message.textContent = "Bạn có thể chơi lại hoặc xem báo cáo biểu đồ.";
    run.disabled = true;
    document.querySelector("#coinBank").innerHTML = "";
    document.querySelector("#budgetLeft").textContent = "0";
    document.querySelectorAll(".district-coins").forEach((zone) => zone.innerHTML = "");
    return;
  }

  const scenario = currentScenario(state);
  updateScenarioVisual(scenario, state.index);
  round.textContent = `Vòng ${state.index + 1}/${scenarios.length}`;
  title.textContent = scenario.title;
  brief.textContent = scenario.description;
  message.textContent = "Phân bổ ngân sách vào các khu vực, sau đó bấm Xác nhận chính sách.";
  run.disabled = false;
  resetRoundCoins();
}

function dominantZone(allocation) {
  const [zone] = Object.entries(allocation).sort((a, b) => b[1] - a[1])[0] || ["reserve"];
  return zone;
}

function runPolicy() {
  const state = loadCity();
  if (state.index >= scenarios.length) return;
  const run = document.querySelector("#runPolicy");
  const allocation = counts();
  const spent = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  const message = document.querySelector("#cityMessage");
  if (!spent) {
    message.textContent = "Bạn cần phân bổ ít nhất một đồng ngân sách trước khi xác nhận chính sách.";
    return;
  }
  if (run) run.disabled = true;

  const { next, effects } = previewStats(state.stats, allocation);
  const zone = dominantZone(allocation);
  const feedback = buildRoundFeedback(state, allocation, effects, zone);
  const allocationText = Object.entries(allocation)
    .filter(([, value]) => value)
    .map(([key, value]) => `${cityZones[key].label}: ${value}`)
    .join(", ");

  const nextState = {
    index: state.index + 1,
    stats: next,
    decisions: [...state.decisions, {
      scenario: currentScenario(state).title,
      choice: `Phân bổ ngân sách (${allocationText})`,
      explanation: `${feedback.immediate}. ${feedback.longTerm}`,
      allocation,
      before: state.stats,
      after: next,
      effects,
      feedback
    }]
  };

  saveCity(nextState);
  message.textContent = nextState.index >= scenarios.length
    ? "Đã hoàn thành 5 vòng. Đang mở báo cáo kết quả..."
    : "Đã xác nhận chính sách. Hệ thống sẽ tự chuyển sang vòng tiếp theo.";
  renderRoundFeedback(feedback);
  renderMetrics(nextState.stats, {});
  updateScenarioMood(nextState.stats);
  flashMap(effects);
  if (run) {
    run.disabled = true;
    run.textContent = nextState.index >= scenarios.length ? "Đang mở kết quả..." : "Đang chuyển vòng...";
  }
  setTimeout(() => {
    if (nextState.index >= scenarios.length) {
      location.href = "result.html";
      return;
    }
    renderRound();
  }, 2200);
}

function flashMap(effects) {
  const map = document.querySelector("#cityMap");
  if (!map) return;
  Object.entries(effects).slice(0, 5).forEach(([key, value], index) => {
    const badge = document.createElement("span");
    badge.className = `impact-badge ${value >= 0 ? "good" : "bad"}`;
    badge.textContent = `${STAT_LABELS[key]} ${value > 0 ? "+" : ""}${value}`;
    badge.style.left = `${12 + index * 17}%`;
    badge.style.top = `${18 + (index % 2) * 54}%`;
    map.appendChild(badge);
    setTimeout(() => badge.remove(), 1300);
  });
}

function recallBudget() {
  const bank = document.querySelector("#coinBank");
  document.querySelectorAll(".coin").forEach((coin) => bank.appendChild(coin));
  selectedCoin = null;
  document.querySelectorAll(".coin").forEach((coin) => coin.classList.remove("selected"));
  updateBudgetLeft();
  renderMetrics(loadCity().stats);
}

document.querySelector("#runPolicy")?.addEventListener("click", runPolicy);
document.querySelector("#recallBudget")?.addEventListener("click", recallBudget);
document.querySelector("#resetCity")?.addEventListener("click", () => {
  localStorage.removeItem(CITY_KEY);
  renderRound();
});
document.querySelector("#openTheory")?.addEventListener("click", () => {
  document.querySelector("#theoryDialog")?.showModal();
});

renderRound();
