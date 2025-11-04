const resultElement = document.getElementById('result');
const qrScanner = new Html5Qrcode("camera");

qrScanner.start(
  { facingMode: "environment" }, // Use back camera
  { fps: 10, qrbox: 250 },
  qrCodeMessage => {
    // Stop scanner after detecting one code
    qrScanner.stop().then(() => console.log("Scanner stopped"));

    // Display scanned QR code
    resultElement.textContent = `Scanned: ${qrCodeMessage}`;

    // Record current date/time
    const now = new Date();
    const scanRecord = {
      qr_content: qrCodeMessage,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString()
    };

    console.log("Sending scan data:", scanRecord);

    // Send data to Node.js server
    fetch('/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scanRecord)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Server response:", data);
      alert("QR scan saved successfully!");
    })
    .catch(err => {
      console.error("Error saving scan:", err);
      alert("Error saving scan");
    });
  },
  errorMessage => {
    // Ignore continuous scan errors
  }
);