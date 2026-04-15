function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Completează numele de utilizator și parola!");

        return;
    }

    const date = {
        utilizator: username,
        parola: password
    };

    fetch("/api/utilizatori", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(date)
    })
    .then(async response => {
        const text = await response.text();
        if (!response.ok) throw new Error(text);
        return text;
    })

    .then(msg => {
        alert(msg);
        console.log("Răspuns server:", msg);
    })
    .catch(err => {
        console.error("Eroare:", err);
        alert("Eroare la înregistrare!:\n" + err.message);
    });
}

