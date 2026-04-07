// js/main.js
import { loadComponent } from './modules/loader.js';
import { initHeaderJS } from './modules/header.js';
import { initFooterJS } from './modules/footer.js';

// Chạy mã khi trình duyệt đã đọc xong khung HTML
document.addEventListener("DOMContentLoaded", function() {
    
    // Tải HTML của Header, sau đó lập tức chạy initHeaderJS
    loadComponent(
        'header-placeholder', 
        '/components/header.html', 
        initHeaderJS
    );

    // Tải HTML của Footer, sau đó lập tức chạy initFooterJS
    loadComponent(
        'footer-placeholder', 
        '/components/footer.html', 
        initFooterJS
    );

});