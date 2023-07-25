

// Escucha el evento onUpdated para detectar cambios en las pestañas
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (changeInfo.status === 'complete' && tab.active) {
        chrome.storage.sync.get(['fontFamily', 'fontWeight'], function (data) {
            if (data) {
                applyStylesToActiveTab(data);
            }
        });
    }
});

// Escucha el evento onMessage para recibir mensajes de la página popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'applyStyles') {
        applyStylesToActiveTab(request);
    }
});

// Función para aplicar los estilos en la pestaña activa
function applyStylesToActiveTab(data) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTab = tabs[0];

        chrome.scripting.insertCSS({
            target: { tabId: activeTab.id },
            css: '* { font-family: ' + data.fontFamily + ' !important; font-weight: ' + data.fontWeight + ' !important ; }'
        });
    });
}