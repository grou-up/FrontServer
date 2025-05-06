import React, { useState, useEffect } from 'react';
import { getMyName } from '../services/auth';
import {
  Upload,
  Calculator,
  Home,
  Settings,
  LogOut,
  Folder
} from 'lucide-react';
import logo from "../images/Logo.png";
import '../styles/Sidebar.css';
import { getMyCampaigns } from "../services/campaign";
import { useNavigate, useLocation } from 'react-router-dom';
import { removeToken } from '../utils/tokenManager';

const MenuItem = ({ item, activePath, onSelect, currentPath = [], level = 0, location }) => {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const itemPath = [...currentPath, item.title];
  const navigate = useNavigate();

  // ✅ isActive 개선: campaignId 기준으로 경로 비교
  const isActive = item.campaignId
    ? location.pathname === `/campaigns/${item.campaignId}`
    : activePath.join('/').startsWith(itemPath.join('/'));

  const [isOpen, setIsOpen] = useState(false);

  // ✅ 처음 렌더링 시 activePath 기준으로 메뉴 열기
  useEffect(() => {
    if (hasChildren && isActive) {
      setIsOpen(true);
    }
  }, [hasChildren, isActive]);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(prev => !prev);
    } else {
      onSelect(itemPath);
      switch (item.title) {
        case "대시보드": return navigate("/main");
        case "액셀 업로드": return navigate("/upload");
        case "마진 계산기": return navigate("/margin-calculator");
        case "설정": return navigate("/settings");
        case "로그아웃":
          removeToken();
          return navigate('/');
        default:
          if (item.campaignId) {
            return navigate(`/campaigns/${item.campaignId}?title=${encodeURIComponent(item.title)}`);
          }
      }
    }
  };

  return (
    <div className={`menu-item level-${level}`}>
      <div
        className={`menu-item-content${isActive ? ' active' : ''}`}
        style={{
          paddingLeft: hasChildren ? '8px' : '8px',
          marginTop: ['대시보드'].includes(item.title)
            ? '25px'
            : ['광고 캠페인 분석', '마진 계산기', '설정'].includes(item.title)
              ? '0px'
              : undefined,
          //   : undefined
        }}
        onClick={handleClick}
      >
        <span className="menu-item-icon">
          {item.icon || (hasChildren ? <Folder size={16} /> : null)}
        </span>
        <span className="menu-item-text">{item.title}</span>
      </div>

      {hasChildren && isOpen && (
        <div className="submenu-container">
          {item.children.map((child, idx) => (
            <MenuItem
              key={idx}
              item={child}
              activePath={activePath}
              onSelect={onSelect}
              currentPath={itemPath}
              level={level + 1}
              location={location}
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
  const [userInfo, setUserInfo] = useState({ name: '' });
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyName();
        setUserInfo({ name: res.data.name });
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    })();

    (async () => {
      try {
        const { data } = await getMyCampaigns();
        setCampaigns(data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // ✅ URL 기반 activePath 설정
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/campaigns/')) {
      const title = new URLSearchParams(location.search).get('title') || '';
      setActivePath(['광고 캠페인 분석', title]);
    } else if (path === '/main') {
      setActivePath(['대시보드']);
    } else if (path === '/upload') {
      setActivePath(['액셀 업로드']);
    } else if (path === '/margin-calculator') {
      setActivePath(['마진 계산기']);
    } else if (path === '/settings') {
      setActivePath(['설정']);
    } else {
      setActivePath([]);
    }
  }, [location]);

  const menuGroups = [
    [
      { title: "대시보드", icon: <Home size={16} /> },
      { title: "액셀 업로드", icon: <Upload size={16} /> }
    ],
    [
      {
        title: "광고 캠페인 분석",
        icon: <Folder size={16} />,
        children: campaigns.map(c => ({
          title: c.title,
          campaignId: c.campaignId
        }))
      }
    ],
    [
      { title: "마진 계산기", icon: <Calculator size={16} /> }
    ],
    [
      { title: "설정", icon: <Settings size={16} /> },
      { title: "로그아웃", icon: <LogOut size={16} /> }
    ]
  ];

  return (
    <aside className="sidebar">


      <nav className="sidebar-nav">
        <div className="sidebar-header">
          <div className="sidebar-logo-box">
            <img src={logo} alt="Logo" />
          </div>
          <div className="sidebar-username">{userInfo.name || '다시 로그인 해주세요'}</div>
        </div>
        <div className="menu-container">
          {menuGroups.map((group, groupIdx) => (
            <React.Fragment key={groupIdx}>
              {group.map((item, i) => (
                <MenuItem
                  key={`${groupIdx}-${i}`}
                  item={item}
                  activePath={activePath}
                  onSelect={setActivePath}
                  location={location}
                />
              ))}
              {groupIdx < menuGroups.length - 1 && <hr className="menu-divider" />}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
