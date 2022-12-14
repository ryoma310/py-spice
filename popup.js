
/* turn off debug */
let DEBUG = false;
if(!DEBUG){
    if(!window.console){
      window.console = {};
    }
    var methods = [
      "log", "debug", "warn", "info"
    ];
    methods.forEach(elem => console[elem] = function(){});
}
/* End turn off debug */

function receive_inspect_method() {

}
var selected_code_global = '';
window.onload = function () {
    console.log("[popup.js] " + "I am popup.js");
    let url = new URL(window.location.href);
    // let params = url.searchParams;
    selected_code_global = url.searchParams.get("s_text");

    let code = url.searchParams.get("s_text");

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
    let myIframe = document.getElementById("iframe");
    if (!( e.origin === "null" && e.source === myIframe.contentWindow )){
        console.error("invalid sender");
        return;
    }
    switch (e.data.action) {
        case "SyncMessage":
            const root = await navigator.storage.getDirectory();
            const rule_handle = await root.getFileHandle("rules.yar", {create: false});
            var rules_str = await (await rule_handle.getFile()).text();

            const key_rule_names = 'rule_names';
            const rule_names = await chrome.storage.local.get(key_rule_names);
            console.log(rule_names);
            if (key_rule_names in rule_names){
                for (var value of rule_names[key_rule_names]) {
                    const rule_handle = await root.getFileHandle(value, {create: false});
                    rules_str = rules_str + "\n\n" + await (await rule_handle.getFile()).text()
                }
            }
    
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
