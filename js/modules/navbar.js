export function setActiveNavLink() {
    // 1. Lấy đuôi đường dẫn trang hiện tại (VD: /bang-gia.html hoặc /)
    let currentPath = window.location.pathname;

    // Nếu trang chủ, trình duyệt đôi khi chỉ trả về "/", ta quy đổi nó thành index.html
    if (currentPath === '/' || currentPath.endsWith('/')) {
        currentPath += 'index.html';
    }

    // 2. Tìm tất cả link trong cả menu Desktop và Mobile
    const allLinks = document.querySelectorAll('#nav-menu a, #mobile-nav a');

    allLinks.forEach(link => {
        const hrefAttr = link.getAttribute('href');
        if (!hrefAttr || hrefAttr === 'javascript:void(0)' || hrefAttr === '#') {
            return;
        }

        try {
            // Lấy URL tuyệt đối của thẻ a để tránh lỗi đường dẫn tương đối (./ hay ../)
            const linkUrl = new URL(link.href, window.location.origin);
            let linkPath = linkUrl.pathname;
            
            if (linkPath === '/' || linkPath.endsWith('/')) {
                linkPath += 'index.html';
            }

            // 3. So sánh và gắn class 'active'
            if (linkPath === currentPath) {
                link.classList.add('active');

                // Đánh dấu menu cha (Desktop)
                const desktopParent = link.closest('.has-mega');
                if (desktopParent) {
                    const parentNavBtn = desktopParent.querySelector('a.nav-link');
                    if (parentNavBtn) parentNavBtn.classList.add('active');
                }

                // Đánh dấu menu cha (Mobile)
                const mobileParent = link.closest('.mobile-item');
                if (mobileParent) {
                    const parentMobileBtn = mobileParent.querySelector('.mobile-dropdown-toggle');
                    if (parentMobileBtn) parentMobileBtn.classList.add('active');
                }
            }
        } catch (e) {
            console.error("Lỗi phân tích URL ở thẻ:", link, e);
        }
    });
}