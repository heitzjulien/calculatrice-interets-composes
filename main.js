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

        var frequence = intervalle === "mensuel" ? 12 : intervalle === "trimestriel" ? 4 : 1;

        var tauxPeriodique = tauxAnnuel / 100 / frequence;

        // Données pour le graphique
        var years = [];
        var capitalData = [];
        var interestData = [];

        var total = capital;
        var totalPayments = capital;
        var totalInterest = 0;

        // Point de départ
        years.push(0);
        capitalData.push(capital);
        interestData.push(0);

        for (var year = 1; year <= periode; year++) {
            for (var period = 0; period < frequence; period++) {
                var interest = total * tauxPeriodique;
                totalInterest += interest;
                total = total * (1 + tauxPeriodique);

                if (frequence === 12) {
                    total += epargne;
                    totalPayments += epargne;
                } else if (frequence === 4 && period % 3 === 2) {
                    total += epargne * 3;
                    totalPayments += epargne * 3;
                }
            }

            // Ajouter le point de données annuel
            years.push(year);
            capitalData.push(totalPayments);
            interestData.push(totalInterest);
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
        return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$& ") + " €";
    }
});