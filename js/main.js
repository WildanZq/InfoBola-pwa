document.addEventListener("DOMContentLoaded", function () {
    var page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);
});

function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            var content = document.querySelector("#content");

            if (this.status == 200) {
                content.innerHTML = xhttp.responseText;
            } else if (this.status == 404) {
                content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
            } else {
                content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
            }

            if (page === 'home') {
                getCompetitions();
            } else if (page === 'saved') {
                getSavedTeams();
            }
        }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
}