export class Yara {
    constructor(yara_, rules_) {
        // yara_: yara-wasm module
        // rules_: list of yara rule file names
        this.yara_wasm = yara_;
        this.yara_rules_file = rules_;
        this.load_yara_rules();
    }

    load_yara_rules(){
        // TODO: load this.yara_rules_file to this.yara_rules
        // TODO: 本当はファイルから読み込む。、複数ルールがあってもうまく読み込めるのかは謎。
        this.yara_rules = 'rule foo: bar {strings: $a = "lmn" condition: $a}';
    }

    async yara_runner(txt){
        console.log(txt)
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
