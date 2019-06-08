
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
        // gamePlayers = playerGames.games[0];

        createList(playerGames);
        showButtoms();

    }).catch(function (error) {
        console.log("Request failed: " + error.message);
    });

}
dataCallGames ();



function createList(playerGames) {

        document.getElementById("gameList").innerHTML = games.map(game =>{
            const playerId = playerGames.logged_player ? playerGames.logged_player.id : null;

            const gameContainsLogPlayer = game.gameplayers.find(gp => gp.player.id === playerId);
            console.log(gameContainsLogPlayer);
            const gpNot = game.gameplayers[0].player.id !== playerId;

            if(!playerId || game.gameplayers.every(gp => gp.player.id !== playerId) && game.gameplayers.length === 2){
              return      `<tr>
                               <td> ${game.id}</td>
                                <td>${game.created}</td>
                                <td>${game.gameplayers.map(gp => gp.player.name)}</td>
                            </tr>`
            }

            if(gameContainsLogPlayer && game.gameplayers.length === 2){
                return `<tr>
                                 <td> ${game.id}</td>
                                 <td>${game.created}</td>
                                 <td>${game.gameplayers[0].player.name} vs ${game.gameplayers[1].player.name}</td>
                                <td><button> <a href="game_view.html?gp=${gameContainsLogPlayer.id}"><b>Go to Game</b></a></button></td>
                              </tr>`
            }
            if (!gameContainsLogPlayer && game.gameplayers.length === 1) {
                            return `<tr>
                                        <td>${game.id}</td>
                                        <td>${game.created}</td>
                                        <td>${game.gameplayers[0].player.name}</td>
                                        <td><button onclick="joinGame(${game.id})"><b>Join the Game</b></button></td>
                                    </tr>`
                        }
            if(gameContainsLogPlayer) {
                return `<tr>
                                        <td>${game.id}</td>
                                        <td>${game.created}</td>
                                        <td>${game.gameplayers[0].player.name}</td>
                                        <td><button> <a href="game_view.html?gp=${gameContainsLogPlayer.id}"><b>Go to Game</b></a></button></td>
                                    </tr>`
            }

        }).join("");

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
            return response.json();
        }
    }).then(function (json) {
          const  nuevoGame = json;
        const gpId = nuevoGame.gpId;
        location.href = `http://localhost:8080/web/game_view.html?gp=${gpId}`
    }).catch(function(error) {
        alert("Not logged in:" + "Please log in!");
    });

}

 async function joinGame (id)  {
    try {

        let response = await fetch(`http://localhost:8080/api/games/${id}/players`, {
            method: 'POST',
            credentials: 'include',
        });
        const message = await response.json();
        console.log(message,2020)
        if (response.status === 201) {

            window.location.href = `http://localhost:8080/web/game_view.html?gp=${message.gpId}`;
        } else if (response.status === 403) {
            alert("you suck")
        } else{
            alert("Something went wrong, try again later");
        }
    } catch (error) {
        console.log("Error: ", error)
    }
}
