// ==========================================
// PHẦN 1: XỬ LÝ MARKDOWN & PHÂN TRANG
// ==========================================

// Khởi tạo State lưu trữ dữ liệu phân trang
window.servicePagination = {
    pages: [],
    currentPage: 1,
    fileName: ''
};

export async function loadMarkdown(fileName, baseUrl = '', isPaginated = false) {
    const loadingElement = document.getElementById('loading');
    const mainContentElement = document.getElementById('main-content');

    if (!loadingElement || !mainContentElement) {
        console.error("DOM thiếu #loading hoặc #main-content");
        return;
    }

    loadingElement.style.display = 'block';
    mainContentElement.classList.add('hidden');

    try {
        const response = await fetch(`${baseUrl}/dich-vu/data/${fileName}.md`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const markdownText = await response.text();

        // XỬ LÝ LOGIC HIỂN THỊ NỘI DUNG 100% HAY PHÂN TRANG
        if (isPaginated) {
            // Regex an toàn hơn: Chỉ cắt khi '---' nằm độc lập trên 1 dòng
            const splitRegex = /\n?^---\s*$\n?/m; 
            window.servicePagination.pages = markdownText.split(splitRegex).filter(page => page.trim() !== '');
        } else {
            window.servicePagination.pages = [markdownText];
        }

        window.servicePagination.currentPage = 1;
        window.servicePagination.fileName = fileName;

        // Render nội dung trang số 1
        renderPage(1);

        loadingElement.style.display = 'none';
        mainContentElement.classList.remove('hidden');

    } catch (error) {
        console.error('Lỗi tải Markdown:', error);
        loadingElement.innerHTML = `<div style="text-align:center; color:red; padding: 20px;">Đã xảy ra lỗi khi tải nội dung dịch vụ!</div>`;
    }
}

// Hàm Render nội dung (Gắn vào window để gọi từ các nút bấm HTML)
window.renderPage = function(pageNumber) {
    const mainContentElement = document.getElementById('main-content');
    const totalPages = window.servicePagination.pages.length;

    if (pageNumber < 1 || pageNumber > totalPages) return;
    window.servicePagination.currentPage = pageNumber;

    const markdownChunk = window.servicePagination.pages[pageNumber - 1];
    if (typeof marked === 'undefined') {
        mainContentElement.innerHTML = '<p>Lỗi: Chưa load thư viện marked.js</p>';
        return;
    }
    
    const htmlContent = marked.parse(markdownChunk);
    let finalHtml = `<div class="page-content" style="animation: fadeIn 0.4s ease-in-out;">${htmlContent}</div>`;
    
    // Thanh phân trang chỉ hiện khi có từ 2 trang trở lên
    if (totalPages > 1) {
        finalHtml += generatePaginationUI(pageNumber, totalPages);
    }

    mainContentElement.innerHTML = finalHtml;
    processServiceContent(mainContentElement, pageNumber);

    const headerOffset = 90; 
    const elementPosition = mainContentElement.getBoundingClientRect().top;
    window.scrollTo({
        top: elementPosition + window.scrollY - headerOffset,
        behavior: 'smooth'
    });
};

function generatePaginationUI(current, total) {
    let ui = `<div class="custom-pagination">`;
    if (current > 1) ui += `<button class="page-item" onclick="renderPage(${current - 1})"><i class="fa-solid fa-chevron-left"></i> Trước</button>`;
    
    for (let i = 1; i <= total; i++) {
        const activeClass = i === current ? 'active' : '';
        ui += `<button class="page-item number ${activeClass}" onclick="renderPage(${i})">${i}</button>`;
    }
    
    if (current < total) ui += `<button class="page-item" onclick="renderPage(${current + 1})">Sau <i class="fa-solid fa-chevron-right"></i></button>`;
    ui += `</div>`;
    return ui;
}

function processServiceContent(container, pageNumber) {
    if (pageNumber === 1) {
        const h1Element = container.querySelector('h1');
        if (h1Element) document.title = h1Element.innerText + ' | Điện lạnh Bách Khoa';
    }
    
    const anchorLinks = container.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
            }
        });
    });
}


// ==========================================
// PHẦN 2: XỬ LÝ RENDER DANH SÁCH BÀI VIẾT
// ==========================================

// Helper function: Tránh lặp lại code HTML của Card bài viết
function generateArticlesHTML(dataArray) {
    if (dataArray.length === 0) {
        return '<p class="empty-msg" style="color: #888; padding: 20px 0; text-align: center;">Chưa có bài viết.</p>';
    }

    const cardsHtml = dataArray.map(item => `
        <article class="article-card">
            <div class="card-image">
                <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
            </div>
            <div class="card-content">
                <h3>${item.title}</h3>
                <p>${item.excerpt}</p>
                <a href="${item.url}" class="read-more">Chi tiết</a>
            </div>
        </article>
    `).join('');

    return `<div class="articles-grid">${cardsHtml}</div>`;
}

// HÀM 1: DÀNH CHO TRANG CÓ PHÂN LOẠI (dich-vu.html)
export function renderArticlesByCategory(dataArray, categoryName, targetElementId) {
    const container = document.getElementById(targetElementId);
    if (!container) return;

    const filteredData = dataArray.filter(item => item.category === categoryName);
    container.innerHTML = generateArticlesHTML(filteredData);
}

// HÀM 2: DÀNH CHO TRANG KHÔNG PHÂN LOẠI (index.html)
export function renderAllArticles(dataArray, targetElementId) {
    const container = document.getElementById(targetElementId);
    if (!container) return;

    container.innerHTML = generateArticlesHTML(dataArray);
}

// THỰC THI CHUNG KHI TRANG LOAD XONG
document.addEventListener('DOMContentLoaded', () => {
    if (typeof servicesData !== 'undefined') {
        // 1. Quét tìm và nạp cho trang phân loại
        renderArticlesByCategory(servicesData, 'dieu-hoa', 'khu-vuc-dieu-hoa');
        renderArticlesByCategory(servicesData, 'dien-lanh', 'khu-vuc-dien-lanh');
        renderArticlesByCategory(servicesData, 'dien-tu', 'khu-vuc-dien-tu');

        // 2. Quét tìm và nạp cho trang liền mạch
        renderAllArticles(servicesData, 'khu-vuc-tat-ca-dich-vu');
    } else {
        // Chỉ log cảnh báo thay vì lỗi, vì có thể trang hiện tại không cần servicesData
        console.warn("Cảnh báo: Dữ liệu servicesData chưa được tải hoặc trang này không sử dụng.");
    }
});