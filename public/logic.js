function registerUser() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", '/register', true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
            console.log("Request finished.");
        }
    }
    let body = {
        username: document.getElementById("usernameInput").value,
        password: document.getElementById("passwordInput").value 
    }
    xhr.send(JSON.stringify(body));
}

function searchInput(event) {
    if (event.keyCode == 13) {
        search(event.target.value, "");
    }
}

function search(searchTerm, type) {
    if (!type) {
        type = "all";
    }
    document.getElementById("list").innerHTML = "";
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
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