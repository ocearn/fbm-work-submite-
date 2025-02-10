document.getElementById("account-type").addEventListener("change", function () {
    const accountType = this.value.toLowerCase();
    const mailBox = document.getElementById("mail-box");
    const cookie2fa = document.getElementById("2fa-cookie");
    const fdType = document.getElementById("fd-type");

    if (["gmail", "instagram", "telegram"].includes(accountType)) {
        mailBox.disabled = true;
        mailBox.required = false;
        cookie2fa.disabled = true;
        cookie2fa.required = false;
        fdType.disabled = true;
        fdType.required = false;

        mailBox.value = "";
        cookie2fa.value = "";
        fdType.value = "";
    } else {
        mailBox.disabled = false;
        mailBox.required = true;
        cookie2fa.disabled = false;
        cookie2fa.required = true;
        fdType.disabled = false;
        fdType.required = true;
    }
});

document.getElementById("submit-btn").addEventListener("click", function () {
    const accountType = document.getElementById("account-type").value;
    const mailBox = document.getElementById("mail-box").value || "N/A";
    const cookie2fa = document.getElementById("2fa-cookie").value || "N/A";
    const fdType = document.getElementById("fd-type").value || "N/A";
    const ttlId = document.getElementById("ttl-id").value;
    const tgUsername = document.getElementById("tg-username").value;
    const tgChatId = document.getElementById("tg-chat-id").value;
    const googleSheet = document.getElementById("google-sheet").value;

    const requiredFields = [
        { value: accountType, name: "Account Type" },
        { value: ttlId, name: "Ttl Id" },
        { value: tgUsername, name: "Tg Username" },
        { value: tgChatId, name: "Tg Chat Id" },
        { value: googleSheet, name: "Google Sheet Link" }
    ];

    for (const field of requiredFields) {
        if (!field.value || field.value === "Select") {
            showPopupAlert(`Please fill out the ${field.name}.`);
            return;
        }
    }

    if (!/^\d{1,4}$/.test(ttlId)) {
        showPopupAlert("Ttl Id must be between 1 and 4 digits.");
        return;
    }

    if (!/^\d{9,10}$/.test(tgChatId)) {
        showPopupAlert("Tg Chat Id must be 9 or 10 digits.");
        return;
    }

    const sheetLinkRegex = /^https?:\/\/(docs\.google\.com\/spreadsheets\/.+)/;
    if (!sheetLinkRegex.test(googleSheet)) {
        showPopupAlert("Please enter a valid Google Sheet link.");
        return;
    }

    const botToken = "7734169736:AAGDFW2mVkNSLrrPClDohEfNE0whlwmBiuE";
    let chatIdForBot;

    if (cookie2fa === "2FA") {
        chatIdForBot = "-1002386343175";
    } else if (cookie2fa === "Cookies") {
        chatIdForBot = "-1002372301785";
    } else if (accountType.toLowerCase() === "gmail") {
        chatIdForBot = "-1002281630040";
    } else if (accountType.toLowerCase() === "instagram") {
        chatIdForBot = "-1002289360040";
    } else if (accountType.toLowerCase() === "telegram") {
        chatIdForBot = "-1002238560040";
    } else {
        alert("সঠিকভাবে 2FA বা Cookies সিলেক্ট করুন।");
        return;
    }

    const message = `
      New Form Submission:
      - Account Type: ${accountType}
      - Mail Box: ${mailBox}
      - 2FA-Cook: ${cookie2fa}
      - FD Type: ${fdType}
      - Ttl Id: ${ttlId}
      - Tg Username: ${tgUsername}
      - Tg Chat Id: ${tgChatId}
      - Google Sheet: ${googleSheet}
    `;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatIdForBot}&text=${encodeURIComponent(
        message
    )}`;

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;

    fetch(telegramUrl)
        .then(async (response) => {
            const result = await response.json();
            if (response.ok) {
                showPopupAlert("আপনার কাজ সফলভাবে জমা করা হয়েছে! ধন্যবাদ 🎉🎉", "success");
                submitBtn.innerText = "Submitted";
                submitBtn.style.backgroundColor = "#ccc";
            } else {
                console.error("Telegram API Error:", result);
                showPopupAlert(`Failed: ${result.description}`);
                submitBtn.disabled = false;
            }
        })
        .catch((error) => {
            console.error("Network Error:", error);
            showPopupAlert("Failed to send data. Please check your network and try again.");
            submitBtn.disabled = false;
        });
});

function showPopupAlert(message, type = "error") {
    const popup = document.querySelector(".popup");
    const popupMessage = popup.querySelector("p");
    popupMessage.textContent = message;

    popup.style.backgroundColor = type === "success" ? "green" : "red";

    popup.classList.add("popup-open");

    setTimeout(() => {
        popup.classList.remove("popup-open");
    }, 10000);
}

const okButton = document.querySelector(".popup button");
okButton.addEventListener("click", () => {
    const popup = document.querySelector(".popup");
    popup.classList.remove("popup-open");
});
