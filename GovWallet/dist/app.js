"use strict";
window.onload = () => {
    const inputField = document.getElementById("inputField");
    const checkButton = document.getElementById("checkButton");
    checkButton === null || checkButton === void 0 ? void 0 : checkButton.addEventListener("click", () => {
        alert(`You entered: ${inputField.value}`);
    });
};
