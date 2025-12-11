// --- MOCK WARNING LIST ---
import { WarningItem } from "@/types";

export const MOCK_WARNING_LIST: WarningItem[] = [
    {
        id: 'w1',
        type: 'payment_overdue',
        contractCode: 'HD-2025-001',
        contractId: '1',
        customerName: 'Công ty Cổ phần Cảng Sài Gòn',
        dueDate: '2025-02-15',
        daysDiff: -15,
        amount: 165000000,
        pic: 'Nguyễn Văn A',
        status: 'pending',
        note: 'Đã gửi email nhắc lần 1',
        details: 'Đợt 1 - Tạm ứng (30%)'
    },
    {
        id: 'w2',
        type: 'acceptance_upcoming',
        contractCode: 'HD-2025-001',
        contractId: '1',
        customerName: 'Công ty Cổ phần Cảng Sài Gòn',
        dueDate: '2025-03-10',
        daysDiff: 7,
        amount: 0,
        pic: 'Nguyễn Văn A',
        status: 'processing',
        note: 'Đang chuẩn bị biên bản',
        details: 'Nghiệm thu giai đoạn 1'
    },
    {
        id: 'w3',
        type: 'payment_upcoming',
        contractCode: 'HD-2025-002',
        contractId: '2',
        customerName: 'Tân Cảng Sài Gòn',
        dueDate: '2025-03-15',
        daysDiff: 12,
        amount: 660000000,
        pic: 'Trần Thị B',
        status: 'pending',
        note: '',
        details: 'Đợt 2 - Golive (50%)'
    },
    {
        id: 'w4',
        type: 'acceptance_overdue',
        contractCode: 'HD-2024-099',
        contractId: '99',
        customerName: 'Công ty Cổ phần Cảng Nam Hải',
        dueDate: '2025-01-30',
        daysDiff: -32,
        amount: 0,
        pic: 'Lê Văn C',
        status: 'resolved',
        note: 'Đã ký ngày 02/03',
        details: 'Nghiệm thu tổng thể'
    }
];