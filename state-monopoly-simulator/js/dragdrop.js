const classifyGroups = [
  { id: "personnel", title: "Cơ chế quan hệ nhân sự", hint: "Quan hệ quyền lực, thỏa hiệp, phân chia ảnh hưởng giữa nhà nước và các thế lực tư bản độc quyền." },
  { id: "ownership", title: "Sở hữu nhà nước - tư nhân đan xen", hint: "Cổ phần nhà nước, doanh nghiệp nhà nước, công ty hỗn hợp, hợp tác công tư." },
  { id: "budget", title: "Sử dụng ngân sách nhà nước", hint: "Đầu tư công, cứu trợ, đặt hàng, mua sắm công, gánh chịu rủi ro lớn." },
  { id: "regulation", title: "Điều tiết kinh tế", hint: "Thuế, lãi suất, trợ cấp, trợ giá, bảo hộ, kiểm soát thị trường." },
  { id: "international", title: "Mở rộng quốc tế", hint: "Viện trợ, hợp tác kinh tế, dự án ở nước ngoài, tập đoàn xuyên quốc gia." }
];

const classifyCards = [
  { id: "card-stock", text: "Nhà nước mua cổ phần doanh nghiệp", group: "ownership" },
  { id: "card-ppp", text: "Mô hình hợp tác công tư trong dự án hạ tầng", group: "ownership" },
  { id: "card-subsidy", text: "Trợ cấp cho tập đoàn lớn trong khủng hoảng", group: "budget" },
  { id: "card-tax", text: "Ưu đãi thuế cho doanh nghiệp quy mô lớn", group: "regulation" },
  { id: "card-procurement", text: "Ký hợp đồng công quy mô lớn với một tập đoàn", group: "budget" },
  { id: "card-plural", text: "Cơ chế thỏa hiệp giữa nhiều nhóm tư bản độc quyền", group: "personnel" },
  { id: "card-aid", text: "Dự án viện trợ gắn với hàng hóa và chuyên gia của nước viện trợ", group: "international" },
  { id: "card-private", text: "Doanh nghiệp tư nhân tham gia công ty có vốn nhà nước", group: "ownership" },
  { id: "card-rate", text: "Điều chỉnh lãi suất để ổn định kinh tế vĩ mô", group: "regulation" },
  { id: "card-reserve", text: "Sử dụng dự trữ quốc gia trong tình huống đặc biệt", group: "budget" }
];

let draggedId = null;
let selectedCardId = null;

function renderClassify() {
  const bank = document.querySelector("#dragBank");
  const grid = document.querySelector("#dropGrid");
  if (!bank || !grid) return;

  bank.innerHTML = classifyCards.map((card) => `
    <button class="drag-card" draggable="true" id="${card.id}" data-group="${card.group}">${card.text}</button>
  `).join("");

  grid.innerHTML = classifyGroups.map((group) => `
    <section class="drop-zone" data-group="${group.id}">
      <h2>${group.title}</h2>
      <p>${group.hint}</p>
      <div class="drop-items"></div>
    </section>
  `).join("");

  bindDragEvents();
}

function bindDragEvents() {
  document.querySelectorAll(".drag-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".drag-card").forEach((item) => item.classList.remove("selected"));
      selectedCardId = card.id;
      card.classList.add("selected");
    });
    card.addEventListener("dragstart", () => {
      draggedId = card.id;
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      draggedId = null;
    });
  });

  document.querySelectorAll(".drop-zone, .drag-bank").forEach((zone) => {
    zone.addEventListener("click", () => {
      if (!selectedCardId) return;
      const card = document.getElementById(selectedCardId);
      if (!card) return;
      const target = zone.classList.contains("drop-zone") ? zone.querySelector(".drop-items") : zone;
      target.appendChild(card);
      card.classList.remove("selected");
      selectedCardId = null;
    });
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("over"));
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("over");
      const card = document.getElementById(draggedId);
      if (!card) return;
      const target = zone.classList.contains("drop-zone") ? zone.querySelector(".drop-items") : zone;
      target.appendChild(card);
    });
  });
}

function checkClassify() {
  let placed = 0;
  let correct = 0;
  document.querySelectorAll(".drop-zone").forEach((zone) => {
    const group = zone.dataset.group;
    zone.querySelectorAll(".drag-card").forEach((card) => {
      placed += 1;
      const ok = card.dataset.group === group;
      if (ok) correct += 1;
      card.classList.toggle("correct", ok);
      card.classList.toggle("incorrect", !ok);
    });
  });

  const feedback = document.querySelector("#classifyFeedback");
  feedback.hidden = false;
  feedback.textContent = placed < classifyCards.length
    ? `Bạn đã xếp ${placed}/${classifyCards.length} thẻ. Hãy kéo đủ thẻ rồi kiểm tra lại. Hiện đúng ${correct}/${classifyCards.length}.`
    : `Kết quả: đúng ${correct}/${classifyCards.length}. ${correct >= 8 ? "Rất ổn để dùng khi thuyết trình." : "Nên xem lại phần cơ sở lý luận và thử lại."}`;
}

function resetClassify() {
  selectedCardId = null;
  renderClassify();
  const feedback = document.querySelector("#classifyFeedback");
  feedback.hidden = true;
  feedback.textContent = "";
}

document.querySelector("#checkClassify")?.addEventListener("click", checkClassify);
document.querySelector("#resetClassify")?.addEventListener("click", resetClassify);
renderClassify();
