import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HealthTips.css';
import apiClient from '../services/apiClient';

const HealthTips = () => {
  const navigate = useNavigate();
  const { getUserRole } = useAuth();
  const [healthTips, setHealthTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTip, setSelectedTip] = useState(null);
  const [showTipModal, setShowTipModal] = useState(false);

  useEffect(() => {
    fetchHealthTips();
  }, []);

  const fetchHealthTips = async () => {
    try {
      setLoading(true);
      const userRole = getUserRole();
      if (userRole !== 'Student') {
        navigate('/dashboard');
        return;
      }
      // Gọi API backend lấy health tips
      // const response = await apiClient.get('/HealthTips');
      // setHealthTips(response.data);
      // Tạm thời dùng mock nếu API chưa có
      setHealthTips(getMockHealthTips());
    } catch (error) {
      setHealthTips(getMockHealthTips());
    } finally {
      setLoading(false);
    }
  };

  const getMockHealthTips = () => {
    return [
      {
        id: 1,
        title: 'Cách duy trì sức khỏe tốt trong mùa thi',
        content: 'Mùa thi là thời điểm căng thẳng và mệt mỏi. Để duy trì sức khỏe tốt, bạn cần: 1) Ngủ đủ 7-8 tiếng mỗi đêm, 2) Ăn uống đầy đủ và cân bằng, 3) Tập thể dục nhẹ nhàng 30 phút mỗi ngày, 4) Uống đủ nước (2-3 lít/ngày), 5) Nghỉ ngơi đều đặn giữa các buổi học.',
        category: 'Sức khỏe học tập',
        tags: ['mùa thi', 'sức khỏe', 'học tập'],
        author: 'BS. Trần Thị Bình',
        publishDate: '2024-12-15',
        readCount: 156,
        imageUrl: '/assets/health-tip-study.jpg',
        difficulty: 'Easy',
        timeToRead: '5 phút'
      },
      {
        id: 2,
        title: 'Dinh dưỡng cho học sinh - Những thực phẩm cần thiết',
        content: 'Chế độ dinh dưỡng đóng vai trò quan trọng trong sự phát triển của học sinh. Các thực phẩm cần thiết bao gồm: 1) Protein từ thịt, cá, trứng, đậu, 2) Carbohydrate từ gạo, bánh mì, 3) Vitamin và khoáng chất từ rau xanh, trái cây, 4) Chất béo tốt từ dầu olive, các loại hạt. Nên ăn 3 bữa chính và 2-3 bữa phụ mỗi ngày.',
        category: 'Dinh dưỡng',
        tags: ['dinh dưỡng', 'thực phẩm', 'sức khỏe'],
        author: 'BS. Lê Văn Cường',
        publishDate: '2024-12-10',
        readCount: 203,
        imageUrl: '/assets/health-tip-nutrition.jpg',
        difficulty: 'Medium',
        timeToRead: '8 phút'
      },
      {
        id: 3,
        title: 'Tập thể dục tại nhà - Các bài tập đơn giản',
        content: 'Tập thể dục không cần phải phức tạp. Bạn có thể tập tại nhà với các bài tập đơn giản: 1) Chống đẩy (10-20 lần), 2) Squat (15-20 lần), 3) Plank (30-60 giây), 4) Jumping jack (20-30 lần), 5) Burpee (10-15 lần). Tập 3-4 lần/tuần, mỗi lần 20-30 phút.',
        category: 'Thể dục',
        tags: ['thể dục', 'tập luyện', 'sức khỏe'],
        author: 'BS. Phạm Thị Dung',
        publishDate: '2024-12-05',
        readCount: 178,
        imageUrl: '/assets/health-tip-exercise.jpg',
        difficulty: 'Easy',
        timeToRead: '6 phút'
      },
      {
        id: 4,
        title: 'Cách phòng ngừa bệnh mùa đông',
        content: 'Mùa đông dễ mắc các bệnh về đường hô hấp. Để phòng ngừa: 1) Giữ ấm cơ thể, đặc biệt là cổ, ngực, 2) Rửa tay thường xuyên với xà phòng, 3) Ăn uống đầy đủ để tăng sức đề kháng, 4) Tập thể dục đều đặn, 5) Ngủ đủ giấc, 6) Tránh tiếp xúc với người bệnh.',
        category: 'Phòng bệnh',
        tags: ['phòng bệnh', 'mùa đông', 'hô hấp'],
        author: 'BS. Hoàng Văn Em',
        publishDate: '2024-12-01',
        readCount: 234,
        imageUrl: '/assets/health-tip-winter.jpg',
        difficulty: 'Easy',
        timeToRead: '4 phút'
      },
      {
        id: 5,
        title: 'Quản lý stress và lo âu cho học sinh',
        content: 'Stress và lo âu là vấn đề phổ biến ở học sinh. Cách quản lý hiệu quả: 1) Thực hành thở sâu và thiền định, 2) Lập kế hoạch học tập hợp lý, 3) Chia sẻ với bạn bè và gia đình, 4) Tập thể dục thường xuyên, 5) Ngủ đủ giấc, 6) Tham gia các hoạt động giải trí lành mạnh.',
        category: 'Sức khỏe tâm thần',
        tags: ['stress', 'lo âu', 'tâm thần'],
        author: 'BS. Nguyễn Thị An',
        publishDate: '2024-11-25',
        readCount: 189,
        imageUrl: '/assets/health-tip-mental.jpg',
        difficulty: 'Medium',
        timeToRead: '7 phút'
      },
      {
        id: 6,
        title: 'Chăm sóc mắt cho người sử dụng máy tính nhiều',
        content: 'Sử dụng máy tính nhiều có thể gây mỏi mắt. Cách chăm sóc: 1) Áp dụng quy tắc 20-20-20 (nhìn xa 20 feet trong 20 giây sau mỗi 20 phút), 2) Điều chỉnh độ sáng màn hình phù hợp, 3) Giữ khoảng cách 50-70cm từ mắt đến màn hình, 4) Thường xuyên nhắm mắt thư giãn, 5) Khám mắt định kỳ.',
        category: 'Chăm sóc mắt',
        tags: ['mắt', 'máy tính', 'sức khỏe'],
        author: 'BS. Trần Văn Bình',
        publishDate: '2024-11-20',
        readCount: 145,
        imageUrl: '/assets/health-tip-eyes.jpg',
        difficulty: 'Easy',
        timeToRead: '5 phút'
      }
    ];
  };

  const categories = ['all', ...new Set(healthTips.map(tip => tip.category))];

  const filteredTips = healthTips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return '#38a169';
      case 'Medium':
        return '#d69e2e';
      case 'Hard':
        return '#e53e3e';
      default:
        return '#718096';
    }
  };

  const handleTipClick = (tip) => {
    setSelectedTip(tip);
    setShowTipModal(true);
  };

  if (loading) {
    return (
      <div className="health-tips-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="health-tips-container">
      <div className="tips-header">
        <h1>Mẹo sức khỏe</h1>
        <p>Khám phá các mẹo và lời khuyên để duy trì sức khỏe tốt</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm mẹo sức khỏe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Tất cả danh mục' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="tips-grid">
        {filteredTips.map((tip) => (
          <div key={tip.id} className="tip-card" onClick={() => handleTipClick(tip)}>
            <div className="tip-image">
              <img src={tip.imageUrl || '/assets/default-tip.jpg'} alt={tip.title} />
              <div className="tip-category">{tip.category}</div>
            </div>
            
            <div className="tip-content">
              <h3>{tip.title}</h3>
              <p>{tip.content.substring(0, 150)}...</p>
              
              <div className="tip-meta">
                <div className="meta-row">
                  <span className="author">
                    <i className="fas fa-user"></i>
                    {tip.author}
                  </span>
                  <span className="date">
                    <i className="fas fa-calendar"></i>
                    {new Date(tip.publishDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                <div className="meta-row">
                  <span className="reads">
                    <i className="fas fa-eye"></i>
                    {tip.readCount} lượt đọc
                  </span>
                  <span className="time">
                    <i className="fas fa-clock"></i>
                    {tip.timeToRead}
                  </span>
                </div>
                
                <div className="meta-row">
                  <span 
                    className="difficulty"
                    style={{ color: getDifficultyColor(tip.difficulty) }}
                  >
                    <i className="fas fa-star"></i>
                    {tip.difficulty}
                  </span>
                </div>
              </div>

              <div className="tip-tags">
                {tip.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTips.length === 0 && (
        <div className="no-results">
          <i className="fas fa-search"></i>
          <p>Không tìm thấy mẹo sức khỏe nào</p>
        </div>
      )}

      {/* Tip Details Modal */}
      {showTipModal && selectedTip && (
        <div className="modal-overlay" onClick={() => setShowTipModal(false)}>
          <div className="tip-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedTip.title}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowTipModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="tip-header">
                <div className="tip-image-large">
                  <img src={selectedTip.imageUrl || '/assets/default-tip.jpg'} alt={selectedTip.title} />
                </div>
                
                <div className="tip-info">
                  <div className="info-row">
                    <span className="info-label">Tác giả:</span>
                    <span className="info-value">{selectedTip.author}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Danh mục:</span>
                    <span className="info-value">{selectedTip.category}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Ngày đăng:</span>
                    <span className="info-value">{new Date(selectedTip.publishDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Thời gian đọc:</span>
                    <span className="info-value">{selectedTip.timeToRead}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Độ khó:</span>
                    <span 
                      className="info-value"
                      style={{ color: getDifficultyColor(selectedTip.difficulty) }}
                    >
                      {selectedTip.difficulty}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Lượt đọc:</span>
                    <span className="info-value">{selectedTip.readCount}</span>
                  </div>
                </div>
              </div>

              <div className="tip-content-full">
                <h4>Nội dung chi tiết</h4>
                <div className="content-text">
                  {selectedTip.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="tip-tags-full">
                <h4>Tags</h4>
                <div className="tags-container">
                  {selectedTip.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="tip-actions">
                <button className="save-btn">
                  <i className="fas fa-bookmark"></i>
                  Lưu mẹo
                </button>
                <button className="share-btn">
                  <i className="fas fa-share"></i>
                  Chia sẻ
                </button>
                <button className="print-btn">
                  <i className="fas fa-print"></i>
                  In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTips; 