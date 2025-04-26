document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculator-form');

    if (!form) {
        console.error("Formulaire non trouvé dans le DOM !");
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const capital = parseFloat(this.capital.value).toFixed(2);
        const epargne = parseFloat(this.epargne.value).toFixed(2);
        const periode = parseInt(this.periode.value);
        const taux = parseFloat(this.taux.value).toFixed(2);
        const intervalle = this.intervalle.value;

        console.log("Capital initial (€):", capital);
        console.log("Épargne mensuelle (€):", epargne);
        console.log("Période (années):", periode);
        console.log("Taux d’intérêt annuel (%):", taux);
        console.log("Intervalle d’intérêts:", intervalle);
    });
});
