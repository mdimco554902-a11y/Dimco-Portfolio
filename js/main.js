/**
 * ============================================================================
 * MAIN.JS - Green Forest Frieren Anime Theme Logic & Interactions
 * Professional Standard Full Stack for Melchor Y. Dimco
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. MOSS-GREEN SCROLL PROGRESS BAR (TOP OF VIEWPORT)
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            progressBar.style.width = `${scrollPercent}%`;
        }, { passive: true });
    }

    // 2. SCROLLSPY (HIGHLIGHT ACTIVE NAV LINK IN MOSS GREEN AS VISITOR SCROLLS)
    const navSections = document.querySelectorAll('section[id], header[id="hero"]');
    const desktopNavLinks = document.querySelectorAll('#nav-menu .nav-link');
    const mobileNavLinks = document.querySelectorAll('#mobile-nav-panel .nav-link');

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 120; // 72px header offset + buffer

        let currentSectionId = 'hero';
        navSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        const updateLinks = (links) => {
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        updateLinks(desktopNavLinks);
        updateLinks(mobileNavLinks);
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();

    // 3. MOBILE SLIDE-IN NAVIGATION MENU
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const mobileNavPanel = document.getElementById('mobile-nav-panel');

    if (hamburgerToggle && mobileNavPanel) {
        hamburgerToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileNavPanel.classList.toggle('open');
            hamburgerToggle.setAttribute('aria-expanded', isOpen);
            hamburgerToggle.textContent = isOpen ? '✕' : '☰';
            if (isOpen && typeof window.playClickSFX === 'function') {
                window.playClickSFX();
            }
        });

        // Close when clicking any link inside panel
        mobileNavPanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavPanel.classList.remove('open');
                hamburgerToggle.setAttribute('aria-expanded', 'false');
                hamburgerToggle.textContent = '☰';
            });
        });

        // Close when clicking outside panel
        document.addEventListener('click', (e) => {
            if (!mobileNavPanel.contains(e.target) && !hamburgerToggle.contains(e.target)) {
                mobileNavPanel.classList.remove('open');
                hamburgerToggle.setAttribute('aria-expanded', 'false');
                hamburgerToggle.textContent = '☰';
            }
        });
    }

    // 4. TOAST NOTIFICATION UTILITY
    const toast = document.getElementById('toast-notification');
    let toastTimeout = null;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 5. ONE-CLICK "COPY EMAIL" BUTTON WITH "COPIED!" FEEDBACK
    const copyEmailBtn = document.getElementById('btn-copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'm.dimco.554902@umindanao.edu.ph';
            const originalText = copyEmailBtn.textContent;

            const notifyCopied = () => {
                copyEmailBtn.textContent = '✓ Copied!';
                copyEmailBtn.style.background = 'var(--c-moss-green)';
                copyEmailBtn.style.color = '#FFFFFF';
                showToast('Email copied to clipboard: ' + email);
                if (typeof window.playClickSFX === 'function') {
                    window.playClickSFX();
                }

                setTimeout(() => {
                    copyEmailBtn.textContent = originalText;
                    copyEmailBtn.style.background = '';
                    copyEmailBtn.style.color = '';
                }, 2000);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email)
                    .then(notifyCopied)
                    .catch(() => notifyCopied());
            } else {
                notifyCopied();
            }
        });
    }

    // 6. BACK-TO-TOP BUTTON (FOOTER & FLOATING DYNAMIC BUTTON)
    const backToTopBtn = document.getElementById('btn-back-to-top');

    const floatingBackBtn = document.createElement('button');
    floatingBackBtn.className = 'floating-back-to-top';
    floatingBackBtn.type = 'button';
    floatingBackBtn.setAttribute('aria-label', 'Back to top of page');
    floatingBackBtn.innerHTML = '↑';
    document.body.appendChild(floatingBackBtn);

    const scrollToTop = (e) => {
        if (e) e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        if (typeof window.playClickSFX === 'function') {
            window.playClickSFX();
        }
    };

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    floatingBackBtn.addEventListener('click', scrollToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 320) {
            floatingBackBtn.classList.add('visible');
        } else {
            floatingBackBtn.classList.remove('visible');
        }
    }, { passive: true });

    // 7. REAL-TIME PROJECT SEARCH & CATEGORY FILTER
    const filterButtons = document.querySelectorAll('.btn-filter');
    const searchInput = document.getElementById('project-search');
    const projectCards = document.querySelectorAll('.project-card');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterProjects() {
        const query = searchQuery.trim().toLowerCase();

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const isFeatured = card.getAttribute('data-featured') === 'true';
            const title = card.querySelector('.project-card-title')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.project-card-desc')?.textContent.toLowerCase() || '';
            const tags = Array.from(card.querySelectorAll('.tool-tag')).map(t => t.textContent.toLowerCase()).join(' ');

            let matchesCategory = false;
            if (activeFilter === 'all') {
                matchesCategory = true;
            } else if (activeFilter === 'featured') {
                matchesCategory = isFeatured;
            } else if (activeFilter === 'app') {
                matchesCategory = (category === 'app');
            } else if (activeFilter === 'web') {
                matchesCategory = (category === 'web');
            }

            const matchesSearch = !query || title.includes(query) || desc.includes(query) || tags.includes(query);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                activeFilter = btn.getAttribute('data-filter');
                filterProjects();

                if (typeof window.playClickSFX === 'function') {
                    window.playClickSFX();
                }
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            filterProjects();
        });
    }

    // 8. PROJECT DETAIL MODAL (CLEAN ACCESSIBLE MODAL FOR ALL 19 REPOS)
    const projectDetails = {
        'MWorld': {
            title: 'MWorld',
            badge: 'Featured • Playable Prototype',
            desc: 'Mythril World - an indestructible, high-altitude training crucible where mages and warriors can unleash powerful spells without wrecking the fragile mortal realm. Inside MWorld, Brawl Arena is a 2D top-down brawler prototype with a cozy high-fantasy feel: forests, elves, mages, and arena trials.',
            features: 'Landing screen with Play, Settings, and About; avatar picker with a brawler callsign; map selection; loadouts Sword, Bow, and Bomb; bot difficulty Easy, Normal, and Hard; top-down arena combat at 60 FPS; virtual joystick and keyboard WASD controls at the same time; attack-blocking obstacles like ruined cars, barricades, crates, and walls; weapon-tailored stats, flying arrows, timed bomb detonations, and melee slash arcs; floating health bars and real-time victory and defeat tracking.',
            screens: 'Landing, Avatar Select, Map Select, Match Setup, Settings, About, and Arena Gameplay.',
            tags: ['Flutter', 'Dart', 'Provider', 'MVC Architecture', 'Cross-Platform', 'SharedPreferences'],
            source: 'https://github.com/mdimco554902-a11y/MWorld'
        },
        'CTrack': {
            title: 'CTrack',
            badge: 'Featured • Nutrition Tracker',
            desc: 'Nutrition and Macro Tracker - an intuitive tracker designed to take the guesswork out of daily nutrition. Track calories, scale portions in grams, balance protein, carbs, and fats, and work toward a personalized daily calorie goal.',
            features: 'Today\'s overview with calories remaining and protein, carbs, and fats against targets; log meals under Breakfast, Lunch, Dinner, or Snack; search for food and add it to a meal; scale portions in grams; quick-add calories; edit or delete a logged meal, with undo after deleting; move between days, pick a date, or jump back to today; adjust the daily calorie goal; switch between light and dark themes; read in-app instructions.',
            screens: 'Landing, Auth, Dashboard, Search, Portion, Instructions, Account, and Settings.',
            tags: ['Flutter', 'Dart', 'Riverpod', 'State Management', 'Cupertino Icons', 'Theme Engine'],
            source: 'https://github.com/mdimco554902-a11y/CTrack'
        },
        'ScamShield': {
            title: 'ScamShield',
            badge: 'Mobile Security App',
            desc: 'A dedicated mobile application engineered with Flutter & Dart to detect, warn against, and shield users from online scams and fraudulent communication channels.',
            tags: ['Flutter', 'Dart', 'Mobile Security', 'UI Design'],
            source: 'https://github.com/mdimco554902-a11y/ScamShield'
        },
        'Login-Homepage': {
            title: 'Login-Homepage',
            badge: 'Auth & Dashboard App',
            desc: 'Clean authentication portal and responsive homepage interface with seamless user flow, input verification, and modern UI components.',
            tags: ['Flutter', 'Dart', 'C++', 'Authentication'],
            source: 'https://github.com/mdimco554902-a11y/Login-Homepage'
        },
        'finance-hub': {
            title: 'finance-hub',
            badge: 'Web Ledger Application',
            desc: 'Financial management dashboard and ledger system built with Laravel and Blade templates for managing transactions and assets.',
            tags: ['PHP', 'Laravel', 'Blade', 'Database'],
            source: 'https://github.com/mdimco554902-a11y/finance-hub'
        },
        'appointment_db': {
            title: 'appointment_db',
            badge: 'Database Booking System',
            desc: 'Database-driven appointment booking and scheduling system engineered with Laravel Blade views and relational SQL schema.',
            tags: ['Laravel', 'Blade', 'MySQL', 'Full Stack'],
            source: 'https://github.com/mdimco554902-a11y/appointment_db'
        },
        '2nd-exam': {
            title: '2nd-exam',
            badge: 'Academic Project',
            desc: 'Academic midterm examination project at University of Mindanao showcasing full-stack MVC patterns with Laravel.',
            tags: ['Laravel', 'Blade', 'PHP', 'MVC'],
            source: 'https://github.com/mdimco554902-a11y/2nd-exam'
        },
        'LARAVEL-SEEDERS-LAB-8': {
            title: 'LARAVEL-SEEDERS-LAB-8',
            badge: 'Database Seeders Lab',
            desc: 'Laboratory module covering Laravel database migrations, model factories, and automated seeders for relational entities.',
            tags: ['Laravel', 'Database Seeders', 'Blade', 'Migrations'],
            source: 'https://github.com/mdimco554902-a11y/LARAVEL-SEEDERS-LAB-8'
        },
        'dimco_blogapp': {
            title: 'dimco_blogapp',
            badge: 'Web Application',
            desc: 'Dynamic blogging platform featuring post creation, category filters, responsive article layouts, and server-side rendering.',
            tags: ['PHP', 'Laravel', 'Blade', 'CRUD'],
            source: 'https://github.com/mdimco554902-a11y/dimco_blogapp'
        },
        'laravel-lab-3-hr': {
            title: 'laravel-lab-3-hr',
            badge: 'Enterprise HR Portal',
            desc: 'Human resources and employee directory management system built with Laravel, model relationships, and Blade templates.',
            tags: ['Laravel', 'PHP', 'Blade', 'HR Management'],
            source: 'https://github.com/mdimco554902-a11y/laravel-lab-3-hr'
        },
        'laravel-lab-activity-2': {
            title: 'laravel-lab-activity-2',
            badge: 'Academic Laboratory',
            desc: 'Laboratory exercise implementing routing, controller logic, and Blade layouts in the Laravel ecosystem.',
            tags: ['Laravel', 'Blade', 'PHP', 'Routing'],
            source: 'https://github.com/mdimco554902-a11y/laravel-lab-activity-2'
        },
        'dimco_labexam1': {
            title: 'dimco_labexam1',
            badge: 'PHP Laboratory Exam',
            desc: 'Core web programming practical laboratory examination covering server-side scripting and data handling in PHP.',
            tags: ['PHP', 'Server-Side', 'Web Dev'],
            source: 'https://github.com/mdimco554902-a11y/dimco_labexam1'
        },
        'Lab1': {
            title: 'Lab1',
            badge: 'PHP Foundations',
            desc: 'Foundational server-side programming lab exploring PHP syntax, conditional logic, and modular code structures.',
            tags: ['PHP', 'Foundations', 'Programming'],
            source: 'https://github.com/mdimco554902-a11y/Lab1'
        },
        'm_dimco_portfolio_lab6': {
            title: 'm_dimco_portfolio_lab6',
            badge: 'Web Portfolio Lab',
            desc: 'Full stack portfolio development laboratory exploring semantic HTML5 structure, responsive viewports, and custom CSS styling.',
            tags: ['HTML5', 'CSS3', 'Responsive Design'],
            source: 'https://github.com/mdimco554902-a11y/m_dimco_portfolio_lab6'
        },
        'payroll-lab9': {
            title: 'payroll-lab9',
            badge: 'Interactive JavaScript App',
            desc: 'Interactive payroll computation application utilizing client-side JavaScript for real-time deductions and salary calculations.',
            tags: ['JavaScript', 'HTML', 'CSS', 'Algorithms'],
            source: 'https://github.com/mdimco554902-a11y/payroll-lab9'
        },
        'DImco_DOM': {
            title: 'DImco_DOM',
            badge: 'DOM Manipulation Lab',
            desc: 'Hands-on Document Object Model exploration with interactive UI events and CSS styling dynamics.',
            tags: ['JavaScript', 'DOM API', 'CSS', 'HTML'],
            source: 'https://github.com/mdimco554902-a11y/DImco_DOM'
        },
        'Simple-Login-Dashboard': {
            title: 'Simple-Login-Dashboard',
            badge: 'Student Portal',
            desc: 'Student Records Portal — responsive web application for managing student records, authenticating credentials, and dashboard navigation.',
            tags: ['HTML', 'CSS', 'JavaScript', 'Student Portal'],
            source: 'https://github.com/mdimco554902-a11y/Simple-Login-Dashboard'
        },
        'shs_registration_system': {
            title: 'shs_registration_system',
            badge: 'Python Web App',
            desc: 'Senior High School Student Registration System — responsive web application managing student enrollment and academic records.',
            tags: ['Python', 'HTML', 'CSS', 'Registration System'],
            source: 'https://github.com/mdimco554902-a11y/shs_registration_system'
        },
        'Dimco_Biography': {
            title: 'Dimco_Biography',
            badge: 'Interactive Biography',
            desc: 'Interactive biographical portfolio showcasing developer origins, character traits, and creative interface experiments.',
            tags: ['HTML5', 'CSS3', 'Creative UI', 'Portfolio'],
            source: 'https://github.com/mdimco554902-a11y/Dimco_Biography'
        }
    };

    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalFeaturesWrap = document.getElementById('modal-features-wrap');
    const modalFeatures = document.getElementById('modal-features');
    const modalScreensWrap = document.getElementById('modal-screens-wrap');
    const modalScreens = document.getElementById('modal-screens');
    const modalTags = document.getElementById('modal-tags');
    const modalSourceLink = document.getElementById('modal-source-link');
    let lastActiveElement = null;

    function openModal(projectId) {
        const data = projectDetails[projectId];
        if (!data || !modal) return;

        lastActiveElement = document.activeElement;

        modalBadge.textContent = data.badge;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;

        if (data.features) {
            modalFeatures.textContent = data.features;
            modalFeaturesWrap.style.display = 'block';
        } else {
            modalFeaturesWrap.style.display = 'none';
        }

        if (data.screens) {
            modalScreens.textContent = data.screens;
            modalScreensWrap.style.display = 'block';
        } else {
            modalScreensWrap.style.display = 'none';
        }

        modalTags.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tool-tag';
            span.textContent = tag;
            modalTags.appendChild(span);
        });

        if (modalSourceLink) {
            modalSourceLink.href = data.source;
        }

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (modalCloseBtn) modalCloseBtn.focus();
        if (typeof window.playClickSFX === 'function') {
            window.playClickSFX();
        }
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
            lastActiveElement.focus();
        }
    }

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') return;
            const id = card.getAttribute('data-id');
            openModal(id);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target.tagName !== 'A') {
                    e.preventDefault();
                    const id = card.getAttribute('data-id');
                    openModal(id);
                }
            }
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });
    }

    // 9. SKILL BARS FILL ANIMATION ON SCROLL (Zero Percentage Numbers)
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    let skillsAnimated = false;
    function triggerSkillsAnimation() {
        if (skillsAnimated) return;
        skillsAnimated = true;

        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            if (targetWidth) {
                bar.style.width = targetWidth;
            }
        });
    }

    if (skillsSection && 'IntersectionObserver' in window) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerSkillsAnimation();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        skillsObserver.observe(skillsSection);
    } else {
        triggerSkillsAnimation();
    }

    // 10. JOURNEY TIMELINE CARDS REVEAL ON SCROLL
    const timelineItems = document.querySelectorAll('.timeline-item.fade-in-on-scroll');

    if (timelineItems.length > 0 && 'IntersectionObserver' in window) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        timelineItems.forEach(item => timelineObserver.observe(item));
    } else {
        timelineItems.forEach(item => item.classList.add('visible'));
    }

    // 11. GENTLE FALLING FOREST LEAVES (MAX 12 LEAVES, SLOW 10-14s DRIFT)
    function initFallingLeaves() {
        const leafContainer = document.getElementById('falling-leaves-container');
        if (!leafContainer) return;

        const maxLeaves = 12; // Performance rule: max 12 leaves
        const leafTypes = ['leaf-green', 'leaf-light', 'leaf-gold', 'leaf-sage'];

        for (let i = 0; i < maxLeaves; i++) {
            const leaf = document.createElement('div');
            const type = leafTypes[i % leafTypes.length];
            leaf.className = `falling-leaf ${type}`;

            const left = Math.random() * 95;
            const size = Math.random() * 6 + 12;
            const duration = Math.random() * 4 + 10; // 10s to 14s slow drift
            const delay = Math.random() * 12;

            leaf.style.left = `${left}vw`;
            leaf.style.width = `${size}px`;
            leaf.style.height = `${size * 1.3}px`;
            leaf.style.animationDuration = `${duration}s, ${duration * 0.4}s`;
            leaf.style.animationDelay = `-${delay}s, -${delay * 0.5}s`;

            leafContainer.appendChild(leaf);
        }
    }

    // Check prefers-reduced-motion: disable floating leaves if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        initFallingLeaves();
    }

    // 12. GLOWING FIREFLIES IN FOOTER
    function initFooterFireflies() {
        const footer = document.querySelector('.site-footer');
        if (!footer || prefersReducedMotion) return;

        const maxFireflies = 10;
        for (let i = 0; i < maxFireflies; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'firefly-dot';
            firefly.style.left = `${Math.random() * 95}%`;
            firefly.style.top = `${Math.random() * 85}%`;
            firefly.style.animationDelay = `${Math.random() * 3.5}s`;
            firefly.style.animationDuration = `${Math.random() * 2 + 2.5}s`;
            footer.appendChild(firefly);
        }
    }
    initFooterFireflies();

    // 13. WORKING CONTACT FORM WITH LIVE TERMINAL STATUS DISPATCH
    const contactForm = document.getElementById('contact-form');
    const terminalLog = document.getElementById('terminal-log');

    if (contactForm && terminalLog) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const subjectInput = document.getElementById('contact-subject');
            const messageInput = document.getElementById('contact-message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                showToast('Please fill out all required fields.');
                return;
            }

            const timestamp = new Date().toLocaleTimeString();

            terminalLog.innerHTML = `
                <div class="terminal-line"><span style="color: var(--c-sunlight-gold);">✦</span> [${timestamp}] FOREST TRANSCEIVER TRANSMITTING...</div>
                <div class="terminal-line"><span style="color: var(--c-sunlight-gold);">✦</span> SENDER: <strong>${name}</strong> (${email})</div>
                <div class="terminal-line"><span style="color: var(--c-sunlight-gold);">✦</span> SUBJECT: "${subject || 'General Inquiry'}"</div>
                <div class="terminal-line" style="color: var(--c-forest-green); font-weight: 700;"><span style="color: var(--c-sunlight-gold);">✦</span> STATUS: DISPATCH RELAYED TO MELCHOR Y. DIMCO!</div>
                <div class="terminal-line"><span style="color: var(--c-moss-green);">✦</span> Awaiting confirmation &amp; review. Thank you for connecting.</div>
            `;

            showToast('✦ Message relayed successfully to Melchor Y. Dimco!');
            if (typeof window.playClickSFX === 'function') {
                window.playClickSFX();
            }

            contactForm.reset();
        });
    }

    // 14. ABOUT ME THEMATIC GRIMOIRE TABS & FOREST BREEZE INTERACTION
    const aboutTabButtons = document.querySelectorAll('.about-tab-btn');
    const aboutTabPanels = document.querySelectorAll('.about-tab-panel');

    if (aboutTabButtons.length && aboutTabPanels.length) {
        aboutTabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                // Update active tab buttons
                aboutTabButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                // Update active tab panels
                if (targetTab === 'all') {
                    aboutTabPanels.forEach(panel => {
                        panel.classList.add('is-active');
                    });
                } else {
                    aboutTabPanels.forEach(panel => {
                        if (panel.getAttribute('data-panel') === targetTab) {
                            panel.classList.add('is-active');
                        } else {
                            panel.classList.remove('is-active');
                        }
                    });
                }

                // Play soft chime sound
                if (typeof window.playClickSFX === 'function') {
                    window.playClickSFX();
                }
            });
        });
    }

    // CAST FOREST BREEZE INTERACTIVE SPELL
    const manaBreezeBtn = document.getElementById('btn-mana-breeze');
    const grimoireCard = document.querySelector('.about-grimoire-card');

    if (manaBreezeBtn && grimoireCard) {
        manaBreezeBtn.addEventListener('click', (e) => {
            if (typeof window.playHoverSFX === 'function') {
                window.playHoverSFX();
            }

            // Spawn 18 gentle swirling breeze particles
            const particleSymbols = ['🍃', '🌿', '✨', '⭐', '❀', '🌱'];
            const cardRect = grimoireCard.getBoundingClientRect();

            for (let i = 0; i < 18; i++) {
                const particle = document.createElement('span');
                particle.className = 'mana-breeze-particle';
                particle.textContent = particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
                
                const startX = Math.random() * (cardRect.width - 40) + 20;
                const startY = cardRect.height - 80 + (Math.random() * 40);
                const driftX = (Math.random() - 0.5) * 160;
                const driftY = -(Math.random() * 260 + 120);
                const rotate = (Math.random() - 0.5) * 360;

                particle.style.left = `${startX}px`;
                particle.style.top = `${startY}px`;
                particle.style.setProperty('--drift-x', `${driftX}px`);
                particle.style.setProperty('--drift-y', `${driftY}px`);
                particle.style.setProperty('--rotate', `${rotate}deg`);
                particle.style.fontSize = `${Math.random() * 0.7 + 0.8}rem`;
                particle.style.animationDelay = `${Math.random() * 0.25}s`;

                grimoireCard.appendChild(particle);

                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2200);
            }

            showToast('🍃 Cast Forest Breeze: A gentle wave of leaves and mana flows through the clearing!');
        });
    }

    // 15. INTERACTIVE PROFILE PORTRAIT HOVER MAGIC (3D Parallax Tilt & Mana Sparkles)
    const profileFrames = document.querySelectorAll('.hero-photo-frame, .about-photo-frame');

    profileFrames.forEach(frame => {
        let isHovered = false;

        // Subtle floating golden mana sparkles on mouse enter
        frame.addEventListener('mouseenter', () => {
            isHovered = true;
            if (typeof window.playHoverSFX === 'function') {
                window.playHoverSFX();
            }

            const sparkSymbols = ['✨', '⭐', '🌱', '❀'];
            const rect = frame.getBoundingClientRect();

            for (let i = 0; i < 4; i++) {
                const spark = document.createElement('span');
                spark.className = 'photo-mana-sparkle';
                spark.textContent = sparkSymbols[Math.floor(Math.random() * sparkSymbols.length)];

                // Position around the border
                const edgeX = (i % 2 === 0 ? 0.2 : 0.8) * rect.width + (Math.random() * 20 - 10);
                const edgeY = (i < 2 ? 0.2 : 0.8) * rect.height + (Math.random() * 20 - 10);
                const tx = (Math.random() - 0.5) * 40;
                const ty = -(Math.random() * 30 + 15);
                const txEnd = tx + (Math.random() - 0.5) * 50;
                const tyEnd = ty - (Math.random() * 40 + 20);

                spark.style.left = `${edgeX}px`;
                spark.style.top = `${edgeY}px`;
                spark.style.setProperty('--tx', `${tx}px`);
                spark.style.setProperty('--ty', `${ty}px`);
                spark.style.setProperty('--tx-end', `${txEnd}px`);
                spark.style.setProperty('--ty-end', `${tyEnd}px`);
                spark.style.animationDelay = `${i * 0.1}s`;

                frame.appendChild(spark);

                setTimeout(() => {
                    if (spark.parentNode) {
                        spark.parentNode.removeChild(spark);
                    }
                }, 1500);
            }
        });

        // 3D Tilt interaction on mouse move
        frame.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            const rect = frame.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
            const rotateY = ((x - centerX) / centerX) * 6;  // max 6 deg

            frame.style.transform = `perspective(700px) translateY(-8px) scale(1.03) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        });

        // Smooth reset on mouse leave
        frame.addEventListener('mouseleave', () => {
            isHovered = false;
            frame.style.transform = '';
        });
    });

    console.log('[PORTFOLIO ONLINE] Melchor Y. Dimco — Green Forest Frieren Portfolio Ready.');
});
