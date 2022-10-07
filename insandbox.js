import {Yara} from './js/yara.js';
import {PythonRE} from './js/python.js';

async function yara_exec(txt, rule){
    window.parent.postMessage({
        action: 'SyncMessage',
        message: 'request'
    }, "*", );

    window.addEventListener('message', async function (e) {
        /*if (e.origin !== "chrome-extension://"+ document.domain)  //送信元のドメインが明確な場合は、チェックすることが強く推奨されています
            return;
        */
        rule = e.data.message;
        let yara_wasm = await new Module();
        let yara = new Yara(yara_wasm, rule);
        yara.check_yara_rules();
        let res = await yara.yara_runner(txt);
        return res
    });
    
}

async function python_exec(txt){
    console.log(txt);
    let pyodide = await loadPyodide();
    // console.log(pyodide);
    let python_re = new PythonRE(pyodide);
    let res = await python_re.runner(txt);
    return res
}

async function create_result_window(input_code, result){
    let pyodide = await loadPyodide();
    // console.log(pyodide);

    const res_html = await window.fetch("../python_code/templates/result.html");
    const template_html = await res_html.text();

    pyodide.FS.mkdir("/template");
    pyodide.FS.writeFile("/template/result.html", template_html, { encoding: "utf8" });

    let result_namespace = { inspect_result : result , input_code: input_code };
    pyodide.registerJsModule("result_namespace", result_namespace);

    const res = await window.fetch("../python_code/create_result_html.py");
    const code = await res.text();

    await pyodide.loadPackage("jinja2");
    await pyodide.runPython(code);

    const ret = result_namespace.result_html

    const div_result = document.getElementById("result");
    div_result.innerHTML = ret;
}

// async function exec_(code){
const exec_ = async(code) => {
    // TODO: とりあえず、実行確認だけしてる。それぞれ、amd/armとオプションを使ってどれを使うか条件分岐する。
    let yara_result = await yara_exec(code, []);
    let python_result = await python_exec(code);

    console.log("[insandbox.js] result(yara): %o", yara_result);
    console.log("[insandbox.js] result(python): %o", python_result);

    await create_result_window(code, python_result);
}


window.onload = function () {
    let url = new URL(window.location.href);
    console.log("[insandbox.js] " + "inside_sundbox")
    console.log("[insandbox.js] " + url)
    console.log("[insandbox.js] " + url.searchParams.get("s_text"))
    let code = url.searchParams.get("s_text")


    exec_(code);
}
