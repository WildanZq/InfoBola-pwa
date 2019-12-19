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
    if ('caches' in window) {
        caches.match(base_url + 'eventsnextleague.php?id=4328').then(function (response) {
            if (response) {
                response.json().then(async function (data) {
                    let content = '';
                    for await (const n of data.events) {
                        let imgHome = '';
                        await fetch(base_url + 'lookupteam.php?id=' + n.idHomeTeam)
                            .then(status)
                            .then(json)
                            .then(function (data) {
                                imgHome = data.teams[0].strTeamBadge;
                            }).catch(error);
                        let imgAway = '';
                        await fetch(base_url + 'lookupteam.php?id=' + n.idAwayTeam)
                            .then(status)
                            .then(json)
                            .then(function (data) {
                                imgAway = data.teams[0].strTeamBadge;
                            }).catch(error);
                        content += `
                        <div class="event-wrapper card">
                            <div class="card-action center-align">
                                <strong class="white-text">${n.dateEvent + ' ' + n.strTime}</strong>
                            </div>
                            <div class="card-content d-flex">
                                <div class="team-wrapper">
                                    <div class="team-icon" style="background-image: url(${imgHome})"></div>
                                    <strong class="team-title">${n.strEvent.split(' vs ')[0]}</strong>
                                    <a href="./team.html?id=${n.idHomeTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                </div>
                                <strong class="event-vs">vs</strong>
                                <div class="team-wrapper">
                                    <div class="team-icon" style="background-image: url(${imgAway})"></div>
                                    <strong class="team-title">${n.strEvent.split(' vs ')[1]}</strong>
                                    <a href="./team.html?id=${n.idAwayTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                </div>
                            </div>
                        </div>
                        `;
                    };
                    document.getElementById("match-wrapper").innerHTML = content;
                });
            }
        });
    }

    fetch(base_url + 'eventsnextleague.php?id=4328')
        .then(status)
        .then(json)
        .then(async function (data) {
            let content = '';
            for await (const n of data.events) {
                let imgHome = '';
                await fetch(base_url + 'lookupteam.php?id=' + n.idHomeTeam)
                    .then(status)
                    .then(json)
                    .then(function (data) {
                        imgHome = data.teams[0].strTeamBadge;
                    }).catch(error);
                let imgAway = '';
                await fetch(base_url + 'lookupteam.php?id=' + n.idAwayTeam)
                    .then(status)
                    .then(json)
                    .then(function (data) {
                        imgAway = data.teams[0].strTeamBadge;
                    }).catch(error);
                content += `
                <div class="event-wrapper card">
                    <div class="card-action center-align">
                        <strong class="white-text">${n.dateEvent + ' ' + n.strTime}</strong>
                    </div>
                    <div class="card-content d-flex">
                        <div class="team-wrapper">
                            <div class="team-icon" style="background-image: url(${imgHome})"></div>
                            <strong class="team-title">${n.strEvent.split(' vs ')[0]}</strong>
                            <a href="./team.html?id=${n.idHomeTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                        <strong class="event-vs">vs</strong>
                        <div class="team-wrapper">
                            <div class="team-icon" style="background-image: url(${imgAway})"></div>
                            <strong class="team-title">${n.strEvent.split(' vs ')[1]}</strong>
                            <a href="./team.html?id=${n.idAwayTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                    </div>
                </div>
                `;
            };
            document.getElementById("match-wrapper").innerHTML = content;
        })
        .catch(error);
}

function getTeamById(id) {
    return new Promise(function (resolve, reject) {
        if ('caches' in window) {
            caches.match(base_url + 'lookupteam.php?id=' + id).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        document.getElementById("title").innerHTML = data.teams[0].strTeam;
                        document.getElementById("desc").innerHTML = data.teams[0].strDescriptionEN;
                        document.getElementById("icon").style.backgroundImage = `url('${data.teams[0].strTeamBadge}')`;
                        resolve(data);
                    });
                }
            });
        }

        fetch(base_url + 'lookupteam.php?id=' + id)
            .then(status)
            .then(json)
            .then(function (data) {
                document.getElementById("title").innerHTML = data.teams[0].strTeam;
                document.getElementById("desc").innerHTML = data.teams[0].strDescriptionEN;
                document.getElementById("icon").style.backgroundImage = `url('${data.teams[0].strTeamBadge}')`;
                resolve(data);
            }).catch(error);
    });
}

function getLastMatchByTeamId(id) {
    return new Promise(function (resolve, reject) {
        if ('caches' in window) {
            caches.match(base_url + 'eventslast.php?id=' + id).then(function (response) {
                if (response) {
                    let content = '';
                    let results = [];
                    response.json().then(async function (data) {
                        for await (const n of data.results) {
                            let imgHome = '';
                            await caches.match(base_url + 'lookupteam.php?id=' + n.idHomeTeam).then(async function (response) {
                                if (response) {
                                    await response.json().then(function (data) {
                                        imgHome = data.teams[0].strTeamBadge;
                                    });
                                }
                            });
                            let imgAway = '';
                            await caches.match(base_url + 'lookupteam.php?id=' + n.idAwayTeam).then(async function (response) {
                                if (response) {
                                    await response.json().then(function (data) {
                                        imgAway = data.teams[0].strTeamBadge;
                                    });
                                }
                            });
                            results.push({ ...n, imgHome, imgAway });
                            content += `
                            <div class="event-wrapper card">
                                <div class="card-action center-align">
                                    <strong class="white-text">${n.dateEvent + ' ' + n.strTime}</strong>
                                </div>
                                <div class="card-content d-flex">
                                    <div class="team-wrapper">
                                        <strong class="team-score">${n.intHomeScore}</strong>
                                        <div class="team-icon" style="background-image: url(${imgHome})"></div>
                                        <strong class="team-title">${n.strEvent.split(' vs ')[0]}</strong>
                                        <a href="./team.html?id=${n.idHomeTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                    </div>
                                    <strong class="event-vs">vs</strong>
                                    <div class="team-wrapper">
                                        <strong class="team-score">${n.intAwayScore}</strong>
                                        <div class="team-icon" style="background-image: url(${imgAway})"></div>
                                        <strong class="team-title">${n.strEvent.split(' vs ')[1]}</strong>
                                        <a href="./team.html?id=${n.idAwayTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                    </div>
                                </div>
                            </div>
                            `;
                        };
                        document.getElementById("last-match-wrapper").innerHTML = content;
                        resolve(results);
                    });
                }
            });
        }

        fetch(base_url + 'eventslast.php?id=' + id)
            .then(status)
            .then(json)
            .then(async function (data) {
                let content = '';
                let results = [];
                for await (const n of data.results) {
                    let imgHome = '';
                    await fetch(base_url + 'lookupteam.php?id=' + n.idHomeTeam)
                        .then(status)
                        .then(json)
                        .then(function (data) {
                            imgHome = data.teams[0].strTeamBadge;
                        }).catch(error);
                    let imgAway = '';
                    await fetch(base_url + 'lookupteam.php?id=' + n.idAwayTeam)
                        .then(status)
                        .then(json)
                        .then(function (data) {
                            imgAway = data.teams[0].strTeamBadge;
                        }).catch(error);
                    results.push({ ...n, imgHome, imgAway });
                    content += `
                    <div class="event-wrapper card">
                        <div class="card-action center-align">
                            <strong class="white-text">${n.dateEvent + ' ' + n.strTime}</strong>
                        </div>
                        <div class="card-content d-flex">
                            <div class="team-wrapper">
                                <strong class="team-score">${n.intHomeScore}</strong>
                                <div class="team-icon" style="background-image: url(${imgHome})"></div>
                                <strong class="team-title">${n.strEvent.split(' vs ')[0]}</strong>
                                <a href="./team.html?id=${n.idHomeTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                            </div>
                            <strong class="event-vs">vs</strong>
                            <div class="team-wrapper">
                                <strong class="team-score">${n.intAwayScore}</strong>
                                <div class="team-icon" style="background-image: url(${imgAway})"></div>
                                <strong class="team-title">${n.strEvent.split(' vs ')[1]}</strong>
                                <a href="./team.html?id=${n.idAwayTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                            </div>
                        </div>
                    </div>
                    `;
                };
                document.getElementById("last-match-wrapper").innerHTML = content;
                resolve(results);
            }).catch(error);
    });
}

function getNextMatchByTeamId(id) {
    return new Promise(function (resolve, reject) {
        if ('caches' in window) {
            caches.match(base_url + 'eventsnext.php?id=' + id).then(function (response) {
                if (response) {
                    response.json().then(async function (data) {
                        let content = '';
                        let events = [];
                        for await (const n of data.events) {
                            let imgHome = '';
                            await caches.match(base_url + 'lookupteam.php?id=' + n.idHomeTeam).then(async function (response) {
                                if (response) {
                                    await response.json().then(function (data) {
                                        imgHome = data.teams[0].strTeamBadge;
                                    });
                                }
                            });
                            let imgAway = '';
                            await caches.match(base_url + 'lookupteam.php?id=' + n.idAwayTeam).then(async function (response) {
                                if (response) {
                                    await response.json().then(function (data) {
                                        imgAway = data.teams[0].strTeamBadge;
                                    });
                                }
                            });
                            events.push({ ...n, imgHome, imgAway });
                            content += `
                            <div class="event-wrapper card">
                                <div class="card-action center-align">
                                    <strong class="white-text">${n.dateEvent + ' ' + n.strTime}</strong>
                                </div>
                                <div class="card-content d-flex">
                                    <div class="team-wrapper">
                                        <div class="team-icon" style="background-image: url(${imgHome})"></div>
                                        <strong class="team-title">${n.strEvent.split(' vs ')[0]}</strong>
                                        <a href="./team.html?id=${n.idHomeTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                    </div>
                                    <strong class="event-vs">vs</strong>
                                    <div class="team-wrapper">
                                        <div class="team-icon" style="background-image: url(${imgAway})"></div>
                                        <strong class="team-title">${n.strEvent.split(' vs ')[1]}</strong>
                                        <a href="./team.html?id=${n.idAwayTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                    </div>
                                </div>
                            </div>
                            `;
                        };
                        document.getElementById("next-match-wrapper").innerHTML = content;
                        resolve(events);
                    });
                }
            });
        }

        fetch(base_url + 'eventsnext.php?id=' + id)
            .then(status)
            .then(json)
            .then(async function (data) {
                let content = '';
                let events = [];
                for await (const n of data.events) {
                    let imgHome = '';
                    await fetch(base_url + 'lookupteam.php?id=' + n.idHomeTeam)
                        .then(status)
                        .then(json)
                        .then(function (data) {
                            imgHome = data.teams[0].strTeamBadge;
                        }).catch(error);
                    let imgAway = '';
                    await fetch(base_url + 'lookupteam.php?id=' + n.idAwayTeam)
                        .then(status)
                        .then(json)
                        .then(function (data) {
                            imgAway = data.teams[0].strTeamBadge;
                        }).catch(error);
                    events.push({ ...n, imgHome, imgAway });
                    content += `
                    <div class="event-wrapper card">
                        <div class="card-action center-align">
                            <strong class="white-text">${n.dateEvent + ' ' + n.strTime}</strong>
                        </div>
                        <div class="card-content d-flex">
                            <div class="team-wrapper">
                                <div class="team-icon" style="background-image: url(${imgHome})"></div>
                                <strong class="team-title">${n.strEvent.split(' vs ')[0]}</strong>
                                <a href="./team.html?id=${n.idHomeTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                            </div>
                            <strong class="event-vs">vs</strong>
                            <div class="team-wrapper">
                                <div class="team-icon" style="background-image: url(${imgAway})"></div>
                                <strong class="team-title">${n.strEvent.split(' vs ')[1]}</strong>
                                <a href="./team.html?id=${n.idAwayTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                            </div>
                        </div>
                    </div>
                    `;
                };
                document.getElementById("next-match-wrapper").innerHTML = content;
                resolve(events);
            }).catch(error);
    });
}

function getSavedTeams() {
    getAllTeams().then(function (teams) {
        let content = '';
        teams.forEach(team => {
            content += `
            <div class="card" style="margin-right: 1rem;">
                <div class="card-content center-align" style="padding-bottom: .6rem;">
                    <div class="team-icon" style="background-image: url(${team.strTeamBadge}); margin: 0;"></div>
                    <p class="team-title center-align" style="margin-top: .4rem;">
                        <strong>${team.strTeam}</strong>
                    </p>
                </div>
                <a href="team.html?id=${team.idTeam}" class="waves-effect waves-light btn-small team-btn" style="width: 100%;">
                    Detail
                </a>
            </div>`;
        });
        document.getElementById("team-wrapper").innerHTML = content;
    });
}

function getSavedTeamById(id) {
    return new Promise(function (resolve, reject) {
        getTeam(id).then(function (team) {
            document.getElementById("title").innerHTML = team.strTeam;
            document.getElementById("desc").innerHTML = team.strDescriptionEN;
            document.getElementById("icon").style.backgroundImage = `url('${team.strTeamBadge}')`;

            contentResult = '';
            for (const n of team.results) {
                contentResult += `
                <div class="event-wrapper card">
                    <div class="card-action center-align">
                        <strong class="white-text">${n.dateEvent + ' ' + n.strTime}</strong>
                    </div>
                    <div class="card-content d-flex">
                        <div class="team-wrapper">
                            <strong class="team-score">${n.intHomeScore}</strong>
                            <div class="team-icon" style="background-image: url(${n.imgHome})"></div>
                            <strong class="team-title">${n.strEvent.split(' vs ')[0]}</strong>
                            <a href="./team.html?id=${n.idHomeTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                        <strong class="event-vs">vs</strong>
                        <div class="team-wrapper">
                            <strong class="team-score">${n.intAwayScore}</strong>
                            <div class="team-icon" style="background-image: url(${n.imgAway})"></div>
                            <strong class="team-title">${n.strEvent.split(' vs ')[1]}</strong>
                            <a href="./team.html?id=${n.idAwayTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                    </div>
                </div>
                `;
            }
            document.getElementById("last-match-wrapper").innerHTML = contentResult;

            contentEvent = '';
            for (const n of team.events) {
                contentEvent += `
                <div class="event-wrapper card">
                    <div class="card-action center-align">
                        <strong class="white-text">${n.dateEvent + ' ' + n.strTime}</strong>
                    </div>
                    <div class="card-content d-flex">
                        <div class="team-wrapper">
                            <div class="team-icon" style="background-image: url(${n.imgHome})"></div>
                            <strong class="team-title">${n.strEvent.split(' vs ')[0]}</strong>
                            <a href="./team.html?id=${n.idHomeTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                        <strong class="event-vs">vs</strong>
                        <div class="team-wrapper">
                            <div class="team-icon" style="background-image: url(${n.imgAway})"></div>
                            <strong class="team-title">${n.strEvent.split(' vs ')[1]}</strong>
                            <a href="./team.html?id=${n.idAwayTeam}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                    </div>
                </div>
                `;
            }
            document.getElementById("next-match-wrapper").innerHTML = contentEvent;

            resolve(team);
        }).catch(function (e) {
            reject(e);
        });
    });
}