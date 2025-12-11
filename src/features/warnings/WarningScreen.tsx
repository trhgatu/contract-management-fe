
import React, { useState, useEffect } from 'react';
import { WarningItem } from '@/types';
import { WarningHeader } from './components/WarningHeader';
import { WarningFilters } from './components/WarningFilters';
import { WarningTable } from './components/WarningTable';
import { WarningDetailModal } from './components/WarningDetailModal';
import { warningService } from '@/services';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const WarningScreen: React.FC = () => {
  const [warnings, setWarnings] = useState<WarningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterPic, setFilterPic] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modal State
  const [selectedWarning, setSelectedWarning] = useState<WarningItem | null>(null);
  const [modalNote, setModalNote] = useState('');

  // Fetch warnings from API
  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build filter object
        const filters: any = {};
        if (filterType !== 'all') filters.type = filterType;
        if (fromDate) filters.startDate = fromDate;
        if (toDate) filters.endDate = toDate;

        const data = await warningService.getAll(filters);
        setWarnings(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load warnings');
        console.error('Error fetching warnings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarnings();
  }, [filterType, fromDate, toDate]);

  // Client-side filter for customer and PIC (since backend might not support these filters)
  const filteredData = warnings.filter(item => {
    const matchCustomer = !filterCustomer ||
      item.customerName.toLowerCase().includes(filterCustomer.toLowerCase()) ||
      item.contractCode.toLowerCase().includes(filterCustomer.toLowerCase());
    const matchPic = !filterPic || item.pic?.toLowerCase().includes(filterPic.toLowerCase());
    return matchCustomer && matchPic;
  });

  const handleClearFilter = () => {
    setFilterType('all');
    setFilterCustomer('');
    setFilterPic('');
    setFromDate('');
    setToDate('');
  };

  const handleExportExcel = () => {
    alert('Đã xuất file Excel danh sách cảnh báo (Demo)');
  };

  const openDetailModal = (item: WarningItem) => {
    setSelectedWarning(item);
    setModalNote(item.note || '');
  };

  const handleUpdateStatus = async (newStatus: 'pending' | 'processing' | 'resolved') => {
    if (!selectedWarning) return;

    try {
      // Update via API
      await warningService.update(selectedWarning.id, {
        status: newStatus,
        note: modalNote
      });

      // Update local state
      setWarnings(prev => prev.map(w =>
        w.id === selectedWarning.id
          ? { ...w, status: newStatus, note: modalNote }
          : w
      ));

      setSelectedWarning(null);
    } catch (err: any) {
      console.error('Failed to update warning:', err);
      alert('Lỗi khi cập nhật cảnh báo: ' + (err.message || 'Unknown error'));
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-600">Đang tải dữ liệu cảnh báo...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-red-600 text-center">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
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
      <WarningHeader />

      {/* Filter Area */}
      <WarningFilters
        filterType={filterType}
        setFilterType={setFilterType}
        filterCustomer={filterCustomer}
        setFilterCustomer={setFilterCustomer}
        filterPic={filterPic}
        setFilterPic={setFilterPic}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        handleClearFilter={handleClearFilter}
        handleExportExcel={handleExportExcel}
      />

      {/* Data Grid */}
      <WarningTable
        warnings={filteredData}
        openDetailModal={openDetailModal}
        formatCurrency={formatCurrency}
      />

      {/* Detail Modal */}
      <WarningDetailModal
        selectedWarning={selectedWarning}
        modalNote={modalNote}
        setModalNote={setModalNote}
        setSelectedWarning={setSelectedWarning}
        handleUpdateStatus={handleUpdateStatus}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};
