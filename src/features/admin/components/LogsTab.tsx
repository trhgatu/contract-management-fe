import React, { useState, useEffect } from 'react';
import { Icons } from '../../../components/ui/Icons';
import { adminService } from '../../../services';
import { AuditLog } from '../../../types';
import { Button, DatePicker, Select, Input, Table, Tag, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface LogsTabProps {
    setViewLogDetails: (log: any) => void;
}

export const LogsTab: React.FC<LogsTabProps> = ({ setViewLogDetails }) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [logSearchUser, setLogSearchUser] = useState('');
    const [dateRange, setDateRange] = useState<any>(null);
    const [logAction, setLogAction] = useState('ALL');

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLogs();
        }, 500);
        return () => clearTimeout(timer);
    }, [logAction, dateRange, logSearchUser]); // Re-fetch when filters change

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (logAction !== 'ALL') params.action = logAction;

            if (dateRange && dateRange[0] && dateRange[1]) {
                // Formatting date for API - utilizing native Date methods since no moment/dayjs
                // Antd DatePicker returns dayjs objects usually if dayjs present, or native Date or similar depending on config.
                // But since no dayjs in package.json, Antd v5 might default to dayjs anyway (it has it as dependency usually).
                // Actually Antd v5 depends on Dayjs. It's an internal dependency of Antd.
                // However, without explicit import, accessing properties might be tricky.
                // Let's safe check:
                const start = dateRange[0].toDate ? dateRange[0].toDate() : new Date(dateRange[0]);
                const end = dateRange[1].toDate ? dateRange[1].toDate() : new Date(dateRange[1]);

                params.startDate = start.toISOString();
                params.endDate = end.toISOString();
            }

            const data = await adminService.getLogs(params);

            // Client-side filtering for User since API doesn't support it yet
            let filtered = data;
            if (logSearchUser) {
                filtered = data.filter((log: AuditLog) =>
                    (log.user?.name || '').toLowerCase().includes(logSearchUser.toLowerCase()) ||
                    (log.user?.email || '').toLowerCase().includes(logSearchUser.toLowerCase())
                );
            }

            setLogs(filtered);
        } catch (error) {
            console.error('Fetch logs error:', error);
            message.error('Không thể tải nhật ký hoạt động');
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<AuditLog> = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (text) => new Date(text).toLocaleString('vi-VN'),
        },
        {
            title: 'Người thực hiện',
            key: 'user',
            width: 200,
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-700">{record.user?.name || 'Unknown'}</span>
                    <span className="text-xs text-slate-500">{record.user?.email}</span>
                </div>
            )
        },
        {
            title: 'Chức năng',
            dataIndex: 'screen',
            key: 'screen',
            width: 150,
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            render: (action) => {
                let color = 'default';
                if (action === 'CREATE') color = 'green';
                if (action === 'UPDATE') color = 'blue';
                if (action === 'DELETE') color = 'red';
                if (action === 'LOGIN') color = 'purple';
                return <Tag color={color}>{action}</Tag>;
            }
        },
        {
            title: '',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() => setViewLogDetails(record)}
                    icon={<Icons.Eye size={16} />}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    const handleExportLogs = (type: 'csv' | 'excel') => {
        if (logs.length === 0) {
            message.warning('Không có dữ liệu để xuất');
            return;
        }

        const extension = type === 'csv' ? 'csv' : 'xls';
        const content = "STT,Thời gian,Người thực hiện,Email,Chức năng,Hành động,Chi tiết\n" +
            logs.map((l, i) => `${i + 1},${new Date(l.createdAt).toLocaleString('vi-VN')},${l.user?.name || ''},${l.user?.email || ''},${l.screen},${l.action},"${JSON.stringify(l.details || {}).replace(/"/g, '""')}"`).join('\n');

        const blob = new Blob([content], { type: `text/${extension}` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs_${new Date().toISOString().split('T')[0]}.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex flex-wrap gap-3 items-center">
                    <Input
                        placeholder="Tìm người thực hiện..."
                        prefix={<Icons.Search size={16} className="text-slate-400" />}
                        className="w-64"
                        value={logSearchUser}
                        onChange={(e) => setLogSearchUser(e.target.value)}
                        allowClear
                    />
                    <RangePicker
                        placeholder={['Từ ngày', 'Đến ngày']}
                        onChange={(dates) => setDateRange(dates)}
                    />
                    <Select
                        defaultValue="ALL"
                        style={{ width: 160 }}
                        value={logAction}
                        onChange={setLogAction}
                    >
                        <Option value="ALL">Tất cả hành động</Option>
                        <Option value="CREATE">Thêm mới</Option>
                        <Option value="UPDATE">Cập nhật</Option>
                        <Option value="DELETE">Xóa</Option>
                        <Option value="LOGIN">Đăng nhập</Option>
                    </Select>
                </div>
                <Space>
                    <Button onClick={() => handleExportLogs('csv')} icon={<Icons.Csv className="w-4 h-4" />}>
                        Xuất CSV
                    </Button>
                    <Button onClick={() => handleExportLogs('excel')} icon={<Icons.Excel className="w-4 h-4" />}>
                        Xuất Excel
                    </Button>
                </Space>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={logs}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 20, showSizeChanger: true }}
                    size="middle"
                />
            </div>
        </div>
    )
}