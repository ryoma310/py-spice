import plyara

parser = plyara.Plyara()

rules_string = """rule url {
    strings:
        $url_regex = /https?:\/\/[a-zA-Z]+?\//
    condition:
        $url_regex 
}

rule python_import {
    strings:
        $subprocess = "import subprocess"
        $os = "import os"
        $sys = "import sys"
        $socket = "import socket"
        $requests = "import requests"
        $pty = "import pty"
    condition:
        any of them
}
"""
rules = parser.parse_string(rules_string);

import json
print(json.dumps(rules))

with open("regex.json", "w") as f:
    json.dump(rules, f, indent=4)