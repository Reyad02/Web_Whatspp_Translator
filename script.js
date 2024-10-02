document.getElementById("languageSelect").addEventListener("change", () => {
    const selectedLanguage = document.getElementById("languageSelect").value;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "logMessages", selectedLanguage: selectedLanguage });
    });
});


document.getElementById("typingLanguageSelect").addEventListener("change", () => {
    const typingLanguage = document.getElementById("typingLanguageSelect").value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "setTypingLanguage", typingLanguage });
    });
});
