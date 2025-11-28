// === QUEEN CELL DETECTION ===

const form = document.getElementById('upload-form');
const imageInput = document.getElementById('image-input');
const preview = document.getElementById('preview');
const resultBox = document.getElementById('result');
const outputImg = document.getElementById('output-img');

// === Short label mapping for display ===
const shortLabelMap = {
  "Queen Cup (Initiation)": "Queen Cup",
  "Open Queen Cell (3–5 days, larva visible)": "Open Cell",
  "Closed Queen Cell (5–8 days, uniform cap)": "Closed Cell",
  "Matured Queen Cell (dark conical tip)": "Matured",
  "Post Hatch Cell (jagged/open tip, emerged)": "Hatched",
  "Failed Cell (dead/abnormal)": "Failed"
};

// === Preview the selected image ===
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove('d-none');
  }
});

// === Handle form submission and detection ===
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = imageInput.files[0];
  if (!file) {
    alert("Please select an image before submitting.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  // Reset result display
  outputImg.src = '';
  outputImg.classList.add("d-none");
  resultBox.innerHTML = '';
  resultBox.classList.add("d-none");

  try {
    // Show processing message
    resultBox.innerHTML = `
      <div class="text-muted">
        <i class="bi bi-hourglass-split"></i> Detecting queen cell maturity...
      </div>`;
    resultBox.classList.remove("d-none");

    const res = await fetch("http://127.0.0.1:8000/queen_detect", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error("Queen detection failed:\n" + errorText);
    }

    const data = await res.json();

    if (!data.image_base64) {
      throw new Error("No image returned from detection.");
    }

    // === Show output image ===
    outputImg.src = "data:image/jpeg;base64," + data.image_base64;
    outputImg.classList.remove("d-none");

    // === Build Detection Summary ===
    let summaryHTML = `
      <h5><i class="bi bi-collection"></i> Detection Summary</h5>
      <ul class="list-group mb-3">`;

    for (const [label, count] of Object.entries(data.summary)) {
      summaryHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${label}
          <span class="badge bg-dark rounded-pill">${count}</span>
        </li>`;
    }
    summaryHTML += `</ul>`;

    // === Final Verdict Message ===
    if (data.result) {
      summaryHTML += `
        <div class="alert alert-info">
          <i class="bi bi-patch-check"></i> <strong>Verdict:</strong> ${data.result}
        </div>`;
    }

    // === Estimated Hatching Table ===
    if (data.cells && data.cells.length > 0) {
      const grouped = {};

      data.cells.forEach(cell => {
        const fullLabel = cell.type;
        const shortLabel = shortLabelMap[fullLabel] || fullLabel;

        // Ensure "Matured" cells always show "Due any time"
        let hatching = cell.estimated_hatching || '–';
        if (shortLabel === "Matured") hatching = "Due any time";

        if (!grouped[shortLabel]) {
          grouped[shortLabel] = {
            count: 0,
            estimated_hatching: hatching
          };
        }
        grouped[shortLabel].count++;
      });

      summaryHTML += `
        <h6><i class="bi bi-calendar-event"></i> Estimated Hatching</h6>
        <table class="table table-sm table-bordered">
          <thead class="table-light">
            <tr>
              <th>Queen Cell Type</th>
              <th>Count</th>
              <th>Estimated Hatching</th>
            </tr>
          </thead>
          <tbody>`;

      for (const [shortType, info] of Object.entries(grouped)) {
        summaryHTML += `
          <tr>
            <td>${shortType}</td>
            <td>${info.count}</td>
            <td>${info.estimated_hatching}</td>
          </tr>`;
      }

      summaryHTML += `</tbody></table>`;
    }

    resultBox.innerHTML = summaryHTML;
    resultBox.classList.remove("d-none");

  } catch (err) {
    console.error(err);
    resultBox.innerHTML = `
      <div class="text-danger">
        <i class="bi bi-x-circle"></i> ${err.message}
      </div>`;
  }
});
