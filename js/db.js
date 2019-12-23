const dbPromised = idb.open("infobola", 1, function (upgradeDb) {
    var articlesObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id"
    });
    articlesObjectStore.createIndex("name", "name", { unique: false });
});

function saveForLater(team) {
    dbPromised
        .then(function (db) {
            var tx = db.transaction("teams", "readwrite");
            var store = tx.objectStore("teams");
            store.add(team);
            return tx.complete;
        })
        .then(function () {
            console.log("Tim berhasil di simpan.");
        });
}

function getAllTeams() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.getAll();
            })
            .then(function (teams) {
                resolve(teams);
            });
    });
}

function getTeam(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.get(parseInt(id));
            })
            .then(function (team) {
                resolve(team);
            });
    });
}

function deleteTeamById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction('teams', 'readwrite');
                var store = tx.objectStore('teams');
                store.delete(parseInt(id));
                return tx.complete;
            }).then(function (r) {
                resolve(r);
            });
    });
}