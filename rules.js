/* turn off debug */
let DEBUG = false
if(!DEBUG){
    if(!window.console){
      window.console = {};
    }
    var methods = [
      "log", "debug", "warn", "info"
    ];
    for (var m in methods){
        console[m] = function(){};
    }
}
/* End turn off debug */

async function parseRules(rules_str) {
    let pyodide = await loadPyodide();
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('plyara');

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

async function displayRules(rules_str) {

    let yara_rules = await parseRules(rules_str);

    var rules_list = document.getElementById("yara_list");

    yara_rules.forEach(rule => {
        var rule_li = document.createElement("li");
        rules_list.appendChild(rule_li);

        rule_li.innerHTML = `
<h3><code>${rule.get("rule_name")}</code></h3>
<h4>Strings</h4>
<table>
    <thead>
        <tr><th>name</th><th>type</th><th>value</th></tr>
    </thead>
    <tbody>
    ${rule.get("strings").map(string => `<tr><td><code>${string.get("name")}</code></td><td>${string.get("type")}</td><td class="td_message"><code>${string.get("value")}</code></td></tr>\n`).join("")}
    </tbody>
</table>
<h4>Condition</h4>
<p><code>${rule.get("condition_terms").join(" ")}</code></p>
        `      
    });
}

function hideLoadScreen() {
    var screen = document.getElementById("loading_screen");
    screen.style.opacity = 0
    setTimeout(function(){
        screen.style.display = "none";
    }, 300);
}

window.addEventListener('message', async function (e) {
    await displayRules(e.data.message);
    hideLoadScreen();
});