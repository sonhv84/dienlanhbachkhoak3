// js/main.js
import { loadComponent } from './modules/loader.js';
import { initHeaderJS } from './modules/header.js';
import { initFooterJS } from './modules/footer.js';

// Chạy mã khi trình duyệt đã đọc xong khung HTML
document.addEventListener("DOMContentLoaded", function() {
    // Tên Repository chính xác của bạn
    const REPO_NAME = '/dienlanhbachkhoak3'; 
    
    // Kiểm tra xem web đang chạy trên GitHub hay trên máy tính
    const isGitHub = window.location.hostname.includes('github.io');
    const BASE_URL = isGitHub ? REPO_NAME : '';

    // Lắp BASE_URL vào trước đường dẫn
    loadComponent('header-placeholder', BASE_URL + '/components/header.html', initHeaderJS);
    loadComponent('footer-placeholder', BASE_URL + '/components/footer.html', initFooterJS);
});