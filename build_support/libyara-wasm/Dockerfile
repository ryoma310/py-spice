From ubuntu:latest

RUN apt-get update
RUN apt-get install -y git curl cmake automake libtool pkg-config python3-pip
RUN apt-get install -y libjansson-dev libmagic-dev 

WORKDIR /root
SHELL ["/bin/bash", "-c"]
RUN git clone https://github.com/emscripten-core/emsdk.git /root/emsdk
RUN cd /root/emsdk/ && ./emsdk install latest && ./emsdk activate latest

RUN git clone https://github.com/mattnotmitt/libyara-wasm.git /root/libyara-wasm
WORKDIR /root/libyara-wasm
RUN source /root/emsdk/emsdk_env.sh && mkdir build && cd build && emcmake cmake .. && emmake make -j8
