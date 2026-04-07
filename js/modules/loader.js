// js/modules/loader.js
export function loadComponent(elementId, filePath, callback = null) {
    const element = document.getElementById(elementId);
    if (!element) return; // Nếu trang không có thẻ này thì bỏ qua

    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Lỗi khi tải: ${filePath}`);
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            // Kích hoạt JS của phần đó ngay sau khi dán HTML xong
            if (callback) {
                callback();
            }
        })
        .catch(error => console.error("Lỗi Load Component:", error));
}