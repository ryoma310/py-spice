async function exec_python(copyed_text){
    const output = document.getElementById("output");
    output.value = "Initializing...\n";

    let pyodide = await loadPyodide();
    
    const res = await window.fetch("regex.py");
    const code = await res.text();

    const code_A = code.slice(0,686);
    const code_B = code.slice(686);
    const code_complete = code_A + copyed_text + code_B;

    let ret = await pyodide.runPython(code_complete);
    output.value += "\n" + ret
    return ret
}


window.onload = function () {
    let url = new URL(window.location.href);
    console.log("[insandbox.js] " + "inside_sundbox")
    console.log("[insandbox.js] " + url)
    console.log("[insandbox.js] " + url.searchParams.get("s_text"))
    let copyed_text = url.searchParams.get("s_text")

    exec_python(copyed_text);
}