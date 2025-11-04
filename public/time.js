function updateTimeDate(){
    const now= new Date();
    document.getElementById('date').textContent = now.toLocaleDateString();
    document.getElementById('time').textContent = now.toLocaleTimeString();

}
setInterval(updateTimeDate, 1000);
updateTimeDate();