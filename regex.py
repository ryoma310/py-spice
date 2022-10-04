import re

match_string = ["https?://[\w/:%#\$&\?\(\)~\.=\+\-]+", "(([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])", "import subprocess", "import os", "import sys", "import socket", "import requests", "import pty", "s.bind", "socket.socket", "AF_INET", "SOCK_STREAM", "bind", "listen", "accept", "close", "os.system", "exec", "eval", "pty.spawn(\"/bin/sh\")", "__import__", "__builtins__", "__globals__ergrrg", "subprocess.run", "shell=True", "subprocess.PIPE", "subprocess.DEBNULL", "subprocess.STDOUT", "subprocess.call", "subprocess.check_call", "subprocess.check_output", "subprocess.Popen", "asyncio.create_subprocess_exec"]

copyed = ""

for i in match_string:
    p = re.compile(i)
    result = p.finditer(copyed)
    for m in result:
        print(m)