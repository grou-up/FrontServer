import React, { useState } from 'react';
import '../styles/Mainform.css'; // 스타일 파일 추가
import KeywordComponent from '../components/KeywordComponent'; // 추가
import Totalsearchbar from './Totalsearchbar';
import { useParams, useLocation } from 'react-router-dom';

const CampaignDetail = () => {
    const { campaignId } = useParams(); // URL 파라미터에서 campaignId를 가져옴
    const location = useLocation(); // 현재 위치 정보 가져오기
    // 쿼리 파라미터에서 title 추출하기
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title');
    // 상태 추가: 어떤 KeywordComponent를 보여줄지 결정
    const [activeComponent, setActiveComponent] = useState(null);

    // 버튼 클릭 시 호출될 함수
    const handleComponentChange = (component) => {
        setActiveComponent(component);
    };

  return (
    <div className="main-content">
      <div className="min-h-screen bg-gray-100">
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">{ title }</h2>
        </div>
        <main className="container mx-auto p-6">
        <Totalsearchbar onComponentChange={handleComponentChange} /> {/* props로 함수 전달 */}
          <div className="mt-8">
            {activeComponent === 'Keywordcomponent' && <KeywordComponent campaignId={campaignId} />}
            {/* <KeywordComponent2 campaignId={campaignId} /> campaignId 전달 */}
            {/* <KeywordComponent3 campaignId={campaignId} /> campaignId 전달 */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignDetail;
