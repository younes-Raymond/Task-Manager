import React, { useEffect, useState } from 'react';
import MainData from './MainData';

const Dashboard = ({ activeTab, children }) => {
  const [onMobile, setOnMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 600) {
      setOnMobile(true);
    }
  }, []);

  
  return (
    <>
      <div>
          <MainData />
      </div>
    </>
  );
};

export default Dashboard;
