import React from 'react';
import { Icons } from '../../../components/ui/Icons';
import { WarningItem } from '../../../types';
import { WarningTypeBadge } from './WarningBadges';

interface WarningDetailModalProps {
  selectedWarning: WarningItem | null;
  modalNote: string;
  setModalNote: (note: string) => void;
  setSelectedWarning: (item: WarningItem | null) => void;
  handleUpdateStatus: (newStatus: 'pending' | 'processing' | 'resolved') => void;
  formatCurrency: (value: number) => string;
}

export const WarningDetailModal: React.FC<WarningDetailModalProps> = ({
  selectedWarning,
  modalNote,
  setModalNote,
  setSelectedWarning,
  handleUpdateStatus,
  formatCurrency,
}) => {
  if (!selectedWarning) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${selectedWarning.daysDiff < 0 ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${selectedWarning.daysDiff < 0 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
              <Icons.Warning size={24} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${selectedWarning.daysDiff < 0 ? 'text-rose-700' : 'text-amber-700'}`}>
                {selectedWarning.daysDiff < 0 ? 'Cảnh báo quá hạn' : 'Nhắc nhở sắp đến hạn'}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {selectedWarning.contractCode} - {selectedWarning.customerName}
              </p>
            </div>
          </div>
          <button onClick={() => setSelectedWarning(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-slate-500"><Icons.X size={20}/></button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Loại cảnh báo</label>
              <div className="font-medium text-slate-800 flex items-center gap-2">
                <WarningTypeBadge type={selectedWarning.type} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Chi tiết đợt</label>
              <div className="font-bold text-blue-700">{selectedWarning.details}</div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Ngày đến hạn (Deadline)</label>
              <div className="font-mono font-bold text-slate-800 text-lg">{selectedWarning.dueDate}</div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tình trạng thời gian</label>
              <div className={`font-bold text-lg ${selectedWarning.daysDiff < 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                {selectedWarning.daysDiff < 0 ? `Trễ ${Math.abs(selectedWarning.daysDiff)} ngày` : `Còn ${selectedWarning.daysDiff} ngày`}
              </div>
            </div>
            {selectedWarning.amount > 0 && (
              <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Số tiền liên quan</label>
                <div className="font-bold text-2xl text-slate-800">{formatCurrency(selectedWarning.amount)}</div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold text-slate-700 block mb-2">Cập nhật ghi chú / Tiến độ xử lý</label>
            <textarea
              className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-blue-500 outline-none h-24 resize-none"
              placeholder="Nhập ghi chú xử lý (VD: Đã gọi điện nhắc khách, đang chờ ký...)"
              value={modalNote}
              onChange={(e) => setModalNote(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Trạng thái xử lý</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg has-[:checked]:bg-slate-50 has-[:checked]:border-slate-400">
                <input type="radio" name="status" checked={selectedWarning.status === 'pending'} onChange={() => handleUpdateStatus('pending')} className="w-4 h-4 text-slate-600"/>
                <span className="text-sm font-medium text-slate-700">Chưa xử lý</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <input type="radio" name="status" checked={selectedWarning.status === 'processing'} onChange={() => handleUpdateStatus('processing')} className="w-4 h-4 text-blue-600"/>
                <span className="text-sm font-medium text-blue-700">Đang xử lý</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-400">
                <input type="radio" name="status" checked={selectedWarning.status === 'resolved'} onChange={() => handleUpdateStatus('resolved')} className="w-4 h-4 text-emerald-600"/>
                <span className="text-sm font-medium text-emerald-700">Đã xử lý (Xong)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
          <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
            <Icons.ArrowRight size={16}/> Xem chi tiết hợp đồng
          </button>
          <div className="flex gap-3">
            <button onClick={() => setSelectedWarning(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-100">Đóng</button>
            <button onClick={() => handleUpdateStatus(selectedWarning.status)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm">Lưu cập nhật</button>
          </div>
        </div>
      </div>
    </div>
  );
};
