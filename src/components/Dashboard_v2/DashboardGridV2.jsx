import { React, useState, useEffect, useMemo } from "react";
import DashboardCalendar from "./DashboardCalendar";
import DashboardSales from "./DashboardSales";
import DashboardActualSales from "./DashboardActualSales";
import DashboardReturnCount from "./DashboardReturnCount";
import DashboardMargin from "./DashboardMargin";
import DashboardAdCost from "./DashboardAdCost";
import DashboardRoas from "./DashboardRoas";
import DashboardSun from "./DashboardSun";
import DashboardCampaign from "./DashboardCampaign";
import DashboardSalesReport from "./DashboardSalesReport";
import DashboardMarginReport from "./DashboardMarginReport";
import { getMyCampaigns } from "../../services/campaign";
import {
    getMarginByCampaignId,
    getNetProfitAndReturnCost,
    findLatestMarginDateByEmail
} from "../../services/margin";
import "../../styles/Dashboard/DashboardGridV2.css";

const DashboardGridV2 = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [dailyNetProfitData, setDailyNetProfitData] = useState([]);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    const { startDate, endDate } = dateRange;

    const formatDate = (d) => d.toISOString().split("T")[0];

    useEffect(() => {
        const initialize = async () => {
            try {
                const dateRes = await findLatestMarginDateByEmail();
                const latest = dateRes?.data ? new Date(dateRes.data) : new Date();

                const campaignsRes = await getMyCampaigns();
                const loadedCampaigns = campaignsRes.data || [];

                setDateRange({ startDate: latest, endDate: latest });
                setCampaigns(loadedCampaigns);

                fetchAll(latest, loadedCampaigns);
            } catch (err) {
                console.error("초기화 실패:", err);
            }
        };
        initialize();
    }, []);

    const fetchAll = async (selectedDate, campaignList) => {
        const end = new Date(selectedDate);
        const start = new Date(selectedDate);
        start.setDate(end.getDate() - 6);

        const sd = formatDate(start);
        const ed = formatDate(end);

        try {
            const marginPromises = campaignList.map(async ({ campaignId }) => {
                try {
                    const resp = await getMarginByCampaignId({ startDate: sd, endDate: ed, campaignId });
                    const dtoList = resp.data || [];
                    const results = dtoList.length > 0 ? dtoList[0].data : [];
                    return { campaignId, data: results };
                } catch (err) {
                    console.warn(`⚠️ margin load error for campaignId ${campaignId}:`, err);
                    return { campaignId, data: [] };
                }
            });

            const marginData = await Promise.all(marginPromises);
            setTableData(marginData);

            const profitResp = await getNetProfitAndReturnCost({ startDate: sd, endDate: ed });
            const profitData = Array.isArray(profitResp.data) ? profitResp.data : [];
            setDailyNetProfitData(profitData);

        } catch (err) {
            console.error("데이터 불러오기 오류:", err);
        }
    };

    const handleDateChange = ({ startDate, endDate }) => {
        const selected = startDate;
        setDateRange({ startDate: selected, endDate: endDate ?? selected });
        fetchAll(selected, campaigns);
    };

    const latestDate = startDate ? formatDate(startDate) : null;

    const flatData = useMemo(() => tableData.flatMap(group => group.data), [tableData]);

    const latestData = useMemo(() => {
        return flatData.filter(x => formatDate(new Date(x.marDate)) === latestDate);
    }, [flatData, latestDate]);

    const totalSales = latestData.reduce((sum, x) => sum + (x.marSales || 0), 0);
    const totalActualSales = latestData.reduce((sum, x) => sum + (x.marActualSales || 0), 0);
    const totalReturnCount = latestData.reduce((sum, x) => sum + (x.marReturnCount || 0), 0);
    const totalAdCost = latestData.reduce((sum, x) => sum + (x.marAdCost || 0), 0);
    const roas = totalAdCost ? (totalSales / totalAdCost) * 100 : 0;
    const margin = dailyNetProfitData?.find(d => d.marDate === latestDate)?.margin ?? 0;
    const sun = 2;

    return (
        <div className="dashboard-container">
            {startDate && (
                <DashboardCalendar
                    initialDate={startDate}
                    onDateChange={handleDateChange}
                />
            )}

            <DashboardSales value={totalSales} />
            <DashboardActualSales value={totalActualSales} />
            <DashboardReturnCount value={totalReturnCount} />
            <DashboardMargin value={margin} />
            <DashboardAdCost value={totalAdCost} />
            <DashboardRoas value={roas} />
            <DashboardSun value={sun} />
            <DashboardCampaign count={campaigns.length} />

            <DashboardSalesReport tableData={tableData} />
            <DashboardMarginReport selectedDate={latestDate} />
        </div>
    );
};

export default DashboardGridV2;
