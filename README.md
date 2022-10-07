# py-spice: Python SniPet Inspector on Chrome Exetnsion

`py-spice`はpythonのコードスニペットに(悪性な挙動をする可能性があり)注意する必要のある箇所があるかを検査するChrome拡張です。

コードスニペットをChrome内で選択した状態で、右クリックをして`コードを検証してコピー`を押すことで利用することができます。

---
## 動作の様子

---
## 中心となる技術
- Chrome拡張
- wasm
- pyodide
- yara

---
## 動作環境
- Chrome Browser: version 71.0 or later

---
## インストール方法
1. Releaseタブから`.crx`ファイルをダウンロード
2. chromeの拡張機能画面(chrome://extensions/)で、右上のボタンから`デベロッパーモード`を有効化
3. `.crx`をドラックアンドドロップしてインストール。

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


---
## Resources
- aaa

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
## 実装予定の機能

---
## 特徴
- wasm内でサンドボックス化されて実行されるので安全。
- cpuのアーキテクチャによらず実行可能

---
## known issue

---
## inspired by

