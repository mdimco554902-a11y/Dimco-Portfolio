/**
 * ============================================================================
 * SFX.JS - Quiet Magic & Fantasy Web Audio Synthesizer
 * ============================================================================
 * Melodic crystalline chimes, harp plucks, and ambient fantasy UI audio
 * for Melchor Y. Dimco's portfolio. Zero external audio files.
 */

// Global Audio State
let audioCtx = null;
let sfxEnabled = localStorage.getItem('dimco-sfx') !== 'false';

/**
 * Initializes or unlocks the Web Audio Context upon user interaction.
 */
function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    return audioCtx;
}

/**
 * Crystalline fairy chime for hover events (soft high sine sparkle).
 */
function playHoverSFX() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1318.51, now); // E6
        osc.frequency.exponentialRampToValueAtTime(1760.00, now + 0.06); // A6

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    } catch (e) {
        console.warn('SFX Error:', e);
    }
}

/**
 * Gentle fantasy harp pluck for click interactions.
 */
function playClickSFX() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;

        // Fundamental note (D5)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.05, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.14);

        // Overtone chime (A5)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880.00, now + 0.02);
        gain2.gain.setValueAtTime(0.03, now + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.02);
        osc2.stop(now + 0.18);
    } catch (e) {
        console.warn('SFX Error:', e);
    }
}

/**
 * Confirmation chime played when toggling audio on or off.
 */
function playToggleSFX(isEnabling) {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';

        if (isEnabling) {
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);
        } else {
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.16);
        }

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    } catch (e) {
        console.warn('SFX Error:', e);
    }
}

/**
 * Celestial Harp Arpeggio for Theme Switching (Sun / Moon)
 */
function playThemeSwitchSFX(isLight) {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        const notes = isLight 
            ? [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 (Dawn sunrise)
            : [1046.50, 783.99, 659.25, 523.25]; // C6, G5, E5, C5 (Twilight calm)

        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';

            const start = now + (idx * 0.065);
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.045, start);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + 0.28);
        });
    } catch (e) {
        console.warn('SFX Error:', e);
    }
}

/**
 * Resonant Medallion Chime
 */
function playCoinSFX() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now); // B5
        gain1.gain.setValueAtTime(0.055, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.51, now + 0.05); // E6
        gain2.gain.setValueAtTime(0.06, now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.05);
        osc2.stop(now + 0.45);
    } catch (e) {
        console.warn('SFX Error:', e);
    }
}

/**
 * Starlight Ray / Light Magic SFX
 */
function playLaserSFX() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';

        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    } catch (e) {
        console.warn('SFX Error:', e);
    }
}

/**
 * Flourish Arpeggio
 */
function playPowerUpSFX() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            const noteStart = now + (i * 0.05);
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(0.04, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.25);
        });
    } catch (e) {
        console.warn('SFX Error:', e);
    }
}

/**
 * Wind Step / Soft Leap SFX
 */
function playJumpSFX() {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';

        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.15);

        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
    } catch (e) {
        console.warn('SFX Error:', e);
    }
}

/**
 * Play custom melodic note tone (Flute / Bell)
 */
function playTone(freq, duration = 0.35) {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const now = ctx.currentTime;

        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.065, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration);
    } catch (e) {
        console.warn('SFX Error:', e);
    }
}

// Expose SFX functions to window object
window.playHoverSFX = playHoverSFX;
window.playClickSFX = playClickSFX;
window.playToggleSFX = playToggleSFX;
window.playThemeSwitchSFX = playThemeSwitchSFX;
window.playCoinSFX = playCoinSFX;
window.playLaserSFX = playLaserSFX;
window.playPowerUpSFX = playPowerUpSFX;
window.playJumpSFX = playJumpSFX;
window.playTone = playTone;

// Initialize sound bindings once DOM is fully parsed
document.addEventListener('DOMContentLoaded', () => {
    const unlockAudio = () => {
        getAudioContext();
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    const sfxToggleBtn = document.getElementById('sfx-toggle');
    if (sfxToggleBtn) {
        sfxToggleBtn.textContent = sfxEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';

        sfxToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const willEnable = !sfxEnabled;
            playToggleSFX(willEnable);
            sfxEnabled = willEnable;
            localStorage.setItem('dimco-sfx', sfxEnabled);

            sfxToggleBtn.textContent = sfxEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
        });
    }

    const bindSFX = () => {
        const sfxTargets = document.querySelectorAll('.sfx-hover, .pixel-btn, .nav-links a, .skill-badge, .inventory-slot, .dpad-btn, .soundpad-btn, .copy-email-btn');
        sfxTargets.forEach((target) => {
            if (target.dataset.sfxBound) return;
            target.dataset.sfxBound = 'true';

            target.addEventListener('mouseenter', () => {
                playHoverSFX();
            });

            if (target.id !== 'sfx-toggle' && target.id !== 'theme-toggle' && !target.classList.contains('soundpad-btn') && !target.classList.contains('synth-key') && target.id !== 'coin-slot') {
                target.addEventListener('click', () => {
                    playClickSFX();
                });
            }
        });
    };

    bindSFX();
});
