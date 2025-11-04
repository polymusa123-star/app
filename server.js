const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json()); // allows JSON body parsing
app.use(express.static('public'));

// Database file (JSON)
const dbFile = 'database.json';

// Read data
app.get('/data', (req, res) => {
  fs.readFile(dbFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading database');
    res.send(JSON.parse(data || '[]'));
  });
});

// Add new data
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

app.listen(3000,'0.0.0.0', () => console.log(`Server running at http://localhost:3000`));
