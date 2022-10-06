async function parseRules() {
    let pyodide = await loadPyodide();
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('plyara');

    let data = await window.fetch("./regex_yara.yar");
    let rules_str = await data.text();

    let shared_variables = { rules_str: rules_str };
    pyodide.registerJsModule("shared_variables", shared_variables);

    // pyodide.FS.writeFile("regex_yara.yar", rules_str, { encoding: "utf8" });

    pyodide.runPython(`
import plyara
import json
import js
import shared_variables

parser = plyara.Plyara()
js.parsed_rules = parser.parse_string(shared_variables.rules_str);

    `);

    let yara_rules = window.parsed_rules.toJs();

    console.log(yara_rules);

    var rules_list = document.getElementById("yara_list");

    yara_rules.forEach(rule => {
        var rule_li = document.createElement("li");
        rules_list.appendChild(rule_li);
        
        var header = document.createElement("h3");
        header.textContent = rule.get("rule_name");
        rule_li.appendChild(header);

        var strings_header = document.createElement("h4");
        strings_header.textContent = "Strings";
        rule_li.appendChild(strings_header);

        var strings_list = document.createElement("ul");
        rule_li.appendChild(strings_list);

        rule.get("strings").forEach(string => {
            var str_li = document.createElement("li");
            str_li.textContent = string.get("value");
            strings_list.appendChild(str_li);
        });

        var condition_header = document.createElement("h4");
        condition_header.textContent = "Condition";
        rule_li.appendChild(condition_header);

        var cond_p = document.createElement("p");
        cond_p.textContent = rule.get("condition_terms").join(" ");
        rule_li.appendChild(cond_p);
        
    });
}

parseRules();