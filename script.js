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

function setStatus(message) {
    status.innerHTML = message;
}

if (uploadBtn) {
    uploadBtn.addEventListener("click", async () => {
        const files = Array.from(filesInput.files || []);
        const guestName = (guestNameInput.value || "İsimsiz").trim();

        if (files.length === 0) {
            setStatus("📷 Lütfen dosya seç.");
            return;
        }

        setStatus("⬆️ Yükleniyor...");

        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);
            formData.append("folder", "fatih-rumeysa");

            const cloudRes = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const cloudData = await cloudRes.json();

            if (!cloudRes.ok) {
                setStatus("❌ Cloudinary hatası: " + JSON.stringify(cloudData));
                return;
            }

            const saveRes = await fetch(
                `${SUPABASE_URL}/rest/v1/wedding_uploads`,
                {
                    method: "POST",
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": `Bearer ${SUPABASE_KEY}`,
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal"
                    },
                    body: JSON.stringify({
                        guest_name: guestName,
                        file_url: cloudData.secure_url,
                        file_type: file.type.startsWith("video") ? "video" : "image",
                        file_name: file.name
                    })
                }
            );

            if (!saveRes.ok) {
                const err = await saveRes.text();
                setStatus("❌ Supabase kayıt hatası: " + err);
                return;
            }
        }

        setStatus("❤️ Yükleme tamamlandı. Teşekkür ederiz!");
        filesInput.value = "";
    });
}
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
