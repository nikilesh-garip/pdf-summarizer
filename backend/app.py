from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from pdfminer.high_level import extract_text
import os

app = Flask(__name__)
CORS(app)

# Load tokenizer + model
model_name = "sshleifer/distilbart-cnn-12-6"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

def extract_text_from_pdf(pdf_path):
    return extract_text(pdf_path)

@app.route("/summarize", methods=["POST"])
def summarize_pdf():
    os.makedirs("./temp", exist_ok=True)
    file = request.files['file']
    file_path = os.path.join("temp", file.filename)
    file.save(file_path)

    raw_text = extract_text_from_pdf(file_path)

    # STRICT truncate (max length=1024 tokens)
    inputs = tokenizer(raw_text, max_length=1024, truncation=True, return_tensors="pt")
    summary_ids = model.generate(inputs["input_ids"], min_length=50, max_length=150, do_sample=False)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(debug=True)
