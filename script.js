const canvas = document.getElementById('signature-pad');
const ctx = canvas.getContext('2d');

// Resize canvas to fit display size
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let drawing = false;

function startPosition(e) {
  drawing = true;
  draw(e);
}

function endPosition() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Mouse events
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Touch events
canvas.addEventListener('touchstart', startPosition);
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', draw);

// Prevent scroll on touch
canvas.addEventListener("touchstart", e => e.preventDefault());
canvas.addEventListener("touchmove", e => e.preventDefault());

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const diabetes = document.getElementById("diabetes").checked;
  const hypertension = document.getElementById("hypertension").checked;
  const asthma = document.getElementById("asthma").checked;
  const notes = document.getElementById("notes").value;
  const patientId = document.getElementById("patientId").value;

  if (!patientId) {
    alert("Patient ID is blank. The file could not be saved.");
    return;
  }

  let y = 10;
  doc.setFontSize(16);
  doc.text("Patient Information Report", 10, y);
  y += 10;
  doc.setFontSize(12);
  doc.text(`Patient ID: ${patientId}`, 10, y);
  y += 10;
  doc.text(`Patient Name: ${name}`, 10, y);
  y += 10;
  doc.text(`Age: ${age}`, 10, y);
  y += 10;
  doc.text("Diseases:", 10, y);
  if (diabetes) doc.text("- Diabetes", 20, (y += 10));
  if (hypertension) doc.text("- Hypertension", 20, (y += 10));
  if (asthma) doc.text("- Asthma", 20, (y += 10));
  if (!diabetes && !hypertension && !asthma)
    doc.text("- None selected", 20, (y += 10));
  y += 10;
  doc.text(`Notes: ${notes}`, 10, y);
  y += 10;

  const signatureData = canvas.toDataURL("image/png");
  doc.addImage(signatureData, "PNG", 10, y, 60, 30);

  doc.save(`${patientId}.pdf`);

  // Reset the form and signature pad
  document.getElementById("patientForm").reset();
  clearSignature();

  // Show success alert
  alert("Form saved successfully!");
}
