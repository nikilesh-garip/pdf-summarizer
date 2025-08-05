const backendURL = "https://pdf-summarizer-backend-4lqb.onrender.com/summarize";

function showFileName(input) {
    const fileNameSpan = document.getElementById('fileName');
    fileNameSpan.innerText = input.files.length > 0 ? input.files[0].name : "";
}

async function uploadPDF() {
    const input = document.getElementById("pdfFile");
    const resultBox = document.getElementById("result");
    const copyBtn = document.getElementById("copyBtn");

    if (!input.files[0]) {
        alert("Please select a PDF file first.");
        return;
    }

    resultBox.innerText = "";
    resultBox.classList.remove("fade");
    copyBtn.hidden = true;

    const formData = new FormData();
    formData.append("file", input.files[0]);

    try {
        const res = await fetch(backendURL, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        resultBox.innerText = data.summary || "No summary returned.";
        resultBox.classList.add("fade");
        copyBtn.hidden = false;
    } catch (err) {
        console.error(err);
        resultBox.innerText = "Failed to summarize PDF.";
    }
}

function copySummary() {
    const text = document.getElementById("result").innerText;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        alert("Summary copied to clipboard!");
    });
}
