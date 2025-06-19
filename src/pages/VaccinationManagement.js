import React, { useState, useEffect } from 'react';
import './VaccinationManagement.css';

const VaccinationManagement = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const mockVaccinations = [
    {
      id: 1,
      patientName: 'Emily Davis',
      vaccineType: 'COVID-19 Booster',
      dateScheduled: '2025-06-25',
      status: 'Scheduled',
      location: 'Main Hospital - Room 302',
      notes: 'Patient has history of mild reactions to vaccines.'
    },
    {
      id: 2,
      patientName: 'Michael Johnson',
      vaccineType: 'Flu Vaccine',
      dateScheduled: '2025-07-10',
      status: 'Scheduled',
      location: 'Downtown Clinic',
      notes: 'Annual flu shot.'
    },
    {
      id: 3,
      patientName: 'Sarah Williams',
      vaccineType: 'Hepatitis B',
      dateScheduled: '2025-06-05',
      status: 'Completed',
      location: 'Main Hospital - Room 205',
      notes: 'First dose of three-dose series.'
    },
    {
      id: 4,
      patientName: 'James Brown',
      vaccineType: 'Tetanus Booster',
      dateScheduled: '2025-05-20',
      status: 'Completed',
      location: 'Community Health Center',
      notes: 'Regular 10-year booster.'
    }
  ];

  useEffect(() => {
    // In a real app, fetch data from API
    // For now, use mock data
    setTimeout(() => {
      setVaccinations(mockVaccinations);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewDetails = (vaccination) => {
    setSelectedVaccination(vaccination);
  };

  const handleCloseDetails = () => {
    setSelectedVaccination(null);
  };

  const handleNewVaccination = () => {
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
    alert('Vaccination scheduled successfully!');
  };

  const getFilteredVaccinations = () => {
    if (activeTab === 'upcoming') {
      return vaccinations.filter(vaccination => vaccination.status === 'Scheduled');
    } else if (activeTab === 'completed') {
      return vaccinations.filter(vaccination => vaccination.status === 'Completed');
    }
    return vaccinations;
  };

  return (
    <div className="vaccination-management-container">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Vaccination Management</h1>
          <button className="btn btn-primary" onClick={handleNewVaccination}>
            Schedule New Vaccination
          </button>
        </div>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Vaccinations
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed Vaccinations
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Vaccinations
            </button>
          </li>
        </ul>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading vaccinations...</p>
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
                      <th>Vaccine Type</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredVaccinations().map((vaccination) => (
                      <tr key={vaccination.id}>
                        <td>{vaccination.id}</td>
                        <td>{vaccination.patientName}</td>
                        <td>{vaccination.vaccineType}</td>
                        <td>{vaccination.dateScheduled}</td>
                        <td>{vaccination.location}</td>
                        <td>
                          <span className={`badge ${
                            vaccination.status === 'Completed' 
                              ? 'bg-success' 
                              : 'bg-primary'
                          }`}>
                            {vaccination.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-info me-2"
                            onClick={() => handleViewDetails(vaccination)}
                          >
                            View
                          </button>
                          {vaccination.status !== 'Completed' && (
                            <button className="btn btn-sm btn-secondary">Edit</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Vaccination Details Modal */}
        {selectedVaccination && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Vaccination Details</h5>
                  <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>Patient:</strong> {selectedVaccination.patientName}
                  </div>
                  <div className="mb-3">
                    <strong>Vaccine Type:</strong> {selectedVaccination.vaccineType}
                  </div>
                  <div className="mb-3">
                    <strong>Date:</strong> {selectedVaccination.dateScheduled}
                  </div>
                  <div className="mb-3">
                    <strong>Location:</strong> {selectedVaccination.location}
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong> {selectedVaccination.status}
                  </div>
                  <div className="mb-3">
                    <strong>Notes:</strong> {selectedVaccination.notes}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}>Close</button>
                  {selectedVaccination.status !== 'Completed' && (
                    <button type="button" className="btn btn-primary">Mark as Completed</button>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}

        {/* New Vaccination Form */}
        {showForm && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Schedule New Vaccination</h5>
                  <button type="button" className="btn-close" onClick={handleCancelForm}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmitForm}>
                    <div className="mb-3">
                      <label htmlFor="patientName" className="form-label">Patient Name</label>
                      <input type="text" className="form-control" id="patientName" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vaccineType" className="form-label">Vaccine Type</label>
                      <select className="form-select" id="vaccineType" required>
                        <option value="">Select a vaccine</option>
                        <option value="COVID-19 Booster">COVID-19 Booster</option>
                        <option value="Flu Vaccine">Flu Vaccine</option>
                        <option value="Hepatitis B">Hepatitis B</option>
                        <option value="Tetanus Booster">Tetanus Booster</option>
                        <option value="MMR">MMR (Measles, Mumps, Rubella)</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vaccinationDate" className="form-label">Date</label>
                      <input type="date" className="form-control" id="vaccinationDate" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="location" className="form-label">Location</label>
                      <select className="form-select" id="location" required>
                        <option value="">Select a location</option>
                        <option value="Main Hospital - Room 205">Main Hospital - Room 205</option>
                        <option value="Main Hospital - Room 302">Main Hospital - Room 302</option>
                        <option value="Downtown Clinic">Downtown Clinic</option>
                        <option value="Community Health Center">Community Health Center</option>
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

export default VaccinationManagement;
