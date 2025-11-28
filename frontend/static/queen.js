// === QUEEN CELL DETECTION ===

const form = document.getElementById('upload-form');
const imageInput = document.getElementById('image-input');
const preview = document.getElementById('preview');
const resultBox = document.getElementById('result');
const outputImg = document.getElementById('output-img');

// === QUEEN CELL DETECTION FRONTEND SCRIPT ===

// Short display names for UI
const SHORT_LABELS = {
    "Open Queen Cell": "Open",
    "Capped Queen Cell": "Capped",
    "Semi-Mature Cell": "Semi-Mature",
    "Matured Cell": "Matured",
    "Failed Cell": "Failed"
};

// Estimated hatching fallback (ensures correct display)
const HATCHING_BY_TYPE = {
    "Open Queen Cell": "3–5 days until hatch",
    "Capped Queen Cell": "1–3 days until hatch",
    "Semi-Mature Cell": "1–2 days until hatch",
    "Matured Cell": "Due anytime – IMMEDIATE HATCH EXPECTED",
    "Failed Cell": "No hatch expected"
};

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("image-input");
    const result = document.getElementById("result");
    const outputImg = document.getElementById("output-img");
    const downloadBtn = document.getElementById("download-btn");

    window.detectQueenCell = async function () {
        if (!input.files || !input.files[0]) {
            alert("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("file", input.files[0]);

        result.innerHTML = `
            <p class="text-muted">
                <i class="bi bi-hourglass-split"></i> Analyzing queen cells...
            </p>
        `;

        outputImg.style.display = "none";
        downloadBtn.style.display = "none";

        try {
            const res = await fetch("/queen_detect", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg);
            }

            const data = await res.json();

            // === Display annotated image ===
            if (data.image_base64) {
                outputImg.src = `data:image/jpeg;base64,${data.image_base64}`;
                outputImg.style.display = "block";
                downloadBtn.style.display = "inline-block";
            }

            // =====================================================
            // 1. SUMMARY TABLE (counts per class)
            // =====================================================
            let html = `
                <div class="alert alert-warning">
                    <h5><i class="bi bi-clipboard-check"></i> Detected Queen Cell Types:</h5>
                    ${Object.entries(data.summary || {}).map(([label, count]) => `
                        <div class="d-flex justify-content-between">
                            <span>${SHORT_LABELS[label] || label}</span>
                            <span class="badge bg-dark">${count}</span>
                        </div>
                    `).join("")}
                </div>
            `;

            // =====================================================
            // 2. HATCHING TABLE (group cells by class)
            // =====================================================
            if (data.cells && data.cells.length > 0) {
                const grouped = {};

                data.cells.forEach(cell => {
                    const type = cell.type;
                    const shortName = SHORT_LABELS[type] || type;

                    if (!grouped[shortName]) {
                        grouped[shortName] = {
                            count: 0,
                            estimated_hatching: cell.estimated_hatching || HATCHING_BY_TYPE[type] || "–"
                        };
                    }

                    grouped[shortName].count++;
                });

                html += `
                    <h5 class="mt-4"><i class="bi bi-calendar-event"></i> Estimated Hatching Time</h5>
                    <table class="table table-bordered table-sm">
                        <thead class="table-light">
                            <tr>
                                <th>Queen Cell Type</th>
                                <th>Count</th>
                                <th>Estimated Hatching</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(grouped).map(([label, info]) => `
                                <tr>
                                    <td>${label}</td>
                                    <td>${info.count}</td>
                                    <td>${info.estimated_hatching}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                `;
            }

            result.innerHTML = html;

        } catch (err) {
            console.error("DETECTION ERROR:", err);
            result.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-x-circle"></i> Detection failed.<br>
                    <small>${err.message}</small>
                </div>
            `;
        }
    };

    // === Reset Form ===
    window.resetForm = function () {
        input.value = "";
        outputImg.src = "";
        outputImg.style.display = "none";
        downloadBtn.style.display = "none";
        result.innerHTML = "";
    };

    // === Download Image ===
    window.downloadImage = function () {
        const link = document.createElement("a");
        link.href = outputImg.src;
        link.download = "annotated_queen_cells.jpg";
        link.click();
    };
});
