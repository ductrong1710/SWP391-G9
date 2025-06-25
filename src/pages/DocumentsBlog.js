import React, { useState, useEffect } from 'react';
import './DocumentsBlog.css';
import apiClient from '../services/apiClient';

const DocumentsBlog = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const mockDocuments = [
    {
      id: 1,
      title: 'Understanding COVID-19 Vaccination',
      category: 'vaccination',
      author: 'Dr. Rebecca Simmons',
      date: '2025-05-15',
      summary: 'A comprehensive guide to COVID-19 vaccination, including types of vaccines, efficacy, and side effects.',
      content: `<h2>COVID-19 Vaccination Guide</h2>
                <p>COVID-19 vaccines have been developed to protect against the SARS-CoV-2 virus. This guide covers the different types of vaccines, their efficacy, and potential side effects.</p>
                <h3>Types of Vaccines</h3>
                <p>There are several types of COVID-19 vaccines including mRNA vaccines, viral vector vaccines, and protein subunit vaccines. Each works differently but all stimulate an immune response.</p>
                <h3>Efficacy</h3>
                <p>COVID-19 vaccines have shown high efficacy rates in preventing severe disease, hospitalization, and death. Efficacy rates vary by vaccine type and variant of the virus.</p>
                <h3>Side Effects</h3>
                <p>Common side effects include pain at the injection site, fatigue, headache, muscle pain, chills, fever, and nausea. These typically resolve within a few days.</p>`,
      imageUrl: 'https://example.com/images/covid-vaccination.jpg',
      tags: ['COVID-19', 'vaccination', 'health guidelines']
    },
    {
      id: 2,
      title: 'Heart Health: Prevention and Management',
      category: 'health',
      author: 'Dr. Michael Garcia',
      date: '2025-06-01',
      summary: 'Learn about heart disease prevention, risk factors, and lifestyle changes for better heart health.',
      content: `<h2>Heart Health: Prevention and Management</h2>
                <p>Heart disease remains one of the leading causes of death worldwide. This article discusses prevention strategies and management techniques.</p>
                <h3>Risk Factors</h3>
                <p>Common risk factors for heart disease include high blood pressure, high cholesterol, smoking, diabetes, obesity, physical inactivity, and family history.</p>
                <h3>Prevention Strategies</h3>
                <p>Prevention strategies include maintaining a healthy diet, regular exercise, avoiding tobacco, limiting alcohol consumption, and managing stress.</p>
                <h3>Management Techniques</h3>
                <p>For those diagnosed with heart disease, management may include medication, lifestyle changes, and in some cases, surgical procedures.</p>`,
      imageUrl: 'https://example.com/images/heart-health.jpg',
      tags: ['heart health', 'prevention', 'lifestyle']
    },
    {
      id: 3,
      title: 'Mental Health During a Pandemic',
      category: 'mental health',
      author: 'Dr. Jennifer Lee',
      date: '2025-04-10',
      summary: 'Strategies for maintaining mental health during difficult times like a pandemic.',
      content: `<h2>Mental Health During a Pandemic</h2>
                <p>The COVID-19 pandemic has had significant impacts on mental health worldwide. This article provides strategies for maintaining mental wellbeing during such challenging times.</p>
                <h3>Common Challenges</h3>
                <p>Challenges include isolation, anxiety about health, grief from loss, financial stress, and disruption to normal routines.</p>
                <h3>Coping Strategies</h3>
                <p>Effective coping strategies include maintaining social connections virtually, establishing routines, physical activity, mindfulness practices, and seeking professional help when needed.</p>
                <h3>Resources</h3>
                <p>Many resources are available including telehealth services, mental health hotlines, online support groups, and self-help applications.</p>`,
      imageUrl: 'https://example.com/images/mental-health.jpg',
      tags: ['mental health', 'pandemic', 'coping strategies']
    },
    {
      id: 4,
      title: 'Nutrition Basics: Eating for Health',
      category: 'nutrition',
      author: 'Dr. Sarah Thompson',
      date: '2025-03-20',
      summary: 'A guide to basic nutrition principles for maintaining good health and preventing disease.',
      content: `<h2>Nutrition Basics: Eating for Health</h2>
                <p>Proper nutrition is essential for maintaining good health and preventing various diseases. This guide covers basic nutrition principles.</p>
                <h3>Macronutrients</h3>
                <p>Macronutrients include carbohydrates, proteins, and fats. Each plays a vital role in body function and should be consumed in appropriate proportions.</p>
                <h3>Micronutrients</h3>
                <p>Micronutrients include vitamins and minerals, which are required in smaller amounts but are essential for various bodily functions.</p>
                <h3>Healthy Eating Patterns</h3>
                <p>Healthy eating patterns include consuming a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats while limiting processed foods, added sugars, and excessive salt.</p>`,
      imageUrl: 'https://example.com/images/nutrition.jpg',
      tags: ['nutrition', 'diet', 'healthy eating']
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi API backend lấy documents
        // const response = await apiClient.get('/DocumentsBlog');
        // setDocuments(response.data);
        // Tạm thời dùng mock nếu API chưa có
        setDocuments(mockDocuments);
      } catch (error) {
        setDocuments(mockDocuments);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mockDocuments]);

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

  const filteredDocuments = activeCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory);

  const renderDocumentsList = () => (
    <div className="row">
      <div className="col-md-3">
        <div className="card mb-4">
          <div className="card-header">
            Categories
          </div>
          <div className="list-group list-group-flush">
            <button 
              className={`list-group-item list-group-item-action ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('all')}
            >
              All Documents
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeCategory === 'vaccination' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('vaccination')}
            >
              Vaccination
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeCategory === 'health' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('health')}
            >
              Health
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeCategory === 'mental health' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('mental health')}
            >
              Mental Health
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeCategory === 'nutrition' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('nutrition')}
            >
              Nutrition
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-9">
        <div className="row">
          {filteredDocuments.map(document => (
            <div className="col-md-6 mb-4" key={document.id}>
              <div className="card h-100 document-card">
                <div className="card-body">
                  <h5 className="card-title">{document.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{document.author} - {document.date}</h6>
                  <p className="card-text">{document.summary}</p>
                  <div className="card-tags mb-3">
                    {document.tags.map((tag, index) => (
                      <span className="badge bg-light text-dark me-2" key={index}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleDocumentSelect(document)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocumentDetail = () => {
    if (!selectedDocument) return null;

    return (
      <div className="row">
        <div className="col-12 mb-4">
          <button 
            className="btn btn-outline-primary"
            onClick={handleBackToList}
          >
            Back to Documents
          </button>
        </div>
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">{selectedDocument.title}</h2>
              <div className="document-meta mb-4">
                <span className="me-3">
                  <strong>Author:</strong> {selectedDocument.author}
                </span>
                <span className="me-3">
                  <strong>Date:</strong> {selectedDocument.date}
                </span>
                <span>
                  <strong>Category:</strong> {selectedDocument.category}
                </span>
              </div>
              <div className="document-content" dangerouslySetInnerHTML={{ __html: selectedDocument.content }}></div>
              <div className="document-tags mt-4">
                <strong>Tags:</strong>
                {selectedDocument.tags.map((tag, index) => (
                  <span className="badge bg-light text-dark ms-2" key={index}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="documents-blog-container">
      <div className="container py-4">
        <h1 className="mb-4">Health Information & Resources</h1>
        
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading documents...</p>
          </div>
        ) : (
          selectedDocument ? renderDocumentDetail() : renderDocumentsList()
        )}
      </div>
    </div>
  );
};

export default DocumentsBlog;
