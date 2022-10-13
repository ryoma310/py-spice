'use strict';

/* turn off debug */
let DEBUG = false
if(!DEBUG){
    var methods = [
      "log", "debug", "warn", "info"
    ];
    for(var i=0; i<methods.length; i++){
      console[methods[i]] = function(){};
    }
}
/* End turn off debug */

async function inspect_code(selected_text){
    console.log("[background.js] " + "insepct code!!!");
    console.log("[background.js] " + selected_text);

    let url = new URL(chrome.runtime.getURL('./popup.html'));
    url.searchParams.append('s_text', selected_text);
    console.log("[background.js] " + url.href)

    chrome.storage.local.get({
        favorite_inspect_window: 'new_tab'
    }, function(items) {
        if (items.favorite_inspect_window == 'new_tab') {
            chrome.tabs.create({url : url.href});
        } else if (items.favorite_inspect_window == 'popup') {
            chrome.windows.create({
                url : url.href,
                focused : true,
                type : "popup"
            });
        }
    });
}

console.log("[background.js] " + "I am background.js");
fetch("./regex_yara.yar")
    .then((response) => response.text())
    .then(async (text) => {
    const root = await navigator.storage.getDirectory();
    const rule_handle = await root.getFileHandle("rules.yar", {create: true});
    const writable = await rule_handle.createWritable();
    await writable.write(text);
    await writable.close();
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'safe-copy',
        title: chrome.i18n.getMessage("background"),
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


chrome.contextMenus.onClicked.addListener((info, tab) => {
    const tabId = tab.id
    
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: getSelectedText,
    }, (selection) => {
        inspect_code(selection[0].result);
    });
});
