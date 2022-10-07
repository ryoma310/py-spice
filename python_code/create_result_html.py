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
    inspect_result_formated[i["type"]].append( (len(inspect_result_formated[i["type"]]), i["line_number"], i["message"]) )

print(inspect_result_formated)
data = {
    "detect_num": inspect_result_raw["count"],
    "detect_engine": result_namespace.engine_name,
    "timestamp": inspect_result_raw["timestamp"],
    "input_code": html.escape(result_namespace.input_code),
    "inspect_result": inspect_result_formated
}
rendered = template.render(data)


result_namespace.result_html = rendered
