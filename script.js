const weddingDate = new Date("2026-08-03T13:30:00").getTime();

const loader = document.getElementById("loader");
const startBtn = document.getElementById("startInvitation");
const music = document.getElementById("bgmusic");

if (startBtn && loader) {
    startBtn.addEventListener("click", () => {
        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
        }, 700);

        if (music) {
            music.play().catch(() => {});
        }
    });
}

function updateCountdown() {
    const now = Date.now();
    const distance = weddingDate - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (distance <= 0) {
        daysEl.textContent = "0";
        hoursEl.textContent = "0";
        minutesEl.textContent = "0";
        secondsEl.textContent = "0";
        return;
    }

    daysEl.textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
    hoursEl.textContent = Math.floor((distance / (1000 * 60 * 60)) % 24);
    minutesEl.textContent = Math.floor((distance / (1000 * 60)) % 60);
    secondsEl.textContent = Math.floor((distance / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const petals = document.getElementById("petals");

function createPetal() {
    if (!petals) return;

    const petal = document.createElement("div");

    petal.innerHTML = "🌸";
    petal.style.position = "fixed";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.top = "-50px";
    petal.style.fontSize = (18 + Math.random() * 18) + "px";
    petal.style.pointerEvents = "none";
    petal.style.zIndex = "1";
    petal.style.animation = `fall ${6 + Math.random() * 4}s linear forwards`;

    petals.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 10000);
}

setInterval(createPetal, 500);

const style = document.createElement("style");

style.innerHTML = `
@keyframes fall {
    0% {
        transform: translateY(-50px) rotate(0deg);
        opacity: 1;
    }

    100% {
        transform: translateY(110vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
        opacity: 0;
    }
}
`;

document.head.appendChild(style);

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

/* ===========================
   FOTOĞRAF / VİDEO YÜKLEME
=========================== */

const CLOUDINARY_CLOUD_NAME = "z9n2qxfo";
const CLOUDINARY_UPLOAD_PRESET = "wedding_upload";
const MAX_FILE_SIZE_MB = 100;

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("mediaFiles");
const guestNameInput = document.getElementById("guestName");
const statusBox = document.getElementById("uploadStatus");
const progressWrap = document.getElementById("uploadProgressWrap");
const progressBar = document.getElementById("uploadProgressBar");

function setUploadStatus(message, type = "") {
    if (!statusBox) return;
    statusBox.className = type;
    statusBox.innerHTML = message;
}

function setProgress(percent) {
    if (!progressWrap || !progressBar) return;
    progressWrap.hidden = false;
    progressBar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
}

function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setProgress(percent);
            }
        });

        xhr.onload = () => {
            let result = {};

            try {
                result = JSON.parse(xhr.responseText);
            } catch (error) {
                reject(new Error("Cloudinary cevabı okunamadı."));
                return;
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(result);
            } else {
                reject(new Error(result.error?.message || "Yükleme başarısız oldu."));
            }
        };

        xhr.onerror = () => {
            reject(new Error("Bağlantı hatası oluştu."));
        };

        xhr.send(formData);
    });
}

if (uploadBtn && fileInput) {
    uploadBtn.addEventListener("click", async () => {
        const files = Array.from(fileInput.files || []);
        const guestName = (guestNameInput?.value || "").trim();

        if (files.length === 0) {
            setUploadStatus("📷 Lütfen en az bir fotoğraf veya video seçin.", "error");
            return;
        }

        const oversizedFile = files.find(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);

        if (oversizedFile) {
            setUploadStatus(`❌ "${oversizedFile.name}" çok büyük. En fazla ${MAX_FILE_SIZE_MB} MB yükleyebilirsiniz.`, "error");
            return;
        }

        uploadBtn.disabled = true;
        uploadBtn.textContent = "Yükleniyor...";
        setProgress(0);

        const uploadedLinks = [];

        try {
            for (let index = 0; index < files.length; index++) {
                const file = files[index];

                setUploadStatus(`⬆️ Yükleniyor: ${index + 1}/${files.length}<br><small>${file.name}</small>`, "loading");

                const result = await uploadToCloudinary(file);
                uploadedLinks.push(result.secure_url);
            }

            setProgress(100);

            const nameText = guestName ? `<br><small>Paylaşım sahibi: ${guestName}</small>` : "";

            setUploadStatus(
                `❤️ Teşekkür ederiz! ${files.length} dosya başarıyla yüklendi.${nameText}`,
                "success"
            );

            fileInput.value = "";
            if (guestNameInput) guestNameInput.value = "";
        } catch (error) {
            console.error(error);
            setUploadStatus(`❌ ${error.message}`, "error");
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.textContent = "❤️ Fotoğraf / Video Yükle";
        }
    });
}
