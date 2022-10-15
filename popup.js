
function receive_inspect_method() {

}
var selected_code_global = '';

function showCopyFeedback(){
    var fbbox = document.createElement("div");
    document.body.appendChild(fbbox);
    fbbox.classList.add("fbbox");
    fbbox.textContent = "Copied!"
    setTimeout(function() {
        fbbox.classList.add("fbbox_active");
        setTimeout(function(){
            fbbox.classList.remove("fbbox_active");
        }, 2000);
    }, 200);
}

window.onload = function () {
    console.log("[popup.js] " + "I am popup.js");
    let url = new URL(window.location.href);
    // let params = url.searchParams;
    selected_code_global = url.searchParams.get("s_text");

    // copy code
    // let code = url.searchParams.get("s_text");
    // navigator.clipboard.writeText(code);
    // showCopyFeedback();

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
}

window.addEventListener('message', async function (e) {
    switch (e.data.action) {
        case "SyncMessage":
            const root = await navigator.storage.getDirectory();
            const rule_handle = await root.getFileHandle("rules.yar", {create: true});
            let rules_str = await (await rule_handle.getFile()).text();
    
            console.log("send rules");
            document.querySelector("iframe").contentWindow.postMessage({
                action: 'SyncMessage',
                message: rules_str
            }, "*", );
            break;

        case "CopyCode":
            navigator.clipboard.writeText(selected_code_global).then(
                ()=>console.log('copy successful'),
                ()=>console.error('user denied, or faild with some error')
            );
            break;

        default:
            break;
    }
    
    console.log("Done!");
            
});
