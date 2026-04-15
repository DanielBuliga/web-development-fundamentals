function incarcaPersoane() {
    console.log("Funcția incarcaPersoane a fost apelată");
    
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "resurse/persoane.xml", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const xmlDoc = xhr.responseXML;

            const persoane = xmlDoc.getElementsByTagName("persoana");

            let tabel = "<table>";
            tabel += `
                <tr>
                    <th>ID</th>
                    <th>Nume</th>
                    <th>Prenume</th>
                    <th>Vârstă</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Adresă</th>
                </tr>
            `;

            for (let i = 0; i < persoane.length; i++) {
                const p = persoane[i];
                const id = p.getAttribute("id");
                const nume = p.getElementsByTagName("nume")[0].textContent;
                const prenume = p.getElementsByTagName("prenume")[0].textContent;
                const varsta = p.getElementsByTagName("varsta")[0].textContent;
                const email = p.getElementsByTagName("email")[0].textContent;
                const telefon = p.getElementsByTagName("telefon")[0].textContent;

                const adresa = p.getElementsByTagName("adresa")[0];
                const strada = adresa.getElementsByTagName("strada")[0].textContent;
                const numar = adresa.getElementsByTagName("numar")[0].textContent;
                const localitate = adresa.getElementsByTagName("localitate")[0].textContent;
                const judet = adresa.getElementsByTagName("judet")[0].textContent;
                const tara = adresa.getElementsByTagName("tara")[0].textContent;

                const adresaCompleta = `${strada}, nr. ${numar}, ${localitate}, ${judet}, ${tara}`;

                tabel += `
                    <tr>
                        <td>${id}</td>
                        <td>${nume}</td>
                        <td>${prenume}</td>
                        <td>${varsta}</td>
                        <td>${email}</td>
                        <td>${telefon}</td>
                        <td>${adresaCompleta}</td>
                    </tr>
                `;
            }

            tabel += "</table>";

            document.getElementById("continut").innerHTML = tabel;
        }
    };

    xhr.open("GET", "resurse/persoane.xml", true);
    xhr.send();
}