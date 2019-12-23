const base_url = "https://api.football-data.org/v2/";

function fetchTo(url) {
    return fetch(url, {
        headers: {
            'X-Auth-Token': 'e8272496bd7d437792fca8015ca8eadd'
        }
    });
}

function getDateNow() {
    return new Date().toISOString().slice(0, 10);
}

function getDateNextWeek() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString().slice(0, 10);
}

function getDateLastWeek() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7).toISOString().slice(0, 10);
}

function getDateNextMonth() {
    const today = new Date();
    return new Date(today.setMonth(today.getMonth() + 1)).toISOString().slice(0, 10);
}

function getDateLastMonth() {
    const today = new Date();
    return new Date(today.setMonth(today.getMonth() - 1)).toISOString().slice(0, 10);
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

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
        caches.match(base_url + 'competitions/2021/matches?status=SCHEDULED&dateFrom=' + getDateNow() + '&dateTo=' + getDateNextWeek()).then(function (response) {
            if (response) {
                response.json().then(async function (data) {
                    let content = '';
                    for await (const n of data.matches) {
                        let imgHome = await getTeamData(n.homeTeam.id);
                        imgHome = imgHome.crestUrl.replace(/^http:\/\//i, 'https://');
                        let imgAway = await getTeamData(n.awayTeam.id);
                        imgAway = imgAway.crestUrl.replace(/^http:\/\//i, 'https://');
                        content += `
                        <div class="col l4 m6 s12">
                        <div class="event-wrapper card">
                            <div class="card-action center-align">
                                <strong class="white-text">${n.utcDate.replace('T', ' ').replace('Z', '')}</strong>
                            </div>
                            <div class="card-content d-flex">
                                <div class="team-wrapper">
                                    <div class="team-icon" style="background-image: url(${imgHome})"></div>
                                    <strong class="team-title">${n.homeTeam.name}</strong>
                                    <a href="./team.html?id=${n.homeTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                </div>
                                <strong class="event-vs">vs</strong>
                                <div class="team-wrapper">
                                    <div class="team-icon" style="background-image: url(${imgAway})"></div>
                                    <strong class="team-title">${n.awayTeam.name}</strong>
                                    <a href="./team.html?id=${n.awayTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                </div>
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

    fetchTo(base_url + 'competitions/2021/matches?status=SCHEDULED&dateFrom=' + getDateNow() + '&dateTo=' + getDateNextWeek())
        .then(status)
        .then(json)
        .then(async function (data) {
            let content = '';
            for await (const n of data.matches) {
                let imgHome = await getTeamData(n.homeTeam.id);
                imgHome = imgHome.crestUrl.replace(/^http:\/\//i, 'https://');
                let imgAway = await getTeamData(n.awayTeam.id);
                imgAway = imgAway.crestUrl.replace(/^http:\/\//i, 'https://');
                content += `
                <div class="col l4 m6 s12">
                <div class="event-wrapper card">
                    <div class="card-action center-align">
                        <strong class="white-text">${n.utcDate.replace('T', ' ').replace('Z', '')}</strong>
                    </div>
                    <div class="card-content d-flex">
                        <div class="team-wrapper">
                            <div class="team-icon" style="background-image: url(${imgHome})"></div>
                            <strong class="team-title">${n.homeTeam.name}</strong>
                            <a href="./team.html?id=${n.homeTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                        <strong class="event-vs">vs</strong>
                        <div class="team-wrapper">
                            <div class="team-icon" style="background-image: url(${imgAway})"></div>
                            <strong class="team-title">${n.awayTeam.name}</strong>
                            <a href="./team.html?id=${n.awayTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                    </div>
                </div>
                </div>
                `;
            };
            document.getElementById("match-wrapper").innerHTML = content;
        })
        .catch(error);
}

function getTeamData(id) {
    return new Promise(function (resolve, reject) {
        if ('caches' in window) {
            caches.match(base_url + 'teams/' + id).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        resolve(data);
                        return;
                    });
                }
            });
        }

        fetchTo(base_url + 'teams/' + id)
            .then(status)
            .then(json)
            .then(function (data) {
                resolve(data);
            }).catch(error);
    });
}

function getTeamById(id) {
    return new Promise(function (resolve, reject) {
        if ('caches' in window) {
            caches.match(base_url + 'teams/' + id).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        document.getElementById("title").innerHTML = data.name;
                        document.getElementById("desc").innerHTML = data.address + '<br>' + data.phone + '<br>' + data.website;
                        document.getElementById("icon").style.backgroundImage = `url('${data.crestUrl.replace(/^http:\/\//i, 'https://')}')`;
                        resolve(data);
                        return;
                    });
                }
            });
        }

        fetchTo(base_url + 'teams/' + id)
            .then(status)
            .then(json)
            .then(function (data) {
                document.getElementById("title").innerHTML = data.name;
                document.getElementById("desc").innerHTML = data.address + '<br>' + data.phone + '<br>' + data.website;
                document.getElementById("icon").style.backgroundImage = `url('${data.crestUrl.replace(/^http:\/\//i, 'https://')}')`;
                resolve(data);
            }).catch(error);
    });
}

function getLastMatchByTeamId(id) {
    return new Promise(function (resolve, reject) {
        if ('caches' in window) {
            caches.match(base_url + 'teams/' + id + '/matches?status=FINISHED&dateFrom=' + getDateLastMonth() + '&dateTo=' + getDateNow()).then(function (response) {
                if (response) {
                    let content = '';
                    let results = [];
                    response.json().then(async function (data) {
                        for await (const n of data.matches) {
                            let imgHome = await getTeamData(n.homeTeam.id);
                            imgHome = imgHome.crestUrl.replace(/^http:\/\//i, 'https://');
                            let imgAway = await getTeamData(n.awayTeam.id);
                            imgAway = imgAway.crestUrl.replace(/^http:\/\//i, 'https://');
                            results.push({ ...n, imgHome, imgAway });
                            content += `
                            <div class="col l4 m6 s12">
                            <div class="event-wrapper card">
                                <div class="card-action center-align">
                                    <strong class="white-text">${n.utcDate.replace('T', ' ').replace('Z', '')}</strong>
                                </div>
                                <div class="card-content d-flex">
                                    <div class="team-wrapper">
                                        <strong class="team-score">${n.score.fullTime.homeTeam}</strong>
                                        <div class="team-icon" style="background-image: url(${imgHome})"></div>
                                        <strong class="team-title">${n.homeTeam.name}</strong>
                                        <a href="./team.html?id=${n.homeTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                    </div>
                                    <strong class="event-vs">vs</strong>
                                    <div class="team-wrapper">
                                        <strong class="team-score">${n.score.fullTime.awayTeam}</strong>
                                        <div class="team-icon" style="background-image: url(${imgAway})"></div>
                                        <strong class="team-title">${n.awayTeam.name}</strong>
                                        <a href="./team.html?id=${n.awayTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                    </div>
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

        fetchTo(base_url + 'teams/' + id + '/matches?status=FINISHED&dateFrom=' + getDateLastMonth() + '&dateTo=' + getDateNow())
            .then(status)
            .then(json)
            .then(async function (data) {
                let content = '';
                let results = [];
                for await (const n of data.matches) {
                    let imgHome = await getTeamData(n.homeTeam.id);
                    imgHome = imgHome.crestUrl.replace(/^http:\/\//i, 'https://');
                    let imgAway = await getTeamData(n.awayTeam.id);
                    imgAway = imgAway.crestUrl.replace(/^http:\/\//i, 'https://');
                    results.push({ ...n, imgHome, imgAway });
                    content += `
                    <div class="col l4 m6 s12">
                    <div class="event-wrapper card">
                        <div class="card-action center-align">
                            <strong class="white-text">${n.utcDate.replace('T', ' ').replace('Z', '')}</strong>
                        </div>
                        <div class="card-content d-flex">
                            <div class="team-wrapper">
                                <strong class="team-score">${n.score.fullTime.homeTeam}</strong>
                                <div class="team-icon" style="background-image: url(${imgHome})"></div>
                                <strong class="team-title">${n.homeTeam.name}</strong>
                                <a href="./team.html?id=${n.homeTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                            </div>
                            <strong class="event-vs">vs</strong>
                            <div class="team-wrapper">
                                <strong class="team-score">${n.score.fullTime.awayTeam}</strong>
                                <div class="team-icon" style="background-image: url(${imgAway})"></div>
                                <strong class="team-title">${n.awayTeam.name}</strong>
                                <a href="./team.html?id=${n.awayTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                            </div>
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
            caches.match(base_url + 'teams/' + id + '/matches?status=SCHEDULED&dateFrom=' + getDateNow() + '&dateTo=' + getDateNextMonth()).then(function (response) {
                if (response) {
                    response.json().then(async function (data) {
                        let content = '';
                        let events = [];
                        for await (const n of data.matches) {
                            let imgHome = await getTeamData(n.homeTeam.id);
                            imgHome = imgHome.crestUrl.replace(/^http:\/\//i, 'https://');
                            let imgAway = await getTeamData(n.awayTeam.id);
                            imgAway = imgAway.crestUrl.replace(/^http:\/\//i, 'https://');
                            events.push({ ...n, imgHome, imgAway });
                            content += `
                            <div class="col l4 m6 s12">
                            <div class="event-wrapper card">
                                <div class="card-action center-align">
                                    <strong class="white-text">${n.utcDate.replace('T', ' ').replace('Z', '')}</strong>
                                </div>
                                <div class="card-content d-flex">
                                    <div class="team-wrapper">
                                        <div class="team-icon" style="background-image: url(${imgHome})"></div>
                                        <strong class="team-title">${n.homeTeam.name}</strong>
                                        <a href="./team.html?id=${n.homeTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                    </div>
                                    <strong class="event-vs">vs</strong>
                                    <div class="team-wrapper">
                                        <div class="team-icon" style="background-image: url(${imgAway})"></div>
                                        <strong class="team-title">${n.awayTeam.name}</strong>
                                        <a href="./team.html?id=${n.awayTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                                    </div>
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

        fetchTo(base_url + 'teams/' + id + '/matches?status=SCHEDULED&dateFrom=' + getDateNow() + '&dateTo=' + getDateNextMonth())
            .then(status)
            .then(json)
            .then(async function (data) {
                let content = '';
                let events = [];
                for await (const n of data.matches) {
                    let imgHome = await getTeamData(n.homeTeam.id);
                    imgHome = imgHome.crestUrl.replace(/^http:\/\//i, 'https://');
                    let imgAway = await getTeamData(n.awayTeam.id);
                    imgAway = imgAway.crestUrl.replace(/^http:\/\//i, 'https://');
                    events.push({ ...n, imgHome, imgAway });
                    content += `
                    <div class="col l4 m6 s12">
                    <div class="event-wrapper card">
                        <div class="card-action center-align">
                            <strong class="white-text">${n.utcDate.replace('T', ' ').replace('Z', '')}</strong>
                        </div>
                        <div class="card-content d-flex">
                            <div class="team-wrapper">
                                <div class="team-icon" style="background-image: url(${imgHome})"></div>
                                <strong class="team-title">${n.homeTeam.name}</strong>
                                <a href="./team.html?id=${n.homeTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                            </div>
                            <strong class="event-vs">vs</strong>
                            <div class="team-wrapper">
                                <div class="team-icon" style="background-image: url(${imgAway})"></div>
                                <strong class="team-title">${n.awayTeam.name}</strong>
                                <a href="./team.html?id=${n.awayTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                            </div>
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
            <div class="col l3 m4 s12">
            <div class="card">
                <div class="card-content d-flex" style="padding-bottom: .6rem; align-items: center; flex-wrap: nowrap; flex-direction: column;">
                    <div class="team-icon" style="background-image: url(${team.crestUrl.replace(/^http:\/\//i, 'https://')}); margin: 0;"></div>
                    <p class="team-title center-align" style="margin-top: .4rem;">
                        <strong>${team.name}</strong>
                    </p>
                </div>
                <a href="team.html?id=${team.id}" class="waves-effect waves-light btn-small team-btn" style="width: 100%;">
                    Detail
                </a>
            </div>
            </div>`;
        });
        document.getElementById("team-wrapper").innerHTML = content;
    });
}

function getSavedTeamById(id) {
    return new Promise(function (resolve, reject) {
        getTeam(id).then(function (team) {
            document.getElementById("title").innerHTML = team.name;
            document.getElementById("desc").innerHTML = team.address + '<br>' + team.phone + '<br>' + team.website;
            document.getElementById("icon").style.backgroundImage = `url('${team.crestUrl.replace(/^http:\/\//i, 'https://')}')`;

            contentResult = '';
            for (const n of team.results) {
                contentResult += `
                <div class="col l4 m6 s12">
                <div class="event-wrapper card">
                    <div class="card-action center-align">
                        <strong class="white-text">${n.utcDate.replace('T', ' ').replace('Z', '')}</strong>
                    </div>
                    <div class="card-content d-flex">
                        <div class="team-wrapper">
                            <strong class="team-score">${n.score.fullTime.homeTeam}</strong>
                            <div class="team-icon" style="background-image: url(${n.imgHome})"></div>
                            <strong class="team-title">${n.homeTeam.name}</strong>
                            <a href="./team.html?id=${n.homeTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                        <strong class="event-vs">vs</strong>
                        <div class="team-wrapper">
                            <strong class="team-score">${n.score.fullTime.awayTeam}</strong>
                            <div class="team-icon" style="background-image: url(${n.imgAway})"></div>
                            <strong class="team-title">${n.awayTeam.name}</strong>
                            <a href="./team.html?id=${n.awayTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                    </div>
                </div>
                </div>
                `;
            }
            document.getElementById("last-match-wrapper").innerHTML = contentResult;

            contentEvent = '';
            for (const n of team.events) {
                contentEvent += `
                <div class="col l4 m6 s12">
                <div class="event-wrapper card">
                    <div class="card-action center-align">
                        <strong class="white-text">${n.utcDate.replace('T', ' ').replace('Z', '')}</strong>
                    </div>
                    <div class="card-content d-flex">
                        <div class="team-wrapper">
                            <div class="team-icon" style="background-image: url(${n.imgHome})"></div>
                            <strong class="team-title">${n.homeTeam.name}</strong>
                            <a href="./team.html?id=${n.homeTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
                        <strong class="event-vs">vs</strong>
                        <div class="team-wrapper">
                            <div class="team-icon" style="background-image: url(${n.imgAway})"></div>
                            <strong class="team-title">${n.awayTeam.name}</strong>
                            <a href="./team.html?id=${n.awayTeam.id}" class="waves-effect waves-light btn-small team-btn">Detail</a>
                        </div>
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