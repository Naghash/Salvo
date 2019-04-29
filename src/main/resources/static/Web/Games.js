var date;

function dataCall () {


    fetch(`http://localhost:8080//api//players`, {
        method: "GET"
    }).then(function (response) {
        if (response.ok) {
            return response.json();

        }
        throw new Error(response.statusText);
    }).then(function (json) {

        playerList = json;

        console.log(playerList)

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

}
