
var games;
var ships;
var user;
var salvos;
var oponent;
var oponentSalvos;

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

});



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

    ships.forEach(sh => {
        sh.location.forEach(location => {
            document.getElementById("ship" + location).id = "shipLoc" + location;
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

        let response = await fetch(`http://localhost:8080/api/games/players/${7}/ships`, {
            method: 'POST',
            credentials:'include',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            },

            body: JSON.stringify([{  location: ["h2","h1","h3"], typeOfShip: "Destroyer" }]),

        });
        const message = await response.json();
        console.log(message,2020)
        if (response.status === 201) {

            alert("good my boy")
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