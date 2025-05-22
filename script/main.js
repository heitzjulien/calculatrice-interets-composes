document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("calculator-form");
    var calculatorSection = document.querySelector(".calculator-section");
    var noScriptMessage = document.getElementById("no-script-message");

    // Masquer la calculatrice si le JS est désactivé
    if (noScriptMessage) {
        calculatorSection.style.display = "none";
        noScriptMessage.style.display = "block";
        return;
    }

    if (!form) return;

    // Initialiser le graph
    var ctx = document.getElementById("results-chart").getContext("2d");
    var chart = new Chart(ctx, {
        type: "line",
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    form.onsubmit = function (e) {
        e.preventDefault();

        var capital = parseFloat(form.capital.value) || 0;
        var epargne = parseFloat(form.epargne.value) || 0;
        var periode = parseInt(form.periode.value, 10) || 0;
        var tauxAnnuel = parseFloat(form.taux.value) || 0;
        var intervalle = form.intervalle.value;

        // Déterminer la fréquence de capitalisation
        var frequence;
        switch (intervalle) {
            case "mensuel":
                frequence = 12;
                break;
            case "trimestriel":
                frequence = 4;
                break;
            case "annuel":
                frequence = 1;
                break;
            default:
                frequence = 12;
        }

        var tauxPeriode = tauxAnnuel / 100 / frequence;
        var totalPeriodes = periode * frequence;

        // Données pour le graphique
        var years = [];
        var capitalData = [];
        var interestData = [];

        var total = capital;
        var totalPayments = capital;
        var totalInterest = 0;

        // Point de départ
        years.push(0);
        capitalData.push(total);
        interestData.push(0);

        // Calculer le versement par période
        var versementParPeriode;
        if (frequence === 12) {
            versementParPeriode = epargne; // Mensuel
        } else if (frequence === 4) {
            versementParPeriode = epargne * 3; // Trimestriel (3 mois)
        } else {
            versementParPeriode = epargne * 12; // Annuel (12 mois)
        }

        for (var periode_i = 1; periode_i <= totalPeriodes; periode_i++) {
            var interest = total * tauxPeriode;
            totalInterest += interest;
            total += interest;

            total += versementParPeriode;
            totalPayments += versementParPeriode;

            if (periode_i % frequence === 0) {
                var year = periode_i / frequence;
                years.push(year);
                capitalData.push(total);
                interestData.push(totalInterest);
            }
        }

        // Mettre à jour le graphique
        chart.data.labels = years;
        chart.data.datasets = [
            {
                label: "Intérêts",
                data: interestData,
                backgroundColor: "rgba(241, 192, 134, 0.6)",
                borderColor: "rgba(241, 192, 134, 1)",
                fill: true
            },
            {
                label: "Versements",
                data: capitalData,
                borderColor: "rgba(141, 173, 255, 1)",
                fill: true
            }
        ];
        chart.update();

        // Mettre à jour les résultats
        document.getElementById("final-amount").textContent = formatMoney(total);
        document.getElementById("total-payments").textContent = formatMoney(totalPayments - capital);
        document.getElementById("total-interest").textContent = formatMoney(totalInterest);

        // Mettre à jour le résumé
        document.getElementById("summary-capital").textContent = formatMoney(capital);
        document.getElementById("summary-monthly").textContent = formatMoney(epargne);
        document.getElementById("summary-years").textContent = periode;
        document.getElementById("summary-rate").textContent = tauxAnnuel + "%";
        document.getElementById("summary-final").textContent = formatMoney(total);

        // Mettre à jour l'année de fin 
        var currentYear = new Date().getFullYear();
        document.getElementById("end-year-label").textContent = currentYear + periode;
    };

    function formatMoney(amount) {
        return amount
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$& ")
            + " €";
    }
});