const weddingDate = new Date("2026-08-03T13:30:00").getTime();

const CLOUD_NAME = "z9n2qxfo";
const UPLOAD_PRESET = "wedding_upload";
const CLOUDINARY_FOLDER = "fatih-rumeysa";
const SUPABASE_URL = "https://ocbxkepptjbaoqwvrzuw.supabase.co";
const SUPABASE_KEY = "sb_publishable_1Wz11hgmmieGxZcfjWJzIA_vUDzBsEN";
const MAX_FILES = 15;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

function safeText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function initLoader() {
    const loader = document.getElementById("loader");
    const startBtn = document.getElementById("startInvitation");
    const music = document.getElementById("bgmusic");

    if (!startBtn || !loader) return;

    startBtn.addEventListener("click", () => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
        }, 700);

        if (music) music.play().catch(() => {});
    });
}

function updateCountdown() {
    const now = Date.now();
    const distance = weddingDate - now;

    if (distance <= 0) {
        safeText("days", "0");
        safeText("hours", "0");
        safeText("minutes", "0");
        safeText("seconds", "0");
        return;
    }

    safeText("days", Math.floor(distance / (1000 * 60 * 60 * 24)));
    safeText("hours", Math.floor((distance / (1000 * 60 * 60)) % 24));
    safeText("minutes", Math.floor((distance / (1000 * 60)) % 60));
    safeText("seconds", Math.floor((distance / 1000) % 60));
}

function initPetals() {
    const petals = document.getElementById("petals");
    if (!petals) return;

    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes fall {
            0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) translateX(40px) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    function createPetal() {
        const petal = document.createElement("div");
        petal.innerHTML = "🌸";
        petal.style.position = "fixed";
        petal.style.left = Math.random() * 100 + "vw";
        petal.style.top = "-50px";
        petal.style.fontSize = (18 + Math.random() * 18) + "px";
        petal.style.pointerEvents = "none";
        petal.style.zIndex = "2";
        petal.style.animation = `fall ${6 + Math.random() * 4}s linear forwards`;
        petals.appendChild(petal);
        setTimeout(() => petal.remove(), 10000);
    }

    setInterval(createPetal, 700);
}

function initContinueButton() {
    const continueBtn = document.getElementById("continueBtn");
    if (!continueBtn) return;

    continueBtn.addEventListener("click", () => {
        const target = document.querySelector(".events");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

function getFileType(file) {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "other";
}

function validateFiles(files) {
    if (!files.length) return "📷 Lütfen en az bir dosya seçin.";
    if (files.length > MAX_FILES) return `Tek seferde en fazla ${MAX_FILES} dosya yükleyebilirsiniz.`;

    for (const file of files) {
        const type = getFileType(file);
        if (type === "other") return `${file.name} desteklenmeyen dosya türü.`;
        if (type === "image" && file.size > MAX_IMAGE_SIZE) return `${file.name} çok büyük. Fotoğraf en fazla 10 MB olmalı.`;
        if (type === "video" && file.size > MAX_VIDEO_SIZE) return `${file.name} çok büyük. Video en fazla 50 MB olmalı.`;
    }

    return null;
}

async function saveToSupabase(payload) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/wedding_uploads`, {
        method: "POST",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Supabase kaydı başarısız: " + errorText);
    }
}

async function uploadFileToCloudinary(file, guestName) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", CLOUDINARY_FOLDER);
    formData.append("context", `guest=${guestName || "Misafir"}`);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error?.message || "Cloudinary yükleme başarısız.");
    }

    return result;
}

function initUpload() {
    const uploadBtn = document.getElementById("uploadBtn");
    const filesInput = document.getElementById("mediaFiles");
    const nameInput = document.getElementById("guestName");
    const status = document.getElementById("uploadStatus");

    if (!uploadBtn || !filesInput || !nameInput || !status) return;

    uploadBtn.addEventListener("click", async () => {
        const files = Array.from(filesInput.files || []);
        const guestName = nameInput.value.trim() || "Misafir";
        const validationError = validateFiles(files);

        if (validationError) {
            status.innerHTML = validationError;
            status.className = "upload-error";
            return;
        }

        uploadBtn.disabled = true;
        status.className = "";
        status.innerHTML = `⬆️ Yükleme başladı... 0/${files.length}`;

        let successCount = 0;
        let imageCount = 0;
        let videoCount = 0;

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                status.innerHTML = `⬆️ Yükleniyor: ${i + 1}/${files.length}<br><small>${file.name}</small>`;

                const cloudinaryResult = await uploadFileToCloudinary(file, guestName);
                const fileType = getFileType(file);
                if (fileType === "image") imageCount++;
                if (fileType === "video") videoCount++;

                await saveToSupabase({
                    guest_name: guestName,
                    file_url: cloudinaryResult.secure_url,
                    file_type: fileType,
                    file_name: file.name
                });

                successCount++;
            }

            status.className = "upload-success";
            status.innerHTML = `❤️ Teşekkür ederiz ${guestName}.<br>${imageCount} fotoğraf, ${videoCount} video başarıyla yüklendi.`;
            filesInput.value = "";
        } catch (error) {
            console.error(error);
            status.className = "upload-error";
            status.innerHTML = `❌ Hata: ${error.message}`;
        } finally {
            uploadBtn.disabled = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    initPetals();
    initContinueButton();
    initUpload();
});
