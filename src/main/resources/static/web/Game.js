var games;
var ships;
var user;
var salvos;
var oponent;
var oponentSalvos;
let myShipsOnTable = {};

function dataCall () {

    var gpId = new URLSearchParams(location.search).get("gp");
    fetch(`http://localhost:8080/api/game_view/${gpId}`, {
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

        if (games.oponent!== null){
            oponent = games.oponent.player.name;
            oponentSalvos = games.oponent.salvos;
        }else {
            oponent = "Waiting for Player 2..."
        }

        createTable(games);
        createShipLoc(ships);
        createTableSalvos(salvos);
        createSalvoLoc(salvos);
        userNames(user,oponent);
        createSalvoOponent(oponentSalvos);
        // createOpShips(oponentShips)

    }).catch(function (error) {
        console.log("Request failed: " + error.message);
    });

}
dataCall ();


function createTable(games){
    var tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var tableLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    var tableGame = document.getElementById("tableGame");


    var trNumbs = document.createElement("div");
    tableGame.appendChild(trNumbs);
    trNumbs.className = "numbers";

    trNumbs.appendChild(document.createElement("div"));

    tableNumbers.forEach(number => {
        const td = document.createElement("div");
        trNumbs.appendChild(td)
        td.textContent = number;
    });



    for (let i = 0; i < tableLetters.length; i++) {
        var trLet = document.createElement("div");
        tableGame.appendChild(trLet);

        let td = document.createElement("div");
        trLet.appendChild(td);
        trLet.className = "numbers"
        td.className = "letters"
        td.textContent = tableLetters[i];

        for (let j = 0; j < tableNumbers.length; j++) {

            let td2 = document.createElement("div");
            trLet.appendChild(td2);
            td2.id = `${tableLetters[i]}${tableNumbers[j]}`;
            td2.className = "shipsGrids"


            var drag = document.getElementById("carrier");
            var drag1 = document.getElementById("patrol");

            var drop = document.getElementById(`${tableLetters[i]}${tableNumbers[j]}`);

            drag.addEventListener("dragstart", function(event) {
                event.dataTransfer.setData("Text", event.target.id);
                console.log(event.target.id,555)

            });

            drop.addEventListener("dragover", function(event) {
                event.preventDefault();
            });

            drop.addEventListener("drop", function(event) {
                event.preventDefault();
                var data = event.dataTransfer.getData("Text");
                event.target.appendChild(document.getElementById(data));

                const shipLength = 3;
                const gridId = event.target.id;
                let myShip = data;
                let shipPos = [];

                if (Object.keys(myShipsOnTable).includes(myShip)) {
                    myShipsOnTable[myShip].forEach(pos => document.getElementById("ship" + pos).style.backgroundColor = "red")
                }

                let myLetter = gridId.slice(0, 1);
                let myNumber = Number(gridId.slice(1));

                // myPosition = tableLetters.indexOf(myLetter);
                console.log(myNumber, shipLength)
                if(myNumber + shipLength < 12){
                    shipPos = tableNumbers.slice(myNumber - 1, (myNumber + shipLength - 1));
                 }else
                     {
                         shipPos = tableNumbers.slice(-shipLength);
                     }
                shipPos = shipPos.map(pos =>  myLetter+pos);
                shipPos.map(ship =>{ document.getElementById(ship).id= "ship" + ship;
                document.getElementById("ship" + ship).style.backgroundColor ="green"
                });
                myShipsOnTable[myShip] = shipPos;
console.log(event.target.id, 858585)
            });

        }
    }
}


function createShipLoc() {

    ships.forEach(sh => {
        sh.location.forEach(location => {
            document.getElementById(location).id = "shipLoc" + location;
            document.getElementById("shipLoc"+ location).style.backgroundColor = "green"
        })
    })
}

function createSalvoOponent() {

    oponentSalvos.forEach(sal => {
        sal.location.forEach(loc =>{
            if  (document.getElementById("shipLoc"+loc) != null){
                document.getElementById("shipLoc"+loc).style.backgroundColor = "grey"
                document.getElementById("shipLoc"+loc).innerHTML = sal.turn;

            }
        })


    })
}

function userNames(user, oponent){
    document.getElementById("player1").textContent = "Player 1:" + " " + user;
    if (oponent) {
        document.getElementById("player2").textContent = "Player 2: " +  oponent;
    }else {
        document.getElementById("player2").textContent = "Waiting for Player 2...";
    }
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

    salvos.forEach(sal => {
        sal.location.forEach(loc => {
                document.getElementById("salvo" + loc).id = "salvoLoc" + loc;
                document.getElementById("salvoLoc"+ loc).style.backgroundColor = "red"
                document.getElementById("salvoLoc"+ loc).innerHTML = sal.turn;
            }
        )
    })
}

async function postShips ()  {
    try {
        const gpId = games.gameplayer.id;
        let response = await fetch(`http://localhost:8080/api/games/players/${gpId}/ships`, {
            method: 'POST',
            credentials:'include',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            },

            body: JSON.stringify([{  location: ["H1","H2","H3"], typeOfShip: "Destroyer" }]),

        });
        const message = await response.json();
        console.log(gpId,78)
        console.log(message,2020)
        if (response.status === 201) {

            window.location.href = `http://localhost:8080/web/game.html?gp=${gpId}`;
        } else if (response.status === 403) {
        } else{
            alert("Something went wrong, try again later");
        }
    } catch (error) {
        console.log("Error: ", error)
    }
}


// function createOpShips(oponentShips) {
//
//     oponentShips.forEach(s => {
//         s.location.forEach(lo => {
//             document.getElementById("salvoLoc"+lo) != null
//                 ? document.getElementById("salvoLoc"+lo).style.backgroundColor = "grey"
//                 : null
//         })
//     })
//
// }