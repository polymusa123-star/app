// Save data to server
document.getElementById('dataForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  await fetch('/data', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, email })
  });

  alert('Data saved!');
  loadData();
});

// Load data from server
async function loadData() {
  const res = await fetch('/data');
  const items = await res.json();

  const list = document.getElementById('dataList');
  list.innerHTML = '';

  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} (${item.email})`;
    list.appendChild(li);
  });
}
