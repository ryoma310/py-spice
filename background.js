'use strict';

async function inspect_code(selected_text){
    console.log("[background.js] " + "insepct code!!!");
    console.log("[background.js] " + selected_text);

    let url = new URL(chrome.runtime.getURL('./popup.html'));
    url.searchParams.append('s_text', selected_text);
    console.log("[background.js] " + url.href)
    chrome.windows.create({
        url : url.href,
        focused : true,
        type : "popup"
    });
}

console.log("[background.js] " + "I am background.js");

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'safe-copy',
        title: 'コードを検証してコピー',
        "contexts" : ["selection"]
    });
});

function getSelectedText() {
    return window.getSelection().toString();
}
async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}


chrome.contextMenus.onClicked.addListener(item => {
    getCurrentTab().then(tab => {
        const tabId = tab.id
        
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: getSelectedText,
        }, (selection) => {
            inspect_code(selection[0].result);
        });
    })
});