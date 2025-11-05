const express = require('express');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Database file
const dbFile = 'database.json';

// GET all data
app.get('/data', (req, res) => {
  fs.readFile(dbFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading database');
    res.send(JSON.parse(data || '[]'));
  });
});

// POST new data
app.post('/data', (req, res) => {
  const newItem = req.body;

  fs.readFile(dbFile, 'utf8', (err, data) => {
    let items = [];
    if (!err && data) items = JSON.parse(data);

    items.push(newItem);

    fs.writeFile(dbFile, JSON.stringify(items, null, 2), (err) => {
      if (err) return res.status(500).send('Error saving data');
      res.send({ message: 'Data saved successfully!' });
    });
  });
});

// DELETE data by index
app.delete('/delete/:index', (req, res) => {
  const index = parseInt(req.params.index);

  fs.readFile(dbFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading database');
    let items = JSON.parse(data || '[]');

    if (index < 0 || index >= items.length) {
      return res.status(400).send({ message: 'Invalid index' });
    }

    items.splice(index, 1);

    fs.writeFile(dbFile, JSON.stringify(items, null, 2), (err) => {
      if (err) return res.status(500).send('Error writing database');
      res.send({ message: 'Record deleted successfully!' });
    });
  });
});

// 🧾 DOWNLOAD as Word document
app.get('/download', (req, res) => {
  fs.readFile(dbFile, 'utf8', async (err, data) => {
    if (err) return res.status(500).send('Error reading database');

    const items = JSON.parse(data || '[]');
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Attendance Report", bold: true, size: 32 })],
          }),
          new Paragraph(""),
          ...items.map((item, i) => {
            const qr = JSON.parse(item.qr_content);
            return new Paragraph({
              children: [
                new TextRun(`ID: ${qr.idnumber} | Name: ${qr.name} | Date: ${item.date} | Time: ${item.time}`)
              ],
            });
          }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('attendance.docx', buffer);
    res.download('attendance.docx', 'attendance.docx', (err) => {
      if (err) res.status(500).send('Error downloading Word file');
    });
  });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running at http://localhost:${PORT}`));
