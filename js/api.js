const base_url = "https://www.thesportsdb.com/api/v1/json/1/";

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function getCompetitions() {
    // 4429 4328 4331 4337 4335 4334
    fetch(base_url + 'eventsnextleague.php?id=4328')
        .then(status)
        .then(json)
        .then(async function (data) {
            let content = '';
            for (const n of data.events) {
                imgHome = '';
                await fetch(base_url + 'lookupteam.php?id=' + n.idHomeTeam)
                    .then(status)
                    .then(json)
                    .then(function (data) {
                        imgHome = data.teams[0].strTeamBadge;
                    }).catch(error);
                imgAway = '';
                await fetch(base_url + 'lookupteam.php?id=' + n.idAwayTeam)
                    .then(status)
                    .then(json)
                    .then(function (data) {
                        imgAway = data.teams[0].strTeamBadge;
                    }).catch(error);
                content += `
                <div class="event-wrapper card">
                    <div class="card-action center-align">
                        <strong class="white-text">${n.strDate + ' ' + n.strTime}</strong>
                    </div>
                    <div class="card-content d-flex">
                        <div class="team-wrapper">
                            <div class="team-icon" style="background-image: url(${imgHome})"></div>
                            <strong class="team-title">${n.strEvent.split(' vs ')[0]}</strong>
                            <a href="?id=${n.idHomeTeam}#team" onclick="loadPage('team')" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                        <strong class="event-vs">vs</strong>
                        <div class="team-wrapper">
                            <div class="team-icon" style="background-image: url(${imgAway})"></div>
                            <strong class="team-title">${n.strEvent.split(' vs ')[1]}</strong>
                            <a href="?id=${n.idAwayTeam}#team" onclick="loadPage('team')" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                    </div>
                </div>
                `;
            };
            document.getElementById("epl").innerHTML = content;
        })
        .catch(error);
}

function getTeamById(id) {
    
}