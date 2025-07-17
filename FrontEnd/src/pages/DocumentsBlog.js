import React, { useState, useEffect } from 'react';
import './DocumentsBlog.css';
import apiClient from '../services/apiClient';

const DocumentsBlog = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const mockDocuments = [
    {
      id: 1,
      title: 'Hướng dẫn khai báo sức khỏe học sinh hàng ngày',
      category: 'hướng dẫn',
      author: 'Phòng Y tế Học đường',
      date: '2025-01-15',
      summary: 'Quy trình và thủ tục khai báo tình trạng sức khỏe học sinh theo quy định mới nhất của Bộ Y tế.',
      content: `<h2>Hướng dẫn khai báo sức khỏe học sinh hàng ngày</h2>
                <p>Khai báo sức khỏe hàng ngày là nghĩa vụ và trách nhiệm của mỗi phụ huynh nhằm đảm bảo an toàn sức khỏe cho toàn thể học sinh.</p>
                <h3>Thời gian khai báo</h3>
                <p>• Hàng ngày trước 7h30 sáng<br>• Cập nhật ngay khi có thay đổi về sức khỏe<br>• Báo cáo khẩn cấp khi xuất hiện triệu chứng bất thường</p>
                <h3>Nội dung cần khai báo</h3>
                <p>• Nhiệt độ cơ thể<br>• Các triệu chứng: ho, sốt, đau họng, khó thở<br>• Tình trạng tiếp xúc với người bệnh<br>• Sử dụng thuốc và vaccine</p>`,
      imageUrl: '/assets/images/health-declaration.jpg',
      tags: ['khai báo', 'sức khỏe', 'quy định', 'hướng dẫn'],
      priority: 'high',
      downloads: 1250
    },
    {
      id: 2,
      title: 'Biện pháp phòng chống dịch bệnh trong trường học',
      category: 'y tế học đường',
      author: 'TS.BS. Nguyễn Văn A',
      date: '2025-01-10',
      summary: 'Tổng hợp các biện pháp phòng chống dịch bệnh hiệu quả trong môi trường giáo dục.',
      content: `<h2>Biện pháp phòng chống dịch bệnh trong trường học</h2>
                <p>Việc phòng chống dịch bệnh trong trường học đòi hỏi sự phối hợp chặt chẽ giữa nhà trường, gia đình và học sinh.</p>
                <h3>5K trong phòng chống dịch</h3>
                <p>• Khẩu trang - Đeo đúng cách và thường xuyên<br>• Khoảng cách - Giữ khoảng cách an toàn 1.5m<br>• Khử khuẩn - Vệ sinh tay và dụng cụ học tập<br>• Không tụ tập đông người<br>• Khai báo y tế trung thực</p>
                <h3>Quy trình xử lý khi có ca nghi nhiễm</h3>
                <p>Khi phát hiện học sinh có triệu chứng nghi nhiễm, cần thực hiện ngay các bước cách ly, thông báo và xử lý theo quy định.</p>`,
      imageUrl: '/assets/images/disease-prevention.jpg',
      tags: ['phòng chống dịch', '5K', 'an toàn', 'quy trình'],
      priority: 'high',
      downloads: 980
    },
    {
      id: 3,
      title: 'Chăm sóc sức khỏe tâm lý học sinh',
      category: 'sức khỏe tâm lý',
      author: 'ThS. Trần Thị B',
      date: '2025-01-05',
      summary: 'Những kiến thức cơ bản về chăm sóc và bảo vệ sức khỏe tâm lý của học sinh trong mùa dịch.',
      content: `<h2>Chăm sóc sức khỏe tâm lý học sinh</h2>
                <p>Sức khỏe tâm lý của học sinh bị ảnh hưởng nghiêm trọng trong thời kỳ học trực tuyến và giãn cách xã hội.</p>
                <h3>Các dấu hiệu cần chú ý</h3>
                <p>• Thay đổi hành vi bất thường<br>• Giảm hứng thú học tập<br>• Lo lắng, căng thẳng thái quá<br>• Rối loạn giấc ngủ và ăn uống</p>
                <h3>Biện pháp hỗ trợ</h3>
                <p>Tạo môi trường học tập tích cực, duy trì kết nối xã hội và có kế hoạch hỗ trợ tâm lý chuyên nghiệp khi cần thiết.</p>`,
      imageUrl: '/assets/images/mental-health.jpg',
      tags: ['tâm lý', 'học sinh', 'hỗ trợ', 'chăm sóc'],
      priority: 'medium',
      downloads: 756
    },
    {
      id: 4,
      title: 'Dinh dưỡng học đường - Bữa ăn an toàn',
      category: 'dinh dưỡng',
      author: 'CN. Lê Thị C',
      date: '2024-12-20',
      summary: 'Hướng dẫn về dinh dưỡng học đường và đảm bảo an toàn thực phẩm trong trường học.',
      content: `<h2>Dinh dưỡng học đường - Bữa ăn an toàn</h2>
                <p>Dinh dưỡng hợp lý là nền tảng cho sự phát triển toàn diện của học sinh.</p>
                <h3>Nguyên tắc dinh dưỡng học đường</h3>
                <p>• Đủ chất, đủ lượng theo độ tuổi<br>• Đảm bảo vệ sinh an toàn thực phẩm<br>• Cân bằng các nhóm chất dinh dưỡng<br>• Phù hợp với điều kiện địa phương</p>
                <h3>Thực đơn mẫu</h3>
                <p>Cung cấp các thực đơn mẫu cho bữa ăn bán trú và các nguyên tắc lựa chọn thực phẩm an toàn.</p>`,
      imageUrl: '/assets/images/school-nutrition.jpg',
      tags: ['dinh dưỡng', 'thực phẩm', 'an toàn', 'thực đơn'],
      priority: 'medium',
      downloads: 645
    },
    {
      id: 5,
      title: 'Quy trình xử lý tai nạn học đường',
      category: 'cấp cứu',
      author: 'BS. CKI Phạm Văn D',
      date: '2024-12-15',
      summary: 'Hướng dẫn các bước sơ cứu và xử lý tai nạn thường gặp trong môi trường học đường.',
      content: `<h2>Quy trình xử lý tai nạn học đường</h2>
                <p>Tai nạn học đường có thể xảy ra bất cứ lúc nào. Việc xử lý kịp thời và đúng cách rất quan trọng.</p>
                <h3>Các loại tai nạn thường gặp</h3>
                <p>• Ngã, va đập<br>• Bỏng, cắt<br>• Dị ứng thực phẩm<br>• Ngạt thở, ngất xỉu</p>
                <h3>Nguyên tắc sơ cứu</h3>
                <p>Luôn đảm bảo an toàn cho người sơ cứu, đánh giá tình trạng nạn nhân và gọi cấp cứu ngay khi cần thiết.</p>`,
      imageUrl: '/assets/images/first-aid.jpg',
      tags: ['sơ cứu', 'tai nạn', 'cấp cứu', 'an toàn'],
      priority: 'high',
      downloads: 1100
    },
    {
      id: 6,
      title: 'Kế hoạch khám sức khỏe định kỳ',
      category: 'khám sức khỏe',
      author: 'Trung tâm Y tế',
      date: '2024-12-01',
      summary: 'Lịch trình và quy trình khám sức khỏe định kỳ cho học sinh các cấp học.',
      content: `<h2>Kế hoạch khám sức khỏe định kỳ</h2>
                <p>Khám sức khỏe định kỳ giúp phát hiện sớm các vấn đề sức khỏe của học sinh.</p>
                <h3>Chu kỳ khám</h3>
                <p>• Học sinh tiểu học: 6 tháng/lần<br>• Học sinh THCS, THPT: 1 năm/lần<br>• Khám chuyên khoa khi có chỉ định</p>
                <h3>Nội dung khám</h3>
                <p>Khám tổng quát, đo chiều cao cân nặng, kiểm tra thị lực, thính lực, răng miệng và các xét nghiệm cần thiết.</p>`,
      imageUrl: '/assets/images/health-checkup.jpg',
      tags: ['khám sức khỏe', 'định kỳ', 'học sinh', 'phát hiện sớm'],
      priority: 'medium',
      downloads: 823
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/BlogDocument');
        // Map dữ liệu từ backend sang định dạng frontend
        const mappedDocs = (response.data || []).map(doc => ({
          id: doc.documentID,
          title: doc.title,
          category: doc.category,
          author: doc.author,
          date: doc.publishDate ? new Date(doc.publishDate).toISOString().split('T')[0] : '',
          summary: doc.summary,
          content: doc.content,
          imageUrl: doc.imageURL,
          tags: doc.category ? [doc.category] : [],
          priority: 'medium',
          downloads: Math.floor(Math.random() * 1000) + 100
        }));
        
        // Nếu có dữ liệu từ API, sử dụng dữ liệu đó, ngược lại dùng mock data
        setDocuments(mappedDocs.length > 0 ? mappedDocs : mockDocuments);
      } catch (error) {
        console.log('API error, fallback to mock data:', error.message);
        // Fallback về mock data khi API lỗi
        setDocuments(mockDocuments);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedDocument(null);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchCategory = activeCategory === 'all' || doc.category === activeCategory;
    const matchSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const categories = [
    { key: 'all', label: 'Tất cả tài liệu', icon: 'fas fa-list' },
    { key: 'hướng dẫn', label: 'Hướng dẫn', icon: 'fas fa-book-open' },
    { key: 'y tế học đường', label: 'Y tế học đường', icon: 'fas fa-hospital' },
    { key: 'sức khỏe tâm lý', label: 'Sức khỏe tâm lý', icon: 'fas fa-brain' },
    { key: 'dinh dưỡng', label: 'Dinh dưỡng', icon: 'fas fa-utensils' },
    { key: 'cấp cứu', label: 'Cấp cứu', icon: 'fas fa-first-aid' },
    { key: 'khám sức khỏe', label: 'Khám sức khỏe', icon: 'fas fa-stethoscope' }
  ];

  const renderDocumentsList = () => (
    <div className="documents-layout">
      {/* Header với search và controls */}
      <div className="documents-header mb-4">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="search-container">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm tài liệu, hướng dẫn..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-end">
            <div className="view-controls">
              <div className="btn-group me-3" role="group">
                <button 
                  className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                  onClick={() => setViewMode('grid')}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button 
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                  onClick={() => setViewMode('list')}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
              <span className="documents-count text-muted">
                {filteredDocuments.length} tài liệu
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Sidebar categories */}
        <div className="col-lg-3">
          <div className="card categories-card sticky-top">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-folder-open me-2"></i>Danh mục
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="categories-list">
                {categories.map(category => (
                  <button 
                    key={category.key}
                    className={`category-item ${activeCategory === category.key ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(category.key)}
                  >
                    <i className={category.icon}></i>
                    <span>{category.label}</span>
                    <span className="category-count">
                      {category.key === 'all' 
                        ? documents.length 
                        : documents.filter(doc => doc.category === category.key).length
                      }
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics card */}
          <div className="card stats-card mt-4">
            <div className="card-body">
              <h6 className="card-title">
                <i className="fas fa-chart-bar me-2"></i>Thống kê
              </h6>
              <div className="stats-item">
                <span>Tổng tài liệu:</span>
                <strong>{documents.length}</strong>
              </div>
              <div className="stats-item">
                <span>Lượt tải xuống:</span>
                <strong>{documents.reduce((sum, doc) => sum + (doc.downloads || 0), 0).toLocaleString()}</strong>
              </div>
              <div className="stats-item">
                <span>Cập nhật gần nhất:</span>
                <strong>{documents.length > 0 ? new Date(Math.max(...documents.map(d => new Date(d.date)))).toLocaleDateString('vi-VN') : 'N/A'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Documents content */}
        <div className="col-lg-9">
          {filteredDocuments.length === 0 ? (
            <div className="no-results text-center py-5">
              <i className="fas fa-file-medical fa-3x mb-3 text-muted"></i>
              <h4>Không tìm thấy tài liệu</h4>
              <p className="text-muted">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
            </div>
          ) : (
            <div className={`documents-content ${viewMode}`}>
              {viewMode === 'grid' ? (
                <div className="row g-4">
                  {filteredDocuments.map(document => (
                    <div className="col-lg-6 col-xl-4" key={document.id}>
                      <div className="document-card-modern">
                        <div className="document-priority">
                          {document.priority === 'high' && (
                            <span className="priority-badge high">
                              <i className="fas fa-exclamation-circle"></i>
                            </span>
                          )}
                        </div>
                        <div className="document-header">
                          <div className="document-category">
                            <span className="category-badge">{document.category}</span>
                          </div>
                          <div className="document-date">
                            {new Date(document.date).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        <div className="document-content">
                          <h5 className="document-title">{document.title}</h5>
                          <p className="document-summary">{document.summary}</p>
                          <div className="document-meta">
                            <span className="author">
                              <i className="fas fa-user-md"></i>
                              {document.author}
                            </span>
                            <span className="downloads">
                              <i className="fas fa-download"></i>
                              {document.downloads?.toLocaleString() || 0}
                            </span>
                          </div>
                        </div>
                        <div className="document-tags">
                          {document.tags.slice(0, 3).map((tag, index) => (
                            <span className="tag" key={index}>{tag}</span>
                          ))}
                        </div>
                        <div className="document-actions">
                          <button 
                            className="btn btn-primary btn-sm w-100"
                            onClick={() => handleDocumentSelect(document)}
                          >
                            <i className="fas fa-eye me-2"></i>Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="documents-list-view">
                  {filteredDocuments.map(document => (
                    <div className="document-list-item" key={document.id}>
                      <div className="document-info">
                        <div className="document-main">
                          <h5 className="document-title">{document.title}</h5>
                          <p className="document-summary">{document.summary}</p>
                          <div className="document-meta-list">
                            <span className="author">
                              <i className="fas fa-user-md"></i>
                              {document.author}
                            </span>
                            <span className="date">
                              <i className="fas fa-calendar"></i>
                              {new Date(document.date).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="category">
                              <i className="fas fa-tag"></i>
                              {document.category}
                            </span>
                            <span className="downloads">
                              <i className="fas fa-download"></i>
                              {document.downloads?.toLocaleString() || 0} lượt tải
                            </span>
                          </div>
                        </div>
                        <div className="document-actions-list">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleDocumentSelect(document)}
                          >
                            <i className="fas fa-eye"></i> Xem
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDocumentDetail = () => {
    if (!selectedDocument) return null;

    return (
      <div className="document-detail-container">
        {/* Header navigation */}
        <div className="detail-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <button 
              className="btn btn-outline-primary"
              onClick={handleBackToList}
            >
              <i className="fas fa-arrow-left me-2"></i>Quay lại danh sách
            </button>
            <div className="document-actions">
              <button className="btn btn-outline-success me-2">
                <i className="fas fa-download me-2"></i>Tải xuống
              </button>
              <button className="btn btn-outline-info me-2">
                <i className="fas fa-share-alt me-2"></i>Chia sẻ
              </button>
              <button className="btn btn-outline-secondary">
                <i className="fas fa-print me-2"></i>In
              </button>
            </div>
          </div>
        </div>

        {/* Document content */}
        <div className="row">
          <div className="col-lg-8">
            <div className="card document-content-card">
              <div className="card-body">
                {/* Document header */}
                <div className="document-detail-header mb-4">
                  <div className="category-priority-row mb-3">
                    <span className="category-badge-detail">{selectedDocument.category}</span>
                    {selectedDocument.priority === 'high' && (
                      <span className="priority-badge-detail">
                        <i className="fas fa-exclamation-circle me-1"></i>Ưu tiên cao
                      </span>
                    )}
                  </div>
                  <h1 className="document-title-detail">{selectedDocument.title}</h1>
                  <div className="document-meta-detail">
                    <div className="meta-item">
                      <i className="fas fa-user-md"></i>
                      <span><strong>Tác giả:</strong> {selectedDocument.author}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-calendar"></i>
                      <span><strong>Ngày đăng:</strong> {new Date(selectedDocument.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-download"></i>
                      <span><strong>Lượt tải:</strong> {selectedDocument.downloads?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Document body */}
                <div className="document-body">
                  <div className="document-content" dangerouslySetInnerHTML={{ __html: selectedDocument.content }}></div>
                </div>

                {/* Document footer */}
                <div className="document-footer mt-4">
                  <div className="tags-section">
                    <h6><strong>Từ khóa:</strong></h6>
                    <div className="tags-list">
                      {selectedDocument.tags.map((tag, index) => (
                        <span className="tag-detail" key={index}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Quick info */}
            <div className="card info-sidebar mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>Thông tin tài liệu
                </h5>
              </div>
              <div className="card-body">
                <div className="info-item">
                  <label>Danh mục:</label>
                  <span>{selectedDocument.category}</span>
                </div>
                <div className="info-item">
                  <label>Tác giả:</label>
                  <span>{selectedDocument.author}</span>
                </div>
                <div className="info-item">
                  <label>Ngày xuất bản:</label>
                  <span>{new Date(selectedDocument.date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="info-item">
                  <label>Lượt tải xuống:</label>
                  <span>{selectedDocument.downloads?.toLocaleString() || 0}</span>
                </div>
                <div className="info-item">
                  <label>Mức độ ưu tiên:</label>
                  <span className={`priority-text ${selectedDocument.priority}`}>
                    {selectedDocument.priority === 'high' ? 'Cao' : 
                     selectedDocument.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>
              </div>
            </div>

            {/* Related documents */}
            <div className="card related-docs mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-file-alt me-2"></i>Tài liệu liên quan
                </h5>
              </div>
              <div className="card-body">
                {documents
                  .filter(doc => doc.id !== selectedDocument.id && doc.category === selectedDocument.category)
                  .slice(0, 3)
                  .map(doc => (
                    <div className="related-doc-item" key={doc.id}>
                      <h6 className="related-title" onClick={() => handleDocumentSelect(doc)}>
                        {doc.title}
                      </h6>
                      <small className="text-muted">{doc.author}</small>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Contact info */}
            <div className="card contact-info">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-phone-alt me-2"></i>Liên hệ hỗ trợ
                </h5>
              </div>
              <div className="card-body">
                <div className="contact-item">
                  <strong>Phòng Y tế Học đường</strong>
                  <p>📞 (024) 3869 4321</p>
                  <p>📧 yte@school.edu.vn</p>
                </div>
                <div className="contact-item">
                  <strong>Hotline hỗ trợ</strong>
                  <p>📞 1900 1234</p>
                  <p>🕒 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="documents-blog-container">
      <div className="container-fluid py-4">
        {/* Main header */}
        <div className="main-header mb-4">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="page-title">
                <i className="fas fa-file-medical me-3"></i>
                Thông tin Y tế & Tài liệu Tham khảo
              </h1>
              <p className="page-subtitle lead">
                Trung tâm thông tin y tế học đường - Tài liệu chính thức và hướng dẫn chuyên nghiệp
              </p>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="stats-row">
          <div className="row g-3 mb-4">
            <div className="col-xl-3 col-md-6">
              <div className="card stat-card documents">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="stat-content">
                      <h5>Tài liệu</h5>
                      <p className="stat-number">{documents.length}</p>
                      <p className="stat-text">Tổng số tài liệu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card stat-card categories">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon">
                      <i className="fas fa-tags"></i>
                    </div>
                    <div className="stat-content">
                      <h5>Danh mục</h5>
                      <p className="stat-number">{categories.length - 1}</p>
                      <p className="stat-text">Chủ đề khác nhau</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card stat-card downloads">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon">
                      <i className="fas fa-download"></i>
                    </div>
                    <div className="stat-content">
                      <h5>Lượt tải</h5>
                      <p className="stat-number">{documents.reduce((sum, doc) => sum + (doc.downloads || 0), 0).toLocaleString()}</p>
                      <p className="stat-text">Tổng lượt tải</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card stat-card recent">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                      <h5>Cập nhật</h5>
                      <p className="stat-number">{documents.filter(doc => {
                        const docDate = new Date(doc.date);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return docDate >= thirtyDaysAgo;
                      }).length}</p>
                      <p className="stat-text">Trong 30 ngày</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải tài liệu y tế...</p>
          </div>
        ) : (
          selectedDocument ? renderDocumentDetail() : renderDocumentsList()
        )}
      </div>
    </div>
  );
};

export default DocumentsBlog;
