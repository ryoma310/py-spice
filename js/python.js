export class PythonRE {
    constructor(pyodide_) {
        this.pyodide = pyodide_;     
    }

    async runner(txt){
        let spice_namespace = { input_text : txt };
        this.pyodide.registerJsModule("spice_namespace", spice_namespace);
    
        const res = await window.fetch("../python_code/regex.py");
        const code = await res.text();

        await this.pyodide.runPython(code);

        const ret = spice_namespace.result;
        console.log("[python.js] result: " + ret.toJs());

        return ret.toJs()
    }
}