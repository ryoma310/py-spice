window.onload = function () {
    const inspect_method_promise = new Promise((resolve, reject) => {
        chrome.storage.local.get({
            favorite_inspect_method: 'yara'
        }, function(items) {
            resolve(items.favorite_inspect_method);
        })
    })

    const span_detect_engine = document.getElementById("detect_engine");
    inspect_method_promise.then((value) => {
        span_detect_engine.innerText = value;
    })
    
    setupI18n()
}

function setupI18n() {
    // console.log("[default_popup.js] setupI18n");
    const i18n_elements = document.getElementsByClassName("i18n-label");

    for (let i = 0; i < i18n_elements.length; i++) {
        // console.log(i18n_elements[i]);
        // console.log(i18n_elements[i].getAttribute('i18n-key'));
        const i18n_key = i18n_elements[i].getAttribute('i18n-key');
        i18n_elements[i].innerHTML = chrome.i18n.getMessage(i18n_key);
    }
}