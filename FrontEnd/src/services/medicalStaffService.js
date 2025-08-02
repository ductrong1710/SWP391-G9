import apiClient from './apiClient';

const medicalStaffService = {
  // Get health records with pagination and filters
  getHealthRecords: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/HealthRecord', { params });
      return response;
    } catch (error) {
      console.error('Error fetching health records:', error);
      throw error;
    }
  },

  // Get students for filter dropdown
  getStudentsForFilter: async () => {
    try {
      const response = await apiClient.get('/api/User/parent/children');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching students for filter:', error);
      return [];
    }
  },

  // Get health record statistics
  getHealthRecordStatistics: async () => {
    try {
      const response = await apiClient.get('/api/HealthRecord/statistics');
      return response.data || {
        totalRecords: 0,
        approvedRecords: 0,
        pendingReview: 0,
        criticalRecords: 0
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        totalRecords: 0,
        approvedRecords: 0,
        pendingReview: 0,
        criticalRecords: 0
      };
    }
  },

  // Approve health record
  approveHealthRecord: async (recordId) => {
    try {
      const response = await apiClient.put(`/api/HealthRecord/${recordId}/approve`);
      return response;
    } catch (error) {
      console.error('Error approving health record:', error);
      throw error;
    }
  },

  // Reject health record
  rejectHealthRecord: async (recordId, reason) => {
    try {
      const response = await apiClient.put(`/api/HealthRecord/${recordId}/reject`, { reason });
      return response;
    } catch (error) {
      console.error('Error rejecting health record:', error);
      throw error;
    }
  },

  // Export health records
  exportHealthRecords: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/HealthRecord/export', { 
        params,
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error exporting health records:', error);
      throw error;
    }
  },

  // Create new health record
  createHealthRecord: async (recordData) => {
    try {
      const response = await apiClient.post('/api/HealthRecord', recordData);
      return response;
    } catch (error) {
      console.error('Error creating health record:', error);
      throw error;
    }
  },

  // Update health record
  updateHealthRecord: async (recordId, recordData) => {
    try {
      const response = await apiClient.put(`/api/HealthRecord/${recordId}`, recordData);
      return response;
    } catch (error) {
      console.error('Error updating health record:', error);
      throw error;
    }
  },

  // Get health record by ID
  getHealthRecordById: async (recordId) => {
    try {
      const response = await apiClient.get(`/api/HealthRecord/${recordId}`);
      return response;
    } catch (error) {
      console.error('Error fetching health record:', error);
      throw error;
    }
  }
};

export default medicalStaffService; 