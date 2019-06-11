var games;
var ships;
var user;
var salvos;
var oponent;
var oponentSalvos;
let myShipsOnTable = {};
var shipLenght;


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

            var drag;
            // var drSh = document.getElementById("carrier")
          let  dragSHips = document.getElementById("ships");
          dragSHips.addEventListener("mouseover", function (ev) {

                    drag = document.getElementById(ev.target.id);

                    var drop = document.getElementById(`${tableLetters[i]}${tableNumbers[j]}`);

                    drag.addEventListener("dragstart", function (event) {
                        event.dataTransfer.setData("text", event.target.id);
                    });

                    drop.addEventListener("dragover", function (event) {
                        event.preventDefault();

                      if ( Object.values(myShipsOnTable).flat().some(pos => event.target.id.includes(pos))) {
                        console.log("hey")
                      }
                    });

                    drop.addEventListener("drop", function (event) {
                        var data = event.dataTransfer.getData("text");
                        event.target.appendChild(document.getElementById(data));

                       if (data === "carrier") {
                           shipLenght = 5;
                       }
                       if (data === "battleship") {
                           shipLenght = 4;
                       }
                        if (data === "submarine"){
                            shipLenght = 3;
                        }
                        if (data === "destroyer") {
                            shipLenght = 3;
                        }
                        if (data === "patrol") {
                            shipLenght = 2;
                        }

                        const gridId = event.target.id;

                        let myShip = data;
                        let shipPos = [];
                        let myLetter = gridId.slice(0, 1);
                        let myNumber = Number(gridId.slice(1));

                        if(drag.classList.contains("vertical")){

                            if (tableLetters.indexOf(myLetter) + 1 + shipLenght < 11) {
                            shipPos = tableLetters.slice(tableLetters.indexOf(myLetter), (tableLetters.indexOf(myLetter) + 1 + shipLenght - 1));

                            } else {
                                shipPos = tableLetters.slice(-shipLenght);
                            }

                            shipPos = shipPos.map(pos => pos + myNumber);

                        }else if(drag.classList.contains("horizontal")) {

                            if (myNumber + shipLenght < 11) {
                                shipPos = tableNumbers.slice(myNumber - 1, (myNumber + shipLenght - 1));
                            } else {
                                shipPos = tableNumbers.slice(-shipLenght);
                            }
                            shipPos = shipPos.map(pos => myLetter + pos);
                        }

                        console.log(shipPos, "shipPos")

                        // if (Object.keys(myShipsOnTable).includes(myShip)) {
                        //     myShipsOnTable[myShip].forEach(pos => document.getElementById(pos).style.backgroundColor = "red")
                        // }
                        // shipPos.forEach(ship => document.getElementById(ship).style.backgroundColor = "green");

                        // if (Object.values(myShipsOnTable).flat().some(pos => shipPos.includes(pos))) {
                        //     myShipsOnTable[myShip].forEach(pos => document.getElementById(pos).style.backgroundColor = "blue")
                        // }
                        myShipsOnTable[myShip] = shipPos
                        console.log(shipPos, Object.keys(myShipsOnTable))
                    });

                });
            }
    }
}
const showRotateText =()=>{
    document.getElementById("rotateText").style.visibility ="visible"

};
const hideRotateText = () => {
    document.getElementById("rotateText").style.visibility ="hidden"

}

const rotateShips = (event) => {

    let ship = event.target;

        if (ship.classList.contains("horizontal")) {
            ship.classList.add("vertical");
            ship.classList.remove("horizontal");
        }else {
            ship.classList.add("horizontal");
            ship.classList.remove("vertical");

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

            window.location.href = `http://localhost:8080/web/game_view.html?gp=${gpId}`;
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
// }15UB129