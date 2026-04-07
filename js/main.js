// js/main.js
import { loadComponent } from "./modules/loader.js";
import { setActiveNavLink } from "./modules/navbar.js";
import { initHeaderJS } from "./modules/header.js";
import { initSearchPlaceholder } from "./modules/searching_header.js";
import { initFooterJS } from "./modules/footer.js";
import { initBanner } from "./modules/banner_slider.js";
import { initRevealOnScroll } from "./modules/bang_gia.js";
import { initButtonPulse } from "./modules/bang_gia.js";

// THÊM DÒNG NÀY: Import module xử lý lỗi
import { initErrorHandler } from "./modules/handleExeption.js";

document.addEventListener("DOMContentLoaded", function () {
  // Tên Repository chính xác của bạn
  const REPO_NAME = "/dienlanhbachkhoak3";

  // Kiểm tra xem web đang chạy trên GitHub hay trên máy tính
  const isGitHub = window.location.hostname.includes("github.io");
  const BASE_URL = isGitHub ? REPO_NAME : "";

  // Lắp BASE_URL vào trước đường dẫn
  // SỬA LỖI: Tải Header 1 lần duy nhất, dùng Arrow Function để gọi cả 2 hàm
  loadComponent(
    "header-placeholder",
    BASE_URL + "/components/header.html",
    () => {
      initHeaderJS(); // 1. Gắn sự kiện cho các nút bấm Menu/Search
      setActiveNavLink();
      initSearchPlaceholder(); // 2. Chạy hiệu ứng chữ
    },
  );

  // Tải Footer
  loadComponent(
    "footer-placeholder",
    BASE_URL + "/components/footer.html",
    initFooterJS,
  );

  initErrorHandler(BASE_URL); // Khởi tạo bộ xử lý lỗi với BASE_URL
  initBanner("slider"); // Khởi tạo slider cho banner
  initRevealOnScroll(".reveal", 0.1);
  initButtonPulse("mainCallBtn", 4000, 300);
});
