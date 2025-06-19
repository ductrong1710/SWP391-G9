import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // This effect runs once when the component mounts
  useEffect(() => {
    // If there's a hash in the URL (e.g., #about), scroll to that section
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Otherwise scroll to the top
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="home-container">
      <section id="home" className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Giải pháp y tế toàn diện cho cộng đồng</h1>
          <p className="hero-desc">
            HealthConnect kết nối bạn với dịch vụ chăm sóc sức khỏe chất lượng cao,
            từ khám bệnh đến tiêm chủng và quản lý hồ sơ y tế.
          </p>
        </div>
      </section>

      <section id="services" className="health-docs-section">
        <div style={{ maxWidth: "1100px", padding: "0 32px" }}>
          <h2 className="section-title">Các dịch vụ chính</h2>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-file-medical"></i>
              </div>
              <h3>Khai báo y tế</h3>
              <p>Khai báo thông tin sức khỏe trực tuyến, giúp theo dõi và phòng ngừa dịch bệnh hiệu quả.</p>
              <Link to="/health-declaration" className="service-link">Khai báo ngay <i className="fas fa-arrow-right"></i></Link>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-stethoscope"></i>
              </div>
              <h3>Khám sức khỏe định kỳ</h3>
              <p>Đặt lịch khám sức khỏe định kỳ với các bác sĩ chuyên khoa có kinh nghiệm.</p>
              <Link to="/health-check-management" className="service-link">Đặt lịch khám <i className="fas fa-arrow-right"></i></Link>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-syringe"></i>
              </div>
              <h3>Tiêm chủng vắc-xin</h3>
              <p>Đăng ký tiêm chủng vắc-xin cho bản thân và gia đình một cách dễ dàng, nhanh chóng.</p>
              <Link to="/vaccination-management" className="service-link">Đăng ký tiêm chủng <i className="fas fa-arrow-right"></i></Link>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-pills"></i>
              </div>
              <h3>Đặt thuốc trực tuyến</h3>
              <p>Đặt thuốc theo đơn và nhận giao hàng tận nơi, đảm bảo thuốc chính hãng và tiết kiệm thời gian.</p>
              <Link to="/send-medicine" className="service-link">Đặt thuốc <i className="fas fa-arrow-right"></i></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="intro-section">
        <div className="intro-content">
          <h2 className="section-title">Về HealthConnect</h2>
          <p>
            HealthConnect là nền tảng quản lý y tế học đường hiện đại, kết nối liền mạch giữa nhà trường, phụ huynh và học sinh, mang đến giải pháp toàn diện từ khai báo hồ sơ sức khỏe, quản lý thuốc men đến xử lý sự cố y tế, tổ chức tiêm chủng và khám sức khỏe định kỳ. Với hệ thống bảo mật cao cấp nhưng vẫn đảm bảo khả năng truy cập nhanh chóng khi cần thiết, phần mềm không chỉ giúp tối ưu hóa quy trình quản lý mà còn hỗ trợ phát hiện sớm các vấn đề sức khỏe tiềm ẩn thông qua báo cáo trực quan và hệ thống cảnh báo thông minh. Health Connect là người bạn đồng hành đáng tin cậy của mỗi trường học trên hành trình kiến tạo môi trường học đường an toàn, lành mạnh - nơi sức khỏe thể chất và tinh thần của học sinh luôn được đặt lên hàng đầu.

          </p>
          <ul className="intro-features">
            <li><i className="fas fa-check-circle"></i> Đội ngũ y bác sĩ chuyên môn cao</li>
            <li><i className="fas fa-check-circle"></i> Hệ thống quản lý hồ sơ y tế hiện đại</li>
            <li><i className="fas fa-check-circle"></i> Bảo mật thông tin cá nhân tuyệt đối</li>
            <li><i className="fas fa-check-circle"></i> Tiếp cận dịch vụ y tế mọi lúc, mọi nơi</li>
          </ul>
          <a href="/about" className="btn-primary-outline">Tìm hiểu thêm</a>
        </div>
        <div className="intro-img-container">
          <img src="https://img.freepik.com/free-photo/medical-workers-covid-19-vaccination-concept-confident-professional-doctor-female-nurse-blue-scrubs-stethoscope-show-thumbs-up-assure-guarantee-best-quality-service-clinic_1258-57360.jpg"
            alt="Healthcare professionals"
            className="intro-img" />
        </div>
      </section>

      <section id="features" className="health-news-section">
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 32px" }}>
          <div className="section-header">
            <h2 className="section-title">Tin tức y tế</h2>
            <a href="/documents-blog" className="view-all">Xem tất cả <i className="fas fa-arrow-right"></i></a>
          </div>

          <div className="news-grid">
            <div className="news-card">
              <div className="news-img-container">
                <img src="https://vinmec-prod.s3.amazonaws.com/images/20220420_043151_478933_benh-thuong-gap-mua.max-1800x1800.jpg" alt="Seasonal health" />
              </div>
              <div className="news-content">
                <span className="news-category">Sức khỏe mùa</span>
                <h3>Các bệnh thường gặp trong mùa mưa và cách phòng tránh</h3>
                <p>Mùa mưa là thời điểm nhiều bệnh dịch có nguy cơ bùng phát. Tìm hiểu cách phòng tránh hiệu quả.</p>
                <a href="/documents-blog" className="news-link">Đọc tiếp <i className="fas fa-arrow-right"></i></a>
              </div>
            </div>

            <div className="news-card">
              <div className="news-img-container">
                <img src="https://vinmec-prod.s3.amazonaws.com/images/20200822_022211_446576_an-uong-lanh-manh.max-1800x1800.jpg" alt="Healthy eating" />
              </div>
              <div className="news-content">
                <span className="news-category">Dinh dưỡng</span>
                <h3>Chế độ ăn uống lành mạnh tăng cường sức đề kháng</h3>
                <p>Khám phá các loại thực phẩm và chế độ ăn giúp nâng cao sức đề kháng trong mùa dịch.</p>
                <a href="/documents-blog" className="news-link">Đọc tiếp <i className="fas fa-arrow-right"></i></a>
              </div>
            </div>

            <div className="news-card">
              <div className="news-img-container">
                <img src="https://suckhoedoisong.qltns.mediacdn.vn/Images/hkiendung/2022/06/21/2_5HDS.jpg" alt="Vaccination" />
              </div>
              <div className="news-content">
                <span className="news-category">Tiêm chủng</span>
                <h3>Lịch tiêm chủng vắc-xin cần thiết cho trẻ em</h3>
                <p>Hướng dẫn đầy đủ về các loại vắc-xin và lịch tiêm chủng quan trọng cho trẻ từ sơ sinh đến 6 tuổi.</p>
                <a href="/documents-blog" className="news-link">Đọc tiếp <i className="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>      <section id="contact" className="cta-section">
        <div className="cta-content">
          <h2>Bạn cần tư vấn y tế?</h2>
          <p>Đội ngũ y bác sĩ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
          <button className="cta-button">Liên hệ ngay</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
