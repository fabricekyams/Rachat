function GetTaux() {
    return [GetTauxElement(0, 120, 0.0188),
        GetTauxElement(121, 180, 0.0227),
        GetTauxElement(181, 240, 0.0243),
        GetTauxElement(241, 300, 0.0284),
        GetTauxElement(301, 360, 0.0367)
    ];
}
function GetTauxElement(durMin, durMax, rate) {
    return {
        DurMin: durMin,
        DurMax: durMax,
        Rate: rate
    }
}
