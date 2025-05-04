import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { getMyCampaigns, deleteCampaignAll, deleteCampaignData } from "../../services/campaign";
import "./DataDeletionComponent.css";

const DataDeletionComponent = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await getMyCampaigns();
                setCampaigns(response.data || []);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            }
        };
        fetchCampaigns();
    }, []);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (!endDate || date > endDate) {
            setEndDate(date);
        }
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleCheckboxChange = (id) => {
        setCampaigns(
            campaigns.map((campaign) =>
                campaign.campaignId === id ? { ...campaign, checked: !campaign.checked } : campaign
            )
        );
    };

    const handleDeleteAll = async () => {
        const selectedCampaigns = campaigns.filter((campaign) => campaign.checked);

        if (selectedCampaigns.length > 0) {
            const confirmation = window.confirm(`정말 ${selectedCampaigns.length}개의 캠페인을 삭제하시겠습니까?`);

            if (confirmation) {
                try {
                    const campaignIdsToDelete = selectedCampaigns.map(campaign => Number(campaign.campaignId));

                    await deleteCampaignAll(campaignIdsToDelete);

                    const response = await getMyCampaigns();
                    setCampaigns(response.data || []);

                } catch (error) {
                    console.error("캠페인 삭제 실패:", error);
                    alert("캠페인 삭제에 실패했습니다."); // 삭제 실패 알림 추가
                }
            }
        } else {
            alert("선택된 캠페인이 없습니다.");
        }
    };

    const handleDeleteByDate = async () => {
        const selectedCampaigns = campaigns.filter((campaign) => campaign.checked);

        if (selectedCampaigns.length > 0) {
            // 날짜 포맷 변경 (YYYY-MM-DD)
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);

            const confirmation = window.confirm(`정말 ${selectedCampaigns.length}개의 캠페인의 ${formattedStartDate} 부터 ${formattedEndDate} 까지의 데이터를 삭제할까요?`);

            if (confirmation) {
                try {
                    const campaignIdsToDelete = selectedCampaigns.map(campaign => Number(campaign.campaignId));

                    // deleteCampaignData 함수에 formatted된 날짜 전달
                    const response = await deleteCampaignData({
                        campaignIds: campaignIdsToDelete,
                        start: formattedStartDate,
                        end: formattedEndDate
                    });

                    // 삭제 후 캠페인 목록 갱신 (선택 사항)
                    const getresponse = await getMyCampaigns();
                    setCampaigns(getresponse.data || []);

                    // 삭제된 데이터 정보 추출
                    const { campaignOptionDetail, keyword, margin, memo } = response.data;

                    // alert 창에 메시지 출력
                    alert(`삭제된 데이터:\n캠페인 옵션 상세: ${campaignOptionDetail}개\n키워드: ${keyword}개\n마진: ${margin}개\n메모: ${memo}개`);

                } catch (error) {
                    console.error("캠페인 삭제 실패:", error);
                    alert("캠페인 삭제에 실패했습니다."); // 삭제 실패 알림 추가
                }
            }
        } else {
            alert("선택된 캠페인이 없습니다.");
        }
    };

    // 날짜 포맷 함수
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month는 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    return (
        <div className="data-setting-delete-container">
            <h2>데이터 삭제</h2>

            <div className="date-picker-container">
                <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                />
                <span className="date-separator">~</span>
                <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    dateFormat="yyyy-MM-dd"
                    minDate={startDate}
                    maxDate={new Date()}
                />
            </div>

            <button className="delete-button" onClick={handleDeleteAll}>캠페인 전체 삭제</button>
            <button className="delete-button" onClick={handleDeleteByDate}>캠페인 기간 삭제</button>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>캠페인명</th>
                    </tr>
                </thead>
                <tbody>
                    {campaigns.map((campaign) => (
                        <tr key={campaign.campaignId}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={campaign.checked}
                                    onChange={() => handleCheckboxChange(campaign.campaignId)}
                                />
                            </td>
                            <td>{campaign.title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataDeletionComponent;
