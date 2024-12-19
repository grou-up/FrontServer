import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Upload, BarChart, Calculator, Home , Settings,LogOut} from 'lucide-react'; // 필요한 아이콘 추가
import '../styles/Sidebar.css';

const MenuItem = ({ item, activePath, onSelect, currentPath = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
  
    const itemPath = [...currentPath, item.title];
    const isActive = activePath.join('/') === itemPath.join('/');
  
    return (
      <div className="menu-item">
        {item.description && ( // 설명이 있을 경우에만 표시
          <div className="menu-item-description">
            {item.description} {/* 설명 추가 */}
          </div>
        )}
        <div 
          className={`menu-item-content ${isActive ? 'active' : ''}`}
          onClick={() => {
            if (hasChildren) {
              setIsOpen(!isOpen);
            }
            onSelect(itemPath);
          }}
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
              />
            ))}
          </div>
        )}
      </div>
    );
  };

const Sidebar = () => {
  const [activePath, setActivePath] = useState([]);
  
  const menuData = [
    {
      title: "대시보드",
      description: "대시보드",
      icon: <Home size={16} />,
      
      children: []
    },
    {
      title: "액셀 업로드",
      description: "파일 업로드",
      icon: <Upload size={16} />, // 아이콘 추가
      children: []
    },
    {
      title: "광고 캠패인",
      description: "광고 캠패인 분석",
      icon: <BarChart size={16} />, // 아이콘 추가
      children: [
        { title: "캠패인 1", icon: <BarChart size={14} /> },
        { title: "캠패인 2", icon: <BarChart size={14} /> },
      ]
    },
    {
        title: "마진 계산기",
        description: "마진 계산기",
        icon: <Calculator size={16} /> // 아이콘 추가
    },
    {
        title: "설정",
        icon: <Settings size={16} />, // 아이콘 추가
    },
    {
        title: "로그아웃",
        icon: <LogOut size={16} /> // 아이콘 추가
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
              {index < menuData.length - 1 && <hr className="menu-divider" />} {/* 구분선 추가 */}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;