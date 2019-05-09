
function dataCallPlayers () {
    fetch("http://localhost:8080/api/players", {
        method: "GET"
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(function (json) {

        playerList = json;
        console.log(playerList,2222)

        createLeaderboard()

    }).catch(function (error) {
        console.log("Request failed: " + error.message);
    });

}
dataCallPlayers ();


function dataCallGames () {
    fetch("http://localhost:8080/api/games", {
        method: "GET"
    }).then(function (response) {
        if (response.ok) {
            return response.json();

        }
        throw new Error(response.statusText);
    }).then(function (json) {

        playerGames = json;
        games = playerGames.games;
        gamePlayers = playerGames.games[0];

        creatingList(games);
        console.log(games, 1111);

    }).catch(function (error) {
        console.log("Request failed: " + error.message);
    });

}
dataCallGames ();


function creatingList(games) {

    var gameList = document.getElementById("gameList");
    var urList = document.createElement("ul");
    gameList.appendChild(urList);
    games.forEach(game => {
        var list = document.createElement("li");
        urList.appendChild(list);
            var playerName = game.gameplayers.map(gp => gp.player.name)
            list.textContent = "Game " + game.id + " was created " + game.created + ", " +
                "Players: " + playerName[0] + " vs " + playerName[1]
    })
}

function createLeaderboard() {

    var table = document.getElementById("leaderboard");
    var thead = document.createElement("thead");
    table.appendChild(thead);
    var trTh = document.createElement("tr");
    thead.appendChild(trTh);
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    var ths = ["Name", "Total", "Won", "Lost", "Tied"];

    ths.forEach(th => {
        var th1 = document.createElement("th");
        trTh.appendChild(th1);
        th1.textContent = th;
        th1.className = th;
    })

    playerList.forEach(player => {
        var trPlayer = document.createElement("tr");
            tbody.appendChild(trPlayer);
        var tdPlayer = document.createElement("td");
            trPlayer.appendChild(tdPlayer);
            tdPlayer.textContent = player.name;
        var totTd = document.createElement("td");
            trPlayer.appendChild(totTd);
            totTd.textContent = player.score.map(sc => sc.score)
                .reduce((a,b) => a + b);

        var tdWin = document.createElement("td");
        trPlayer.appendChild(tdWin);
        var tdLose = document.createElement("td");
        trPlayer.appendChild(tdLose);
        var tdTie = document.createElement("td");
        trPlayer.appendChild(tdTie);

        tdWin.textContent = player.score.filter(sc => sc.score == 1).length;
        tdLose.textContent = player.score.filter(sc => sc.score == 0).length;
        tdTie.textContent = player.score.filter(sc => sc.score == 0.5).length;

    })

}


const signIn = () => {
    let userName = document.getElementById("name").value;
    let password = document.getElementById("password").value;
    if (userName || password == null) {
        alert("Username or password is empty")
    }

    fetch("http://localhost:8080/api/players", {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:"userName=" + userName + "&password=" + password
    }).then(function (response) {
        let logInButton = document.getElementById("logInForm");
        if (response.ok) {
            logInButton.style.display = "none"}
    }).catch(function(error) {
        alert('Player not saved: ' + error.message);
    });

};

const logIn = () => {
    let userName = document.getElementById("name").value;
    let password = document.getElementById("password").value;

    fetch("http://localhost:8080/api/login", {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:"userName=" + userName + "&password=" + password
    }).then(function (response) {

        let logInButton = document.getElementById("logInForm");
        let logOutButton = document.getElementById("logOutForm");

        if (response.ok) {
            logOutButton.style.display = "block";
            logInButton.style.display = "none"
        }
        }).catch(function(error) {
        alert('Not logged in: ' + error.message);
    });

}

const logOut = () => {

    fetch("http://localhost:8080/api/logout", {
        method: 'POST',
    }).then(function (response) {

        let logInButton = document.getElementById("logInForm");
        let logOutButton = document.getElementById("logOutForm");

        if (response.ok) {
            logOutButton.style.display = "none";
            logInButton.style.display = "block"
        }
    }).catch(function(error) {
        alert('Not logged out: ' + error.message);
    });

}
