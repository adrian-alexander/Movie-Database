// function registerUser() {
//     let count = 0;
//     for (user in users) {
//         if (document.getElementById("usernameInput").value === users[user].username) {
//             count++;
//         } 
//     }
//     //Hardcoding this for now. Will fix for project check-in 3.
//     let user3 = {};
//     if (count === 0) {
//         users[user3] = {
//             username: document.getElementById("usernameInput").value,
//             password: document.getElementById("passwordInput").value,
//             registered: "true",
//             watchlist: "",
//             favouriteMovie: ""
//         }
//         console.log("Successfully registered.");
//     }
// }

// function loginUser() {
//     for (user in users) {
//         if (document.getElementById("usernameInput").value === users[user].username) {
//             if (document.getElementById("passwordInput").value === users[user].password) {
//                 console.log("Success!");
//             }
//         }
//     }
//     console.log("Nope.");
// }

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

function watchlist(movieTitle) {
    //Haven't implemented on website yet
    //Add delete functionality when button click
    //Add different user functionality.
    users[user3] = {
        watchlist: movieTitle
    }
	console.log("Successfully added " + movieTitle + " to your watchlist.");
}

function favouriteMovie(movieTitle) {
    //Haven't implemented on website yet
    //Add different user functionality.
    users[user3] = {
        favouriteMovie: movieTitle
    }
	console.log("Successfully set " + movieTitle + " as your favourite movie.");
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