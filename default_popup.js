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
    
}