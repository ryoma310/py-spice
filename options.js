// Saves options to chrome.storage
function save_options() {
    var inspect_method = document.inspect_method_form.inspect_method.value;
    chrome.storage.local.set({
        favorite_inspect_method: inspect_method
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get({
        favorite_inspect_method: 'yara'
    }, function(items) {
        document.inspect_method_form.inspect_method.value = items.favorite_inspect_method;
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
    const new_rules = await file.text();
    //await writable.write(contents);
    //await writable.close();

    const root = await navigator.storage.getDirectory();
    const rule_handle = await root.getFileHandle("rules.yar", {create: true});
    const current_rules = await (await rule_handle.getFile()).text();
    const writable = await rule_handle.createWritable();
    await writable.write(current_rules);
    await writable.write(new_rules);
    await writable.close();
}

async function show_rules(){
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
      const root = await navigator.storage.getDirectory();
      const rule_handle = await root.getFileHandle("rules.yar", {create: true});
      const current_rules = await (await rule_handle.getFile()).text();
      document.getElementById('current_rules').value = current_rules;
}

var show_rules_clicked = false;

async function show_yara_rules() {
    if (!show_rules_clicked) {
        var container = document.getElementById("rules_container");
        var iframe = document.createElement("iframe");
        iframe.width = 500;
        iframe.height = 500;
        container.appendChild(iframe);
        iframe.src = new URL(chrome.runtime.getURL('./rules.html'));
        console.log("clicked");
        show_rules_clicked = true;
    }
    const root = await navigator.storage.getDirectory();
    const rule_handle = await root.getFileHandle("rules.yar", {create: true});
    let rules_str = await (await rule_handle.getFile()).text();

    document.querySelector("iframe").contentWindow.postMessage({
      action: 'SyncMessage',
      message: rules_str
    }, "*", );
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('add_rule').addEventListener('click', add_rule);
document.getElementById('show_rules').addEventListener('click', show_rules);
document.getElementById('show_yara_rules').addEventListener('click', show_yara_rules);
