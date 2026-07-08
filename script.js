document.addEventListener("DOMContentLoaded", () => {
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

    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes fall {
            0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) translateX(40px) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    function createPetal() {
        if (!petals) return;
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

    setInterval(createPetal, 500);

    const continueBtn = document.getElementById("continueBtn");
    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            const target = document.querySelector(".events");
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

    const CLOUD_NAME = "z9n2qxfo";
    const UPLOAD_PRESET = "wedding_upload";
    const SUPABASE_URL = "https://ocbxkepptjbaoqwvrzuw.supabase.co";
    const SUPABASE_KEY = "sb_publishable_1Wz11hgmmieGxZcfjWJzIA_vUDzBsEN";

    const uploadBtn = document.getElementById("uploadBtn");
    const filesInput = document.getElementById("mediaFiles");
    const guestNameInput = document.getElementById("guestName");
    const status = document.getElementById("uploadStatus");

    function setStatus(message, type = "info") {
        if (!status) return;
        status.className = `upload-status ${type}`;
        status.innerHTML = message;
    }

    function uploadToCloudinary(file, onProgress) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);
            formData.append("folder", "fatih-rumeysa");

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable && onProgress) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    onProgress(percent);
                }
            };

            xhr.onload = () => {
                let result = {};
                try { result = JSON.parse(xhr.responseText); } catch (e) {}

                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(result);
                } else {
                    reject(new Error(result?.error?.message || "Cloudinary yükleme hatası"));
                }
            };

            xhr.onerror = () => reject(new Error("İnternet bağlantısı veya yükleme hatası"));
            xhr.send(formData);
        });
    }

    async function saveToSupabase({ guestName, file, cloudinaryResult }) {
        const payload = {
            guest_name: guestName || "İsimsiz Misafir",
            file_url: cloudinaryResult.secure_url,
            file_type: cloudinaryResult.resource_type || (file.type.startsWith("video") ? "video" : "image"),
            file_name: file.name
        };

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
            throw new Error("Supabase kayıt hatası: " + errorText);
        }
    }

    if (uploadBtn && filesInput) {
        uploadBtn.addEventListener("click", async () => {
            const files = Array.from(filesInput.files || []);
            const guestName = (guestNameInput?.value || "").trim();

            if (files.length === 0) {
                setStatus("📷 Lütfen en az bir fotoğraf veya video seçin.", "error");
                return;
            }

            if (files.length > 15) {
                setStatus("⚠️ Tek seferde en fazla 15 dosya yükleyebilirsiniz.", "error");
                return;
            }

            for (const file of files) {
                const isVideo = file.type.startsWith("video");
                const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
                if (file.size > maxSize) {
                    setStatus(`⚠️ ${file.name} çok büyük. Fotoğraf max 10 MB, video max 50 MB olmalı.`, "error");
                    return;
                }
            }

            uploadBtn.disabled = true;
            uploadBtn.textContent = "Yükleniyor...";

            let uploadedCount = 0;
            const total = files.length;

            try {
                for (const file of files) {
                    setStatus(`⬆️ ${uploadedCount + 1}/${total} yükleniyor: ${file.name}<br><small>%0</small>`, "info");

                    const cloudinaryResult = await uploadToCloudinary(file, (percent) => {
                        setStatus(`⬆️ ${uploadedCount + 1}/${total} yükleniyor: ${file.name}<br><small>%${percent}</small>`, "info");
                    });

                    await saveToSupabase({ guestName, file, cloudinaryResult });
                    uploadedCount++;
                }

                setStatus(`❤️ Teşekkür ederiz${guestName ? " " + guestName : ""}!<br>${uploadedCount} dosya başarıyla yüklendi.`, "success");
                filesInput.value = "";
            } catch (error) {
                console.error(error);
                setStatus(`❌ ${error.message}`, "error");
            } finally {
                uploadBtn.disabled = false;
                uploadBtn.textContent = "❤️ Fotoğraf / Video Yükle";
            }
        });
    }
});
