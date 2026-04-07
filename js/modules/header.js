// js/modules/header.js
export function initHeaderJS() {
    const mobileToggle = document.getElementById("mobile-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    const overlay = document.getElementById("mobile-overlay");
    const toggleIcon = mobileToggle ? mobileToggle.querySelector("i") : null;

    const mobileSearchToggle = document.getElementById("mobile-search-toggle");
    const mobileSearchPanel = document.getElementById("mobile-search-panel");
    const searchIcon = mobileSearchToggle ? mobileSearchToggle.querySelector("i") : null;

    const mobileItems = document.querySelectorAll(".mobile-item");

    // Nếu không tìm thấy các nút mobile (chạy trên màn hình lớn), dừng xử lý mobile
    if (!mobileToggle || !mobileNav) return;

    // --- XỬ LÝ TÌM KIẾM MOBILE ---
    function closeSearchPanel() {
        if (!mobileSearchPanel) return;
        mobileSearchPanel.classList.remove("active");
        if (searchIcon) {
            searchIcon.classList.remove("fa-xmark");
            searchIcon.classList.add("fa-search");
        }
    }

    function openSearchPanel() {
        if (!mobileSearchPanel) return;
        mobileSearchPanel.classList.add("active");
        if (searchIcon) {
            searchIcon.classList.remove("fa-search");
            searchIcon.classList.add("fa-xmark");
        }
    }

    function toggleSearchPanel() {
        if (mobileSearchPanel && mobileSearchPanel.classList.contains("active")) {
            closeSearchPanel();
        } else {
            closeMobileMenu();
            openSearchPanel();
        }
    }

    // --- XỬ LÝ MENU MOBILE ---
    function openMobileMenu() {
        mobileNav.classList.add("active");
        if (overlay) overlay.classList.add("active");
        document.body.classList.add("menu-open");
        if (toggleIcon) {
            toggleIcon.classList.remove("fa-bars");
            toggleIcon.classList.add("fa-times");
        }
    }

    function closeMobileMenu() {
        mobileNav.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
        document.body.classList.remove("menu-open");
        if (toggleIcon) {
            toggleIcon.classList.remove("fa-times");
            toggleIcon.classList.add("fa-bars");
        }
        mobileItems.forEach(item => item.classList.remove("active"));
    }

    function toggleMobileMenu() {
        if (mobileNav.classList.contains("active")) {
            closeMobileMenu();
        } else {
            closeSearchPanel();
            openMobileMenu();
        }
    }

    // --- GẮN SỰ KIỆN CLICK ---
    if (mobileToggle) mobileToggle.addEventListener("click", toggleMobileMenu);
    if (mobileSearchToggle) mobileSearchToggle.addEventListener("click", toggleSearchPanel);
    if (overlay) overlay.addEventListener("click", () => {
        closeMobileMenu();
        closeSearchPanel();
    });

    // Xử lý đóng/mở submenu trên mobile
    mobileItems.forEach(item => {
        const button = item.querySelector(".mobile-dropdown-toggle");
        if (button) {
            button.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                // Đóng các menu khác
                mobileItems.forEach(other => { 
                    if (other !== item) other.classList.remove("active"); 
                });
                
                // Mở/đóng menu hiện tại
                if (isActive) item.classList.remove("active");
                else item.classList.add("active");
            });
        }
    });

    // Reset lại trạng thái khi kéo giãn trình duyệt sang Desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 992) { 
            closeMobileMenu(); 
            closeSearchPanel(); 
        }
    });
}