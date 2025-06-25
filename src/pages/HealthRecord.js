import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { getMockHealthChecks } from '../utils/mockData';

const HealthCheck = () => {
  const [healthChecks, setHealthChecks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/HealthCheckResult');
      setHealthChecks(response.data);
    } catch (error) {
      setHealthChecks(getMockHealthChecks());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default HealthCheck; 