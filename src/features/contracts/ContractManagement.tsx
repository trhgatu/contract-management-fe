import React, { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { contractService, masterDataService } from '@/services';
import { Contract, ContractAttachment, PaymentTerm, Expense, ProjectMember } from '@/types';
import { ContractHeader } from './components/ContractHeader';
import { ContractFilters } from './components/ContractFilters';
import { ContractList } from './components/ContractList';
import { ContractDetails } from './components/ContractDetails';
import { ContractModal } from './components/ContractModal';
import { ViewFilesModal } from './components/ViewFilesModal';

export const ContractManagement: React.FC = () => {
    const { showToast } = useToast();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

    // Main Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<Contract>>({});

    // View Files Modal State
    const [viewFilesModal, setViewFilesModal] = useState<{
        title: string;
        files: ContractAttachment[];
        isOpen: boolean;
    }>({ title: '', files: [], isOpen: false });

    // Filter states
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [quickSearch, setQuickSearch] = useState('');

    // Fetch contracts from API
    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await contractService.getAll();
            setContracts(data);
            if (data.length > 0 && !selectedContractId) {
                setSelectedContractId(data[0].id);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load contracts');
            console.error('Error fetching contracts:', err);
        } finally {
            setLoading(false);
        }
    };

    const selectedContract = contracts.find(c => c.id === selectedContractId);

    // --- Main Modal Handlers ---

    const handleOpenAddModal = () => {
        setIsEditMode(false);
        setFormData({
            status: 'ST01',
            attachments: [],
            vat: 10,
            valuePostVat: 0,
            paymentTerms: [],
            expenses: [],
            members: [],
            softwareIds: []  // Initialize as empty array
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (contract: Contract) => {
        setIsEditMode(true);
        setFormData(JSON.parse(JSON.stringify(contract)));
        setIsModalOpen(true);
    };

    const handleFormChange = (field: keyof Contract, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles: ContractAttachment[] = Array.from(e.target.files).map((f: File, index) => ({
                id: `new_${Date.now()}_${index}`,
                name: f.name,
                size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
                type: f.name.split('.').pop() || 'file',
                uploadDate: new Date().toISOString().split('T')[0]
            }));

            setFormData(prev => ({
                ...prev,
                attachments: [...(prev.attachments || []), ...newFiles]
            }));
        }
    };

    const removeFile = (fileId: string) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments?.filter(f => f.id !== fileId)
        }));
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        // Comprehensive Validation
        // Comprehensive Validation
        if (!formData.customerId) {
            showToast('Vui lòng chọn Khách hàng', 'warning');
            return;
        }

        if (!formData.code || !formData.code.trim()) {
            showToast('Vui lòng nhập Số hợp đồng', 'warning');
            return;
        }

        if (!formData.signDate || formData.signDate === 'Invalid date') {
            showToast('Vui lòng chọn Ngày ký hợp đồng', 'warning');
            return;
        }

        if (!formData.softwareIds || formData.softwareIds.length === 0) {
            showToast('Vui lòng chọn ít nhất 1 phần mềm', 'warning');
            return;
        }

        if (formData.status === 'ST03' && !formData.acceptanceDate) {
            showToast("Vui lòng nhập 'Ngày nghiệm thu' khi trạng thái là 'Hoàn thành'.", 'warning');
            return;
        }

        try {
            setIsSaving(true);
            // Clean data: remove invalid dates and temporary IDs
            const cleanData = { ...formData };

            // Remove 'Invalid date' strings
            if (cleanData.signDate === 'Invalid date') cleanData.signDate = undefined;
            if (cleanData.acceptanceDate === 'Invalid date') cleanData.acceptanceDate = undefined;

            // Clean nested arrays - remove temporary IDs and clean dates
            if (cleanData.paymentTerms) {
                cleanData.paymentTerms = cleanData.paymentTerms.map(item => {
                    let { id, ...rest } = item;
                    // Clean collectionDate
                    if (rest.collectionDate === 'Invalid date' || rest.collectionDate === '') {
                        rest.collectionDate = null as any;
                    }
                    // Return clean object (omit id if temporary)
                    return (id && id.toString().startsWith('term_')) ? rest : { ...rest, id };
                });
            }
            if (cleanData.expenses) {
                cleanData.expenses = cleanData.expenses.map(item => {
                    const { id, ...rest } = item;
                    return (id && id.toString().startsWith('exp_')) ? rest : { ...rest, id };
                });
            }
            if (cleanData.members) {
                cleanData.members = cleanData.members.map(item => {
                    const { id, ...rest } = item;
                    return (id && id.toString().startsWith('mem_')) ? rest : { ...rest, id };
                });
            }

            if (isEditMode && formData.id) {
                // Update existing contract
                const updated = await contractService.update(formData.id, cleanData);
                setContracts(prev => prev.map(c => c.id === updated.id ? updated : c));
                showToast('Cập nhật hợp đồng thành công!', 'success');
            } else {
                // Create new contract - remove id if exists
                const { id, ...dataToCreate } = cleanData;
                const newContract = await contractService.create(dataToCreate);
                setContracts(prev => [newContract, ...prev]);
                setSelectedContractId(newContract.id);
                showToast('Tạo hợp đồng mới thành công!', 'success');
            }
            setIsModalOpen(false);
            fetchContracts(); // Refresh to get full data with associations
        } catch (err: any) {
            showToast('Lỗi khi lưu hợp đồng: ' + (err.message || 'Unknown error'), 'error');
            console.error('Save error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Inline Editing Handlers ---

    // 1. Payment Terms
    const handleAddPaymentTerm = () => {
        const newTerm: PaymentTerm = {
            id: `term_${Date.now()}`,
            batch: `Đợt ${(formData.paymentTerms?.length || 0) + 1}`,
            content: '',
            ratio: 0,
            value: 0,
            isCollected: false,
            collectionDate: '',
            invoiceStatus: 'not_exported'
        };
        setFormData(prev => ({
            ...prev,
            paymentTerms: [...(prev.paymentTerms || []), newTerm]
        }));
    };

    const handleUpdatePaymentTerm = (id: string, field: keyof PaymentTerm, value: any) => {
        setFormData(prev => ({
            ...prev,
            paymentTerms: prev.paymentTerms?.map(t => {
                if (t.id !== id) return t;

                if (field === 'ratio') {
                    const totalValue = prev.valuePostVat || 0;
                    const calculatedValue = (totalValue * Number(value)) / 100;
                    return { ...t, [field]: value, value: calculatedValue };
                }

                return { ...t, [field]: value };
            })
        }));
    };

    const handleDeletePayment = (id: string) => {
        setFormData(prev => ({
            ...prev,
            paymentTerms: prev.paymentTerms?.filter(t => t.id !== id)
        }));
    };

    // 2. Expenses
    const handleAddExpense = () => {
        const newExp: Expense = {
            id: `exp_${Date.now()}`,
            category: '',
            description: '',
            supplierId: '',
            totalAmount: 0,
            contractStatus: '',
            paymentStatus: 'unpaid',
            pic: '',
            note: '',
            attachments: []
        };
        setFormData(prev => ({
            ...prev,
            expenses: [...(prev.expenses || []), newExp]
        }));
    };

    const handleUpdateExpense = (id: string, field: keyof Expense, value: any) => {
        setFormData(prev => ({
            ...prev,
            expenses: prev.expenses?.map(e => e.id === id ? { ...e, [field]: value } : e)
        }));
    };

    const handleExpenseFileUpload = (e: React.ChangeEvent<HTMLInputElement>, expenseId: string) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles: ContractAttachment[] = Array.from(e.target.files).map((f: File, index) => ({
                id: `exp_file_${Date.now()}_${index}`,
                name: f.name,
                size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
                type: f.name.split('.').pop() || 'file',
                uploadDate: new Date().toISOString().split('T')[0]
            }));

            setFormData(prev => ({
                ...prev,
                expenses: prev.expenses?.map(exp => {
                    if (exp.id === expenseId) {
                        return { ...exp, attachments: [...(exp.attachments || []), ...newFiles] };
                    }
                    return exp;
                })
            }));
        }
    };

    const removeExpenseFile = (expenseId: string, fileId: string) => {
        setFormData(prev => ({
            ...prev,
            expenses: prev.expenses?.map(exp => {
                if (exp.id === expenseId) {
                    return { ...exp, attachments: exp.attachments?.filter(f => f.id !== fileId) };
                }
                return exp;
            })
        }));
    };

    const handleDeleteExpense = (id: string) => {
        setFormData(prev => ({
            ...prev,
            expenses: prev.expenses?.filter(e => e.id !== id)
        }));
    };

    const openViewFilesModal = (title: string, files: ContractAttachment[] = []) => {
        setViewFilesModal({ title, files, isOpen: true });
    };

    // 3. Members
    const handleAddMember = () => {
        const newMem: ProjectMember = {
            id: `mem_${Date.now()}`,
            memberCode: '',
            name: '',
            role: 'Dev'
        };
        setFormData(prev => ({
            ...prev,
            members: [...(prev.members || []), newMem]
        }));
    };

    const handleUpdateMember = (id: string, field: keyof ProjectMember, value: any) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members?.map(m => m.id === id ? { ...m, [field]: value } : m)
        }));
    };

    const handleDeleteMember = (id: string) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members?.filter(m => m.id !== id)
        }));
    };

    const handleDeleteContract = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa hợp đồng này không? Hành động này không thể hoàn tác.')) {
            try {
                await contractService.delete(id);
                setContracts(prev => prev.filter(c => c.id !== id));
                if (selectedContractId === id) {
                    setSelectedContractId(contracts.find(c => c.id !== id)?.id || null);
                }
                showToast('Xóa hợp đồng thành công!', 'success');
            } catch (err: any) {
                console.error('Delete error:', err);
                showToast('Lỗi khi xóa hợp đồng: ' + (err.message || 'Unknown error'), 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-slate-600">Đang tải hợp đồng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-red-600 text-center">
                    <h3 className="text-lg font-semibold mb-2">Lỗi tải dữ liệu</h3>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchContracts}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 gap-4">
            <ContractHeader />
            <ContractFilters
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                searchCustomer={searchCustomer}
                setSearchCustomer={setSearchCustomer}
                quickSearch={quickSearch}
                setQuickSearch={setQuickSearch}
                handleOpenAddModal={handleOpenAddModal}
            />
            <ContractList
                contracts={contracts}
                selectedContractId={selectedContractId}
                setSelectedContractId={setSelectedContractId}
                handleOpenEditModal={handleOpenEditModal}
                handleDeleteContract={handleDeleteContract}
                openViewFilesModal={openViewFilesModal}
            />
            <ContractDetails
                selectedContract={selectedContract}
                openViewFilesModal={openViewFilesModal}
            />
            <ContractModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                isEditMode={isEditMode}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleSave}
                handleFormChange={handleFormChange}
                handleFileUpload={handleFileUpload}
                removeFile={removeFile}
                handleAddPaymentTerm={handleAddPaymentTerm}
                handleUpdatePaymentTerm={handleUpdatePaymentTerm}
                handleDeletePayment={handleDeletePayment}
                handleAddExpense={handleAddExpense}
                handleUpdateExpense={handleUpdateExpense}
                handleDeleteExpense={handleDeleteExpense}
                handleExpenseFileUpload={handleExpenseFileUpload}
                openViewFilesModal={openViewFilesModal}
                handleAddMember={handleAddMember}
                handleUpdateMember={handleUpdateMember}
                handleDeleteMember={handleDeleteMember}
                isSaving={isSaving}
            />
            <ViewFilesModal
                viewFilesModal={viewFilesModal}
                setViewFilesModal={setViewFilesModal}
            />
        </div>
    );
};