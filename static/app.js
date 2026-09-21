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

const dailyRecap = document.querySelector("[data-daily-recap]");

if (dailyRecap) {
    const slides = Array.from(dailyRecap.querySelectorAll("[data-recap-slide]"));
    const tabs = Array.from(dailyRecap.querySelectorAll("[data-recap-tab]"));
    const viewport = dailyRecap.querySelector("[data-recap-viewport]");
    let activeSlide = 0;
    let rotationTimer;
    let touchStartX = 0;
    let touchStartY = 0;

    function showRecap(index, direction = 1) {
        const nextIndex = (index + slides.length) % slides.length;
        dailyRecap.dataset.direction = direction < 0 ? "previous" : "next";
        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === nextIndex;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });
        tabs.forEach((tab, tabIndex) => {
            const isActive = tabIndex === nextIndex;
            tab.setAttribute("aria-selected", String(isActive));
            tab.tabIndex = isActive ? 0 : -1;
        });
        activeSlide = nextIndex;
    }

    function stopRecapRotation() {
        window.clearInterval(rotationTimer);
    }

    function startRecapRotation() {
        stopRecapRotation();
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            rotationTimer = window.setInterval(() => showRecap(activeSlide + 1, 1), 5000);
        }
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            showRecap(index, index < activeSlide ? -1 : 1);
            startRecapRotation();
        });
    });
    dailyRecap.querySelector("[data-recap-previous]").addEventListener("click", () => {
        showRecap(activeSlide - 1, -1);
        startRecapRotation();
    });
    dailyRecap.querySelector("[data-recap-next]").addEventListener("click", () => {
        showRecap(activeSlide + 1, 1);
        startRecapRotation();
    });

    dailyRecap.addEventListener("mouseenter", stopRecapRotation);
    dailyRecap.addEventListener("mouseleave", startRecapRotation);
    dailyRecap.addEventListener("focusin", stopRecapRotation);
    dailyRecap.addEventListener("focusout", (event) => {
        if (!dailyRecap.contains(event.relatedTarget)) {
            startRecapRotation();
        }
    });
    viewport.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
        stopRecapRotation();
    }, { passive: true });
    viewport.addEventListener("touchend", (event) => {
        const distanceX = event.changedTouches[0].clientX - touchStartX;
        const distanceY = event.changedTouches[0].clientY - touchStartY;
        if (Math.abs(distanceX) > 42 && Math.abs(distanceX) > Math.abs(distanceY)) {
            showRecap(activeSlide + (distanceX < 0 ? 1 : -1), distanceX < 0 ? 1 : -1);
        }
        startRecapRotation();
    }, { passive: true });

    startRecapRotation();
}

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