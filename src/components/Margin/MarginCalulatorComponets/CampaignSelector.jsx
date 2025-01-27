import React from "react";
import '../../../styles/MarginCalculatorForm.css'
function CampaignSelector({ campaigns, selectedCampaignId, handleCampaignSelect }) {
    return (
        <div className="campaign-select">
            <label>캠페인 선택:</label>
            <select onChange={handleCampaignSelect} value={selectedCampaignId || ""}>
                <option value="" disabled>
                    캠페인을 선택하세요
                </option>
                {campaigns.map((campaign) => (
                    <option key={campaign.campaignId} value={campaign.campaignId}>
                        {campaign.title}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CampaignSelector;