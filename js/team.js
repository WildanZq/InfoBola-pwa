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
                            saveForLater({ ...team, events, results });
                            window.location.reload(false);
                        });
                    });
                });
            }
        });
});