import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Upload, BarChart, Calculator, Home, Settings, LogOut } from 'lucide-react'; // 필요한 아이콘 추가
import '../styles/Sidebar.css';
import { getMyCampaigns } from "../services/campaign";
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/tokenManager';
import SidebarFooter from './SidebarFooter';
const MenuItem = ({ item, activePath, onSelect, currentPath = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const navigate = useNavigate(); // useNavigate 훅 사용

  const itemPath = [...currentPath, item.title];
  const isActive = activePath.join('/') === itemPath.join('/');

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(itemPath);
      // URL로 이동
      if (item.title === "대시보드") {
        navigate("/main");
      } else if (item.title === "액셀 업로드") {
        navigate("/upload");
      } else if (item.campaignId) {
        console.log(item.campaignId);
        navigate(`/campaigns/${item.campaignId}?title=${encodeURIComponent(item.title)}`);
      } else if (item.title === "마진 계산기") {
        navigate("/margin-calculator");
      } else if (item.title === "결제") {
        navigate("/payments");
      } else if (item.title === "로그아웃") {
        removeToken(); // 토큰 삭제
        navigate('/'); // 로그인 페이지로 리다이렉트
      }
    }
  };

  return (
    <div className="menu-item">
      {item.description && (
        <div className="menu-item-description">
          {item.description}
        </div>
      )}
      <div
        className={`menu-item-content ${isActive ? 'active' : ''}`}
        onClick={handleClick} // 클릭 시 handleClick 호출
      >
        {hasChildren && (
          <span className="menu-item-icon">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        <span className="menu-item-icon">
          {item.icon}
        </span>
        <span className="menu-item-text">{item.title}</span>
      </div>

      {hasChildren && isOpen && (
        <div className="submenu-container">
          {item.children.map((child, index) => (
            <MenuItem
              key={index}
              item={child}
              activePath={activePath}
              onSelect={onSelect}
              currentPath={itemPath}
              className="campaign-child" // 캠페인 자식 요소에 클래스 추가
            />
          ))}
        </div>
      )}
    </div>
  );
};
const Sidebar = () => {
  const [activePath, setActivePath] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getMyCampaigns();// 캠페인 데이터 가져오기
        setCampaigns(response.data || []); // response.data가 캠페인 리스트라고 가정
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };
    fetchCampaigns();
  }, []);

  const optimizedCampaigns = campaigns.filter(campaign => campaign.camAdType === "매출 최적화");
  const manualCampaigns = campaigns.filter(campaign => campaign.camAdType === "수동 성과형");
  const generalCampaigns = campaigns.filter(campaign => campaign.camAdType === "간편 매출 스타트");

  const menuData = [
    {
      title: "대시보드",
      description: "대시보드",
      icon: <Home size={16} />,
      children: [],
      showDivider: true, // 구분선 표시 여부
    },
    {
      title: "액셀 업로드",
      description: "파일 업로드",
      icon: <Upload size={16} />,
      children: [],
      showDivider: true,
    },
    {
      title: "매출 최적화",
      description: "광고 캠패인 분석",
      icon: <BarChart size={16} />,
      children: optimizedCampaigns.map((campaign) => ({
        title: campaign.title,
        campaignId: campaign.campaignId,
        icon: <BarChart size={14} />,
      })),
      showDivider: false, // 구분선 제거
    },
    {
      title: "수동 성과형",
      icon: <BarChart size={16} />,
      children: manualCampaigns.map((campaign) => ({
        title: campaign.title,
        campaignId: campaign.campaignId,
        icon: <BarChart size={14} />,
      })),
      showDivider: false,
    },
    {
      title: "간편 매출 스타트",
      icon: <BarChart size={16} />,
      children: generalCampaigns.map((campaign) => ({
        title: campaign.title,
        campaignId: campaign.campaignId,
        icon: <BarChart size={14} />,
      })),
      showDivider: true,
    },
    {
      title: "마진 계산기",
      description: "마진 계산기",
      icon: <Calculator size={16} />,
      showDivider: true,
    },
    {
      title: "결제",
      icon: <Settings size={16} />,
      showDivider: true,
    },
    {
      title: "로그아웃",
      icon: <LogOut size={16} />,
      showDivider: true, // 구분선 제거
    },
  ];

  const handleSelect = (path) => {
    setActivePath(path);
  };

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <nav className="sidebar-nav" style={{ flex: '1' }}>

        <div className="menu-container">
          {menuData.map((item, index) => (
            <div key={index}>
              <MenuItem
                item={item}
                activePath={activePath}
                onSelect={handleSelect}
              />
              {item.showDivider && index < menuData.length - 1 && <hr className="menu-divider" />} {/* 구분선 추가 */}
            </div>
          ))}
        </div>
      </nav>
      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;