export class PythonRE {
    constructor(pyodide_) {
        this.pyodide = pyodide_;     
    }

    async runner(txt){
        const output = document.getElementById("output");
        output.value = "Initializing...\n";

        // とりあえず、入力をpythonに流し込むだけの例
        // TODO: 関数とか作って、正規表現の検証をする。
        let ret = await this.pyodide.runPython(txt);
        output.value += "\n" + ret;
        console.log(ret);
    }
}