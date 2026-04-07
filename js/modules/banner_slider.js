// js/handleBanner.js

export function initBanner(containerId) {
    const slider = document.getElementById(containerId);
    if (!slider) return;

    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide');
    const dotsContainer = slider.querySelector('.pagination');
    const prevBtn = slider.querySelector('.prev-btn') || slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next-btn') || slider.querySelector('.next');

    let currentIndex = 0;
    let isGoingForward = true;
    let autoPlayInterval = null;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    // --- Cập nhật Slider ---
    function updateSlider() {
        track.style.transition = 'transform 0.8s cubic-bezier(0.45, 0, 0.55, 1)';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        slides.forEach((slide, i) => slide.classList.toggle('active', i === currentIndex));
        
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }
    }

    // --- Tạo Dots ---
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = ''; // Clear để tránh duplicate nếu gọi lại hàm
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.onclick = () => {
                currentIndex = i;
                updateSlider();
                resetAutoPlay();
            };
            dotsContainer.appendChild(dot);
        });
    }

    // --- Logic Tự động chạy (Ping-pong) ---
    function autoMove() {
        if (isGoingForward) {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else { 
                isGoingForward = false; 
                currentIndex--; 
            }
        } else {
            if (currentIndex > 0) {
                currentIndex--;
            } else { 
                isGoingForward = true; 
                currentIndex++; 
            }
        }
        updateSlider();
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(autoMove, 2500);
    }

    function stopAutoPlay() { 
        clearInterval(autoPlayInterval); 
    }

    function resetAutoPlay() { 
        stopAutoPlay(); 
        startAutoPlay(); 
    }

    // --- Xử lý Kéo/Vuốt (Drag/Swipe) ---
    const getX = (e) => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

    function dragStart(e) {
        // Ngăn chặn hành vi kéo ảnh (ghost image) mặc định của trình duyệt trên desktop
        if (e.type === 'mousedown') e.preventDefault(); 
        
        isDragging = true;
        startX = getX(e);
        currentX = startX; // FIX LỖI: Phải gán currentX = startX lúc bắt đầu click
        
        stopAutoPlay();
        track.style.transition = 'none';
    }

    function dragMove(e) {
        if (!isDragging) return;
        currentX = getX(e);
        const diff = currentX - startX;
        const movePercent = (diff / slider.offsetWidth) * 100;
        track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${movePercent}%))`; // Cú pháp calc an toàn hơn
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = currentX - startX;
        const threshold = slider.offsetWidth * 0.15; // Phải kéo ít nhất 15% chiều rộng mới chuyển slide

        // Nếu kéo đủ xa qua TRÁI (next)
        if (diff < -threshold && currentIndex < slides.length - 1) {
            currentIndex++;
            isGoingForward = true;
        } 
        // Nếu kéo đủ xa qua PHẢI (prev)
        else if (diff > threshold && currentIndex > 0) {
            currentIndex--;
            isGoingForward = false;
        }
        
        updateSlider();
        startAutoPlay();
    }

    // --- Gắn Sự Kiện ---
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) { 
                currentIndex++; 
                isGoingForward = true; 
            } else { 
                currentIndex = 0; 
            }
            updateSlider(); 
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) { 
                currentIndex--; 
                isGoingForward = false; 
            } else { 
                currentIndex = slides.length - 1; 
            }
            updateSlider(); 
            resetAutoPlay();
        });
    }

    // Gắn sự kiện drag/swipe
    slider.addEventListener('mousedown', dragStart);
    slider.addEventListener('touchstart', dragStart, { passive: true });
    
    // Gắn move/end lên window để tránh lỗi khi kéo chuột ra khỏi vùng slider
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchmove', dragMove, { passive: true });
    window.addEventListener('touchend', dragEnd);

    // Tạm dừng autoplay khi hover chuột vào slider (chỉ áp dụng cho desktop)
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    // Khởi tạo ban đầu
    createDots();
    startAutoPlay();
    if (slides.length > 0) slides[0].classList.add('active');
}