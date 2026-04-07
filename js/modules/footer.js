// js/modules/footer.js
export function initFooterJS() {
    // Tìm thẻ có id="current-year" trong footer
    const yearSpan = document.getElementById("current-year");
    
    // Nếu tìm thấy, cập nhật thành năm hiện tại
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}