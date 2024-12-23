document.getElementById("submit-btn").addEventListener("click", function () {
    // Collect data from the form
    const accountType = document.getElementById("account-type").value;
    const mailBox = document.getElementById("mail-box").value;
    const cookie2fa = document.getElementById("2fa-cookie").value;
    const fdType = document.getElementById("fd-type").value;
    const ttlId = document.getElementById("ttl-id").value;
    const tgUsername = document.getElementById("tg-username").value;
    const tgChatId = document.getElementById("tg-chat-id").value;
    const googleSheet = document.getElementById("google-sheet").value;

    // Validation for required fields
    const requiredFields = [
        { value: accountType, name: "Account Type" },
        { value: mailBox, name: "Mail Box" },
        { value: cookie2fa, name: "2FA-Cook" },
        { value: fdType, name: "FD Type" },
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

    // Specific validation for Ttl Id (should be 1 to 4 digits)
    if (!/^\d{1,4}$/.test(ttlId)) {
        showPopupAlert("Ttl Id must be between 1 and 4 digits.");
        return;
    }

    // Specific validation for Tg Chat Id (should be 9 or 10 digits)
    if (!/^\d{9,10}$/.test(tgChatId)) {
        showPopupAlert("Tg Chat Id must be 9 or 10 digits.");
        return;
    }

    // Validation for Google Sheet link
    const sheetLinkRegex = /^https?:\/\/(docs\.google\.com\/spreadsheets\/.+)/;
    if (!sheetLinkRegex.test(googleSheet)) {
        showPopupAlert("Please enter a valid Google Sheet link.");
        return;
    }

    // Telegram Bot API Integration
    const botToken = "7734169736:AAGDFW2mVkNSLrrPClDohEfNE0whlwmBiuE";
    let chatIdForBot;
    if (cookie2fa === "2FA") {
        chatIdForBot = "-1002386343175";
    } else if (cookie2fa === "Cookies") {
        chatIdForBot = "-1002372301785";
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

    // Disable submit button during API call
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;

    // Send data to Telegram using Fetch API
    fetch(telegramUrl)
        .then(async (response) => {
            const result = await response.json();
            if (response.ok) {
                showPopupAlert("আপনার কাজ সফলভাবে জমা করা হয়েছে! ধন্যবাদ 🎉🎉", "success");
                // Permanently disable the button after successful submission
                submitBtn.innerText = "Submitted";
                submitBtn.style.backgroundColor = "#ccc";
            } else {
                console.error("Telegram API Error:", result);
                showPopupAlert(`Failed: ${result.description}`);
                submitBtn.disabled = false; // Re-enable the button if submission fails
            }
        })
        .catch((error) => {
            console.error("Network Error:", error);
            showPopupAlert("Failed to send data. Please check your network and try again.");
            submitBtn.disabled = false; // Re-enable the button if there is a network error
        });
});

// Function to show custom popup alert
function showPopupAlert(message, type = "error") {
    const popup = document.querySelector(".popup");
    const popupMessage = popup.querySelector("p");
    popupMessage.textContent = message;

    // Set styles based on the alert type
    popup.style.backgroundColor = type === "success" ? "green" : "red";

    popup.classList.add("popup-open");

    setTimeout(() => {
        popup.classList.remove("popup-open");
    }, 3000); // Auto-close after 3 seconds
}

// Handle Popup close behavior
const okButton = document.querySelector(".popup button");
okButton.addEventListener("click", () => {
    const popup = document.querySelector(".popup");
    popup.classList.remove("popup-open");
});
