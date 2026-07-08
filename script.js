const weddingDate = new Date("2026-08-03T13:30:00").getTime();

const loader = document.getElementById("loader");
const startBtn = document.getElementById("startInvitation");
const music = document.getElementById("bgmusic");

startBtn.addEventListener("click", () => {
    loader.style.opacity = "0";

    setTimeout(() => {
        loader.style.display = "none";
    }, 700);

    music.play().catch(() => {});
});

function updateCountdown() {
    const now = Date.now();
    const distance = weddingDate - now;

    if (distance <= 0) {
        document.getElementById("days").textContent = "0";
        document.getElementById("hours").textContent = "0";
        document.getElementById("minutes").textContent = "0";
        document.getElementById("seconds").textContent = "0";
        return;
    }

    document.getElementById("days").textContent =
        Math.floor(distance / (1000 * 60 * 60 * 24));

    document.getElementById("hours").textContent =
        Math.floor((distance / (1000 * 60 * 60)) % 24);

    document.getElementById("minutes").textContent =
        Math.floor((distance / (1000 * 60)) % 60);

    document.getElementById("seconds").textContent =
        Math.floor((distance / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const petals = document.getElementById("petals");

function createPetal() {

    const petal = document.createElement("div");

    petal.innerHTML = "🌸";

    petal.style.position = "fixed";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.top = "-50px";
    petal.style.fontSize = (18 + Math.random() * 18) + "px";
    petal.style.pointerEvents = "none";
    petal.style.animation = `fall ${6 + Math.random()*4}s linear forwards`;

    petals.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 10000);
}

setInterval(createPetal, 500);

const style = document.createElement("style");

style.innerHTML = `
@keyframes fall{

0%{
transform:translateY(-50px) rotate(0deg);
opacity:1;
}

100%{
transform:translateY(110vh) translateX(${Math.random()*200-100}px) rotate(360deg);
opacity:0;
}

}
`;
/* ===========================
   DETAYLARA KAYDIR
=========================== */

const continueBtn = document.getElementById("continueBtn");

if (continueBtn) {

    continueBtn.addEventListener("click", () => {

        const target = document.querySelector(".events");

        if (target) {

            target.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        }

    });

}
cconsole.log("Upload kodu yüklendi");

const uploadBtn = document.getElementById("uploadBtn");

console.log(uploadBtn);

if (uploadBtn) {

    console.log("Upload butonu bulundu");

    uploadBtn.addEventListener("click", async () => {

        console.log("BUTONA BASILDI");

        alert("Çalıştı");

    });

}
        }

        status.innerHTML = "⬆️ Yükleniyor...";

        for (const file of files) {

            const formData = new FormData();

            formData.append("file", file);
            formData.append("upload_preset", "wedding_upload");
            formData.append("folder", "fatih-rumeysa");
            formData.append("context", `guest=${guestName}`);

           const response = await fetch(
    "https://api.cloudinary.com/v1_1/z9n2qxfo/auto/upload",
    {
        method: "POST",
        body: formData
    }
);

const result = await response.json();
console.log(result);

if (!response.ok) {
    console.error(result);
    status.innerHTML = "❌ " + (result.error?.message || "Yükleme başarısız.");
    return;
}
        }

        status.innerHTML =
            "❤️ Teşekkür ederiz! Fotoğraf ve videolar başarıyla yüklendi.";

    });

}
