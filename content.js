// I initially explored the LibreTranslate API for implementing the translation feature in my Chrome extension. But it is a paid service.
// As a result, I used dummy text.

// Library Name: LibreTranslate API
// Website: https://portal.libretranslate.com/


const processedMessages = new Set();

async function logMessages(selectedLanguage) {
    if (!selectedLanguage || selectedLanguage === "nothing") {
        return;
    }
    const translateTo = selectedLanguage === "eng" ? "English" :
        selectedLanguage === "bd" ? "Bangla" :
            selectedLanguage === "ind" ? "Hindi" : "";

    let translation = "Translate to " + translateTo;
    const messages = document.querySelectorAll('span[dir="ltr"] > span');

    for (const msg of messages) {
        let text = msg.textContent;
        if (processedMessages.has(text + translateTo)) {
            continue;
        }
        processedMessages.add(text + translateTo);

        let translationDiv = msg.parentNode.querySelector("#translation-div");
        if (translationDiv) {
            translationDiv.remove();
        }
        translationDiv = document.createElement('div');
        translationDiv.id = "translation-div";
        msg.parentNode.appendChild(translationDiv);
        const newSpan = document.createElement('span');
        newSpan.id = "translation-span";
        newSpan.textContent = translation;
        newSpan.style.display = "block";
        newSpan.style.backgroundColor = "lightgray";
        newSpan.style.padding = "5px";
        newSpan.style.color = "black";
        newSpan.style.borderRadius = "4px";
        translationDiv.appendChild(newSpan);
    }
}

function clearProcessedMessages() {
    processedMessages.clear();
}

function setupMutationObserver(selectedLanguage) {
    const targetNode = document.querySelector('div[data-tab="8"]');

    if (targetNode) {
        const config = { childList: true, subtree: true };

        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    logMessages(selectedLanguage);
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    } else {
        console.warn("not found");
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "logMessages") {
        clearProcessedMessages();
        setupMutationObserver(request.selectedLanguage);
    }
    if (request.action === "setTypingLanguage") {
        typingLanguage = request.typingLanguage;
        updateMessageBoxWithLanguage(typingLanguage);
    }
});

let typingLanguage = "en";

function updateMessageBoxWithLanguage(language) {
    if (!language || language === "nothing") {
        return;
    }

    const languageText = language === "eng" ? "Typing in English" :
    language === "bd" ? "Typing in Bangla" :
    language === "ind" ? "Typing in Hindi" : "";

    const main = document.querySelector("#main")

    const messageBox = main.querySelector('div[contenteditable="true"]');
    const editorSpan = messageBox.querySelector('span[data-lexical-text]')
    if (editorSpan) {
        const origMessage = editorSpan.childNodes[0].data;
        const newMessage = languageText;
        editorSpan.childNodes[0].data = newMessage;

    }
}
