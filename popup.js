
function receive_inspect_method() {

}

window.onload = function () {
    console.log("[popup.js] " + "I am popup.js");
    let url = new URL(window.location.href);
    // let params = url.searchParams;

    // receive parameters stored in chrome storage
    const inspect_method_promise = new Promise((resolve, reject) => {
        chrome.storage.local.get({
            favorite_inspect_method: 'yara'
        }, function(items) {
            resolve(items.favorite_inspect_method);
        })
    })

    inspect_method_promise.then((value) => {
        console.log("[popup.js] then: " + value)

        url.pathname = "insandbox.html"

        let language = chrome.i18n.getMessage("language");
        console.log(language);

        // add search parameters for inspect method
        url.searchParams.append('inspect_method', value);
        url.searchParams.append("language", language);

        let myIframe = document.getElementById("iframe");

        console.log("[popup.js] " + url.href);
        myIframe.src = url.href
    })

    // receive parameters stored in chrome storage
    // var inspect_method = 'inspect'
    // chrome.storage.local.get({
    //     favorite_inspect_method: 'yara'
    // }, function(items) {
    //     inspect_method = items.favorite_inspect_method;
    // });


    // url.pathname = "insandbox.html"

    // let myIframe = document.getElementById("iframe");
    
    // console.log("[popup.js] " + url.href);
    // myIframe.src = url.href;
}

window.addEventListener('message', async function (e) {
    const root = await navigator.storage.getDirectory();
    const rule_handle = await root.getFileHandle("rules.yar", {create: true});
    let rules_str = await (await rule_handle.getFile()).text();

    console.log("send rules");
    document.querySelector("iframe").contentWindow.postMessage({
        action: 'SyncMessage',
        message: rules_str
    }, "*", );
    
    console.log("Done!");
            
});