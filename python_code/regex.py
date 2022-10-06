import re
import datetime
import spice_namespace

print("[regex.py] input_text: ", spice_namespace.input_text)

match_strings = {
    "url": ["https?://[\w/:%#\$&\?\(\)~\.=\+\-]+"],
    "IP": ["((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])"],
    "python_import": ["import subprocess", "import os", "import sys", "import socket", "import requests", "import pty"],
    "socket": ["s.bind", "socket.socket", "AF_INET", "SOCK_STREAM", "bind", "listen", "accept", "close"],
    "os": ["os.system"],
    "eval_and_exec": ["exec", "eval"],
    "pty": ["pty.spawn(\"/bin/sh\")"],
    "python_double_underscore": ["__import__", "__builtins__", "__globals__ergrrg"],
    "subprocess": ["subprocess.run", "shell=True", "subprocess.PIPE", "subprocess.DEBNULL", "subprocess.STDOUT", "subprocess.call", "subprocess.check_call", "subprocess.check_output", "subprocess.Popen", "asyncio.create_subprocess_exec"]
}

match_result_ls = list()
for k, v in match_strings.items():
    for pattern in v:
        p = re.compile(pattern)
        result = p.finditer(spice_namespace.input_text)
        for m in result:
            match_result_ls.append({"type": k, "message": str(m)})
ret = {
    "count": len(match_result_ls),
    "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "detect": match_result_ls
}
spice_namespace.result = ret
