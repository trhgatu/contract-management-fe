
import React, { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import { Contract, PaymentTerm, Expense, ProjectMember, ContractAttachment } from '@/types';
import { GeneralTab } from './modal_tabs/GeneralTab';
import { PaymentTab } from './modal_tabs/PaymentTab';
import { ExpenseTab } from './modal_tabs/ExpenseTab';
import { MembersTab } from './modal_tabs/MembersTab';
import { Button } from 'antd';

interface ContractModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    isEditMode: boolean;
    formData: Partial<Contract>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Contract>>>;
    handleSave: () => void;
    handleFormChange: (field: keyof Contract, value: any) => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeFile: (fileId: string) => void;
    handleAddPaymentTerm: () => void;
    handleUpdatePaymentTerm: (id: string, field: keyof PaymentTerm, value: any) => void;
    handleDeletePayment: (id: string) => void;
    handleAddExpense: () => void;
    handleUpdateExpense: (id: string, field: keyof Expense, value: any) => void;
    handleDeleteExpense: (id: string) => void;
    handleExpenseFileUpload: (e: React.ChangeEvent<HTMLInputElement>, expenseId: string) => void;
    openViewFilesModal: (title: string, files: ContractAttachment[]) => void;
    handleAddMember: () => void;
    handleUpdateMember: (id: string, field: keyof ProjectMember, value: any) => void;
    handleDeleteMember: (id: string) => void;
    isSaving?: boolean;
}

export const ContractModal: React.FC<ContractModalProps> = ({
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    handleSave,
    handleFormChange,
    handleFileUpload,
    removeFile,
    handleAddPaymentTerm,
    handleUpdatePaymentTerm,
    handleDeletePayment,
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense,
    handleExpenseFileUpload,
    openViewFilesModal,
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,
    isSaving = false,
}) => {
    const [modalTab, setModalTab] = useState<'general' | 'payment' | 'expense' | 'member'>('general');

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-7xl h-[95vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">
                            {isEditMode ? `Chỉnh sửa hợp đồng: ${formData.code}` : 'Thêm mới hợp đồng'}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {isEditMode ? 'Cập nhật thông tin và file đính kèm' : 'Nhập đầy đủ thông tin hợp đồng dự án'}
                        </p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"><Icons.X size={20} /></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
                    {[
                        { id: 'general', label: '1. Thông tin chung' },
                        { id: 'payment', label: '2. Điều khoản thanh toán' },
                        { id: 'expense', label: '3. Chi phí' },
                        { id: 'member', label: '4. Thành viên dự án' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setModalTab(tab.id as any)}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${modalTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-white relative">
                    {modalTab === 'general' && (
                        <GeneralTab
                            formData={formData}
                            handleFormChange={handleFormChange}
                            handleFileUpload={handleFileUpload}
                            removeFile={removeFile}
                        />
                    )}

                    {modalTab === 'payment' && (
                        <PaymentTab
                            paymentTerms={formData.paymentTerms || []}
                            handleAddPaymentTerm={handleAddPaymentTerm}
                            handleUpdatePaymentTerm={handleUpdatePaymentTerm}
                            handleDeletePayment={handleDeletePayment}
                        />
                    )}

                    {modalTab === 'expense' && (
                        <ExpenseTab
                            expenses={formData.expenses || []}
                            formData={formData}
                            handleAddExpense={handleAddExpense}
                            handleUpdateExpense={handleUpdateExpense}
                            handleDeleteExpense={handleDeleteExpense}
                            handleExpenseFileUpload={handleExpenseFileUpload}
                            openViewFilesModal={openViewFilesModal}
                        />
                    )}

                    {modalTab === 'member' && (
                        <MembersTab
                            members={formData.members || []}
                            handleAddMember={handleAddMember}
                            handleUpdateMember={handleUpdateMember}
                            handleDeleteMember={handleDeleteMember}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 px-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                    <Button
                        onClick={() => setIsModalOpen(false)}
                        className="h-10 px-6 border-slate-300 text-slate-600 font-medium hover:bg-slate-50"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSave}
                        loading={isSaving}
                        icon={<Icons.Check size={18} />}
                        className="h-10 px-6 bg-blue-600 hover:bg-blue-700 font-bold shadow-sm"
                    >
                        Lưu dữ liệu
                    </Button>
                </div>
            </div>
        </div>
    )
}
