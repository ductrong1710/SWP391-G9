import React, { useState, useEffect } from 'react';
import './RecordProcess.css';

const RecordProcess = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockRecords = [
    {
      id: 1,
      patientName: 'David Chen',
      patientId: 'P10045',
      dateCreated: '2025-01-15',
      lastUpdated: '2025-06-10',
      recordType: 'Medical History',
      doctorName: 'Dr. Amanda Patel',
      summary: 'Complete medical history including allergies, past surgeries, and family history.',
      attachments: ['history.pdf', 'family_history.pdf']
    },
    {
      id: 2,
      patientName: 'David Chen',
      patientId: 'P10045',
      dateCreated: '2025-05-20',
      lastUpdated: '2025-05-20',
      recordType: 'Laboratory Results',
      doctorName: 'Dr. James Wilson',
      summary: 'Blood work results showing normal CBC, liver function, and kidney function.',
      attachments: ['lab_results_may2025.pdf']
    },
    {
      id: 3,
      patientName: 'Maria Rodriguez',
      patientId: 'P10078',
      dateCreated: '2025-04-05',
      lastUpdated: '2025-06-12',
      recordType: 'Consultation Notes',
      doctorName: 'Dr. Sarah Kim',
      summary: 'Follow-up consultation for hypertension management.',
      attachments: ['consultation_notes.pdf', 'bp_readings.xlsx']
    },
    {
      id: 4,
      patientName: 'John Smith',
      patientId: 'P10023',
      dateCreated: '2025-06-01',
      lastUpdated: '2025-06-01',
      recordType: 'Radiology Report',
      doctorName: 'Dr. Robert Johnson',
      summary: 'Chest X-ray showing no abnormalities.',
      attachments: ['xray_report.pdf', 'xray_image.jpg']
    }
  ];

  useEffect(() => {
    // In a real app, fetch data from API
    // For now, use mock data
    setTimeout(() => {
      setRecords(mockRecords);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedRecord(null);
    setViewMode('list');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRecords = records.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderListView = () => (
    <>
      <div className="card mb-4">
        <div className="card-body">
          <div className="input-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by patient name, ID, record type, or doctor"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="btn btn-outline-primary">
              <i className="bi bi-search"></i> Search
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Patient</th>
                  <th>Patient ID</th>
                  <th>Record Type</th>
                  <th>Last Updated</th>
                  <th>Doctor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.patientName}</td>
                    <td>{record.patientId}</td>
                    <td>{record.recordType}</td>
                    <td>{record.lastUpdated}</td>
                    <td>{record.doctorName}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleViewDetails(record)}
                      >
                        View
                      </button>
                      <button className="btn btn-sm btn-secondary">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderDetailView = () => {
    if (!selectedRecord) return null;

    return (
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Medical Record Details</h5>
          <button className="btn btn-sm btn-outline-primary" onClick={handleBackToList}>
            Back to List
          </button>
        </div>
        <div className="card-body">
          <div className="record-header mb-4">
            <h4>{selectedRecord.recordType}</h4>
            <div className="d-flex justify-content-between flex-wrap">
              <div>
                <p className="mb-1"><strong>Patient:</strong> {selectedRecord.patientName}</p>
                <p className="mb-1"><strong>Patient ID:</strong> {selectedRecord.patientId}</p>
                <p className="mb-1"><strong>Doctor:</strong> {selectedRecord.doctorName}</p>
              </div>
              <div>
                <p className="mb-1"><strong>Date Created:</strong> {selectedRecord.dateCreated}</p>
                <p className="mb-1"><strong>Last Updated:</strong> {selectedRecord.lastUpdated}</p>
                <p className="mb-1"><strong>Record ID:</strong> {selectedRecord.id}</p>
              </div>
            </div>
          </div>

          <div className="record-content mb-4">
            <h5>Summary</h5>
            <p>{selectedRecord.summary}</p>
          </div>

          <div className="record-attachments">
            <h5>Attachments</h5>
            <div className="list-group">
              {selectedRecord.attachments.map((attachment, index) => (
                <a href="#" className="list-group-item list-group-item-action" key={index}>
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">{attachment}</h6>
                    <small>Download</small>
                  </div>
                  <small className="text-muted">
                    {attachment.endsWith('.pdf') ? 'PDF Document' : 
                     attachment.endsWith('.xlsx') ? 'Excel Spreadsheet' : 
                     attachment.endsWith('.jpg') || attachment.endsWith('.png') ? 'Image' : 
                     'Document'}
                  </small>
                </a>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-outline-secondary">Print Record</button>
            <button className="btn btn-primary">Request Update</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="record-process-container">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Medical Records</h1>
          <div>
            <button className="btn btn-outline-primary me-2">
              Upload New Record
            </button>
            <button className="btn btn-primary">
              Request Medical Record
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading medical records...</p>
          </div>
        ) : (
          viewMode === 'list' ? renderListView() : renderDetailView()
        )}
      </div>
    </div>
  );
};

export default RecordProcess;
