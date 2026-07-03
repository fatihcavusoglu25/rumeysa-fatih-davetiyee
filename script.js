const weddingDate = new Date("2026-08-03T13:30:00").getTime();

/* COUNTDOWN */
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
        document.getElementById("timer").innerHTML = "💍 Bugün Bizim Günümüz!";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("timer").innerHTML =
        `${days} Gün ${hours} Saat ${minutes} Dakika ${seconds} Saniye`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* FADE IN EFFECT */
window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "1.5s ease";
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
});

/* FLOWER EFFECT (basit romantik partikül) */
function createPetal(){
    const petal = document.createElement("div");
    petal.innerHTML = "🌸";
    petal.style.position = "fixed";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.top = "-20px";
    petal.style.fontSize = Math.random() * 20 + 10 + "px";
    petal.style.opacity = "0.7";
    petal.style.animation = "fall 6s linear forwards";
    document.body.appendChild(petal);

    setTimeout(()=>petal.remove(),6000);
}

setInterval(createPetal, 500);

/* CSS animation inject */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fall{
    to{
        transform: translateY(110vh) rotate(360deg);
        opacity:0;
    }
}
`;
document.head.appendChild(style);
