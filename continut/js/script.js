function updateDate(){
  document.getElementById("date").innerHTML = new Date().toString();
}

function getInfo(){
    setInterval(updateDate, 1000);
    document.getElementById("location").innerHTML  = getLocation();
    document.getElementById("url").innerHTML = window.location.pathname;
    let browser = navigator.appName;
    let version = navigator.appVersion;
    document.getElementById("browser").innerHTML = 
    "Browser Name: " + browser + "<br>" +
    " Version: " + version;
    document.getElementById("os").innerHTML = "Operating System: " + navigator.platform;
}

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else { 
        document.getElementById("location").innerHTML =
        "Geolocation is not supported by this browser.";
      }
      
      function showPosition(position) {
        document.getElementById("location").innerHTML =
        "Latitude: " + position.coords.latitude + "<br>" +
        "Longitude: " + position.coords.longitude;
      }
}

function initDraw() {
  const powerBtn = document.getElementById('powerBtn');
  const screen = document.getElementById('screen');

  const idsToShow = [
    'line0',
    'line1', 'pulse',
    'line2', 'heart',
    'line3', 'smiley',
    'line4', 'snake',
    'text1'
  ];

  powerBtn.addEventListener('click', () => {
    screen.setAttribute('fill', 'white');

    const text2 = document.getElementById('powerMessage');
    text2.classList.add('hidden');

    idsToShow.forEach((id, index) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        el.classList.remove('hidden');
        el.classList.add('fadeIn');
      }, 500 * index);
    });

    setTimeout(() => {
      const smiley = document.getElementById('smiley');
      smiley.classList.remove('hidden');
      smiley.classList.add('bounceIn');
  }, 2500);
  });
}

let canvas, ctx;
let firstClick = 0;

function drawRectangle(p1, p2) {
  const x = Math.min(p1.x, p2.x);
  const y = Math.min(p1.y, p2.y);
  const width = Math.abs(p2.x - p1.x);
  const height = Math.abs(p2.y - p1.y);

  ctx.strokeStyle = document.getElementById("strokeColor").value;
  ctx.fillStyle = document.getElementById("fillColor").value;

  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
}

function Canvas() {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");

  canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!firstClick) {
      firstClick = { x, y };
    } else {
      const secondClick = { x, y };
      drawRectangle(firstClick, secondClick);
      firstClick = 0;
    }
  });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let initialTable;
let addedRows = 0;
let addedCols = 0;

document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("myTable");
  if (table) {
      initialTable = table.innerHTML; 
  } else {
      console.error("Tabelul cu id 'myTable' nu a fost găsit!");
  }
})

function insertRow() {
  const table = document.getElementById("myTable");
  const line = parseInt(document.getElementById("pozition").value);
  const bgColor = document.getElementById("bgColor").value;

  if (!line || line > table.rows.length|| line < 1) {
      alert("Linie invalidă!");
      return;
  }

  const newRow = table.insertRow(line);
  for (let i = 0; i < table.rows[0].cells.length; i++) {
      const cell = newRow.insertCell(i);
      cell.textContent = `Nou R${line}, C${i + 1}`;
      cell.style.backgroundColor = bgColor;
  }

  addedRows++;
  checkReset(table);
}

function insertColumn() {
  const table = document.getElementById("myTable");
  const col = parseInt(document.getElementById("pozition").value);
  const bgColor = document.getElementById("bgColor").value;

  if (!col || col > table.rows[0].cells.length || col < 1) {
      alert("Coloană invalidă!");
      return;
  }

  for (let i = 0; i < table.rows.length; i++) {
      const cell = table.rows[i].insertCell(col - 1);
      cell.textContent = `Nou R${i + 1}, C${col}`;
      cell.style.backgroundColor = bgColor;
  }

  if(col == table.rows.length)
  {
      cell = table.rows[i].insertCell(col-1);
      cell.textContent = `Nou R${i + 1}, C${col}`;
      cell.style.backgroundColor = bgColor;
  }

  addedCols++;
  checkReset(table);

}

function checkReset(table) {
  if (addedRows > 5 || addedCols > 5) {
      alert("S-a atins limita de 5 linii/5 coloane. Tabelul se resetează.");
      table.innerHTML = initialTable;
      addedRows = 0;
      addedCols = 0;
  }
}
