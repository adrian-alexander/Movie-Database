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

async function accountType() {

    let currentUser = await request({ path: "/private/users/me", method: "GET" });
    if (currentUser.userType == "normal") {
        currentUser.userType = "contributor";
    }
    else {
        currentUser.userType = "normal";
    }

    await request({ path: "/private/users/me", method: "POST", body: currentUser });
    location.reload();
}

async function followPerson() {
    let path = "/api/people?name=" + document.getElementById('idDataCell').innerHTML;
    let person = await request({ path: path, method: "GET" });
    let currentUser = await request({ path: "/private/users/me", method: "GET" });

    if (document.getElementById('followPerson').innerHTML == "Follow") {
        currentUser.peopleFollowing.push(person.personID);
    }
    else if (document.getElementById('followPerson').innerHTML == "Remove") {
        currentUser.peopleFollowing = currentUser.peopleFollowing.filter((filter => {return filter !== person.personID}));
    }

    await request({ path: "/private/users/me", method: "POST", body: currentUser });
    location.reload();

}

async function followUser() {
    let path = "/api/users/" + document.getElementById('idDataCell').innerHTML;
    let user = await request({ path: path, method: "GET" });
    let currentUser = await request({ path: "/private/users/me", method: "GET" });

    if (document.getElementById('followUser').innerHTML == "Follow") {
        currentUser.usersFollowing.push(user.userID);
    }
    else if (document.getElementById('followUser').innerHTML == "Remove") {
        currentUser.usersFollowing = currentUser.usersFollowing.filter((filter => {return filter !== user.userID}));
    }

    await request({ path: "/private/users/me", method: "POST", body: currentUser });
    location.reload();

}

async function watchlist() {
    let currentUser = await request({ path: "/private/users/me", method: "GET" });


    if (document.getElementById('addToWatchlistButton').innerHTML == "Add to watchlist") {
        currentUser.watchlist.push(document.getElementById('idDataCell').innerHTML);
    }
    else if (document.getElementById('addToWatchlistButton').innerHTML == "Remove from watchlist") {
        currentUser.watchlist = currentUser.watchlist.filter((filter => {return filter !== document.getElementById('idDataCell').innerHTML}));
    }

    await request({ path: "/private/users/me", method: "POST", body: currentUser });
    location.reload();
}

async function favourites() {
    let currentUser = await request({ path: "/private/users/me", method: "GET" });
    if (document.getElementById('addToFavouritesButton').innerHTML == "Add to favourite movies") {
        currentUser.favouriteMovies.push(document.getElementById('idDataCell').innerHTML);
    }
    else if (document.getElementById('addToFavouritesButton').innerHTML == "Remove from favourite movies") {
        currentUser.favouriteMovies = currentUser.favouriteMovies.filter((filter => {return filter !== document.getElementById('idDataCell').innerHTML}));
    }

    await request({ path: "/private/users/me", method: "POST", body: currentUser });
    location.reload();
}

async function request(object) {
    let requestOptions = { method: object.method, headers: { "Content-Type": "application/json" } };
    if (object.body) {
        requestOptions.body = JSON.stringify(object.body);
    }
    let request = await fetch(object.path, requestOptions);
    try {
        return await request.json();
    } catch {
        return null;
    }
}

async function review() {
    let currentUser = await request({ path: "/private/users/me", method: "GET" });
    let body = [];

    if (currentUser.reviews == undefined) {
        currentUser.reviews = [];
    }
    currentUser.reviews.push({
        review: document.getElementById('review').value,
        reviewOutOf10: document.getElementById('reviewOutOf10').value,
        movie: document.getElementById('movieID').innerHTML
    })
    body.push({
        review: document.getElementById('review').value,
        reviewOutOf10: document.getElementById('reviewOutOf10').value,
        user: currentUser,
        movie: document.getElementById('movieID').innerHTML
    })

    let path = "/private/movie/" + document.getElementById('movieID') + "/reviews";
    await request({ path: "/private/users/me", method: "POST", body: currentUser });
    await request({ path: path, method: "POST", body: body });
    location.reload();
}

if (document.getElementById('changeAccountType')) {
    document.getElementById('changeAccountType').addEventListener('click', accountType);
}
if (document.getElementById('followPerson')) {
    document.getElementById('followPerson').addEventListener('click', followPerson);
}
if (document.getElementById('addToWatchlistButton')) {
    (document.getElementById('addToWatchlistButton').addEventListener('click', watchlist));
}
if (document.getElementById('addToFavouritesButton')) {
    (document.getElementById('addToFavouritesButton').addEventListener('click', favourites));
}
if (document.getElementById('followUser')) {
    (document.getElementById('followUser').addEventListener('click', followUser));
}
if (document.getElementById('commentButton')) {
    (document.getElementById('commentButton').addEventListener('click', review));
}
if (document.getElementById('editMovieButton')) {
    (document.getElementById('editMovieButton').addEventListener('click', editMovie));
}