import React, { useState, useEffect } from 'react';
import './HealthCheckManagement.css';

const HealthCheckManagement = () => {
  const [healthChecks, setHealthChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHealthCheck, setSelectedHealthCheck] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const mockHealthChecks = [
    {
      id: 1,
      patientName: 'John Doe',
      date: '2025-05-15',
      checkupType: 'Annual Physical',
      doctorName: 'Dr. Sarah Wilson',
      status: 'Completed',
      results: 'Normal blood pressure, healthy BMI, normal cholesterol levels.'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      date: '2025-06-10',
      checkupType: 'Blood Test',
      doctorName: 'Dr. Michael Chen',
      status: 'Pending Results',
      results: 'Awaiting lab results.'
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      date: '2025-06-20',
      checkupType: 'Cardiovascular Screening',
      doctorName: 'Dr. Lisa Carter',
      status: 'Scheduled',
      results: 'Not available yet.'
    }
  ];

  useEffect(() => {
    // In a real app, fetch data from API
    // For now, use mock data
    setTimeout(() => {
      setHealthChecks(mockHealthChecks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewDetails = (healthCheck) => {
    setSelectedHealthCheck(healthCheck);
  };

  const handleCloseDetails = () => {
    setSelectedHealthCheck(null);
  };

  const handleNewHealthCheck = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // In a real app, send data to API
    // For now, just close the form
    setShowForm(false);
    alert('Health check scheduled successfully!');
  };

  return (
    <div className="health-check-management-container">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Health Check Management</h1>
          <button className="btn btn-primary" onClick={handleNewHealthCheck}>
            Schedule New Health Check
          </button>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading health checks...</p>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Doctor</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthChecks.map((healthCheck) => (
                      <tr key={healthCheck.id}>
                        <td>{healthCheck.id}</td>
                        <td>{healthCheck.patientName}</td>
                        <td>{healthCheck.date}</td>
                        <td>{healthCheck.checkupType}</td>
                        <td>{healthCheck.doctorName}</td>
                        <td>
                          <span className={`badge ${
                            healthCheck.status === 'Completed' 
                              ? 'bg-success' 
                              : healthCheck.status === 'Pending Results' 
                                ? 'bg-warning' 
                                : 'bg-primary'
                          }`}>
                            {healthCheck.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-info me-2"
                            onClick={() => handleViewDetails(healthCheck)}
                          >
                            View
                          </button>
                          <button className="btn btn-sm btn-secondary">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Health Check Details Modal */}
        {selectedHealthCheck && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Health Check Details</h5>
                  <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>Patient:</strong> {selectedHealthCheck.patientName}
                  </div>
                  <div className="mb-3">
                    <strong>Date:</strong> {selectedHealthCheck.date}
                  </div>
                  <div className="mb-3">
                    <strong>Type:</strong> {selectedHealthCheck.checkupType}
                  </div>
                  <div className="mb-3">
                    <strong>Doctor:</strong> {selectedHealthCheck.doctorName}
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong> {selectedHealthCheck.status}
                  </div>
                  <div className="mb-3">
                    <strong>Results:</strong> {selectedHealthCheck.results}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}>Close</button>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}

        {/* New Health Check Form */}
        {showForm && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Schedule New Health Check</h5>
                  <button type="button" className="btn-close" onClick={handleCancelForm}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmitForm}>
                    <div className="mb-3">
                      <label htmlFor="patientName" className="form-label">Patient Name</label>
                      <input type="text" className="form-control" id="patientName" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="checkupDate" className="form-label">Date</label>
                      <input type="date" className="form-control" id="checkupDate" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="checkupType" className="form-label">Type</label>
                      <select className="form-select" id="checkupType" required>
                        <option value="">Select a type</option>
                        <option value="Annual Physical">Annual Physical</option>
                        <option value="Blood Test">Blood Test</option>
                        <option value="Cardiovascular Screening">Cardiovascular Screening</option>
                        <option value="Diabetes Screening">Diabetes Screening</option>
                        <option value="Vision Test">Vision Test</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="doctorName" className="form-label">Doctor</label>
                      <select className="form-select" id="doctorName" required>
                        <option value="">Select a doctor</option>
                        <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
                        <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                        <option value="Dr. Lisa Carter">Dr. Lisa Carter</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="notes" className="form-label">Notes (Optional)</label>
                      <textarea className="form-control" id="notes" rows="3"></textarea>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCancelForm}>Cancel</button>
                      <button type="submit" className="btn btn-primary">Schedule</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheckManagement;
