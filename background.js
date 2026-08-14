chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "bg-fix-active-field",
    title: "Поправи текста (правопис, точки, IP, имена)",
    contexts: ["editable"]
  });
});

function sendFixMessage(tab) {
  if (!tab?.id) return;
  chrome.tabs.sendMessage(tab.id, { type: "APPLY_FIX_TO_ACTIVE" }, () => {
    if (chrome.runtime.lastError) {
      console.warn("[BG Spellcheck] could not reach content script:", chrome.runtime.lastError.message);
      chrome.action.setBadgeText({ text: "!", tabId: tab.id });
      chrome.action.setBadgeBackgroundColor({ color: "#c62828", tabId: tab.id });
      chrome.action.setTitle({
        title: "Разширението не откри редактируемо поле на тази страница. Презареди страницата (F5) и опитай пак.",
        tabId: tab.id
      });
      setTimeout(() => chrome.action.setBadgeText({ text: "", tabId: tab.id }), 5000);
    }
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "bg-fix-active-field") sendFixMessage(tab);
});

// Keyboard shortcut - works even in popup-style windows where the toolbar
// icon isn't shown, since commands are global and don't need the icon.
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "fix-active-field") return;
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  sendFixMessage(tab);
});
