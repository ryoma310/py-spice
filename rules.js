async function parseRules() {
    let pyodide = await loadPyodide();
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('plyara');

    const root = await navigator.storage.getDirectory();
    const rule_handle = await root.getFileHandle("rules.yar", {create: true});
    let rules_str = await (await rule_handle.getFile()).text();

    let shared_variables = { rules_str: rules_str };
    pyodide.registerJsModule("shared_variables", shared_variables);
    pyodide.runPython(`
import plyara
import json
import js
import shared_variables

parser = plyara.Plyara()
shared_variables.parsed_rules = parser.parse_string(shared_variables.rules_str);
    `);

    return shared_variables.parsed_rules.toJs();
}

async function displayRules() {

    let yara_rules = await parseRules();

    var rules_list = document.getElementById("yara_list");

    yara_rules.forEach(rule => {
        var rule_li = document.createElement("li");
        rules_list.appendChild(rule_li);

        rule_li.innerHTML = `
<h3><code>${rule.get("rule_name")}</code></h3>
<h4>Strings</h4>
<table>
    <tr><th>name</th><th>type</th><th>value</th></tr>
    ${rule.get("strings").map(string => `<tr><td><code>${string.get("name")}</code></td><td>${string.get("type")}</td><td><code>${string.get("value")}</code></td></tr>\n`).join("")}
</table>
<h4>Condition</h4>
<p><code>${rule.get("condition_terms").join(" ")}</code></p>
        `      
    });
}

displayRules();