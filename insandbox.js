import { Yara } from './js/yara.js';
import { PythonRE } from './js/python.js';

async function yara_exec(txt, rule, language) {
    window.parent.postMessage({
        action: 'SyncMessage',
        message: 'request'
    }, "*",);

    window.addEventListener('message', async function (e) {
        //送信元のドメインが明確な場合は、チェックすることが強く推奨されています
        /*if (e.origin !== "chrome-extension://"+ document.domain) 
            return;
        */
        rule = e.data.message;
        let yara_wasm = await new Module();
        let yara = new Yara(yara_wasm, rule);
        yara.check_yara_rules();
        let res = await yara.yara_runner(txt);
        console.log("[insandbox.js] result(yara): %o", res);
        await create_result_window(txt, res, "yara", language);
    });

}

async function python_exec(txt, language) {
    console.log(txt);
    let pyodide = await loadPyodide();
    // console.log(pyodide);
    let python_re = new PythonRE(pyodide);
    let res = await python_re.runner(txt);
    console.log("[insandbox.js] result(python): %o", res);
    await create_result_window(txt, res, "python", language);
    // return res
}


async function create_result_window(input_code, result, engine_name, language){
    console.log("create result window" + language);
    let pyodide = await loadPyodide();
    // console.log(pyodide);

    const res_html = await window.fetch("../python_code/templates/result.html");
    const template_html = await res_html.text();

    pyodide.FS.mkdir("/template");
    pyodide.FS.writeFile("/template/result.html", template_html, { encoding: "utf8" });

    let result_namespace = { inspect_result : result , input_code: input_code, engine_name: engine_name, language: language };
    pyodide.registerJsModule("result_namespace", result_namespace);

    const res = await window.fetch("../python_code/create_result_html.py");
    const code = await res.text();

    await pyodide.loadPackage("jinja2");
    await pyodide.runPython(code);

    const ret = result_namespace.result_html

    const div_result = document.getElementById("result");
    div_result.innerHTML = ret;

    hideLoadScreen();
}

// async function exec_(code){
const exec_ = async(code, inspect_method, language) => {
    if (inspect_method == 'yara') {
        await yara_exec(code, [], language);
    } else if (inspect_method == 'python') {
        await python_exec(code, language);
    } else {
        console.log("[insandbox.js] error inspect method word")
    }
    
    //let yara_result = await yara_exec(code, []);
    //let python_result = await python_exec(code);


    //await create_result_window(code, python_result);
}

function hideLoadScreen() {
    var screen = document.getElementById("loading_screen");
    screen.style.opacity = 0
    setTimeout(function(){
        screen.style.display = "none";
    }, 300);
}

window.onload = function () {
    let url = new URL(window.location.href);
    console.log("[insandbox.js] " + "inside_sundbox")
    console.log("[insandbox.js] " + url)
    console.log("[insandbox.js] " + url.searchParams.get("s_text"))
    console.log("[insandbox.js] " + url.searchParams.get("inspect_method"))
    let code = url.searchParams.get("s_text")
    let inspect_method = url.searchParams.get("inspect_method")
    let language = url.searchParams.get("language");

    console.log("insandbox onload " + language);
    
    exec_(code, inspect_method, language);

    //if (inspect_method == 'yara') {
    //    let yara_result = yara_exec(code, []);
    //    console.log("[insandbox.js] result(yara): %o", yara_result);
    //} else if (inspect_method == 'python') {
    //    let python_result = python_exec(code);
    //    console.log("[insandbox.js] result(python): %o", python_result);
    //} else {
    //    console.log("[insandbox.js] error inspect method word")
    //}
}

function copyCode() {
    var code = document.getElementById("inspected_code");
    // コピーするコードが書けません。
}