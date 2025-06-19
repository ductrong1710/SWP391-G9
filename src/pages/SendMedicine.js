import React, { useState, useEffect } from 'react';
import './SendMedicine.css';

const SendMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  
  const mockMedicines = [
    {
      id: 1,
      patientName: 'Thomas Anderson',
      medicineName: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      duration: '7 days',
      dateOrdered: '2025-06-15',
      status: 'Delivered',
      deliveryAddress: '123 Oak St, Anytown, USA',
      specialInstructions: 'Take with food.'
    },
    {
      id: 2,
      patientName: 'Lisa Wong',
      medicineName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      dateOrdered: '2025-06-10',
      status: 'In Transit',
      deliveryAddress: '456 Maple Ave, Anytown, USA',
      specialInstructions: 'Take in the morning.'
    },
    {
      id: 3,
      patientName: 'Robert Martin',
      medicineName: 'Metformin',
      dosage: '1000mg',
      frequency: 'Twice daily',
      duration: '30 days',
      dateOrdered: '2025-06-12',
      status: 'Processing',
      deliveryAddress: '789 Pine Rd, Anytown, USA',
      specialInstructions: 'Take with meals.'
    }
  ];

  useEffect(() => {
    // In a real app, fetch data from API
    // For now, use mock data
    setTimeout(() => {
      setMedicines(mockMedicines);
      setLoading(false);
    }, 1000);
  }, []);

  const handleNewMedicine = () => {
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
    alert('Medicine order placed successfully!');
  };

  const handleViewDetails = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const handleCloseDetails = () => {
    setSelectedMedicine(null);
  };

  return (
    <div className="send-medicine-container">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Medical Supply Management</h1>
          <button className="btn btn-primary" onClick={handleNewMedicine}>
            Order New Medicine
          </button>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading medicine orders...</p>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Patient</th>
                      <th>Medicine</th>
                      <th>Date Ordered</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((medicine) => (
                      <tr key={medicine.id}>
                        <td>{medicine.id}</td>
                        <td>{medicine.patientName}</td>
                        <td>{medicine.medicineName} ({medicine.dosage})</td>
                        <td>{medicine.dateOrdered}</td>
                        <td>
                          <span className={`badge ${
                            medicine.status === 'Delivered' 
                              ? 'bg-success' 
                              : medicine.status === 'In Transit' 
                                ? 'bg-info' 
                                : 'bg-warning'
                          }`}>
                            {medicine.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-info me-2"
                            onClick={() => handleViewDetails(medicine)}
                          >
                            View
                          </button>
                          {medicine.status !== 'Delivered' && (
                            <button className="btn btn-sm btn-secondary">Track</button>
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

        {/* Medicine Order Details Modal */}
        {selectedMedicine && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Medicine Order Details</h5>
                  <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>Patient:</strong> {selectedMedicine.patientName}
                  </div>
                  <div className="mb-3">
                    <strong>Medicine:</strong> {selectedMedicine.medicineName}
                  </div>
                  <div className="mb-3">
                    <strong>Dosage:</strong> {selectedMedicine.dosage}
                  </div>
                  <div className="mb-3">
                    <strong>Frequency:</strong> {selectedMedicine.frequency}
                  </div>
                  <div className="mb-3">
                    <strong>Duration:</strong> {selectedMedicine.duration}
                  </div>
                  <div className="mb-3">
                    <strong>Date Ordered:</strong> {selectedMedicine.dateOrdered}
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong> {selectedMedicine.status}
                  </div>
                  <div className="mb-3">
                    <strong>Delivery Address:</strong> {selectedMedicine.deliveryAddress}
                  </div>
                  <div className="mb-3">
                    <strong>Special Instructions:</strong> {selectedMedicine.specialInstructions}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}>Close</button>
                  {selectedMedicine.status !== 'Delivered' && (
                    <button type="button" className="btn btn-primary">Update Status</button>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}

        {/* New Medicine Order Form */}
        {showForm && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Order New Medicine</h5>
                  <button type="button" className="btn-close" onClick={handleCancelForm}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmitForm}>
                    <div className="mb-3">
                      <label htmlFor="patientName" className="form-label">Patient Name</label>
                      <input type="text" className="form-control" id="patientName" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="medicineName" className="form-label">Medicine Name</label>
                      <select className="form-select" id="medicineName" required>
                        <option value="">Select a medicine</option>
                        <option value="Amoxicillin">Amoxicillin</option>
                        <option value="Lisinopril">Lisinopril</option>
                        <option value="Metformin">Metformin</option>
                        <option value="Atorvastatin">Atorvastatin</option>
                        <option value="Levothyroxine">Levothyroxine</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="dosage" className="form-label">Dosage</label>
                      <input type="text" className="form-control" id="dosage" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="frequency" className="form-label">Frequency</label>
                      <select className="form-select" id="frequency" required>
                        <option value="">Select frequency</option>
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="Four times daily">Four times daily</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="duration" className="form-label">Duration</label>
                      <input type="text" className="form-control" id="duration" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="deliveryAddress" className="form-label">Delivery Address</label>
                      <textarea className="form-control" id="deliveryAddress" rows="2" required></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="specialInstructions" className="form-label">Special Instructions (Optional)</label>
                      <textarea className="form-control" id="specialInstructions" rows="2"></textarea>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCancelForm}>Cancel</button>
                      <button type="submit" className="btn btn-primary">Place Order</button>
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

export default SendMedicine;
