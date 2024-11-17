
import React, { useState } from 'react';
import { Upload, Table } from 'lucide-react';

const MainForm = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleFileUpload = (event, fileNumber) => {
    const file = event.target.files[0];
    if (fileNumber === 1) {
      setFile1(file);
    } else {
      setFile2(file);
    }
    // 실제 구현에서는 여기서 엑셀 파일을 파싱하고 데이터를 설정합
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 네비게이션 바 */}
      <nav className="bg-blue-600 p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-white text-2xl font-bold">Grow Up</h1>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 첫 번째 파일 업로드 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-50">
                <Upload className="w-8 h-8 text-blue-500" />
                <span className="mt-2 text-base">첫 번째 파일 선택</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={(e) => handleFileUpload(e, 1)}
                />
              </label>
            </div>
            {file1 && (
              <p className="mt-2 text-sm text-gray-600">
                선택된 파일: {file1.name}
              </p>
            )}
          </div>

          {/* 두 번째 파일 업로드 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-50">
                <Upload className="w-8 h-8 text-blue-500" />
                <span className="mt-2 text-base">두 번째 파일 선택</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={(e) => handleFileUpload(e, 2)}
                />
              </label>
            </div>
            {file2 && (
              <p className="mt-2 text-sm text-gray-600">
                선택된 파일: {file2.name}
              </p>
            )}
          </div>
        </div>

        {/* 데이터 테이블 영역 */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">분석 결과</h2>
          {tableData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      헤더 1
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      헤더 2
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      헤더 3
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* 여기에 실제 데이터 행이 들어갑니다 */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">데이터 1</td>
                    <td className="px-6 py-4 whitespace-nowrap">데이터 2</td>
                    <td className="px-6 py-4 whitespace-nowrap">데이터 3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              파일을 업로드하면 여기에 분석 결과가 표시됩니다
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default MainForm;