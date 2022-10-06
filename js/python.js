export class PythonRE {
    constructor(pyodide_) {
        this.pyodide = pyodide_;     
    }

    async runner(txt){
        const output = document.getElementById("output");
        output.value = "Initializing...\n";
    
        const res = await window.fetch("../python_code/regex.py");
        const code = await res.text();

        const code_A = code.slice(0,691);
        const code_B = code.slice(691);
        const code_complete = code_A + txt + code_B;

        let ret = await this.pyodide.runPython(code_complete);
        output.value += "\n" + ret;
        console.log(ret);
    }
}