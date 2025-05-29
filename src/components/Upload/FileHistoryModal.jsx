import React from 'react';
import { X } from 'lucide-react';
import '../../styles/Upload/FileHistoryModal.css';

export default function FileHistoryModal({ isOpen, onClose, date, files }) {
    if (!isOpen) return null;

    return (
        <div className="file-history-modal-overlay" onClick={onClose}>
            <div className="file-history-modal-container" onClick={e => e.stopPropagation()}>
                <button className="file-history-modal-close" onClick={onClose}>
                    <X size={20} />
                </button>
                <div className="file-history-modal-title">
                    업로드 내역: {date}
                </div>
                <div className="file-history-modal-list">
                    {files.map((f, idx) => (
                        <div key={idx} className="file-history-item">
                            <div className="file-history-modal-item-type">{f.type}</div>
                            <div className="file-history-modal-item-detail">
                                <div><strong>파일명:</strong> {f.fileName}</div>
                                <div><strong>전체 건수:</strong> {f.fileAllCount}</div>
                                <div><strong>신규 건수:</strong> {f.fileNewCount}</div>
                                <div><strong>중복 건수:</strong> {f.fileDuplicateCount}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
