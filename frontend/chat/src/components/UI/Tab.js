import React, { useState, useEffect } from 'react';

const Tab = ({ tabs }) => {
  // Check if tabs are available and set initial active tab accordingly
  const [activeTab, setActiveTab] = useState(tabs.length > 0 ? tabs[0].label : '');

  const handleTabClick = (tab) => {
    setActiveTab(tab.label);
  };

  // Update activeTab if tabs prop changes
  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTab(tabs[0].label);
    }
  }, [tabs]);

  return (
    <div>
      <div className="tab-header">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab)}
            className={activeTab === tab.label ? 'active' : ''}
            aria-selected={activeTab === tab.label}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.map((tab) => 
          activeTab === tab.label && <div key={tab.label}>{tab.content}</div>
        )}
      </div>
    </div>
  );
};

export default Tab;
