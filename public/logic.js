function search(searchTerm, type) {
    if (!type) {
        type = "all";
    }
    document.getElementById("list").innerHTML = "";
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let parser = JSON.parse(xhttp.responseText);
            for (let i = 0; i < parser.length; i++) {
                let listItem = document.createElement("LI");
                let a = document.createElement("A");
                a.href = parser[i].url;
                a.text = parser[i].information
                listItem.appendChild(a)
                document.getElementById("list").appendChild(listItem);
                let breakLine = document.createElement("BR");
                document.getElementById("list").appendChild(breakLine);
            }
        }

    }
    xhttp.open("GET", "/private/search?searchTerm=" + searchTerm + "&type=" + type, true);
    xhttp.send();
}