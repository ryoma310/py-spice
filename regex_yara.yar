rule url {
    strings:
        $url_regex = /https?:\/\/[a-zA-Z]+?\//
    condition:
        $url_regex 
}

rule IP {
    strings:
        $ipv4 = /([0-9]{1,3}\.){3}[0-9]{1,3}/ wide ascii
        $ipv6 = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/ wide ascii
    condition:
        any of them
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

rule socket {
    strings:
        $s_bind = "s.bind"
        $socket_socket = "socket.socket"
        $AF_INET = "AF_INET"
        $SOCK_STREAM = "SOCK_STREAM"
        $bind = "bind"
        $listen = "listen"
        $accept = "accept"
        $close = "close"
    condition:
        any of them
}

rule os {
    strings:
        $os_system = "os.system"
    condition:
        any of them
}

rule eval_and_exec {
    strings:
        $ecal = "eval"
        $exec = "exec"
    condition:
        any of them
}

rule pty {
    strings:
        $spawn = "pty.spawn(\"/bin/sh\")"
    condition:
        any of them
}

rule python_double_underscore {
    strings:
        $import = "__import__"
        $builtins = "__builtins__"
        $globals_ergrrg = "__globals__ergrrg"
    condition:
        any of them
}

rule subprocess {
    strings:
        $run = "subprocess.run"
        $shell = "shell=True" // 空白があったときにうまく動かないから、正規表現で書き直す
        $pipe = "subprocess.PIPE"
        $debnull = "subprocess.DEBNULL"
        $stdout = "subprocess.STDOUT"
        $call = "subprocess.call"
        $check_call = "subprocess.check_call"
        $check_out = "subprocess.check_out"
        $popen = "subprocess.Popen"
        $asyncio = "asyncio.create_subprocess_exec"
    condition:
        any of them
}