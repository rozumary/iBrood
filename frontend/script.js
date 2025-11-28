// === SCRIPT FOR BROOD DETECTION ===

const form = document.getElementById('upload-form');
const imageInput = document.getElementById('image-input');
const preview = document.getElementById('preview');
const resultBox = document.getElementById('result');
const outputImg = document.getElementById('output-img');

// Show preview when image is selected
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove('d-none');
  }
});

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = imageInput.files[0];
  if (!file) {
    alert("Please select an image.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  // Clear previous results
  outputImg.src = '';
  outputImg.classList.add("d-none");
  resultBox.innerHTML = '';
  resultBox.classList.add("d-none");

  try {
    // Use relative path so it works locally and on deployment
    const res = await fetch("/detect", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      alert("Detection failed:\n" + errText);
      return;
    }

    const data = await res.json();

    // Display annotated image if available
    if (data.image_base64) {
      outputImg.src = `data:image/jpeg;base64,${data.image_base64}`;
      outputImg.classList.remove("d-none");
    }

    // Display summary and cells info
    let html = '';

    if (data.summary && Object.keys(data.summary).length > 0) {
      html += `
        <div class="alert alert-warning">
          <h5>Detected Brood Types:</h5>
          ${Object.entries(data.summary).map(([label, count]) => `
            <div class="d-flex justify-content-between">
              <span>${label}</span>
              <span class="badge bg-dark">${count}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (data.cells && data.cells.length > 0) {
      html += `
        <h5 class="mt-4">Cell Details</h5>
        <table class="table table-bordered table-sm">
          <thead class="table-light">
            <tr>
              <th>Type</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            ${data.cells.map(cell => `
              <tr>
                <td>${cell.type}</td>
                <td>${(cell.confidence * 100).toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (html) {
      resultBox.innerHTML = html;
      resultBox.classList.remove("d-none");
    }

  } catch (err) {
    alert("Something went wrong: " + err.message);
  }
});

// Optional: reset function
window.resetForm = function () {
  imageInput.value = '';
  preview.src = '';
  preview.classList.add('d-none');
  outputImg.src = '';
  outputImg.classList.add('d-none');
  resultBox.innerHTML = '';
  resultBox.classList.add('d-none');
};
