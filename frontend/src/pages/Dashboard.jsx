import React from 'react';
import { useAuth } from '../context/AuthContext';
import SpecialistDashboard from '../components/Dashboard/SpecialistDashboard';
import UserDashboard from '../components/Dashboard/UserDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'specialist') {
    return <SpecialistDashboard />;
  }

  return <UserDashboard />;
};

export default Dashboard;
