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
    const TEAM = getTeamById(ID);
    getNextMatchByTeamId(ID);
    getLastMatchByTeamId(ID);

    document.getElementById("btn-save").onclick = function () {
        TEAM.then(function (team) {
            saveForLater(team.teams[0]);
        });
    }
});