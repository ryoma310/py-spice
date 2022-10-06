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
        console.log(e.data.message);
        //let yara = new Yara(yara_wasm, e.data.message);
        //await yara.yara_runner(txt); 
    });
    let yara_wasm = await new Module();
    let yara = new Yara(yara_wasm, rule);
    await yara.load_yara_rules();
    yara.check_yara_rules();
    let res = await yara.yara_runner(txt);
    return res
}

async function python_exec(txt){
    console.log(txt);
    let pyodide = await loadPyodide();
    // console.log(pyodide);
    let python_re = new PythonRE(pyodide);
    let res = await python_re.runner(txt);
    return res
}

// async function exec_(code){
const exec_ = async(code) => {
    // TODO: とりあえず、実行確認だけしてる。それぞれ、amd/armとオプションを使ってどれを使うか条件分岐する。
    let yara_result = await yara_exec(code, []);
    let python_result = await python_exec(code);

    console.log("[insandbox.js] result(yara): %o", yara_result);
    console.log("[insandbox.js] result(python): %o", python_result);
}


window.onload = function () {
    let url = new URL(window.location.href);
    console.log("[insandbox.js] " + "inside_sundbox")
    console.log("[insandbox.js] " + url)
    console.log("[insandbox.js] " + url.searchParams.get("s_text"))
    let code = url.searchParams.get("s_text")


    exec_(code);
}
