import React, { useState, useEffect, useMemo } from 'react';
import './RecordProcess.css';

const RecordProcess = () => {
  // Mock data cho hồ sơ y tế từng học sinh
  const mockRecords = useMemo(() => [
    {
      id: 1,
      studentName: 'Nguyễn Văn An',
      studentId: 'SV2022001',
      class: '10A1',
      lastUpdated: '2025-06-10',
      status: 'Đã cập nhật',
      doctorName: 'Dr. Amanda',
      summary: 'Đã tiêm chủng đầy đủ, không bệnh nền.',
      attachments: ['hoso_1.pdf']
    },
    {
      id: 2,
      studentName: 'Trần Thị Bình',
      studentId: 'SV2022045',
      class: '11A2',
      lastUpdated: '2025-06-09',
      status: 'Chưa cập nhật',
      doctorName: 'Dr. James',
      summary: 'Cần bổ sung giấy khám sức khỏe.',
      attachments: []
    },
    {
      id: 3,
      studentName: 'Lê Minh Cường',
      studentId: 'SV2022078',
      class: '10A3',
      lastUpdated: '2025-06-08',
      status: 'Đã cập nhật',
      doctorName: 'Dr. Sarah',
      summary: 'Có tiền sử dị ứng nhẹ.',
      attachments: ['hoso_3.pdf']
    },
    {
      id: 4,
      studentName: 'Phạm Thị Dung',
      studentId: 'SV2022012',
      class: '10A1',
      lastUpdated: '2025-06-07',
      status: 'Đã cập nhật',
      doctorName: 'Dr. Robert',
      summary: 'Đã cập nhật đầy đủ thông tin.',
      attachments: ['hoso_4.pdf']
    }
  ], []);

  // Danh sách học sinh mẫu cho từng lớp
  const studentsByClass = useMemo(() => ({
    '10A1': [
      { studentId: 'SV2022001', studentName: 'Nguyễn Văn An' },
      { studentId: 'SV2022012', studentName: 'Phạm Thị Dung' },
      { studentId: 'SV2022013', studentName: 'Lê Thị Hạnh' }
    ],
    '10A2': [
      { studentId: 'SV2022020', studentName: 'Trần Văn Bình' },
      { studentId: 'SV2022021', studentName: 'Ngô Thị Mai' }
    ],
    '10A3': [
      { studentId: 'SV2022078', studentName: 'Lê Minh Cường' }
    ],
    '11A1': [
      { studentId: 'SV2022100', studentName: 'Phạm Văn Hòa' }
    ],
    '11A2': [
      { studentId: 'SV2022045', studentName: 'Trần Thị Bình' }
    ],
    '12A1': [
      { studentId: 'SV2023001', studentName: 'Nguyễn Văn Nam' }
    ],
    '12A2': [
      { studentId: 'SV2023002', studentName: 'Lê Thị Lan' }
    ]
  }), []);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filters, setFilters] = useState({ grade: '', className: '', status: '' });
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ summary: '', status: '', attachments: [] });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addData, setAddData] = useState({
    studentName: '',
    studentId: '',
    class: '',
    doctorName: '',
    lastUpdated: new Date().toISOString().slice(0,10),
    status: 'Chưa cập nhật',
    summary: '',
    attachments: []
  });
  const [addClass, setAddClass] = useState('');
  const [addStudentId, setAddStudentId] = useState('');

  // Lọc danh sách hồ sơ
  const getFilteredRecords = () => {
    return records.filter(record => {
      if (filters.grade && !record.class.startsWith(filters.grade)) return false;
      if (filters.className && record.class !== filters.className) return false;
      if (filters.status && record.status !== filters.status) return false;
      return true;
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setRecords(mockRecords);
      setLoading(false);
    }, 800);
  }, [mockRecords]);

  useEffect(() => {
    if (showDetail && selectedRecord) {
      setEditData({
        summary: selectedRecord.summary,
        status: selectedRecord.status,
        attachments: [...selectedRecord.attachments],
      });
      setEditMode(false);
    }
  }, [showDetail, selectedRecord]);

  // Handler
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetail(true);
  };
  const handleCloseDetail = () => {
    setSelectedRecord(null);
    setShowDetail(false);
  };

  const handleApplyFilters = () => {
    setRecords(getFilteredRecords());
  };
  const handleResetFilters = () => {
    setFilters({ grade: '', className: '', status: '' });
    setRecords(mockRecords);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAttachmentChange = (e, idx) => {
    const newAttachments = [...editData.attachments];
    newAttachments[idx] = e.target.value;
    setEditData((prev) => ({ ...prev, attachments: newAttachments }));
  };
  const handleAddAttachment = () => {
    setEditData((prev) => ({ ...prev, attachments: [...prev.attachments, ''] }));
  };
  const handleRemoveAttachment = (idx) => {
    const newAttachments = editData.attachments.filter((_, i) => i !== idx);
    setEditData((prev) => ({ ...prev, attachments: newAttachments }));
  };
  const handleSaveEdit = () => {
    setRecords((prev) => prev.map(r =>
      r.id === selectedRecord.id ? { ...r, ...editData } : r
    ));
    setSelectedRecord((prev) => prev ? { ...prev, ...editData } : prev);
    setEditMode(false);
  };
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddAttachmentChangeAdd = (e, idx) => {
    const newAttachments = [...addData.attachments];
    newAttachments[idx] = e.target.value;
    setAddData((prev) => ({ ...prev, attachments: newAttachments }));
  };
  const handleAddAttachmentAdd = () => {
    setAddData((prev) => ({ ...prev, attachments: [...prev.attachments, ''] }));
  };
  const handleRemoveAddAttachment = (idx) => {
    const newAttachments = addData.attachments.filter((_, i) => i !== idx);
    setAddData((prev) => ({ ...prev, attachments: newAttachments }));
  };
  const handleSaveAdd = () => {
    setRecords((prev) => [
      ...prev,
      {
        ...addData,
        id: prev.length ? Math.max(...prev.map(r => r.id)) + 1 : 1
      }
    ]);
    setShowAddModal(false);
    setAddData({
      studentName: '',
      studentId: '',
      class: '',
      doctorName: '',
      lastUpdated: new Date().toISOString().slice(0,10),
      status: 'Chưa cập nhật',
      summary: '',
      attachments: []
    });
  };

  const availableStudents = useMemo(() => {
    if (!addClass) return [];
    const all = studentsByClass[addClass] || [];
    // Lọc học sinh đã có hồ sơ
    return all.filter(s => !records.some(r => r.studentId === s.studentId));
  }, [addClass, records, studentsByClass]);

  // Card tổng quan
  const total = records.length;
  const updated = records.filter(r => r.status === 'Đã cập nhật').length;
  const notUpdated = records.filter(r => r.status === 'Chưa cập nhật').length;

  const handleOpenAddModal = () => {
    setAddClass(filters.className || '');
    setAddStudentId('');
    setAddData({
      studentName: '',
      studentId: '',
      class: '',
      doctorName: '',
      lastUpdated: new Date().toISOString().slice(0,10),
      status: 'Chưa cập nhật',
      summary: '',
      attachments: []
    });
    setShowAddModal(true);
  };

  const handleAddClassChange = (e) => {
    setAddClass(e.target.value);
    setAddStudentId('');
    setAddData((prev) => ({ ...prev, class: e.target.value, studentId: '', studentName: '' }));
  };
  const handleAddStudentChange = (e) => {
    const studentId = e.target.value;
    setAddStudentId(studentId);
    const student = (studentsByClass[addClass] || []).find(s => s.studentId === studentId);
    setAddData((prev) => ({
      ...prev,
      studentId,
      studentName: student ? student.studentName : ''
    }));
  };

  return (
    <div className="record-process-container">
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Hồ sơ y tế theo lớp</h1>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <i className="fas fa-plus me-2"></i>Thêm hồ sơ
          </button>
        </div>
        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card health-stat-card">
              <div className="card-body">
                <h5 className="card-title">Tổng số hồ sơ</h5>
                <p className="card-number">{total}</p>
                <p className="card-text">Học sinh</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card health-stat-card">
              <div className="card-body">
                <h5 className="card-title">Đã cập nhật</h5>
                <p className="card-number">{updated}</p>
                <p className="card-text">Hồ sơ</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card health-stat-card">
              <div className="card-body">
                <h5 className="card-title">Chưa cập nhật</h5>
                <p className="card-number">{notUpdated}</p>
                <p className="card-text">Hồ sơ</p>
              </div>
            </div>
          </div>
        </div>
        {/* Filter Card */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Lọc hồ sơ y tế</h5>
            <div className="row">
              <div className="col-md-3 mb-2">
                <select 
                  id="grade" 
                  className="form-select"
                  value={filters.grade}
                  onChange={e => setFilters({...filters, grade: e.target.value})}
                >
                  <option value="">Chọn khối</option>
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <select 
                  id="className" 
                  className="form-select"
                  value={filters.className}
                  onChange={e => setFilters({...filters, className: e.target.value})}
                >
                  <option value="">Chọn lớp</option>
                  <option value="10A1">10A1</option>
                  <option value="10A2">10A2</option>
                  <option value="10A3">10A3</option>
                  <option value="11A1">11A1</option>
                  <option value="11A2">11A2</option>
                  <option value="12A1">12A1</option>
                  <option value="12A2">12A2</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <select 
                  id="status" 
                  className="form-select"
                  value={filters.status}
                  onChange={e => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">Trạng thái</option>
                  <option value="Đã cập nhật">Đã cập nhật</option>
                  <option value="Chưa cập nhật">Chưa cập nhật</option>
                </select>
              </div>
              <div className="col-md-3 mb-2">
                <div className="d-flex">
                  <button className="btn btn-primary flex-grow-1 me-2" onClick={handleApplyFilters}>
                    <i className="fas fa-search me-2"></i>Lọc
                  </button>
                  <button className="btn btn-secondary" onClick={handleResetFilters}>
                    <i className="fas fa-redo"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Table */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải dữ liệu hồ sơ...</p>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Mã học sinh</th>
                      <th>Họ tên</th>
                      <th>Lớp</th>
                      <th>Bác sĩ phụ trách</th>
                      <th>Ngày cập nhật</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length > 0 ? (
                      records.map((record) => (
                        <tr key={record.id}>
                          <td>{record.id}</td>
                          <td>{record.studentId}</td>
                          <td>{record.studentName}</td>
                          <td>{record.class}</td>
                          <td>{record.doctorName}</td>
                          <td>{record.lastUpdated}</td>
                          <td>
                            <span className={`badge ${record.status === 'Đã cập nhật' ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {record.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-info me-2"
                              onClick={() => handleViewDetails(record)}
                            >
                              <i className="fas fa-eye me-1"></i>Xem
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-3">
                          <p className="mb-0 text-muted">Không có dữ liệu hồ sơ nào phù hợp với điều kiện lọc</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Modal chi tiết hồ sơ */}
        {showDetail && selectedRecord && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Chi tiết hồ sơ y tế</h5>
                  <button type="button" className="btn-close" onClick={handleCloseDetail}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>Mã học sinh:</strong> {selectedRecord.studentId}
                  </div>
                  <div className="mb-3">
                    <strong>Họ tên:</strong> {selectedRecord.studentName}
                  </div>
                  <div className="mb-3">
                    <strong>Lớp:</strong> {selectedRecord.class}
                  </div>
                  <div className="mb-3">
                    <strong>Bác sĩ phụ trách:</strong> {selectedRecord.doctorName}
                  </div>
                  <div className="mb-3">
                    <strong>Ngày cập nhật:</strong> {selectedRecord.lastUpdated}
                  </div>
                  <div className="mb-3">
                    <strong>Trạng thái:</strong> {!editMode ? (
                      <span className={`badge ${selectedRecord.status === 'Đã cập nhật' ? 'bg-success' : 'bg-warning text-dark'}`}>{selectedRecord.status}</span>
                    ) : (
                      <select className="form-select" name="status" value={editData.status} onChange={handleEditChange}>
                        <option value="Đã cập nhật">Đã cập nhật</option>
                        <option value="Chưa cập nhật">Chưa cập nhật</option>
                      </select>
                    )}
                  </div>
                  <div className="mb-3">
                    <strong>Tóm tắt:</strong> {!editMode ? (
                      selectedRecord.summary
                    ) : (
                      <textarea className="form-control" name="summary" value={editData.summary} onChange={handleEditChange} rows={3} />
                    )}
                  </div>
                  <div className="mb-3">
                    <strong>Tệp đính kèm:</strong>
                    {!editMode ? (
                      <ul>
                        {selectedRecord.attachments.length > 0 ? (
                          selectedRecord.attachments.map((file, idx) => (
                            <li key={idx}>
                              <button type="button" className="btn btn-link p-0" style={{textDecoration: 'underline'}}>{file}</button>
                            </li>
                          ))
                        ) : (
                          <li>Không có</li>
                        )}
                      </ul>
                    ) : (
                      <div>
                        {editData.attachments.map((file, idx) => (
                          <div className="input-group mb-2" key={idx}>
                            <input type="text" className="form-control" value={file} onChange={e => handleAttachmentChange(e, idx)} placeholder="Tên file..." />
                            <button className="btn btn-danger" type="button" onClick={() => handleRemoveAttachment(idx)}>&times;</button>
                          </div>
                        ))}
                        <button className="btn btn-outline-primary btn-sm" type="button" onClick={handleAddAttachment}>Thêm tệp</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  {!editMode ? (
                    <button type="button" className="btn btn-warning" onClick={() => setEditMode(true)}>Cập nhật</button>
                  ) : (
                    <>
                      <button type="button" className="btn btn-success" onClick={handleSaveEdit}>Lưu</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Hủy</button>
                    </>
                  )}
                  <button type="button" className="btn btn-secondary" onClick={handleCloseDetail}>Đóng</button>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}
        {/* Modal thêm hồ sơ */}
        {showAddModal && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thêm hồ sơ y tế mới</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Chọn lớp</label>
                    <select className="form-select" value={addClass} onChange={handleAddClassChange}>
                      <option value="">Chọn lớp</option>
                      {Object.keys(studentsByClass).map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Chọn học sinh</label>
                    <select className="form-select" value={addStudentId} onChange={handleAddStudentChange} disabled={!addClass}>
                      <option value="">Chọn học sinh</option>
                      {availableStudents.map(s => (
                        <option key={s.studentId} value={s.studentId}>{s.studentName} ({s.studentId})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bác sĩ phụ trách</label>
                    <input type="text" className="form-control" name="doctorName" value={addData.doctorName} onChange={handleAddChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Trạng thái</label>
                    <select className="form-select" name="status" value={addData.status} onChange={handleAddChange}>
                      <option value="Đã cập nhật">Đã cập nhật</option>
                      <option value="Chưa cập nhật">Chưa cập nhật</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tóm tắt</label>
                    <textarea className="form-control" name="summary" value={addData.summary} onChange={handleAddChange} rows={3} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tệp đính kèm</label>
                    {addData.attachments.map((file, idx) => (
                      <div className="input-group mb-2" key={idx}>
                        <input type="text" className="form-control" value={file} onChange={e => handleAddAttachmentChangeAdd(e, idx)} placeholder="Tên file..." />
                        <button className="btn btn-danger" type="button" onClick={() => handleRemoveAddAttachment(idx)}>&times;</button>
                      </div>
                    ))}
                    <button className="btn btn-outline-primary btn-sm" type="button" onClick={handleAddAttachmentAdd}>Thêm tệp</button>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success" onClick={handleSaveAdd} disabled={!addClass || !addStudentId}>Lưu</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
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

export default RecordProcess;
