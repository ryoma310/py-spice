# How to create libyara-wasm

- [mattnotmitt/libyara-wasm](https://github.com/mattnotmitt/libyara-wasm)をビルドする環境を作りました。
- このディレクトリにある[Dockerfile](./Dockerfile)を利用して、`docker build`でイメージを作ります。
- このイメージで作られるコンテナには、`/root/libyara-wasm/dist/libyara-wasm.js`に`libyara-wasm.js`があるので、それをコピーすることでビルド済みのlibyara-wasmが手に入ります。

- 以下は、イメージをビルドして、libyara-wasm.jsを取り出し、最後にコンテナを止めるコマンド例です。
```bash
docker build . -t libyara-build-env:latest
docker run -td --rm --name libyara-wasm libyara-build-env:latest
docker cp libyara-wasm:/root/libyara-wasm/dist/libyara-wasm.js .
docker stop libyara-wasm
```