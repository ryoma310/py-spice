
async function exec_python(code){
    const output = document.getElementById("output");
    output.value = "Initializing...\n";

    let pyodide = await loadPyodide();

    let ret = await pyodide.runPython(code);
    output.value += "\n" + ret
    return ret
}


window.onload = function () {
    let url = new URL(window.location.href);
    console.log("[insandbox.js] " + "inside_sundbox")
    console.log("[insandbox.js] " + url)
    console.log("[insandbox.js] " + url.searchParams.get("s_text"))
    let code = url.searchParams.get("s_text")

    exec_python(code);
}
