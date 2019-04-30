
function dataCall () {


    fetch("http://localhost:8080/api/players", {
        method: "GET"
    }).then(function (response) {
        if (response.ok) {
            return response.json();

        }
        throw new Error(response.statusText);
    }).then(function (json) {

        playerList = json;
        player1 = playerList[0];
        player2 = playerList[1]
        console.log(playerList,2222)

        createLeaderboard()
    }).catch(function (error) {
        console.log("Request failed: " + error.message);
    });

}
dataCall ();

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
        tdWin.textContent = player.score.map(sc => sc.score)
            .reduce((a,b) => a + b);
    })




}
