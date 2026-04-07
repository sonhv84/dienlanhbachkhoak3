// js/modules/error_handler.js

export function initErrorHandler(baseUrl) {
    // 1. DANH SÁCH ĐEN: Khai báo các từ khóa hoặc đường dẫn không cho phép truy cập
    const forbiddenPaths = [
        '/admin',          // Ví dụ: Chặn vào thư mục admin
        '/private',        // Thư mục nội bộ
        '/test',           // Các trang đang test
        'draft.html'       // Các file nháp
        ,'/components'
        // Bạn có thể thêm các đường dẫn muốn chặn vào đây...
    ];

    document.addEventListener('click', async function(e) {
        // Tìm thẻ <a> gần nhất mà người dùng vừa click vào
        const link = e.target.closest('a');

        // Bỏ qua các link không cần kiểm tra
        if (!link || link.target === '_blank' || 
            link.getAttribute('href').startsWith('#') || 
            link.getAttribute('href').startsWith('javascript:')) {
            return;
        }

        // Chỉ can thiệp vào các đường link nội bộ (cùng tên miền)
        if (link.hostname === window.location.hostname) {
            e.preventDefault(); // Chặn hành vi chuyển trang mặc định ngay lập tức

            const urlToVisit = link.href;
            
            // Lấy ra phần đường dẫn phía sau tên miền (Ví dụ: /dich-vu/sua-dieu-hoa.html)
            const pathName = new URL(urlToVisit).pathname;

            // 2. KIỂM TRA QUYỀN TRUY CẬP (Có nằm trong danh sách đen không?)
            const isForbidden = forbiddenPaths.some(forbiddenWord => pathName.includes(forbiddenWord));

            if (isForbidden) {
                // Nếu link chứa từ khóa bị cấm -> Đẩy thẳng ra 404, không cần fetch hỏi server nữa
                console.warn("Bảo mật: Cố tình truy cập đường dẫn bị cấm!");
                window.location.href = baseUrl + '/404.html';
                return; 
            }

            // 3. KIỂM TRA SỰ TỒN TẠI (Nếu không bị cấm thì xem file có thật không?)
            try {
                // Hỏi thăm server xem file có tồn tại không (Chỉ lấy tiêu đề, rất nhẹ)
                const response = await fetch(urlToVisit, { method: 'HEAD' });

                if (response.ok) {
                    // Trạng thái 200 OK -> Cho phép đi tiếp
                    window.location.href = urlToVisit;
                } else {
                    // Trạng thái 404 Not Found -> Link chết/gõ sai -> Trỏ về 404.html
                    window.location.href = baseUrl + '/404.html';
                }
            } catch (error) {
                // Lỗi mạng hoặc server sập -> Đẩy về 404 cho an toàn
                console.error("Lỗi kiểm tra đường dẫn:", error);
                window.location.href = baseUrl + '/404.html';
            }
        }
    });
}