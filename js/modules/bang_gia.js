// File: src/js/effects.js

// 1. Hiệu ứng Reveal on Scroll
export function initRevealOnScroll(selector = '.reveal', thresholdValue = 0.1) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: thresholdValue });

    elements.forEach(el => observer.observe(el));
}

// 2. Hiệu ứng Button Shake/Pulse
export function initButtonPulse(buttonId, intervalMs = 4000, durationMs = 300) {
    const callBtn = document.getElementById(buttonId);
    if (!callBtn) return;

    setInterval(() => {
        callBtn.style.transform = 'scale(1.05)';
        setTimeout(() => {
            callBtn.style.transform = '';
        }, durationMs);
    }, intervalMs);
}