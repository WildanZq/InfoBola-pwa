if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("../sw.js")
            .then(function () {
                console.log("Pendaftaran ServiceWorker berhasil");
            })
            .catch(function () {
                console.log("Pendaftaran ServiceWorker gagal");
            });
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

document.addEventListener("DOMContentLoaded", function () {
    const ID = new URLSearchParams(window.location.search).get("id");
    const btnSave = document.getElementById("btn-save");

    getSavedTeamById(ID)
        .then(function (team) {
            btnSave.innerHTML = 'Delete From Saved';

            btnSave.onclick = function () {
                deleteTeamById(ID);
                window.location.reload(false);
            }
        })
        .catch(function (e) {
            const TEAM = getTeamById(ID);
            const NEXT_MATCH = getNextMatchByTeamId(ID);
            const LAST_MATCH = getLastMatchByTeamId(ID);

            btnSave.onclick = function () {
                TEAM.then(function (team) {
                    NEXT_MATCH.then(function (events) {
                        LAST_MATCH.then(function (results) {
                            saveForLater({ ...team.teams[0], events, results });
                            window.location.reload(false);
                        });
                    });
                });
            }
        });
});