
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

        // creatingList(games);
        // crearLista(playerGames);
        showButtoms();

    }).catch(function (error) {
        console.log("Request failed: " + error.message);
    });

}
dataCallGames ();



const showButtoms =()=> {
    const playerName =document.getElementById("playerName");
    const logged_user = playerGames.logged_player;
    const logInButton = document.getElementById("logInForm");
    const logOutButton = document.getElementById("logOutForm");

    console.log(logged_user,5555)

    if(logged_user != null){
    playerName.innerHTML = logged_user.userName;
    logOutButton.style.display = "block";
    logInButton.style.display = "none"
    }else {
        logOutButton.style.display = "none";
        logInButton.style.display = "block"
    }
}

//
// if (games.logged_player){
//     const playerId = games.logged_player.id;
//     console.log(gpId);
//     document.getElementById("gameList").innerHTML = games.games
//         .map(game => {
//                 const gp = game.gamePlayers.find(gp => gp.player.id === playerId)
//             if (gp) {
//                 const gpId = gp.id;
//                 return `<ul><a href="game.html/${gpId}">${game.id},${game.created},${game.gameplayers.map(gp => gp.player.name)}</a>
//                </ul>`  //go to game
//             } else if(game.gamePlayers.length < 2) {
//                 return `<ul><a href="game.html/${gpId}">${game.id},${game.created},${game.gameplayers.map(gp => gp.player.name)}</a>
//                </ul>` //join game
//
//             } else {
//
//             }
//
//
//         }).join("");
// } else {
//     document.getElementById("gameList").innerHTML = games.games
//         .map(game => `<ul><a href="#">${game.id},${game.created},${game.gameplayers.map(gp => gp.player.name)}</a>
//                </ul>`
//         ).join("");
// }
// function creatingList(games) {
//
//     var gameList = document.getElementById("gameList");
//     var urList = document.createElement("ul");
//     gameList.appendChild(urList);
//     games.forEach(game => {
//         var list = document.createElement("li");
//         urList.appendChild(list);
//             var playerName = game.gameplayers.map(gp => gp.player.name)
//             list.textContent = "Game " + game.id + " was created " + game.created + ", " +
//                 "Players: " + playerName[0] + " vs " + playerName[1]
//     })
// }
// function crearLista(games) {
//     console.log(gpId,55444)
// }

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

    fetch("http://localhost:8080/api/players", {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:"userName=" + userName + "&password=" + password
    }).then(function (response) {
        if (response.ok){
            logIn();
        }

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
        if (response.ok){
            location.reload();
    }
        }).catch(function(error) {
        alert('Not logged in: ' + error.message);
    });

}

const logOut = () => {

    fetch("http://localhost:8080/api/logout", {
        method: 'POST',
    }).then(function (response) {
        if (response.ok){
            location.reload();
        }
    }).catch(function(error) {
        alert('Not logged out: ' + error.message);
    });

}
