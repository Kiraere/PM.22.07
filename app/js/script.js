const btnRoll = document.getElementsByClassName("roll");
const blockRoll = document.getElementsByClassName("roll-block");

// Додаємо слухачі подій для кожної кнопки
Array.from(btnRoll).forEach((btn, index) => {
    btn.addEventListener("click", () => showOrHide(blockRoll[index]));
});

// Функція для розгортання/згортання
function showOrHide(block) {
    if (block.style.maxHeight && block.style.maxHeight !== "0px") {
        block.style.maxHeight = "0"; // Згорнути
    } else {
        block.style.maxHeight = block.scrollHeight + "px"; // Розгорнути до висоти контенту
    }
}
