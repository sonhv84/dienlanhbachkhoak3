// js/main.js
import { loadComponent } from "./modules/loader.js";
import { setActiveNavLink } from "./modules/navbar.js";
// import { initHeaderJS } from "./modules/header.js";
import { initSearchPlaceholder } from "./modules/searching_header.js";
import { initFooterJS } from "./modules/footer.js";
import { initBanner } from "./modules/banner_slider.js";

import { initHeaderJS } from './modules/header.js';

// Gộp import từ cùng một file cho gọn gàng
import { initRevealOnScroll, initButtonPulse } from "./modules/bang_gia.js"; 

// FIX 1: Thêm loadMarkdown vào danh sách import từ loadingDichVu.js
import { renderArticlesByCategory, loadMarkdown } from './data/loadingDichVu.js';

import { initErrorHandler } from "./modules/handleExeption.js";

document.addEventListener("DOMContentLoaded", function () {
  // renderHeader();
  // Tên Repository chính xác của bạn
  const REPO_NAME = "/dienlanhbachkhoak3";

  // Kiểm tra xem web đang chạy trên GitHub hay trên máy tính
  const isGitHub = window.location.hostname.includes("github.io");
  const BASE_URL = isGitHub ? REPO_NAME : "";

  // Lắp BASE_URL vào trước đường dẫn
  loadComponent(
    "header-placeholder",
    BASE_URL + "/components/header.html",
    () => {
      initHeaderJS(); // 1. Gắn sự kiện cho các nút bấm Menu/Search
      setActiveNavLink();
      initSearchPlaceholder(); // 2. Chạy hiệu ứng chữ
    },
  );

  const contentWrapper = document.getElementById('content-wrapper');
  if (contentWrapper && contentWrapper.dataset.markdown) {
        const fileName = contentWrapper.dataset.markdown;
        // Đã import loadMarkdown ở trên, giờ hàm này sẽ chạy bình thường
        loadMarkdown(fileName, BASE_URL); 
  }

  // Tải Footer
  loadComponent(
    "footer-placeholder",
    BASE_URL + "/components/footer.html",
    initFooterJS,
  );

  initErrorHandler(BASE_URL); // Khởi tạo bộ xử lý lỗi với BASE_URL
  initBanner("slider"); // Khởi tạo slider cho banner

  // FIX 2: Bọc các hàm render trong câu lệnh điều kiện (Safety Check)
  // Chỉ chạy render nếu biến servicesData thực sự tồn tại
  if (typeof servicesData !== 'undefined') {
      renderArticlesByCategory(servicesData, 'dieu-hoa', 'khu-vuc-dieu-hoa');
      renderArticlesByCategory(servicesData, 'dien-lanh', 'khu-vuc-dien-lanh');
      renderArticlesByCategory(servicesData, 'dien-tu', 'khu-vuc-dien-tu');
  } else {
      // Sẽ hiển thị ở các trang không có section danh sách bài viết (ví dụ: trang chi tiết dịch vụ)
      console.log("Trang hiện tại không yêu cầu render danh sách servicesData.");
  }

  initRevealOnScroll(".reveal", 0.1);
  initButtonPulse("mainCallBtn", 4000, 300);
});