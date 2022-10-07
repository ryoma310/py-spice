# py-spice: Python SniPet Inspector on Chrome Exetnsion

`py-spice` is a Chrome extension that inspects python code snippets for areas that need attention and is sandboxed and executed within wasm to ensure safe behavior.

You can use it by selecting the code snippet in Chrome, right-clicking on it, and pressing `Verify and copy code`.

<img width="336" alt="readme_en_verify_and_copy_code" src="https://user-images.githubusercontent.com/59504885/194576841-aa2bcad5-6479-40cc-a247-82e87517dddc.png">


---
## How it works

---
## Installation
1. Download `.crx` file from Release tab.
2. On the chrome extensions screen (chrome://extensions/), activate `developer mode` from the top right button
3. Drag and drop `.crx` file to install


---
## Function
- Two types of code inspection engines are available in py-spice: `yara` and `pure python`.
### yara
- `libyara-wasm` enables the use of yara within Chrome extensions.
- As for the YARA rules used for the inspection, they are provided by default, but users are free to load new ones at their convenience.
### pure python
- Thanks to pyodide, it is now possible to run python within a Chrome extension.
- It is possible to inspect the code using python's re package.
- Compared to YARA, it is not possible to extend rules, but it is expected to run faster.

---
## System requirements
- Chrome Browser: version 71.0 or later



---
## Mainly used technology
- Chrome extension

    It is a program that runs on Chrome and provides various functions. py-spice is implemented as an extension for Chrome, the world's most used web browser, so it can be deployed in many environments.
- wasm

    A binary code format that runs in the browser, allowing the use of CPU features without being limited by the expressive capabilities of JavaScript. [libyara-wasm](https://github.com/mattnotmitt/libyara-wasm) and [Pyodide](https://pyodide.org/en/stable/index.html) are used in py-spice.
- pyodide

    It is a Python runtime environment built on wasm. python repositories can also be used, and py-spice uses a repository called [plyara](https://github.com/plyara/plyara).
- yara

    A tool for identifying and classifying malware from text or binary according to defined rules. py-spice defines its own Python code snippets that can be malware and detects them.

---
## For Developers
- To develop this extension, follow these steps:
    1. Clone this repository.
        ```bash
        git clone https://github.com/ryoma310/py-spice.git
        ```
    2. Open extensions page (chrome://extensions/).
    3. Activate `Developer mode` from the top right button
    4. Selecting the cloned directory from `Load Unpacked` will install them.

- Follow this [link](build_support/libyara-wasm/README.md) for instructions on how to build [libyara-wasm](https://github.com/mattnotmitt/libyara-wasm).


---
## Future work
- Support for languages other language
- CVE Scanning
- Investigate even dependent libraries (e.g., those that are imported)

---
## Known issue
- `Verify and copy code` cannot be performed unless the target tab is selected.

---
## Dependencies
- [mattnotmitt/libyara-wasm](https://github.com/mattnotmitt/libyara-wasm)
- [VirusTotal/yara](https://github.com/VirusTotal/yara)
- [Pyodide](https://pyodide.org/en/stable/index.html)
- [plyara/plyara](https://github.com/plyara/plyara)

---
## Inspired by
- [imp0rtp3/Yobi](https://github.com/imp0rtp3/Yobi)
