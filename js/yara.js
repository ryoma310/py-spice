export class Yara {
    constructor(yara_, rules_) {
        // yara_: yara-wasm module
        // rules_: list of yara rule file names
        this.yara_wasm = yara_;
        this.yara_rules_file = rules_;
        // this.load_yara_rules();
    }

    async load_yara_rules(){
        // TODO: load this.yara_rules_file to this.yara_rules
        // TODO: 本当はファイルから読み込む。、複数ルールがあってもうまく読み込めるのかは謎。
        // 拡張機能のあるディレクトリ階層下から.yarを読み取る
        const res = await window.fetch("../regex_yara.yar");
        let rules = await res.text();
        this.yara_rules = rules;
        console.log("[yara.js] load rules: " + rules);
    }

    //セットされているyaraルールを取得したい場合は以下の実行でできる
    //await chrome.storage.local.get("yara_rules");

    //txtがyaraルールになっていることが確認された上で呼ばれる必要がある
    append_yara_rule(txt){
        chrome.storage.local.get("yara_rules", (data)=> {
            var yara_rules = data["yara_rules"] + "\n" + txt;
            chrome.storage.local.set({"yara_rules": yara_rules})
          });
    }

    check_yara_rules(){
        const yara_matches =  this.yara_wasm.run("sample", this.yara_rules);
        if (yara_matches.compileErrors.size() === 0) {
			return false;
		}
		for (let i = yara_matches.compileErrors.size()-1; i >= 0; i--) {
			const compileError = yara_matches.compileErrors.get(i);
			if (!compileError.warning) {
				console.log(`Error on line ${compileError.lineNumber}: ${compileError.message} in YARA rules`);
			}
		}
    }

    async yara_runner(txt){
        console.log("Run yara.\ntarget: " + txt);
        // this.yara_rules = get_current_yara_rule();
        const yara_matches = await this.yara_wasm.run(txt, this.yara_rules);

        const match_result_ls = new Array();
        console.log(yara_matches.matchedRules.size())
        for (let i = 0; i < yara_matches.matchedRules.size(); i++) {
            // let metadata = {};
            const rule = yara_matches.matchedRules.get(i);

            const matches = rule.resolvedMatches
            for (let j = 0; j < matches.size(); j++) {
                const match = matches.get(j);
                // console.log("matched: ", match)
                const match_result = new Map();
                match_result.set("type", rule.ruleName);
                match_result.set("message", JSON.stringify(match));
                match_result_ls.push(match_result);
            }
        }
        const d = new Date();
        const formatted_datetime = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
        const ret = new Map();
        ret.set("count", match_result_ls.length);
        ret.set("timestamp", formatted_datetime);
        ret.set("detect", match_result_ls);

        console.log("[yara.js] result: " + ret);

        return ret
    }
}
