const toggles = document.querySelectorAll("[data-player-toggle]");

function closePlayer(toggle) {
    const panel = document.getElementById(toggle.getAttribute("aria-controls"));
    toggle.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    panel.previousElementSibling.classList.remove("is-expanded");
}

function openPlayer(toggle) {
    toggles.forEach((otherToggle) => {
        if (otherToggle !== toggle) {
            closePlayer(otherToggle);
        }
    });

    const panel = document.getElementById(toggle.getAttribute("aria-controls"));
    toggle.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    panel.previousElementSibling.classList.add("is-expanded");
}

toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
        if (toggle.getAttribute("aria-expanded") === "true") {
            closePlayer(toggle);
        } else {
            openPlayer(toggle);
        }
    });
});

const achievementBadges = document.querySelectorAll("[data-achievement-badge]");

function closeAchievementBadges(except = null) {
    achievementBadges.forEach((badge) => {
        if (badge !== except) {
            badge.setAttribute("aria-expanded", "false");
        }
    });
}

achievementBadges.forEach((badge) => {
    badge.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = badge.getAttribute("aria-expanded") !== "true";
        closeAchievementBadges(badge);
        badge.setAttribute("aria-expanded", String(willOpen));
    });
});

document.addEventListener("click", () => closeAchievementBadges());

const donutDrawer = document.querySelector("[data-donut-drawer]");
const donutToggle = document.querySelector("[data-donut-toggle]");
const donutClose = document.querySelector("[data-donut-close]");
const donutPanel = document.getElementById("donut-panel");

function setDonutDrawer(open) {
    donutDrawer.classList.toggle("is-open", open);
    donutToggle.setAttribute("aria-expanded", String(open));
    donutPanel.setAttribute("aria-hidden", String(!open));
}

donutToggle.addEventListener("click", () => {
    setDonutDrawer(donutToggle.getAttribute("aria-expanded") !== "true");
});

donutClose.addEventListener("click", () => {
    setDonutDrawer(false);
    donutToggle.focus();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeAchievementBadges();
    }
    if (event.key === "Escape" && donutToggle.getAttribute("aria-expanded") === "true") {
        setDonutDrawer(false);
        donutToggle.focus();
    }
});