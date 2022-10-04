
async function exec_python(code){
    // console.log(Object.keys(LibNamespace))
    const output = document.getElementById("output");
    output.value = "Initializing...\n";

    let pyodide = await loadPyodide();
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('./whl/yara_python-4.2.0-cp310-cp310-emscripten_3_1_14_wasm32.whl');
    pyodide.runPython(`
    import yara
    rule = yara.compile(source='rule foo: bar {strings: $a = "lmn" condition: $a}')
    matches = rule.match(data='abcdefgjiklmnoprstuvwxyz')
    print(matches)
    `);

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
