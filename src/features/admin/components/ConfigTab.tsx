import React, { useState, useEffect } from 'react';
import { Icons } from '../../../components/ui/Icons';
import { Button, Input, Card, Form, message, Spin } from 'antd';
import { adminService } from '../../../services';
import { SystemConfig } from '../../../services/adminService';

export const ConfigTab: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [configs, setConfigs] = useState<SystemConfig[]>([]);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const data = await adminService.getConfigs();
            setConfigs(data);

            // Transform array to object for form
            const formData: Record<string, string> = {};
            data.forEach(config => {
                formData[config.key] = config.value;
            });
            form.setFieldsValue(formData);
        } catch (error) {
            console.error('Fetch configs error:', error);
            message.error('Không thể tải cấu hình hệ thống');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (values: any) => {
        setSaving(true);
        try {
            // Update each changed config
            const promises = Object.keys(values).map(async (key) => {
                const config = configs.find(c => c.key === key);
                // Only update if existing and changed (or just update all present in form)
                if (config && config.value !== values[key]) {
                    return adminService.updateConfig(config.id, values[key]);
                }
                return Promise.resolve();
            });

            await Promise.all(promises);
            message.success('Lưu cấu hình thành công');
            fetchConfigs(); // Reload to ensure sync
        } catch (error) {
            console.error('Save configs error:', error);
            message.error('Lỗi khi lưu cấu hình');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-10"><Spin size="large" /></div>;
    }

    const hasConfig = configs.length > 0;

    return (
        <div className="max-w-4xl">
            <Card title={
                <div className="flex items-center gap-2">
                    <Icons.Settings size={20} className="text-blue-600" />
                    <span className="font-bold text-slate-800">Thiết lập chung</span>
                </div>
            } className="shadow-sm border-slate-200">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    {!hasConfig && (
                        <div className="text-center py-4 text-slate-500">
                            Chưa có cấu hình nào trong database. Vui lòng thêm dữ liệu.
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Map through configs to render inputs */}
                        {configs.map(config => (
                            <Form.Item
                                key={config.id}
                                name={config.key}
                                label={config.description || config.key}
                                help={config.key === 'SYSTEM_DOMAIN' ? 'Domain chính của hệ thống' : ''}
                            >
                                <Input disabled={!config.isEditable} />
                            </Form.Item>
                        ))}
                    </div>

                    {hasConfig && (
                        <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                loading={saving}
                                icon={<Icons.Save size={18} />}
                                className="bg-blue-600 font-bold px-8"
                            >
                                Lưu cấu hình
                            </Button>
                        </div>
                    )}
                </Form>
            </Card>
        </div>
    );
};
