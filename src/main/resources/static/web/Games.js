
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

        createList(playerGames);
        showButtoms();

    }).catch(function (error) {
        console.log("Request failed: " + error.message);
    });

}
dataCallGames ();



function createList(playerGames) {

    if (playerGames.logged_player) {
        const playerId = playerGames.logged_player.id;
        document.getElementById("gameList").innerHTML = games.map(game => {

                const gp = game.gameplayers.find(gp => gp.player.id === playerId);
                if (gp) {
                    const gpId = gp.id;
                    return `<ul><a href="game.html?gp=${gpId}"> ${game.id},${game.created},${game.gameplayers
                        .map(gp => gp.player.name)}, <b>Go to Game</b></a>
               </ul>`
                } else if (game.gameplayers.length < 2) {
                    return `<ul><button>${game.id},${game.created},${game.gameplayers
                        .map(gp => gp.player.name)}, <b>Join the Game</b><button/>
               </ul>`



                }

        }).join("");
    }

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

const newGame =()=>{
    fetch("http://localhost:8080/api/games", {
        method: 'POST',
        credentials: "include",
    }).then(function (response) {
        if (response.ok) {
            console.log("success")

            return response.json();
        }
    }).then(function (json) {
        console.log("ok2")
          const  nuevoGame = json;
        console.log(nuevoGame, "newgameJSON")
        const gpId = nuevoGame.gpId;
        // location.href = `http://localhost:8080/web/game.html?gp=${gpId}`
    }).catch(function(error) {
        alert("Not logged in:" + error.message);
    });

}
