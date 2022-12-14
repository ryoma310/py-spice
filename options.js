
/* turn off debug */
let DEBUG = false;
if(!DEBUG){
    if(!window.console){
      window.console = {};
    }
    var methods = [
      "log", "debug", "warn", "info"
    ];
    methods.forEach(elem => console[elem] = function(){});
}
/* End turn off debug */

// Saves options to chrome.storage
function save_options() {
    var inspect_method = document.inspect_method_form.inspect_method.value;
    var inspect_window = document.inspect_window_form.inspect_window.value;
    chrome.storage.local.set({
        favorite_inspect_method: inspect_method,
        favorite_inspect_window: inspect_window
    }, function() {
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get({
        favorite_inspect_method: 'yara',
        favorite_inspect_window: 'new_tab'
    }, function(items) {
        document.inspect_method_form.inspect_method.value = items.favorite_inspect_method;
        document.inspect_window_form.inspect_window.value = items.favorite_inspect_window;
    });
}

async function add_rule() {
    const options = {
        types: [
          {
            description: 'Text Files',
            accept: {
              'text/plain': ['.yar'],
            },
          },
        ],
      };
    const [handle] = await window.showOpenFilePicker(options);
    const file = await handle.getFile();
    const d = new Date();
    const formatted_datetime = `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}${d.getHours().toString().padStart(2, '0')}${d.getMinutes().toString().padStart(2, '0')}${d.getSeconds().toString().padStart(2, '0')}`;
    const file_name = file.name + "_" + formatted_datetime + ".yar";
    const new_rules = await file.text();

    //await writable.write(contents);
    //await writable.close();

    const root = await navigator.storage.getDirectory();
    const rule_handle = await root.getFileHandle(file_name, {create: true});
    const current_rules = await (await rule_handle.getFile()).text();
    const writable = await rule_handle.createWritable();
    await writable.write(current_rules);
    await writable.write(new_rules);
    await writable.close();

    const key_rule_names = 'rule_names';
    var rule_names = await chrome.storage.local.get(key_rule_names);
    if (key_rule_names in rule_names){
        rule_names[key_rule_names].push(file_name);
    } else {
        rule_names[key_rule_names] = [file_name];
    }
    await chrome.storage.local.set(rule_names);
}

var show_rules_clicked = false;
var rule_loading = false;

async function show_yara_rules() {
    if (rule_loading){
        return;
    }
    rule_loading = true;

    if (!show_rules_clicked) {
        var container = document.getElementById("rules_container");
        var iframe = document.createElement("iframe");
        iframe.setAttribute("id", "rule_iframe");
        iframe.width = 500;
        iframe.height = 500;
        container.appendChild(iframe);
        console.log("clicked");
        show_rules_clicked = true;
    } else {
        var iframe = document.getElementById("rule_iframe");
    }

    window.addEventListener('message', async function (e) {
        let myIframe = document.getElementById("rule_iframe");
        if (!( e.origin === "null" && e.source === myIframe.contentWindow )){
            console.error("invalid sender");
            return;
        }

        switch (e.data.action) {
            case "RequestRuleMessage":
                iframe.contentWindow.postMessage({
                    action: 'SyncRuleMessage',
                    message: rules_str
                  }, "*", ); 
                break;

            case "RuleLoadFinish":
                rule_loading = false;
                break;

            default:
                break;
        }
    });

    iframe.src = new URL(chrome.runtime.getURL('./rules.html'));


    const root = await navigator.storage.getDirectory();
    const rule_handle = await root.getFileHandle("rules.yar", {create: false});
    var rules_str = await (await rule_handle.getFile()).text();

    const key_rule_names = 'rule_names';
    const rule_names = await chrome.storage.local.get(key_rule_names);
    if (key_rule_names in rule_names){
        for (var value of rule_names[key_rule_names]) {
            const rule_handle = await root.getFileHandle(value, {create: false});
            rules_str = rules_str + "\n\n" + await (await rule_handle.getFile()).text()
        }
    }
}

function setupI18n() {
    console.log("[options.js] setupI18n");
    const i18n_elements = document.getElementsByClassName("i18n-label");

    for (let i = 0; i < i18n_elements.length; i++) {
        console.log(i18n_elements[i]);
        console.log(i18n_elements[i].getAttribute('i18n-key'));
        const i18n_key = i18n_elements[i].getAttribute('i18n-key');
        i18n_elements[i].textContent = chrome.i18n.getMessage(i18n_key);
    }
}

document.addEventListener('DOMContentLoaded', setupI18n);
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('add_rule').addEventListener('click', add_rule);
document.getElementById('show_rules').addEventListener('click', show_yara_rules);

let radio_btns = document.querySelectorAll(`input[type='radio']`);
radio_btns.forEach(btn => {
    btn.addEventListener('change', save_options);
});
