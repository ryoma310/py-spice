
window.onload = function () {
    console.log("[popup.js] " + "I am popup.js");
    let url = new URL(window.location.href);
    // let params = url.searchParams;
    url.pathname = "insandbox.html"

    let myIframe = document.getElementById("iframe");
    
    console.log("[popup.js] " + url.href);
    myIframe.src = url.href;
}