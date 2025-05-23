let canvas = document.getElementById("signaturePad");
let ctx = canvas.getContext("2d");
let isDrawing = false;

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

// For touch devices
canvas.addEventListener("touchstart", startDraw, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDraw);

function startDraw(e) {
  isDrawing = true;
  ctx.beginPath();
  let pos = getPos(e);
  ctx.moveTo(pos.x, pos.y);
  e.preventDefault();
}

function draw(e) {
  if (!isDrawing) return;
  let pos = getPos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  e.preventDefault();
}

function stopDraw(e) {
  isDrawing = false;
  e.preventDefault();
}

function getPos(e) {
  if (e.touches) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  } else {
    return {
      x: e.offsetX,
      y: e.offsetY,
    };
  }
}

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

  let y = 10;
  doc.text(`Patient Name: ${name}`, 10, y);
  y += 10;
  doc.text(`Age: ${age}`, 10, y);
  y += 10;
  doc.text(`Diseases:`, 10, y);
  if (diabetes) doc.text("- Diabetes", 20, (y += 10));
  if (hypertension) doc.text("- Hypertension", 20, (y += 10));
  if (asthma) doc.text("- Asthma", 20, (y += 10));
  if (!diabetes && !hypertension && !asthma)
    doc.text("- None selected", 20, (y += 10));
  y += 10;
  const signatureData = canvas.toDataURL("image/png");
  doc.addImage(signatureData, "PNG", 10, y + 10, 60, 30);
  doc.text(`Notes: ${notes}`, 10, y);
  let patientId = document.getElementById("patientId").value;
  if (patientId == null || patientId == "") {
    alert("Patient ID is blank. The file could not be saved.");
    return;
  }
  doc.save(patientId);
}
