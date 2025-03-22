import React, { useState } from 'react';
import "../../styles/memo/Memoview.css";
import { Trash2 } from 'lucide-react';
import { updateMemo, deleteMemo } from '../../services/memo'; // 업데이트 API 호출을 위한 함수 import

const MemoView = ({ memos, fetchMemos }) => {
    const [editingMemoId, setEditingMemoId] = useState(null); // 현재 수정 중인 메모 ID
    const [editedContent, setEditedContent] = useState(''); // 수정된 내용 상태

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('삭제된 메모는 영영 떠나갑니다. \n정말 삭제할까요?');
        if (confirmDelete) {
            await deleteMemo({ id });
            alert('메모가 삭제 되었습니다!');
            fetchMemos(); // 수정 후 메모 목록 갱신
        } else {
            alert('메모가 남아있기로 했습니다');
        }
    };

    const handleContentChange = (memo) => {
        setEditingMemoId(memo.id); // 수정 중인 메모 ID 설정
        setEditedContent(memo.contents); // 수정할 내용 설정
    };

    const handleBlur = async (memo) => {
        if (editedContent.trim() !== memo.contents) {
            const confirmUpdate = window.confirm('수정된 내용을 저장하시겠습니까?');
            if (confirmUpdate) {
                try {
                    await updateMemo({
                        memoId: memo.id,
                        contents: editedContent,
                    });
                    alert('메모가 수정되었습니다.');
                    fetchMemos(); // 수정 후 메모 목록 갱신
                } catch (error) {
                    console.error('메모 수정 실패:', error);
                    alert('메모 수정에 실패했습니다.');
                }
            } else {
                setEditedContent(memo.contents); // 수정 취소 시 원래 내용으로 복원
            }
        }
        setEditingMemoId(null); // 수정 완료 후 상태 초기화
    };

    return (
        <div className="memo-view">
            <div className="table-container">
                <table>
                    <tbody>
                        {memos.map((memo) => (
                            <tr key={memo.id}>
                                <td className="memo-view-td-date">{memo.date}</td>
                                <td className="memo-view-td-contents">
                                    {editingMemoId === memo.id ? (
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)} // 수정된 내용 업데이트
                                            onBlur={() => handleBlur(memo)} // 포커스 아웃 시 수정 완료
                                            rows={editedContent.split('\n').length} // 줄 수를 수정된 내용에 맞춤
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                outline: 'none',
                                                resize: 'none', // 크기 조절 비활성화
                                            }}
                                        />
                                    ) : (
                                        <span onClick={() => handleContentChange(memo)} style={{ whiteSpace: 'pre-wrap' }}>
                                            {memo.contents.replace(/<br\s*\/?>/g, '\n')} {/* HTML의 <br>을 줄바꿈으로 변환 */}
                                        </span>
                                    )}
                                </td>
                                <td className="memo-view-td-delete-button">
                                    <button onClick={() => handleDelete(memo.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default MemoView;