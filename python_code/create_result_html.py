from jinja2 import Template, Environment, FileSystemLoader
import html
from collections import defaultdict
import result_namespace

print("[regex.py] inspect_result: ", result_namespace.inspect_result)

env = Environment(loader=FileSystemLoader('/template'), autoescape=True)
template = env.get_template('result.html')


inspect_result_raw = result_namespace.inspect_result.to_py()

print(inspect_result_raw)

inspect_result_formated = defaultdict(list)
for i in inspect_result_raw["detect"]:
    # append, (<No.>, <line no.>, <message>)
    inspect_result_formated[i["type"]].append( (i["line_number"], i["message"]) )
inspect_result_formated_new = dict()
for k, v in inspect_result_formated.items():
    inspect_result_formated_new[k] = list()
    for i, l in enumerate(sorted(v, key=lambda x: x[0])):
        inspect_result_formated_new[k].append((i, l[0], l[1]))

validation_results = {"en":"Validation results", "ja":"検証結果"}
validation_counts = {"en":"Validation counts", "ja": "検知数"}
validation_engine = {"en":"Validation engine", "ja": "検知エンジン"}
timestamp_language = {"en":"timestamp: ", "ja":"タイムスタンプ："}
validation_details = {"en":"Validation details", "ja": "検知詳細"}
source_code = {"en": "Source code", "ja": "ソースコード"}
copy_string = {"en": "Copy", "ja": "コピー"}

print(inspect_result_formated_new)
data = {
    "detect_num": inspect_result_raw["count"],
    "detect_engine": result_namespace.engine_name,
    "timestamp": inspect_result_raw["timestamp"],
    "input_code": html.escape(result_namespace.input_code),
    "inspect_result": inspect_result_formated_new,
    "validation_results": validation_results[result_namespace.language],
    "validation_counts": validation_counts[result_namespace.language],
    "validation_engine": validation_engine[result_namespace.language],
    "timestamp_language": timestamp_language[result_namespace.language],
    "validation_details": validation_details[result_namespace.language],
    "source_code": source_code[result_namespace.language],
    "copy_string": copy_string[result_namespace.language]

}
rendered = template.render(data)


result_namespace.result_html = rendered
