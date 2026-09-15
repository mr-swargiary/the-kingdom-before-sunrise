/*
 * ============================================================
 * THE KINGDOM BEFORE SUNRISE
 * Main JavaScript System
 * Version: 1.0.0
 * ============================================================
 *
 * This file provides the foundation for:
 * - Mobile navigation
 * - Active navigation links
 * - Site-wide search
 * - Local progress storage
 * - Achievement tracking
 * - Personalized roadmap foundation
 * - Career-path data
 * - Accessibility helpers
 * - Keyboard controls
 *
 * No external libraries required.
 * ============================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       1. CORE CONFIGURATION
       ======================================================== */

    const SITE_NAME = "The Kingdom Before Sunrise";
    const STORAGE_PREFIX = "tkbs_";
    const STORAGE_KEYS = {
        progress: `${STORAGE_PREFIX}progress_v1`,
        achievements: `${STORAGE_PREFIX}achievements_v1`,
        profile: `${STORAGE_PREFIX}profile_v1`
    };


    /* ========================================================
       2. BASIC PAGE INFORMATION
       ======================================================== */

    const currentPath = window.location.pathname;
    const currentFile = currentPath.split("/").pop() || "index.html";
    const isPagesDirectory = currentPath.includes("/pages/");

    function getPagePath(page) {
        if (isPagesDirectory) {
            if (page === "index.html") {
                return "../index.html";
            }

            return page;
        }

        if (page === "index.html") {
            return "index.html";
        }

        return `pages/${page}`;
    }


    /* ========================================================
       3. SAFE LOCAL STORAGE
       ======================================================== */

    function readStorage(key, fallback) {
        try {
            const stored = localStorage.getItem(key);

            if (!stored) {
                return fallback;
            }

            return JSON.parse(stored);
        } catch (error) {
            console.warn(`${SITE_NAME}: Storage read failed.`, error);
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`${SITE_NAME}: Storage write failed.`, error);
            return false;
        }
    }


    /* ========================================================
       4. MOBILE NAVIGATION
       ======================================================== */

    function setupMobileNavigation() {

        const navContainer = document.querySelector(".nav-container");
        const navLinks = document.querySelector(".nav-links");

        if (!navContainer || !navLinks) {
            return;
        }

        /*
         * Avoid creating the button twice.
         */
        if (document.querySelector(".mobile-menu-toggle")) {
            return;
        }

        const toggleButton = document.createElement("button");

        toggleButton.className = "mobile-menu-toggle";
        toggleButton.type = "button";
        toggleButton.setAttribute("aria-label", "Open navigation menu");
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.setAttribute("aria-controls", "main-navigation");

        toggleButton.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        navLinks.id = "main-navigation";

        /*
         * Insert before navigation links.
         */
        navContainer.insertBefore(toggleButton, navLinks);

        function closeMenu() {
            navLinks.classList.remove("mobile-open");
            toggleButton.classList.remove("active");

            toggleButton.setAttribute("aria-expanded", "false");
            toggleButton.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
        }

        function openMenu() {
            navLinks.classList.add("mobile-open");
            toggleButton.classList.add("active");

            toggleButton.setAttribute("aria-expanded", "true");
            toggleButton.setAttribute(
                "aria-label",
                "Close navigation menu"
            );
        }

        toggleButton.addEventListener("click", () => {

            const isOpen =
                navLinks.classList.contains("mobile-open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        /*
         * Close menu after selecting a navigation link.
         */
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        /*
         * Close when Escape is pressed.
         */
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        /*
         * Close when viewport becomes large again.
         */
        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeMenu();
            }
        });
    }


    /* ========================================================
       5. ACTIVE NAVIGATION LINK
       ======================================================== */

    function setupActiveNavigation() {

        const links = document.querySelectorAll(".nav-links a");

        if (!links.length) {
            return;
        }

        links.forEach(link => {

            const href = link.getAttribute("href");

            if (!href) {
                return;
            }

            /*
             * Ignore external links.
             */
            if (
                href.startsWith("http://") ||
                href.startsWith("https://") ||
                href.startsWith("#")
            ) {
                return;
            }

            const linkFile = href.split("/").pop();

            let isActive = false;

            if (
                currentFile === linkFile ||
                (currentFile === "" && linkFile === "index.html")
            ) {
                isActive = true;
            }

            /*
             * Homepage can also appear as ./index.html.
             */
            if (
                (currentFile === "index.html" || currentFile === "") &&
                (linkFile === "index.html" || href === "./")
            ) {
                isActive = true;
            }

            if (isActive) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });
    }


    /* ========================================================
       6. SMOOTH ANCHOR SCROLLING
       ======================================================== */

    function setupSmoothScrolling() {

        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {

            link.addEventListener("click", event => {

                const targetID = link.getAttribute("href");

                if (!targetID || targetID === "#") {
                    return;
                }

                const target = document.querySelector(targetID);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                /*
                 * Update URL without forcing page reload.
                 */
                try {
                    history.pushState(null, "", targetID);
                } catch (error) {
                    console.warn(
                        `${SITE_NAME}: History update failed.`
                    );
                }
            });
        });
    }


    /* ========================================================
       7. SEARCH DATABASE
       ======================================================== */

    const searchIndex = [
        {
            title: "Home",
            page: "index.html",
            description:
                "The main introduction to The Kingdom Before Sunrise.",
            keywords:
                "home cybersecurity kingdom beginner start"
        },

        {
            title: "Complete Roadmap",
            page: "roadmap.html",
            description:
                "The complete cybersecurity learning roadmap.",
            keywords:
                "roadmap cybersecurity learning path beginner advanced"
        },

        {
            title: "Cybersecurity Careers",
            page: "careers.html",
            description:
                "Explore cybersecurity roles, skills and career paths.",
            keywords:
                "career cybersecurity analyst SOC VAPT penetration testing cloud security forensics"
        },

        {
            title: "Skills",
            page: "skills.html",
            description:
                "Build computer, Linux, networking, programming and security skills.",
            keywords:
                "skills Linux networking Python programming security cloud forensics"
        },

        {
            title: "Projects",
            page: "projects.html",
            description:
                "Learn cybersecurity by building practical projects.",
            keywords:
                "projects practice Python security portfolio programming"
        },

        {
            title: "Resources",
            page: "resources.html",
            description:
                "Find learning resources for cybersecurity and its foundations.",
            keywords:
                "resources books courses documentation labs CTF certifications"
        },

        {
            title: "About",
            page: "about.html",
            description:
                "Learn about the mission and philosophy behind the platform.",
            keywords:
                "about mission philosophy learning"
        },

        {
            title: "Contact",
            page: "contact.html",
            description:
                "Contact information and responsible security reporting.",
            keywords:
                "contact correction suggestion security report"
        },

        {
            title: "Disclaimer",
            page: "disclaimer.html",
            description:
                "Educational purpose, responsible use and legal information.",
            keywords:
                "disclaimer legal educational responsible security"
        },

        {
            title: "Privacy Policy",
            page: "privacy.html",
            description:
                "Information about privacy and data handling.",
            keywords:
                "privacy data cookies personal information"
        },

        {
            title: "Terms & Conditions",
            page: "terms.html",
            description:
                "Rules governing use of the platform.",
            keywords:
                "terms conditions lawful use security"
        },

        {
            title: "FAQ",
            page: "faq.html",
            description:
                "Frequently asked questions about cybersecurity learning.",
            keywords:
                "FAQ questions beginner Linux programming career degree"
        }
    ];


    /* ========================================================
       8. SEARCH SYSTEM
       ======================================================== */

    function createSearchInterface() {

        if (document.querySelector(".site-search-overlay")) {
            return;
        }

        const overlay = document.createElement("div");

        overlay.className = "site-search-overlay";

        overlay.innerHTML = `
            <div
                class="site-search-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="search-title"
            >

                <div class="search-header">

                    <div>
                        <p class="search-eyebrow">
                            THE KINGDOM SEARCH
                        </p>

                        <h2 id="search-title">
                            Find your path.
                        </h2>
                    </div>

                    <button
                        type="button"
                        class="search-close"
                        aria-label="Close search"
                    >
                        ×
                    </button>

                </div>

                <div class="search-input-wrapper">

                    <span aria-hidden="true">
                        ⌕
                    </span>

                    <input
                        type="search"
                        class="site-search-input"
                        placeholder="Search cybersecurity topics..."
                        autocomplete="off"
                        spellcheck="false"
                        aria-label="Search the website"
                    />

                    <kbd>ESC</kbd>

                </div>

                <div
                    class="search-results"
                    aria-live="polite"
                ></div>

            </div>
        `;

        document.body.appendChild(overlay);

        const input =
            overlay.querySelector(".site-search-input");

        const results =
            overlay.querySelector(".search-results");

        const closeButton =
            overlay.querySelector(".search-close");


        function closeSearch() {

            overlay.classList.remove("open");

            document.body.classList.remove("search-open");

            input.value = "";

            results.innerHTML = "";
        }


        function openSearch() {

            overlay.classList.add("open");

            document.body.classList.add("search-open");

            setTimeout(() => {
                input.focus();
            }, 50);

            renderResults("");
        }


        function renderResults(query) {

            const cleanQuery =
                query.trim().toLowerCase();

            let matches = searchIndex;

            if (cleanQuery) {

                const words =
                    cleanQuery
                        .split(/\s+/)
                        .filter(Boolean);

                matches = searchIndex.filter(item => {

                    const searchableText = (
                        `${item.title} ` +
                        `${item.description} ` +
                        `${item.keywords}`
                    ).toLowerCase();

                    return words.every(word =>
                        searchableText.includes(word)
                    );
                });
            }

            if (!matches.length) {

                results.innerHTML = `
                    <div class="search-empty">
                        <strong>No results found.</strong>
                        <p>
                            Try a broader cybersecurity term.
                        </p>
                    </div>
                `;

                return;
            }

            results.innerHTML = matches.map(item => {

                const path = getPagePath(item.page);

                return `
                    <a
                        class="search-result"
                        href="${path}"
                    >
                        <span class="search-result-icon">
                            ◈
                        </span>

                        <span>
                            <strong>
                                ${item.title}
                            </strong>

                            <small>
                                ${item.description}
                            </small>
                        </span>
                    </a>
                `;

            }).join("");
        }


        input.addEventListener("input", () => {
            renderResults(input.value);
        });


        closeButton.addEventListener("click", closeSearch);


        overlay.addEventListener("click", event => {

            if (event.target === overlay) {
                closeSearch();
            }
        });


        document.addEventListener("keydown", event => {

            /*
             * Escape closes search.
             */
            if (
                event.key === "Escape" &&
                overlay.classList.contains("open")
            ) {
                closeSearch();
            }

            /*
             * "/" opens search unless user is already typing.
             */
            const activeElement =
                document.activeElement;

            const isTyping =
                activeElement &&
                (
                    activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    activeElement.isContentEditable
                );

            if (
                event.key === "/" &&
                !isTyping &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey
            ) {
                event.preventDefault();
                openSearch();
            }

            /*
             * Ctrl + K / Cmd + K
             */
            if (
                event.key.toLowerCase() === "k" &&
                (event.ctrlKey || event.metaKey)
            ) {
                event.preventDefault();
                openSearch();
            }
        });


        /*
         * Public search controls.
         */
        window.KingdomSearch = {
            open: openSearch,
            close: closeSearch
        };
    }


    /* ========================================================
       9. SEARCH BUTTON
       ======================================================== */

    function setupSearchButton() {

        const navContainer =
            document.querySelector(".nav-container");

        if (!navContainer) {
            return;
        }

        if (document.querySelector(".search-toggle")) {
            return;
        }

        const button = document.createElement("button");

        button.type = "button";
        button.className = "search-toggle";
        button.setAttribute(
            "aria-label",
            "Search website"
        );

        button.innerHTML = "⌕";

        button.addEventListener("click", () => {

            if (
                window.KingdomSearch &&
                typeof window.KingdomSearch.open === "function"
            ) {
                window.KingdomSearch.open();
            }
        });

        navContainer.appendChild(button);
    }


    /* ========================================================
       10. PROGRESS SYSTEM
       ======================================================== */

    function getProgress() {

        return readStorage(
            STORAGE_KEYS.progress,
            {
                completed: [],
                updatedAt: null
            }
        );
    }


    function saveProgress(progress) {

        progress.updatedAt =
            new Date().toISOString();

        return writeStorage(
            STORAGE_KEYS.progress,
            progress
        );
    }


    function isProgressComplete(id) {

        const progress = getProgress();

        return progress.completed.includes(id);
    }


    function setProgress(id, completed = true) {

        if (!id) {
            return false;
        }

        const progress = getProgress();

        const index =
            progress.completed.indexOf(id);

        if (completed && index === -1) {
            progress.completed.push(id);
        }

        if (!completed && index !== -1) {
            progress.completed.splice(index, 1);
        }

        const saved = saveProgress(progress);

        if (saved) {
            updateProgressElements();
        }

        return saved;
    }


    function toggleProgress(id) {

        return setProgress(
            id,
            !isProgressComplete(id)
        );
    }


    function updateProgressElements() {

        const elements =
            document.querySelectorAll("[data-progress-id]");

        elements.forEach(element => {

            const id =
                element.dataset.progressId;

            const completed =
                isProgressComplete(id);

            element.classList.toggle(
                "progress-complete",
                completed
            );

            element.setAttribute(
                "aria-pressed",
                String(completed)
            );

            if (element.dataset.progressLabel) {

                element.textContent =
                    completed
                        ? "Completed"
                        : element.dataset.progressLabel;
            }
        });
    }


    function setupProgressElements() {

        const elements =
            document.querySelectorAll("[data-progress-id]");

        elements.forEach(element => {

            const id =
                element.dataset.progressId;

            if (!id) {
                return;
            }

            if (
                element.tagName === "BUTTON" ||
                element.getAttribute("role") === "button"
            ) {

                element.addEventListener("click", () => {
                    toggleProgress(id);
                });
            }
        });

        updateProgressElements();
    }


    /* ========================================================
       11. ACHIEVEMENT SYSTEM
       ======================================================== */

    const achievementDefinitions = {

        first_visit: {
            title: "First Step",
            description:
                "Entered The Kingdom Before Sunrise."
        },

        roadmap_visit: {
            title: "The Map",
            description:
                "Explored the cybersecurity roadmap."
        },

        careers_visit: {
            title: "Choose Your Path",
            description:
                "Explored cybersecurity career paths."
        },

        skills_visit: {
            title: "Skill Builder",
            description:
                "Explored the cybersecurity skill tree."
        },

        projects_visit: {
            title: "Builder",
            description:
                "Explored practical cybersecurity projects."
        },

        resources_visit: {
            title: "Knowledge Seeker",
            description:
                "Explored the learning resources."
        }
    };


    function getAchievements() {

        return readStorage(
            STORAGE_KEYS.achievements,
            {
                unlocked: [],
                updatedAt: null
            }
        );
    }


    function unlockAchievement(id) {

        if (!achievementDefinitions[id]) {
            return false;
        }

        const achievements =
            getAchievements();

        if (achievements.unlocked.includes(id)) {
            return false;
        }

        achievements.unlocked.push(id);

        achievements.updatedAt =
            new Date().toISOString();

        return writeStorage(
            STORAGE_KEYS.achievements,
            achievements
        );
    }


    function trackCurrentPage() {

        unlockAchievement("first_visit");

        const pageAchievements = {

            "roadmap.html": "roadmap_visit",

            "careers.html": "careers_visit",

            "skills.html": "skills_visit",

            "projects.html": "projects_visit",

            "resources.html": "resources_visit"
        };

        const achievement =
            pageAchievements[currentFile];

        if (achievement) {
            unlockAchievement(achievement);
        }
    }


    /* ========================================================
       12. CAREER PATH DATA
       ======================================================== */

    const careerPaths = {

        analyst: {
            title: "Cybersecurity Analyst",

            stages: [
                "Computer Fundamentals",
                "Linux",
                "Networking",
                "Cybersecurity Fundamentals",
                "Log Analysis",
                "Security Monitoring",
                "Incident Response",
                "SIEM",
                "Threat Intelligence"
            ]
        },

        soc: {
            title: "SOC Analyst",

            stages: [
                "Computer Fundamentals",
                "Linux",
                "Networking",
                "Security Fundamentals",
                "Logs",
                "Security Monitoring",
                "SIEM Concepts",
                "Alert Investigation",
                "Incident Response"
            ]
        },

        pentesting: {
            title: "Authorized Security Testing",

            stages: [
                "Computer Fundamentals",
                "Linux",
                "Networking",
                "Programming",
                "Web Technologies",
                "Security Fundamentals",
                "Vulnerability Assessment",
                "Security Testing",
                "Reporting & Remediation"
            ]
        },

        appsec: {
            title: "Application Security",

            stages: [
                "Programming",
                "Web Development",
                "HTTP",
                "Databases",
                "Authentication",
                "Secure Coding",
                "Application Security",
                "Security Testing",
                "Remediation"
            ]
        },

        cloud: {
            title: "Cloud Security",

            stages: [
                "Computer Fundamentals",
                "Linux",
                "Networking",
                "Cloud Fundamentals",
                "Identity & Access",
                "Cloud Networking",
                "Monitoring",
                "Data Protection",
                "Secure Architecture"
            ]
        },

        forensics: {
            title: "Digital Forensics",

            stages: [
                "Computer Fundamentals",
                "Operating Systems",
                "Filesystems",
                "Logs",
                "Evidence Concepts",
                "Disk Analysis",
                "Memory Concepts",
                "Timeline Analysis",
                "Reporting"
            ]
        }
    };


    /* ========================================================
       13. PERSONALIZED ROADMAP ENGINE
       ======================================================== */

    function generateRoadmap(profile = {}) {

        const goal =
            profile.goal || "analyst";

        const experience =
            profile.experience || "beginner";

        const hours =
            Number(profile.hoursPerWeek) || 5;

        const selectedCareer =
            careerPaths[goal] ||
            careerPaths.analyst;

        const foundation = [
            "Computer Fundamentals",
            "Linux",
            "Networking"
        ];

        const stages = [
            ...foundation,
            ...selectedCareer.stages
        ];

        /*
         * Remove duplicate stages while preserving order.
         */
        const uniqueStages =
            [...new Set(stages)];

        let pace = "Steady";

        if (hours >= 10) {
            pace = "Accelerated";
        } else if (hours <= 3) {
            pace = "Light";
        }

        return {
            goal: selectedCareer.title,
            experience,
            hoursPerWeek: hours,
            pace,
            stages: uniqueStages
        };
    }


    function saveProfile(profile) {

        return writeStorage(
            STORAGE_KEYS.profile,
            profile
        );
    }


    function getProfile() {

        return readStorage(
            STORAGE_KEYS.profile,
            {}
        );
    }


    /* ========================================================
       14. ACCESSIBILITY
       ======================================================== */

    function setupAccessibility() {

        /*
         * Respect reduced-motion preferences.
         */
        const reducedMotion =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        if (reducedMotion) {
            document.documentElement.classList.add(
                "reduce-motion"
            );
        }

        /*
         * Add keyboard focus class.
         */
        document.addEventListener("keydown", event => {

            if (event.key === "Tab") {
                document.body.classList.add(
                    "keyboard-navigation"
                );
            }
        });

        document.addEventListener("mousedown", () => {
            document.body.classList.remove(
                "keyboard-navigation"
            );
        });
    }


    /* ========================================================
       15. SAFE EXTERNAL LINKS
       ======================================================== */

    function setupExternalLinks() {

        const links =
            document.querySelectorAll("a[href]");

        links.forEach(link => {

            const href =
                link.getAttribute("href");

            if (!href) {
                return;
            }

            const isExternal =
                href.startsWith("http://") ||
                href.startsWith("https://");

            if (!isExternal) {
                return;
            }

            /*
             * External links opened in a new tab should
             * receive appropriate rel protection.
             */
            if (link.target === "_blank") {

                const existingRel =
                    link.getAttribute("rel") || "";

                const relValues =
                    new Set(
                        existingRel
                            .split(/\s+/)
                            .filter(Boolean)
                    );

                relValues.add("noopener");
                relValues.add("noreferrer");

                link.setAttribute(
                    "rel",
                    [...relValues].join(" ")
                );
            }
        });
    }


    /* ========================================================
       16. PUBLIC KINGDOM API
       ======================================================== */

    window.Kingdom = {

        version: "1.0.0",

        siteName: SITE_NAME,

        progress: {
            get: getProgress,
            set: setProgress,
            toggle: toggleProgress,
            isComplete: isProgressComplete
        },

        achievements: {
            get: getAchievements,
            unlock: unlockAchievement,
            definitions: achievementDefinitions
        },

        careers: careerPaths,

        roadmap: {
            generate: generateRoadmap
        },

        profile: {
            get: getProfile,
            save: saveProfile
        },

        search: {
            open: () => {
                if (
                    window.KingdomSearch &&
                    typeof window.KingdomSearch.open === "function"
                ) {
                    window.KingdomSearch.open();
                }
            },

            close: () => {
                if (
                    window.KingdomSearch &&
                    typeof window.KingdomSearch.close === "function"
                ) {
                    window.KingdomSearch.close();
                }
            }
        }
    };


    /* ========================================================
       17. INITIALIZE SYSTEM
       ======================================================== */

    setupMobileNavigation();

    setupActiveNavigation();

    setupSmoothScrolling();

    createSearchInterface();

    setupSearchButton();

    setupProgressElements();

    trackCurrentPage();

    setupAccessibility();

    setupExternalLinks();


    /* ========================================================
       18. DEVELOPMENT MESSAGE
       ======================================================== */

    console.log(
        `%c${SITE_NAME}`,
        "font-size: 18px; font-weight: bold;"
    );

    console.log(
        "Interactive foundation loaded successfully."
    );

    console.log(
        "Version:",
        window.Kingdom.version
    );

});
