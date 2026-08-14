const DEFAULT_SETTINGS = {
  enabled: true,
  spellcheckEnabled: true,
  autoFixOnBlur: true,
  fixEllipsis: true,
  fixIpCommas: true,
  capitalizeSentences: true,
  capitalizeNames: true,
  namesList: [
    "Иван", "Мария", "Георги", "Петър", "Стоян", "Никола", "Елена", "Христо",
    "Димитър", "Александър", "София", "Пловдив", "Варна", "Бургас"
  ],
  customRules: []
};

const TOGGLE_IDS = [
  "enabled", "spellcheckEnabled", "autoFixOnBlur",
  "fixEllipsis", "fixIpCommas", "capitalizeSentences", "capitalizeNames"
];

let settings = { ...DEFAULT_SETTINGS };

function save() {
  chrome.storage.sync.set(settings);
}

function renderNames() {
  const container = document.getElementById("namesList");
  container.innerHTML = "";
  settings.namesList.forEach((name, i) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `<span>${name}</span>`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => {
      settings.namesList.splice(i, 1);
      save();
      renderNames();
    });
    chip.appendChild(removeBtn);
    container.appendChild(chip);
  });
}

function renderRules() {
  const container = document.getElementById("customRulesList");
  container.innerHTML = "";
  settings.customRules.forEach((rule, i) => {
    const row = document.createElement("div");
    row.className = "rule-item";
    const text = document.createElement("span");
    text.className = "rule-text";
    text.textContent = `"${rule.find}" → "${rule.replace}"`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => {
      settings.customRules.splice(i, 1);
      save();
      renderRules();
    });
    row.appendChild(text);
    row.appendChild(removeBtn);
    container.appendChild(row);
  });
}

function renderToggles() {
  for (const id of TOGGLE_IDS) {
    document.getElementById(id).checked = !!settings[id];
  }
}

function wireToggles() {
  for (const id of TOGGLE_IDS) {
    document.getElementById(id).addEventListener("change", (e) => {
      settings[id] = e.target.checked;
      save();
    });
  }
}

document.getElementById("addNameBtn").addEventListener("click", () => {
  const input = document.getElementById("newName");
  const val = input.value.trim();
  if (val) {
    settings.namesList.push(val);
    save();
    renderNames();
    input.value = "";
  }
});

document.getElementById("newName").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("addNameBtn").click();
});

document.getElementById("addRuleBtn").addEventListener("click", () => {
  const find = document.getElementById("ruleFind").value.trim();
  const replace = document.getElementById("ruleReplace").value;
  if (find) {
    settings.customRules.push({ find, replace, isRegex: false });
    save();
    renderRules();
    document.getElementById("ruleFind").value = "";
    document.getElementById("ruleReplace").value = "";
  }
});

document.getElementById("fixNowBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  chrome.tabs.sendMessage(tab.id, { type: "APPLY_FIX_TO_ACTIVE" }, (resp) => {
    const btn = document.getElementById("fixNowBtn");
    if (chrome.runtime.lastError) {
      btn.textContent = "Няма достъп до тази страница";
    } else if (resp && resp.ok) {
      btn.textContent = "Готово ✓";
    } else {
      btn.textContent = "Кликни в текстово поле първо";
    }
    setTimeout(() => { btn.textContent = "Поправи текущото поле"; }, 1600);
  });
});

chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
  settings = { ...DEFAULT_SETTINGS, ...stored };
  renderToggles();
  renderNames();
  renderRules();
  wireToggles();
});
