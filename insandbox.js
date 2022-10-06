import {Yara} from './js/yara.js';
import {PythonRE} from './js/python.js';


function yara_exec(txt){
    new Module().then(async yara_wasm => {
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
    });
}

async function python_exec(txt){
    console.log(txt);
    let pyodide = await loadPyodide();
    console.log(pyodide);
    let python_re = new PythonRE(pyodide);
    await python_re.runner(txt);
}

async function exec_(code){
    // TODO: とりあえず、実行確認だけしてる。それぞれ、amd/armとオプションを使ってどれを使うか条件分岐する。
    yara_exec(code);
    await python_exec(code);
}


window.onload = function () {
    let url = new URL(window.location.href);
    console.log("[insandbox.js] " + "inside_sundbox")
    console.log("[insandbox.js] " + url)
    console.log("[insandbox.js] " + url.searchParams.get("s_text"))
    let code = url.searchParams.get("s_text")

    exec_(code);
}
