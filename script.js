function calculInteretsComposes(capitalInitial, tauxAnnuel, dureeAnnees, epargneMensuelle) {
    var tauxMensuel = tauxAnnuel / 12;
    var nombreMois = dureeAnnees * 12;
    var capitalFinal = capitalInitial;
    var i;

    for (i = 0; i < nombreMois; i++) {
        capitalFinal = capitalFinal * (1 + tauxMensuel);
        capitalFinal += epargneMensuelle;
    }

    return capitalFinal;
}
