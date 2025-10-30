from flask import Flask, render_template, request, jsonify
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
import traceback

TEMPLATE = """
Answer the question below.

Here is the conversation history:
{context}

Question:
{question}

Answer:
"""

def create_chain(model_name: str = "llama3.1"):
    model = OllamaLLM(model=model_name)
    prompt = ChatPromptTemplate.from_template(TEMPLATE)
    return prompt | model

app = Flask(__name__, static_folder='static', template_folder='templates')
chain = create_chain()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        context = data.get("context", "")
        question = data.get("question", "")

        print(f"[DEBUG] Received question: {question}")

        result = chain.invoke({"context": context, "question": question})
        print(f"[DEBUG] Result: {result}")

        return jsonify({"reply": result})
    except Exception as e:
        print("[ERROR]", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
