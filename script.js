// Düğün tarihi
const weddingDate = new Date("2026-08-03T13:30:00").getTime();

function updateCountdown() {

    const now = new Date().getTime();

    const distance = weddingDate - now;

    if (distance <= 0) {

        document.getElementById("timer").innerHTML =
        "💍 Bugün Bizim Günümüz!";

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

setInterval(updateCountdown,1000);
