/**
 * Helper to extract user-friendly error messages from API responses
 */
export const getErrorMessage = (error: any): string => {
    if (!error) return 'Đã có lỗi xảy ra (Unknown error)';

    // 1. Check for specific backend error messages logic
    // Expected format: { success: false, message: "..." } or { error: "..." }
    if (error.response && error.response.data) {
        const data = error.response.data;

        // Extract the raw message
        let rawMessage = data.message || data.error || '';

        // Prioritize "message" field if it exists
        if (rawMessage) {
            // --- Specific Translations for Common Validation Errors ---
            if (rawMessage.includes("Validation isEmail on email failed")) {
                return "Email không đúng định dạng. Vui lòng kiểm tra lại.";
            }

            if (rawMessage.includes("Validation len on name failed")) {
                return "Tên phải có độ dài hợp lệ.";
            }

            if (rawMessage.includes("Validation len on code failed")) {
                return "Mã phải có độ dài hợp lệ.";
            }

            if (rawMessage.includes("must be unique")) {
                return "Dữ liệu này đã tồn tại trong hệ thống (trùng lặp).";
            }

            // Return the raw message if no translation match, but valid string
            if (typeof rawMessage === 'string') return rawMessage;
        }
    }

    // 2. HTTP Status Code Handling
    if (error.response) {
        const status = error.response.status;
        switch (status) {
            case 400:
                return 'Dữ liệu không hợp lệ (400). Vui lòng kiểm tra lại thông tin.';
            case 401:
                return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            case 403:
                return 'Bạn không có quyền thực hiện thao tác này.';
            case 404:
                return 'Không tìm thấy dữ liệu yêu cầu (404).';
            case 500:
                return 'Lỗi hệ thống (500). Vui lòng thử lại sau.';
            default:
                return `Lỗi kết nối máy chủ (${status}).`;
        }
    }

    // 3. Network Errors (No response)
    if (error.request) {
        return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng hoặc liên hệ IT.';
    }

    // 4. Other Errors
    return error.message || 'Đã có lỗi không xác định xảy ra.';
};
