export class Yara {
    constructor(yara_, rules_) {
        // yara_: yara-wasm module
        // rules_: list of yara rule file names
        this.yara_wasm = yara_;
        this.yara_rules_file = rules_;
        this.load_yara_rules();
    }

    #load_yara_rules(){
        // TODO: load this.yara_rules_file to this.yara_rules
        // TODO: 本当はファイルから読み込む。、複数ルールがあってもうまく読み込めるのかは謎。
        // 拡張機能のあるディレクトリ階層下から.yarを読み取る
        this.yara_rules = 'rule foo: bar {strings: $a = "lmn" condition: $a}';
    }

    get_current_yara_rule(){
        return chrome.storage.local.get("yara_rules", (data) =>{
            return data["yara_rules"];
        });
    }
    
    //txtがyaraルールになっていることが確認された上で呼ばれる必要がある
    append_yara_rule(txt){
        this.yara_rules += get_current_yara_rule() + "\n" + txt;
        chrome.storage.local.set("yara_rules", this.yara_rules)
    }

    async yara_runner(txt){
        console.log("Run yara.\ntarget: " + txt);
        this.yara_rules = get_current_yara_rule();
        const yara_matches = await this.yara_wasm.run(txt, this.yara_rules);
        // console.log(yara_matches)
        for (let i = 0; i < yara_matches.matchedRules.size(); i++) {
            // let metadata = {};
            const rule = yara_matches.matchedRules.get(i);

            const matches = rule.resolvedMatches
            for (let j = 0; j < matches.size(); j++) {
                const match = matches.get(j);
                console.log("matched: ", match)
            }
        }
    }
}
