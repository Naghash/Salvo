
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

        games = json;
        creatingList(games);
        console.log(games, 1111);

    }).catch(function (error) {
        console.log("Request failed: " + error.message);
    });

}
dataCallGames ();


function creatingList(games) {

    var gameList = document.getElementById("gameList");
    var orLlist = document.createElement("ol");
        gameList.appendChild(orLlist);

    for (let i = 0; i < games.length; i++) {
        var list = document.createElement("li");
            orLlist.appendChild(list);
            list.textContent = "Game ID:" + " " + games[i].id +" was created " + games[i].created;
    }
}

function createLeaderboard(){

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
