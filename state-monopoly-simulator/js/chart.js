function loadResultState() {
  const saved = localStorage.getItem("stateMonopolySimulation");
  if (!saved) return { index: 0, stats: { ...INITIAL_STATS }, decisions: [] };
  try {
    return JSON.parse(saved);
  } catch {
    return { index: 0, stats: { ...INITIAL_STATS }, decisions: [] };
  }
}

function resultCode(stats) {
  return `BA-${stats.consumerWelfare ?? 0}-${100 - (stats.marketConcentration ?? 0)}-${stats.employment ?? 0}-${stats.corporatePower ?? 0}`;
}

function profile(stats) {
  const influence = (stats.corporatePower + stats.marketConcentration) / 2;
  const social = (stats.consumerWelfare + stats.smallBusiness + stats.employment) / 3;
  if (influence >= 68 && stats.employment >= 58) {
    return {
      name: "Chính phủ phụ thuộc vào tập đoàn lớn",
      strength: "Ổn định việc làm và xử lý khủng hoảng nhanh trong ngắn hạn.",
      risk: "Ảnh hưởng tập đoàn và mức độ tập trung thị trường tăng, cần đặt điều kiện kiểm soát rõ hơn."
    };
  }
  if (stats.consumerWelfare >= 68 && stats.stateBudget < 55) {
    return {
      name: "Chính phủ định hướng phúc lợi",
      strength: "Người tiêu dùng và ổn định xã hội được ưu tiên rõ rệt.",
      risk: "Ngân sách còn lại chịu áp lực, cần cân đối với đầu tư dài hạn."
    };
  }
  if (stats.smallBusiness >= 65 && stats.marketConcentration <= 48) {
    return {
      name: "Chính phủ ưu tiên cạnh tranh",
      strength: "Doanh nghiệp nhỏ và cạnh tranh thị trường được cải thiện.",
      risk: "Hiệu quả xử lý khủng hoảng lớn có thể chậm nếu thiếu công cụ ổn định ngắn hạn."
    };
  }
  if (stats.employment >= 65 && stats.consumerWelfare >= 60 && stats.stateBudget >= 50) {
    return {
      name: "Chính phủ điều tiết cân bằng",
      strength: "Không có chỉ số xã hội nào rơi quá thấp, ngân sách vẫn còn vùng đệm.",
      risk: "Hiệu quả không quá đột phá, cần tiếp tục theo dõi ảnh hưởng của doanh nghiệp lớn."
    };
  }
  if (social >= 62) {
    return {
      name: "Chính phủ can thiệp mạnh vì xã hội",
      strength: "Phúc lợi, việc làm và sức sống doanh nghiệp nhỏ được bảo vệ tương đối tốt.",
      risk: "Can thiệp nhiều có thể tạo áp lực ngân sách nếu thiếu cơ chế đánh giá hiệu quả."
    };
  }
  return {
    name: "Chính phủ thận trọng với ngân sách",
    strength: "Giữ được một phần nguồn lực công và tránh can thiệp quá mức.",
    risk: "Phúc lợi hoặc việc làm có thể chưa được cải thiện đủ mạnh trong các khủng hoảng."
  };
}

function buildSummary(stats, decisions) {
  if (!decisions.length) {
    return "Bạn chưa hoàn thành game. Hãy quay lại trang Game để xử lý các tình huống trước khi xem kết quả.";
  }
  const ending = profile(stats);
  return `${ending.name}: kết quả này không phải đúng hoặc sai tuyệt đối, mà cho thấy xu hướng điều hành của người chơi qua năm vòng chính sách.`;
}

function learningItems(decisions) {
  const text = decisions.map((item) => `${item.scenario} ${item.choice}`).join(" ").toLowerCase();
  return [
    ["Cứu trợ tổ chức tài chính lớn", text.includes("ngân hàng")],
    ["Quyền lực dữ liệu và hạ tầng công nghệ", text.includes("dữ liệu") || text.includes("công nghệ")],
    ["Điều tiết giá và phúc lợi xã hội", text.includes("năng lượng") || text.includes("người tiêu dùng")],
    ["Doanh nghiệp lớn tác động ngược đến chính sách", text.includes("đóng nhà máy")],
    ["Hợp đồng công, hạ tầng và giám sát", text.includes("hạ tầng") || text.includes("điều tiết")]
  ];
}

function renderLearningCheck(target, decisions) {
  if (!target) return;
  target.innerHTML = `
    <h2>Mục tiêu học tập đã chạm tới</h2>
    <div class="check-grid">
      ${learningItems(decisions).map(([label, done]) => `
        <span class="${done ? "done" : ""}">${done ? "✓" : "•"} ${label}</span>
      `).join("")}
    </div>
  `;
}

function allocationText(allocation = {}) {
  return Object.entries(allocation)
    .filter(([, value]) => value)
    .map(([key, value]) => `${cityZones[key]?.label ?? key}: ${value}`)
    .join(" · ");
}

function totalSpent(decisions) {
  return decisions.reduce((sum, item) => (
    sum + Object.values(item.allocation ?? {}).reduce((inner, value) => inner + value, 0)
  ), 0);
}

function strongestDecision(decisions) {
  if (!decisions.length) return "Chưa có quyết định nào.";
  const ranked = decisions.map((item, index) => {
    const power = Object.values(item.effects ?? {}).reduce((sum, value) => sum + Math.abs(value), 0);
    return { item, index, power };
  }).sort((a, b) => b.power - a.power)[0];
  return `Vòng ${ranked.index + 1}: ${ranked.item.scenario}`;
}

function replayTip(stats) {
  const influence = ((stats.corporatePower ?? 50) + (stats.marketConcentration ?? 50)) / 2;
  if (influence >= 68) return "Gợi ý chơi lại: thử tăng phần điều tiết, chia gói thầu hoặc hỗ trợ doanh nghiệp nhỏ để giảm ảnh hưởng tập đoàn.";
  if ((stats.stateBudget ?? 50) < 45) return "Gợi ý chơi lại: thử giữ thêm dự phòng để giảm áp lực ngân sách.";
  if ((stats.consumerWelfare ?? 50) < 50) return "Gợi ý chơi lại: thử phân bổ nhiều hơn cho người tiêu dùng hoặc dịch vụ công.";
  return "Gợi ý chơi lại: thử thay đổi một vòng để so sánh tác động giữa ổn định ngắn hạn và cạnh tranh dài hạn.";
}

function renderDecisionMap(log, decisions) {
  log.innerHTML = decisions.length
    ? decisions.map((item, index) => `
      <details class="decision-item" ${index === 0 ? "open" : ""}>
        <summary>
          ${scenarios[index]?.image ? `<img class="history-thumb" src="${scenarios[index].image}" alt="${scenarios[index].alt}" loading="lazy">` : ""}
          <strong>Vòng ${index + 1}: ${item.scenario}</strong>
          <span>${allocationText(item.allocation)}</span>
        </summary>
        <p class="muted">Tác động tức thời: ${item.feedback?.immediate ?? "Chỉ số thay đổi theo phân bổ."}</p>
        <p>Tác động dài hạn: ${item.feedback?.longTerm ?? item.explanation}</p>
        <p>Liên hệ lý luận: ${item.feedback?.theory ?? "Nguồn lực nhà nước và quyền lực kinh tế có thể đan xen trong quá trình điều tiết."}</p>
        <p class="newsline">${item.feedback?.event ?? ""}</p>
      </details>
    `).join("")
    : `<div class="decision-item">Chưa có dữ liệu game.</div>`;
}

function renderFallbackStats(canvas, labels, values) {
  canvas.replaceWith(document.createRange().createContextualFragment(`
    <div class="stat-list">
      ${Object.keys(STAT_LABELS).map((key, index) => `
        <div class="stat-row">
          <div class="stat-meta"><span>${labels[index]}</span><strong>${values[index]}</strong></div>
          <div class="bar"><span style="width:${values[index]}%"></span></div>
        </div>
      `).join("")}
    </div>
  `));
}

function renderResult() {
  const summary = document.querySelector("#resultSummary");
  const log = document.querySelector("#decisionLog");
  const canvas = document.querySelector("#resultChart");
  const code = document.querySelector("#resultCode");
  const meta = document.querySelector("#reportMeta");
  const profileCard = document.querySelector("#profileCard");
  const learningCheck = document.querySelector("#learningCheck");
  if (!summary || !log || !canvas) return;

  const state = loadResultState();
  const ending = profile(state.stats);
  summary.textContent = buildSummary(state.stats, state.decisions);
  if (code) code.textContent = resultCode(state.stats);
  if (meta) {
    meta.innerHTML = `
      <span>Ngày chơi: ${new Date().toLocaleDateString("vi-VN")}</span>
      <span>Số vòng: ${state.decisions.length}/${scenarios.length}</span>
      <span>Tổng đồng ngân sách đã điều phối: ${totalSpent(state.decisions)}</span>
      <span>Quyết định tác động mạnh nhất: ${strongestDecision(state.decisions)}</span>
      <span>${replayTip(state.stats)}</span>
    `;
  }
  if (profileCard) {
    profileCard.innerHTML = `
      <strong>${ending.name}</strong>
      <span><b>Ưu điểm:</b> ${ending.strength}</span>
      <span><b>Hạn chế:</b> ${ending.risk}</span>
    `;
  }
  renderLearningCheck(learningCheck, state.decisions);
  renderDecisionMap(log, state.decisions);

  const labels = Object.values(STAT_LABELS);
  const values = Object.keys(STAT_LABELS).map((key) => state.stats[key] ?? 50);
  if (typeof Chart === "undefined") {
    renderFallbackStats(canvas, labels, values);
    return;
  }
  new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Chỉ số sau game",
        data: values,
        backgroundColor: ["#155e75", "#b45309", "#0f766e", "#15803d", "#2563eb", "#7c3aed"]
      }]
    },
    options: {
      responsive: true,
      scales: { y: { min: 0, max: 100 } },
      plugins: { legend: { display: false } }
    }
  });
}

document.querySelector("#printReport")?.addEventListener("click", () => window.print());
renderResult();
