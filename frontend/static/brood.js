// BROOD CELL DETECTION
const form = document.getElementById('upload-form');
const imageInput = document.getElementById('image-input');
const preview = document.getElementById('preview');
const resultBox = document.getElementById('result');
const outputImg = document.getElementById('output-img');



// Preview selected image
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove('d-none');
  }
});

// Form submit for brood detection
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = imageInput.files[0];
  if (!file) {
    alert("Please select an image.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  outputImg.src = '';
  outputImg.classList.add("d-none");
  resultBox.innerHTML = '';
  resultBox.classList.add("d-none");

  try {
    const res = await fetch("http://127.0.0.1:8000/detect", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      alert("Detection failed:\n" + errorText);
      return;
    }

    const data = await res.json();

    if (data.image_base64) {
      outputImg.src = "data:image/jpeg;base64," + data.image_base64;
      outputImg.classList.remove("d-none");

      let summaryHTML = `<h5>📝 Brood Cell Detection Summary:</h5><ul>`;
      for (const [label, count] of Object.entries(data.summary)) {
        summaryHTML += `<li><strong>${label}</strong>: ${count}</li>`;
      }
      summaryHTML += `</ul>`;
      summaryHTML += `<p><strong>Health Score:</strong> ${data.health_score}%</p>`;
      summaryHTML += `<p><strong>Verdict:</strong> ${data.verdict}</p>`;

      resultBox.innerHTML = summaryHTML;
      resultBox.classList.remove("d-none");
    } else {
      alert("Detection failed: No image returned.");
    }

  } catch (err) {
    alert("Something went wrong: " + err.message);
  }
});

