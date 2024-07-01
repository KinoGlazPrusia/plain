import myComp1 from "./myComp1/myComp1.js";

document.addEventListener("DOMContentLoaded", () => {
    const a = document.getElementById('a')
    const b = document.getElementById('b')

    b.signals.connect(a, 'clicked', () => console.log("Hola"))
})