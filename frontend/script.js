const form = document.getElementById('upload-form');
const imageInput = document.getElementById('image-input');
const preview = document.getElementById('preview');
const resultBox = document.getElementById('result');
const outputImg = document.getElementById('output-img');

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove('d-none');
  }
});

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

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("image")) {
      const blob = await res.blob();
      console.log("Blob type:", blob.type); 
      outputImg.src = URL.createObjectURL(blob);
      outputImg.classList.remove("d-none");
      resultBox.classList.remove("d-none");
    } else {
      const errJson = await res.json();
      alert("Detection failed: " + errJson.error);
    }
  } catch (err) {
    alert("Something went wrong: " + err.message);
  }
});
