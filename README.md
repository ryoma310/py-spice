English version is [here](README_en.md).

# py-spice: Python SniPet Inspector on Chrome Exetnsion

`py-spice`はpythonのコードスニペットに(悪性な挙動をする可能性があり)注意する必要のある箇所があるかを検査するChrome拡張です。wasm内でサンドボックス化して実行されるので安全に確かめることができます。

コードスニペットをChrome内で選択した状態で、右クリックをして`コードを検証してコピー`を押すことで利用することができます。

<img width="344" alt="usage" src="https://user-images.githubusercontent.com/99947844/194580666-28d755e1-dad6-46f9-bce0-afaaa1869caf.png">


---
## 動作の様子

---
## インストール方法
1. Releaseタブから`.crx`ファイルをダウンロード
2. chromeの拡張機能画面(chrome://extensions/)で、右上のボタンから`デベロッパーモード`を有効化
3. `.crx`をドラックアンドドロップしてインストール。


---
## 機能
- py-spiceではコードの検査エンジンとして`yara`、`pure python`の2種類を利用することができます。
### yara
- `libyara-wasm`を利用することでChrome拡張内でyaraの利用を可能にしました。
- 検査に利用するyaraのルールについてはデフォルトで用意されていますが、利用者が都合に合わせて自由に新しいものを読み込むことができます。
### pure python
- pyodideのおかげでpythonをChrome拡張内で実行することが可能になりました。
- pythonのreパッケージを利用してコードの検査を行うことが可能です。
- yaraのものに比べ、ルールの拡張はできませんがより高速な動作が期待できます。

---
## 動作環境
- Chrome Browser: version 71.0 or later



---
## 中心となる技術
- Chrome拡張機能

    Chrome上で動作し、さまざまな機能を提供してくれるプログラムです。py-spiceは世界で最も使用されているWebブラウザであるChromeの拡張機能として実装されているので、多くの環境に導入することができます。
- wasm

    ブラウザ上で動くバイナリコードのフォーマットです。JavaScriptの表現能力にとらわれず、CPUの機能を利用することができます。py-spiceではwasmとして[libyara-wasm](https://github.com/mattnotmitt/libyara-wasm)と[Pyodide](https://pyodide.org/en/stable/index.html)が使用されています。
- pyodide

    wasm上でビルドされたPythonの実行環境です。Pythonのリポジトリも使用することができ、py-spiceでは[plyara](https://github.com/plyara/plyara)というリポジトリを利用しています。
- yara

    テキストまたはバイナリから、定義された規則に従ってマルウェアを識別、分類するためのツールです。py-spiceではPythonのコードでマルウェアになりうるものを独自に定義し、検知を行っています。

---
## For Developers
- この拡張機能を開発するには以下の手順に従ってください。
    1. このリポジトリをclone
        ```bash
        git clone https://github.com/ryoma310/py-spice.git
        ```
    2. chromeの拡張機能画面(chrome://extensions/)を開く。
    3. 右上のボタンから`デベロッパーモード`を有効化
    4. `パッケージ化されていない拡張機能を読み込む`からcloneしたディレクトリを選択すると、インストールすることができます。

- [libyara-wasm](https://github.com/mattnotmitt/libyara-wasm)をビルドする方法については[こちら](build_support/libyara-wasm/README.md)に従ってください。


---
## 実装予定の機能
- Python以外の言語への対応
- CVEのスキャン
- 依存ライブラリ(importされているものなど)にまで調査の幅を広げる

---
## known issue
- `コードを検証してコピー`をする場合に、対象のタブが選択されていないと実行できません。

---
## 依存関係
- [mattnotmitt/libyara-wasm](https://github.com/mattnotmitt/libyara-wasm)
- [VirusTotal/yara](https://github.com/VirusTotal/yara)
- [Pyodide](https://pyodide.org/en/stable/index.html)
- [plyara/plyara](https://github.com/plyara/plyara)

---
## inspired by
- [imp0rtp3/Yobi](https://github.com/imp0rtp3/Yobi)