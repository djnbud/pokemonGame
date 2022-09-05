function initPlayerInv() {
    document.querySelector("#pokemonPlayerInv").addEventListener("click", (e) => {});
    document.querySelector("#pokemonStoragePlayerInv").addEventListener("click", (e) => {});

    document.querySelector("#pokedexPlayerInv").addEventListener("click", (e) => {});
    document.querySelector("#itemsPlayerInv").addEventListener("click", (e) => {});
    document.querySelector("#closePlayerInv").addEventListener("click", (e) => {
        closePlayerInventory();
    });
    keys.i.pressed = false;
    playerInventory();
}

function playerInventory() {
    const animationId = window.requestAnimationFrame(playerInventory);

    if (keys.i.pressed && playerUI.open === true) {
        window.cancelAnimationFrame(animationId);
        closePlayerInventory();
    }
}

function closePlayerInventory() {
    if (playerUI.open === true) {
        keys.i.pressed = false;
        animate();
        playerUI.open = false;
        document.querySelector("#playerUIContainer").style.display = "none";
    }
}
