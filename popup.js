
window.onload = function () {
    console.log("[popup.js] " + "I am popup.js");
    let url = new URL(window.location.href);
    // let params = url.searchParams;
    url.pathname = "insandbox.html"

    let myIframe = document.getElementById("iframe");
    
    console.log("[popup.js] " + url.href);
    myIframe.src = url.href;
}

window.addEventListener('message', async function (e) {
    console.log("read file");
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