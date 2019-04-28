
var games;
var ships;
var user;
var salvos;
var oponent;
var oponentShips;
var oponentSalvos;

function dataCall () {

    var gpId = new URLSearchParams(location.search).get("gp");
    fetch(`http://localhost:8080//api/game_view/${gpId}`, {
        method: "GET"
    }).then(function (response) {
        if (response.ok) {
            return response.json();

        }
        throw new Error(response.statusText);
    }).then(function (json) {

        games = json;
        ships = games.gameplayer.ships;
        user = games.gameplayer.player.name;
        salvos = games.gameplayer.salvos;

        oponent = games.oponent.player.name;
        oponentShips = games.oponent.ships;
        oponentSalvos = games.oponent.salvos;
        createTable(games);
        createShipLoc(ships);
        createTableSalvos(salvos);
        createSalvoLoc(salvos);
        userNames(user);
        userName2(oponent);
        createSalvoOponent(oponentSalvos);
        createOpShips(oponentShips)

    }).catch(function (error) {
        console.log("Request failed: " + error.message);
    });

}
dataCall ();


//game table
function createTable(games){
    var tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var tableLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    var table = document.getElementById("tableGame");
    var header = document.createElement("thead");
    table.appendChild(header);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    var trNumbs = document.createElement("tr");
    tbody.appendChild(trNumbs);

    trNumbs.appendChild(document.createElement("td"));

    tableNumbers.forEach(number => {
        const td = document.createElement("td");
    trNumbs.appendChild(td)
    td.textContent = number;

})



    for (let i = 0; i < tableLetters.length; i++) {
        var trLet = document.createElement("tr");
        tbody.appendChild(trLet);

        let td = document.createElement("td");
        trLet.appendChild(td);
        td.textContent = tableLetters[i];

        for (let j = 0; j < tableNumbers.length; j++) {

            let td2 = document.createElement("td");
            trLet.appendChild(td2);
            td2.id = `${"ship" + tableLetters[i]}${tableNumbers[j]}`;


        }
    }
}

function createShipLoc() {
    var ship1 = ships[0].location;
    var ship2 = ships[1].location;
    var shipLocations = ship1.concat(ship2);

    shipLocations.forEach(location => document.getElementById("ship"+location).id = "shipLoc" + location);
    shipLocations.forEach(location => document.getElementById("shipLoc"+location).style.backgroundColor = "green");
}

function createSalvoOponent() {
    var salvo1Op = oponentSalvos[0].location;
    var salvo2Op = oponentSalvos[1].location;
    var salvoLocationOp = salvo1Op.concat(salvo2Op);

    console.log(salvoLocationOp);

    salvoLocationOp.forEach(loc => {
        document.getElementById("shipLoc"+loc) != null
            ? document.getElementById("shipLoc"+loc).style.backgroundColor = "grey"
            : null
    });

}

function userNames(user) {
    document.getElementById("player1").textContent = "Player 1:" + " " + user;
}
function userName2(user2){

    document.getElementById("player2").textContent = "Player 2:" + " " +  oponent;

}


function createTableSalvos(salvos){
    var tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var tableLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    var table = document.getElementById("tableSalvos");
    var header = document.createElement("thead");
    table.appendChild(header);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    var trNumbs = document.createElement("tr");
    tbody.appendChild(trNumbs);

    trNumbs.appendChild(document.createElement("td"));

    tableNumbers.forEach(number => {
        const td = document.createElement("td");
        trNumbs.appendChild(td)
        td.textContent = number;

    })



    for (let i = 0; i < tableLetters.length; i++) {
        var trLet = document.createElement("tr");
        tbody.appendChild(trLet);

        let td = document.createElement("td");
        trLet.appendChild(td);
        td.textContent = tableLetters[i];

        for (let j = 0; j < tableNumbers.length; j++) {

            let td2 = document.createElement("td");
            trLet.appendChild(td2);
            td2.id = `${"salvo" + tableLetters[i]}${tableNumbers[j]}`;


        }
    }
}
function createSalvoLoc() {
    var salvo1 = salvos[0].location;
    var salvo2 = salvos[1].location;
    var salvoLocations = salvo1.concat(salvo2);

    salvoLocations.forEach(location => document.getElementById("salvo"+location).id = "salvoLoc" + location);
    salvoLocations.forEach(location => document.getElementById("salvoLoc"+location).style.backgroundColor = "red");

}

function createOpShips(oponentShips) {
    var opShips1 = oponentShips[0].location;
    var opShips2 = oponentShips[1].location;
    var opShhipLoc = opShips1.concat(opShips2);

    opShhipLoc.forEach(loc => {
        document.getElementById("salvoLoc"+loc) != null
            ? document.getElementById("salvoLoc"+loc).style.backgroundColor = "grey"
            : null
    });


}