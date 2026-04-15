function initVerify() {
    console.log("initVerificare încărcat");
    const button = document.querySelector("button");
    if (button) {
        button.addEventListener("click", verificaUtilizator);
    }
  }
  
  function checkUser() {
    const username = document.getElementById("user").value;
    const password = document.getElementById("pass").value;

    fetch("resurse/utilizatori.json")
        .then(response => {
            if (!response.ok) throw new Error("Eroare la încărcarea utilizatorilor");
            return response.text();
        })
        .then(text => {
            const users = JSON.parse(text);
            const matchedUser = users.find(u => u.utilizator === username && u.parola === password);
            const resultElement = document.getElementById("result");

            if (matchedUser) {
                alert("Autentificare reușită!");
            } else {
                alert("Utilizator sau parolă greșite!")
            }
        })
        .catch(err => console.error("Eroare:", err));
}