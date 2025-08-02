import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import './VaccinationManagement.css';
import '../components/Modal.css';

const VaccinationManagement = () => {
  const navigate = useNavigate();
  const { getUserRole, user: currentUser } = useAuth();
  const [vaccinationPlans, setVaccinationPlans] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filters, setFilters] = useState({
    scheduleDate: '',
    creatorId: '',
    grade: ''
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    PlanName: '',
    ScheduledDate: '',
    Description: '',
    Status: 'Active',
    Grade: 'Toàn trường',
  });
  const [editFormData, setEditFormData] = useState({
    id: '',
    PlanName: '',
    ScheduledDate: '',
    Description: '',
    Status: '',
    Grade: 'Toàn trường',
  });
  const [vaccineList, setVaccineList] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [planToNotify, setPlanToNotify] = useState(null);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState('');
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [addVaccineData, setAddVaccineData] = useState({ VaccineName: '', Description: '' });
  const [addVaccineLoading, setAddVaccineLoading] = useState(false);
  const [showVaccineManager, setShowVaccineManager] = useState(false);
  const [editVaccineId, setEditVaccineId] = useState(null);
  const [editVaccineData, setEditVaccineData] = useState({ VaccineName: '', Description: '' });
  const [deleteVaccineId, setDeleteVaccineId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const gradeOptions = ['Toàn trường', '6', '7', '8', '9'];
  const [availableCreators, setAvailableCreators] = useState([]);

  // Filter handlers
  const handleApplyFilters = () => {
    console.log("Applied filters:", filters);
    console.log("Filtered plans:", filteredPlans);
    console.log("All plans:", vaccinationPlans);
  };

  const handleResetFilters = () => {
    setFilters({
      scheduleDate: '',
      creatorId: '',
      grade: ''
    });
  };

  // Thống kê
  const totalStudents = vaccinationPlans.reduce((sum, plan) => sum + (plan.totalStudents || 0), 0);
  const confirmed = vaccinationPlans.reduce((sum, plan) => sum + (plan.confirmedCount || 0), 0);
  const completed = vaccinationPlans.reduce((sum, plan) => sum + (plan.completedCount || 0), 0);
  const pending = vaccinationPlans.reduce((sum, plan) => sum + (plan.pendingCount || 0), 0);
  const totalRounds = vaccinationPlans.length;

  // Debug thống kê
  console.log('=== THỐNG KÊ DEBUG ===');
  console.log('vaccinationPlans:', vaccinationPlans);
  console.log('totalStudents:', totalStudents);
  console.log('confirmed:', confirmed);
  console.log('completed:', completed);
  console.log('pending:', pending);
  console.log('totalRounds:', totalRounds);
  console.log('=== END THỐNG KÊ DEBUG ===');

  // Toast notification
  const [showToast, setShowToast] = useState(false);
  const [showDateErrorModal, setShowDateErrorModal] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState('');
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [showRecordResultsModal, setShowRecordResultsModal] = useState(false);
  const [recordResultsList, setRecordResultsList] = useState([]);
  const [showVaccinationDetailModal, setShowVaccinationDetailModal] = useState(false);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
  const [recordResultsSearch, setRecordResultsSearch] = useState('');
  const [studentsListSearch, setStudentsListSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterStatus]);

  // Thêm interval để tự động refresh dữ liệu mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // 30 giây

    return () => clearInterval(interval);
  }, []);

  // Fetch available creators
  useEffect(() => {
    apiClient.get('/User')
      .then(res => {
        console.log('Creators API Response:', res);
        console.log('Creators data:', res.data);
        setAvailableCreators(res.data);
      })
      .catch(err => {
        console.error('Creators API Error:', err);
        setAvailableCreators([]);
      });
  }, []);



  // Filter logic cho studentsList
  const filteredStudentsList = studentsList.filter(student => {
    if (!studentsListSearch.trim()) return true;
    
    const searchTerm = studentsListSearch.toLowerCase();
    const studentId = (student.userID || student.UserID || '').toLowerCase();
    const studentName = (student.name || student.Name || student.fullName || student.FullName || '').toLowerCase();
    const className = (student.className || student.ClassName || student.class || student.Class || '').toLowerCase();
    
    return studentId.includes(searchTerm) || 
           studentName.includes(searchTerm) || 
           className.includes(searchTerm);
  });

  // Filter logic giống HealthCheckManagement
  const filteredPlans = vaccinationPlans.filter(plan => {
    console.log('=== FILTER DEBUG ===');
    console.log('Current plan:', plan);
    console.log('Current filters:', filters);
    
    const matchDate = !filters.scheduleDate || (plan.scheduledDate && plan.scheduledDate.startsWith(filters.scheduleDate));
    console.log('Date match:', matchDate, 'Plan date:', plan.scheduledDate, 'Filter date:', filters.scheduleDate);
    
    // Filter theo creator - so sánh với tên hiển thị
    let matchCreator = true;
    if (filters.creatorId) {
      // Lấy tên hiển thị của creator từ availableCreators
      const creatorUser = availableCreators.find(u => 
        u.UserID === plan.creatorID || 
        u.userID === plan.creatorID ||
        u.Username === plan.creatorID ||
        u.username === plan.creatorID
      );
      
      const planCreatorDisplayName = creatorUser ? 
        (creatorUser.Username || creatorUser.username || creatorUser.FullName || creatorUser.fullName || plan.creatorID) : 
        (plan.creatorName || plan.creatorID);
      
      console.log('Creator comparison:', {
        planCreatorID: plan.creatorID,
        planCreatorName: plan.creatorName,
        planCreatorDisplayName: planCreatorDisplayName,
        filterCreator: filters.creatorId,
        creatorUser: creatorUser
      });
      
      matchCreator = planCreatorDisplayName.toString().toLowerCase().includes(filters.creatorId.toLowerCase());
      console.log('Creator match:', matchCreator);
    }
    
    // Filter theo khối
    let matchGrade = true;
    if (filters.grade) {
      const planGrade = plan.grade || plan.Grade || '';
      matchGrade = planGrade.toString().toLowerCase().includes(filters.grade.toLowerCase());
      console.log('Grade match:', matchGrade, 'Plan grade:', planGrade, 'Filter grade:', filters.grade);
    }
    
    const finalMatch = matchDate && matchCreator && matchGrade;
    console.log('Final match:', finalMatch, 'for plan ID:', plan.id);
    console.log('=== END FILTER DEBUG ===');
    
    return finalMatch;
  });

  useEffect(() => {
    if (showCreateModal) {
      console.log('Calling API: /VaccineType/with-diseases (showCreateModal)');
      apiClient.get('/VaccineType/with-diseases').then(res => {
        console.log('API Response showCreateModal:', res.data);
        console.log('First vaccine diseases showCreateModal:', res.data[0]?.diseases);
        setVaccineList(res.data);
      });
    }
  }, [showCreateModal]);

  useEffect(() => {
    if (showEditModal && vaccineList.length === 0) {
      console.log('Calling API: /VaccineType/with-diseases (showEditModal)');
      apiClient.get('/VaccineType/with-diseases').then(res => {
        console.log('API Response showEditModal:', res.data);
        console.log('First vaccine diseases showEditModal:', res.data[0]?.diseases);
        setVaccineList(res.data);
      });
    }
  }, [showEditModal]);

  useEffect(() => {
    if (notifyMessage && notifyMessage.includes('Thêm vaccine thành công')) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [notifyMessage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRole = getUserRole();
      if (userRole !== 'MedicalStaff') {
        navigate('/dashboard');
        return;
      }
      // Fetch kế hoạch tiêm chủng
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const plansResponse = await apiClient.get(`/VaccinationPlan?${params.toString()}`);
      const plans = plansResponse.data;

      // Fetch consent forms và thông tin người tạo cho mỗi plan
      const plansWithStats = await Promise.all(plans.map(async (plan) => {
        try {
          const consentResponse = await apiClient.get(`/VaccinationConsentForm/plan/${plan.vaccinationPlanID || plan.id}`);
          const consents = consentResponse.data || [];
          
          // Debug raw consent data
          console.log(`=== RAW CONSENT DATA FOR PLAN ${plan.id} ===`);
          consents.forEach((consent, index) => {
            console.log(`Consent ${index}:`, {
              id: consent.id,
              studentID: consent.studentID,
              consentStatus: consent.consentStatus,
              status: consent.status,
              statusID: consent.statusID
            });
          });
          console.log('=== END RAW CONSENT DATA ===');
          
          // Tính toán thống kê từ consent forms
          const totalStudents = consents.length;
          const confirmedCount = consents.filter(c => c.consentStatus === 'Approved').length;
          const pendingCount = consents.filter(c => c.consentStatus === 'Pending' || !c.consentStatus).length;
          
          // Tính completedCount từ VaccinationResult thay vì consentStatus
          let completedCount = 0;
          try {
            // Lấy tất cả kết quả tiêm chủng cho plan này
            const resultsResponse = await apiClient.get(`/VaccinationResult/plan/${plan.vaccinationPlanID || plan.id}`);
            const results = resultsResponse.data || [];
            
            // Đếm số kết quả có status "Completed"
            completedCount = results.filter(result => 
              result.vaccinationStatus === 'Completed' || result.VaccinationStatus === 'Completed'
            ).length;
            
            console.log(`=== VACCINATION RESULTS FOR PLAN ${plan.id} ===`);
            console.log('results:', results);
            console.log('completedCount from results:', completedCount);
            console.log('=== END VACCINATION RESULTS ===');
          } catch (error) {
            console.error(`Error fetching vaccination results for plan ${plan.id}:`, error);
            completedCount = 0;
          }
          
          // Debug thống kê cho từng plan
          console.log(`=== THỐNG KÊ PLAN ${plan.id} ===`);
          console.log('consents:', consents);
          console.log('totalStudents:', totalStudents);
          console.log('confirmedCount:', confirmedCount);
          console.log('pendingCount:', pendingCount);
          console.log('completedCount:', completedCount);
          console.log('=== END THỐNG KÊ PLAN ===');
          
          // Fetch thông tin người tạo
          let creatorInfo = null;
          if (plan.creatorID || plan.CreatorID) {
            try {
              const creatorResponse = await apiClient.get(`/User/${plan.creatorID || plan.CreatorID}`);
              creatorInfo = creatorResponse.data;
            } catch (error) {
              console.error(`Error fetching creator info for plan ${plan.id}:`, error);
            }
          }
          
          return {
            ...plan,
            totalStudents,
            confirmedCount,
            pendingCount,
            completedCount,
            creatorInfo
          };
        } catch (error) {
          console.error(`Error fetching consents for plan ${plan.vaccinationPlanID}:`, error);
          return {
            ...plan,
            totalStudents: 0,
            confirmedCount: 0,
            pendingCount: 0,
            completedCount: 0
          };
        }
      }));

      setVaccinationPlans(plansWithStats);
    } catch (err) {
      console.error('Lỗi lấy dữ liệu tiêm chủng:', err);
      // Fallback to empty array on error
      setVaccinationPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#3182ce';
      case 'Completed':
        return '#38a169';
      case 'Cancelled':
        return '#e53e3e';
      case 'Pending':
        return '#d69e2e';
      default:
        return '#718096';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Active':
        return 'Đang thực hiện';
      case 'Completed':
        return 'Hoàn thành';
      case 'Cancelled':
        return 'Đã hủy';
      case 'Pending':
        return 'Chờ thực hiện';
      default:
        return status;
    }
  };

  const getVaccinationStatusText = (status) => {
    switch (status) {
      case 'Completed':
        return 'Đã tiêm thành công';
      case 'Failed':
        return 'Tiêm không thành công';
      case 'Postponed':
        return 'Hoãn tiêm';
      case 'Refused':
        return 'Từ chối tiêm';
      case 'Pending':
        return 'Chờ tiêm';
      default:
        return status || 'Chưa ghi nhận';
    }
  };

  const getVaccinationStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#10b981'; // Green
      case 'Failed':
        return '#ef4444'; // Red
      case 'Postponed':
        return '#f59e0b'; // Yellow
      case 'Refused':
        return '#6b7280'; // Gray
      case 'Pending':
        return '#3b82f6'; // Blue
      default:
        return '#9ca3af'; // Light gray
    }
  };

  // Filter danh sách học sinh trong modal ghi nhận kết quả
  const filteredRecordResultsList = recordResultsList.filter(student => {
    if (!recordResultsSearch.trim()) return true;
    
    const searchTerm = recordResultsSearch.toLowerCase();
    const studentId = (student.userID || '').toLowerCase();
    const studentName = (student.name || '').toLowerCase();
    const status = getVaccinationStatusText(student.vaccinationStatus).toLowerCase();
    
    return studentId.includes(searchTerm) || 
           studentName.includes(searchTerm) || 
           status.includes(searchTerm);
  });



  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const CreatorID = user?.userID || user?.UserID || '';
      if (!formData.PlanName || !CreatorID) {
        setNotifyMessage('Vui lòng nhập đầy đủ tên kế hoạch và đảm bảo bạn đã đăng nhập!');
        setLoading(false);
        return;
      }
      // Kiểm tra ngày dự kiến
      if (formData.ScheduledDate) {
        const selectedDate = new Date(formData.ScheduledDate);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selectedDate < today) {
          setDateErrorMessage('Ngày dự kiến phải lớn hơn hoặc bằng hôm nay!');
          setShowDateErrorModal(true);
          setLoading(false);
          return;
        }
      }
      const newPlan = {
        PlanName: formData.PlanName.trim(),
        ScheduledDate: formData.ScheduledDate ? new Date(formData.ScheduledDate).toISOString() : null,
        Description: formData.Description,
        Status: formData.Status,
        CreatorID,
        Grade: formData.Grade,
      };
      console.log('Payload gửi lên:', newPlan);
      await apiClient.post('/VaccinationPlan', newPlan);
      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      setNotifyMessage('Có lỗi khi tạo kế hoạch tiêm chủng!');
      console.error('Error creating vaccination plan:', error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (plan) => {
    try {
      console.log('=== OPENING PLAN DETAILS ===');
      console.log('Plan object:', plan);
      console.log('Plan statistics:', {
        totalStudents: plan.totalStudents,
        confirmedCount: plan.confirmedCount,
        pendingCount: plan.pendingCount,
        completedCount: plan.completedCount
      });
      console.log('=== END PLAN DETAILS DEBUG ===');
      
      // Sử dụng plan hiện tại thay vì fetch lại để tránh mất thống kê đã tính
    setSelectedPlan(plan);
    setShowDetailsModal(true);
    } catch (error) {
      console.error('Error opening plan details:', error);
      setSelectedPlan(plan);
      setShowDetailsModal(true);
    }
  };

  const handleViewStudents = async (plan) => {
    try {
      const res = await apiClient.get(`/VaccinationConsentForm/plan/${plan.id || plan.vaccinationPlanID}`);
      // Lọc các học sinh đã xác nhận
      const confirmed = res.data.filter(f => f.consentStatus === "Approved" && f.studentID);
      // Lấy thông tin profile cho từng studentID
      const studentProfiles = await Promise.all(
        confirmed.map(async (f) => {
          try {
            const profileRes = await apiClient.get(`/Profile/user/${f.studentID}`);
            return {
              userID: f.studentID,
              name: profileRes.data?.name || profileRes.data?.Name || 'Không rõ tên',
              classID: profileRes.data?.classID || profileRes.data?.ClassID || 'Không rõ',
            };
          } catch {
            return {
              userID: f.studentID,
              name: 'Không rõ tên',
              classID: 'Không rõ',
            };
          }
        })
      );
      setStudentsList(studentProfiles);
      setShowStudentsModal(true);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách học sinh:', err);
      setStudentsList([]);
      setShowStudentsModal(true);
    }
  };

  const handleRecordResults = async (plan) => {
    try {
      console.log('=== DEBUG RECORD RESULTS ===');
      console.log('Plan:', plan);
      
      const res = await apiClient.get(`/VaccinationConsentForm/plan/${plan.id || plan.vaccinationPlanID}`);
      console.log('Consent forms response:', res.data);
      
      // Lọc các học sinh đã xác nhận
      const confirmed = res.data.filter(f => f.consentStatus === "Approved" && f.studentID);
      console.log('=== DEBUG CONFIRMED STUDENTS ===');
      console.log('All consent forms:', res.data);
      console.log('Confirmed consent forms:', confirmed);
      console.log('Confirmed count:', confirmed.length);
      console.log('=== END DEBUG CONFIRMED STUDENTS ===');
      
      // Lấy thông tin profile và kết quả tiêm chủng cho từng studentID
      const studentProfiles = await Promise.all(
        confirmed.map(async (f) => {
          try {
            const profileRes = await apiClient.get(`/Profile/user/${f.studentID}`);
            
            // Kiểm tra xem đã có kết quả tiêm chủng trong database chưa
            let existingResult = null;
            try {
              const resultRes = await apiClient.get(`/VaccinationResult/consentform/${f.id || f.ID || f.consentFormID}`);
              console.log(`API response for student ${f.studentID}:`, resultRes);
              if (resultRes.data) {
                existingResult = resultRes.data; // API trả về object, không phải array
                console.log(`Found existing result for student ${f.studentID}:`, existingResult);
                console.log(`VaccinationStatus from API:`, existingResult.vaccinationStatus || existingResult.VaccinationStatus);
              }
            } catch (resultErr) {
              console.log(`No existing result found for student ${f.studentID}:`, resultErr.message);
            }
            
            // Nếu có kết quả trong database, sử dụng dữ liệu đó
            if (existingResult) {
            return {
              userID: f.studentID,
              name: profileRes.data?.name || profileRes.data?.Name || 'Không rõ tên',
              classID: profileRes.data?.classID || profileRes.data?.ClassID || 'Không rõ',
                consentFormID: f.id || f.ID || f.consentFormID,
              status: f.status || f.statusID || 'Pending',
                vaccinationStatus: existingResult.vaccinationStatus || existingResult.VaccinationStatus || 'Pending',
                notes: existingResult.notes || existingResult.Notes || '',
                actualVaccinationDate: existingResult.actualVaccinationDate || existingResult.ActualVaccinationDate ? 
                  new Date(existingResult.actualVaccinationDate || existingResult.ActualVaccinationDate).toISOString().split('T')[0] : 
                  new Date().toISOString().split('T')[0],
                performer: existingResult.performer || existingResult.Performer || currentUser?.fullName || currentUser?.FullName || currentUser?.username || currentUser?.Username || 'Không xác định',
                postVaccinationReaction: existingResult.postVaccinationReaction || existingResult.PostVaccinationReaction || '',
                postponementReason: existingResult.postponementReason || existingResult.PostponementReason || '',
                failureReason: existingResult.failureReason || existingResult.FailureReason || '',
                refusalReason: existingResult.refusalReason || existingResult.RefusalReason || '',
                needToContactParent: existingResult.needToContactParent || existingResult.NeedToContactParent || false
              };
            } else {
              // Nếu chưa có kết quả, sử dụng default values
              return {
                userID: f.studentID,
                name: profileRes.data?.name || profileRes.data?.Name || 'Không rõ tên',
                classID: profileRes.data?.classID || profileRes.data?.ClassID || 'Không rõ',
                consentFormID: f.id || f.ID || f.consentFormID,
                status: f.status || f.statusID || 'Pending',
                vaccinationStatus: 'Pending', // Chưa ghi kết quả thì là Pending
              notes: '',
              actualVaccinationDate: new Date().toISOString().split('T')[0], // Default to today
              performer: currentUser?.fullName || currentUser?.FullName || currentUser?.username || currentUser?.Username || 'Không xác định',
              postVaccinationReaction: '',
              postponementReason: '',
              failureReason: '',
              refusalReason: '',
              needToContactParent: false
            };
            }
          } catch {
            return {
              userID: f.studentID,
              name: 'Không rõ tên',
              classID: 'Không rõ',
              consentFormID: f.id || f.ID || f.consentFormID,
              status: f.status || f.statusID || 'Pending',
              vaccinationStatus: 'Pending', // Chưa ghi kết quả thì là Pending
              notes: '',
              actualVaccinationDate: new Date().toISOString().split('T')[0], // Default to today
              performer: currentUser?.fullName || currentUser?.FullName || currentUser?.username || currentUser?.Username || 'Không xác định',
              postVaccinationReaction: '',
              postponementReason: '',
              failureReason: '',
              refusalReason: '',
              needToContactParent: false
            };
          }
        })
      );
      console.log('Student profiles created:', studentProfiles);
      console.log('Final vaccination statuses:');
      studentProfiles.forEach((student, index) => {
        console.log(`Student ${index + 1} (${student.name}): ${student.vaccinationStatus}`);
      });
      
      // Kiểm tra xem có học sinh nào đã có dữ liệu trong database không
      const studentsWithData = studentProfiles.filter(student => 
        student.vaccinationStatus !== 'Completed' || 
        student.notes || 
        student.postVaccinationReaction || 
        student.postponementReason || 
        student.failureReason || 
        student.refusalReason
      );
      
      if (studentsWithData.length > 0) {
        console.log('Found students with existing data:', studentsWithData);
        setNotifyMessage(`Đã tìm thấy ${studentsWithData.length} học sinh có dữ liệu đã lưu. Dữ liệu sẽ được hiển thị trong form.`);
        setTimeout(() => setNotifyMessage(''), 3000);
      }
      
      setSelectedPlan(plan);
      setRecordResultsList(studentProfiles);
      setShowRecordResultsModal(true);
      
      // Không refresh data ở đây để tránh mất thống kê đã tính
      console.log('=== RECORD RESULTS MODAL DEBUG ===');
      console.log('Student profiles count:', studentProfiles.length);
      console.log('Student profiles:', studentProfiles);
      console.log('=== END RECORD RESULTS MODAL DEBUG ===');
    } catch (err) {
      console.error('Lỗi khi lấy danh sách học sinh để ghi nhận kết quả:', err);
      setRecordResultsList([]);
      setShowRecordResultsModal(true);
    }
  };

  const handleSaveVaccinationResults = async () => {
    try {
      console.log('=== DEBUG SAVE VACCINATION RESULTS ===');
      console.log('recordResultsList:', recordResultsList);
      console.log('selectedPlan:', selectedPlan);
      
      const resultsToSave = recordResultsList.map((student, index) => {
        console.log(`Processing student ${index}:`, student);
        console.log(`Student ${index} details:`, {
        consentFormID: student.consentFormID,
        vaccinationStatus: student.vaccinationStatus,
          actualVaccinationDate: student.actualVaccinationDate,
          performer: student.performer,
          postVaccinationReaction: student.postVaccinationReaction,
          notes: student.notes
        });
        const result = {
          ConsentFormID: student.consentFormID, // Chú ý: viết hoa chữ cái đầu
          VaccineTypeID: selectedPlan?.vaccineTypeID || selectedPlan?.VaccineTypeID || selectedPlan?.vaccineType?.id || selectedPlan?.VaccineType?.ID || 'VC0001', // Default vaccine type
          ActualVaccinationDate: student.vaccinationStatus === 'Completed' ? student.actualVaccinationDate : null,
          Performer: student.vaccinationStatus === 'Completed' ? student.performer : null,
          PostVaccinationReaction: student.vaccinationStatus === 'Completed' ? student.postVaccinationReaction : null,
          Notes: student.notes,
          NeedToContactParent: student.needToContactParent || false,
          VaccinationStatus: student.vaccinationStatus || 'Pending', // Default to Pending if not set
          PostponementReason: student.vaccinationStatus === 'Postponed' ? student.postponementReason : null,
          FailureReason: student.vaccinationStatus === 'Failed' ? student.failureReason : null,
          RefusalReason: student.vaccinationStatus === 'Refused' ? student.refusalReason : null,
          RecordedBy: currentUser?.fullName || currentUser?.FullName || currentUser?.username || currentUser?.Username || 'Không xác định'
        };
        console.log('Result to save:', result);
        return result;
      });

      console.log('All results to save:', resultsToSave);

      // Save each result
      console.log('Sending requests to:', '/VaccinationResult/record');
      
      // Kiểm tra xem backend có hoạt động không
      try {
        console.log('Testing backend connection...');
        const testResponse = await apiClient.get('/VaccinationResult');
        console.log('Backend is working, vaccination results:', testResponse.data);
        
        // Kiểm tra vaccine types
        const vaccineResponse = await apiClient.get('/VaccineType/with-diseases');
        console.log('Available vaccine types:', vaccineResponse.data);
      } catch (error) {
        console.error('Backend connection test failed:', error);
        alert('Không thể kết nối đến backend. Vui lòng kiểm tra lại!');
        return;
      }
      
      // Thử gọi từng API một thay vì Promise.all
      for (let i = 0; i < resultsToSave.length; i++) {
        const result = resultsToSave[i];
        try {
          console.log(`Sending result ${i + 1}:`, result);
          console.log(`Result ${i + 1} details:`, {
            ConsentFormID: result.ConsentFormID,
            VaccineTypeID: result.VaccineTypeID,
            VaccinationStatus: result.VaccinationStatus,
            ActualVaccinationDate: result.ActualVaccinationDate,
            Performer: result.Performer,
            PostVaccinationReaction: result.PostVaccinationReaction,
            Notes: result.Notes,
            RecordedBy: result.RecordedBy,
            PostponementReason: result.PostponementReason,
            FailureReason: result.FailureReason,
            RefusalReason: result.RefusalReason
          });
          
          // Thử gọi API với dữ liệu đơn giản hơn
          const simpleResult = {
            ConsentFormID: result.ConsentFormID,
            VaccineTypeID: result.VaccineTypeID,
            VaccinationStatus: result.VaccinationStatus,
            ActualVaccinationDate: result.ActualVaccinationDate,
            Performer: result.Performer,
            Notes: result.Notes || '',
            RecordedBy: result.RecordedBy
          };
          
          // Validate dữ liệu trước khi gửi
          if (!simpleResult.ConsentFormID) {
            throw new Error('ConsentFormID is required');
          }
          if (!simpleResult.VaccineTypeID) {
            throw new Error('VaccineTypeID is required');
          }
          if (!simpleResult.VaccinationStatus) {
            throw new Error('VaccinationStatus is required');
          }
          if (simpleResult.VaccinationStatus === "Completed" && !simpleResult.ActualVaccinationDate) {
            throw new Error('ActualVaccinationDate is required for completed vaccinations');
          }
          
          console.log(`Simple result ${i + 1}:`, simpleResult);
          console.log('Full URL will be:', apiClient.defaults.baseURL + '/VaccinationResult/record');
          
          // Gửi đầy đủ dữ liệu thay vì chỉ tối thiểu
          const fullResult = {
            ConsentFormID: simpleResult.ConsentFormID,
            VaccineTypeID: simpleResult.VaccineTypeID,
            VaccinationStatus: simpleResult.VaccinationStatus,
            ActualVaccinationDate: simpleResult.ActualVaccinationDate,
            Performer: simpleResult.Performer,
            PostVaccinationReaction: result.PostVaccinationReaction, // Lấy từ result gốc
            Notes: simpleResult.Notes,
            RecordedBy: simpleResult.RecordedBy,
            // Thêm các trường reason theo status
            PostponementReason: result.PostponementReason,
            FailureReason: result.FailureReason,
            RefusalReason: result.RefusalReason
          };
          
          // Đảm bảo các trường không bị undefined
          if (fullResult.Performer === undefined || fullResult.Performer === null) {
            fullResult.Performer = '';
          }
          if (fullResult.PostVaccinationReaction === undefined || fullResult.PostVaccinationReaction === null) {
            fullResult.PostVaccinationReaction = '';
          }
          if (fullResult.Notes === undefined || fullResult.Notes === null) {
            fullResult.Notes = '';
          }
          if (fullResult.PostponementReason === undefined || fullResult.PostponementReason === null) {
            fullResult.PostponementReason = '';
          }
          if (fullResult.FailureReason === undefined || fullResult.FailureReason === null) {
            fullResult.FailureReason = '';
          }
          if (fullResult.RefusalReason === undefined || fullResult.RefusalReason === null) {
            fullResult.RefusalReason = '';
          }
          
          // Thêm ActualVaccinationDate nếu status là Completed
          if (fullResult.VaccinationStatus === "Completed") {
            // Đảm bảo format ngày đúng
            const vaccinationDate = fullResult.ActualVaccinationDate || new Date().toISOString().split('T')[0];
            fullResult.ActualVaccinationDate = vaccinationDate + 'T00:00:00'; // Thêm time để đảm bảo format đúng
          } else {
            // Nếu không phải Completed thì set null
            fullResult.ActualVaccinationDate = null;
          }
          
          // Validate fullResult
          if (!fullResult.ConsentFormID) {
            throw new Error('ConsentFormID is required');
          }
          if (!fullResult.VaccineTypeID) {
            throw new Error('VaccineTypeID is required');
          }
          if (!fullResult.VaccinationStatus) {
            throw new Error('VaccinationStatus is required');
          }
          
          // Validate theo từng status
          if (fullResult.VaccinationStatus === "Completed") {
            if (!fullResult.ActualVaccinationDate) {
              throw new Error('ActualVaccinationDate is required for completed vaccinations');
            }
            if (!fullResult.Performer) {
              throw new Error('Performer is required for completed vaccinations');
            }
          }
          
          if (fullResult.VaccinationStatus === "Postponed" && !fullResult.PostponementReason) {
            throw new Error('Postponement reason is required for postponed vaccinations');
          }
          
          if (fullResult.VaccinationStatus === "Failed" && !fullResult.FailureReason) {
            throw new Error('Failure reason is required for failed vaccinations');
          }
          
          if (fullResult.VaccinationStatus === "Refused" && !fullResult.RefusalReason) {
            throw new Error('Refusal reason is required for refused vaccinations');
          }
          
          console.log('Full result:', fullResult);
          console.log('Full result JSON:', JSON.stringify(fullResult, null, 2));
          
          // Kiểm tra dữ liệu trước khi gửi
          console.log('Data validation:', {
            hasConsentFormID: !!fullResult.ConsentFormID,
            hasVaccineTypeID: !!fullResult.VaccineTypeID,
            hasVaccinationStatus: !!fullResult.VaccinationStatus,
            hasActualVaccinationDate: !!fullResult.ActualVaccinationDate,
            hasPerformer: !!fullResult.Performer,
            hasPostVaccinationReaction: !!fullResult.PostVaccinationReaction,
            hasNotes: !!fullResult.Notes,
            hasRecordedBy: !!fullResult.RecordedBy,
            hasPostponementReason: !!fullResult.PostponementReason,
            hasFailureReason: !!fullResult.FailureReason,
            hasRefusalReason: !!fullResult.RefusalReason
          });
          
          const response = await apiClient.post('/VaccinationResult/record', fullResult);
          console.log(`Result ${i + 1} saved successfully:`, response.data);
        } catch (error) {
          console.error(`Error saving result ${i + 1}:`, error);
          console.error('Error details:', error.response?.data);
          console.error('Error status:', error.response?.status);
          console.error('Error message:', error.message);
          console.error('Error config:', error.config);
          throw error;
        }
      }
      
      // Show success message
      setShowRecordResultsModal(false);
      setRecordResultsList([]);
      setRecordResultsSearch('');
      
      // Refresh data để cập nhật thống kê
      console.log('Refreshing data after successful vaccination result save...');
      await fetchData();
      
      // Show success notification
      setNotifyMessage('Ghi nhận kết quả tiêm chủng thành công!');
      setTimeout(() => {
        setNotifyMessage('');
      }, 3000);
    } catch (error) {
      console.error('Lỗi khi ghi nhận kết quả tiêm chủng:', error);
      
      // Hiển thị thông báo lỗi chi tiết
      let errorMessage = 'Có lỗi xảy ra khi ghi nhận kết quả tiêm chủng!';
      
      if (error.response?.data) {
        errorMessage = error.response.data;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show error notification
      setNotifyMessage(`Lỗi: ${errorMessage}`);
      setTimeout(() => {
        setNotifyMessage('');
      }, 5000);
    }
  };

  const handleVaccinationStatusChange = (index, newStatus) => {
    const updatedList = [...recordResultsList];
    updatedList[index].vaccinationStatus = newStatus;
    setRecordResultsList(updatedList);
  };

  const handleVaccinationNotesChange = (index, notes) => {
    const updatedList = [...recordResultsList];
    updatedList[index].notes = notes;
    setRecordResultsList(updatedList);
  };

  const handleVaccinationDateChange = (index, date) => {
    const updatedList = [...recordResultsList];
    updatedList[index].actualVaccinationDate = date;
    setRecordResultsList(updatedList);
  };

  const handlePerformerChange = (index, performer) => {
    const updatedList = [...recordResultsList];
    updatedList[index].performer = performer;
    setRecordResultsList(updatedList);
  };

  const handlePostVaccinationReactionChange = (index, reaction) => {
    const updatedList = [...recordResultsList];
    updatedList[index].postVaccinationReaction = reaction;
    setRecordResultsList(updatedList);
  };

  const handlePostponementReasonChange = (index, reason) => {
    const updatedList = [...recordResultsList];
    updatedList[index].postponementReason = reason;
    setRecordResultsList(updatedList);
  };

  const handleFailureReasonChange = (index, reason) => {
    const updatedList = [...recordResultsList];
    updatedList[index].failureReason = reason;
    setRecordResultsList(updatedList);
  };

  const handleRefusalReasonChange = (index, reason) => {
    const updatedList = [...recordResultsList];
    updatedList[index].refusalReason = reason;
    setRecordResultsList(updatedList);
  };

  const handleNeedToContactParentChange = (index, needContact) => {
    const updatedList = [...recordResultsList];
    updatedList[index].needToContactParent = needContact;
    setRecordResultsList(updatedList);
  };

  const handleOpenVaccinationModal = async (index) => {
    try {
      // Refresh data trước khi mở modal để đảm bảo dữ liệu mới nhất
      await fetchData();
      
    setSelectedStudentIndex(index);
    setShowVaccinationDetailModal(true);
    } catch (error) {
      console.error('Error refreshing data before opening modal:', error);
      setSelectedStudentIndex(index);
      setShowVaccinationDetailModal(true);
    }
  };

  const handleSaveVaccinationDetail = async () => {
    setShowVaccinationDetailModal(false);
    setSelectedStudentIndex(null);
    
    // Refresh data sau khi đóng modal
    try {
      await fetchData();
    } catch (error) {
      console.error('Error refreshing data after closing modal:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenNotifyModal = (plan) => {
    setPlanToNotify(plan);
    setShowConfirmModal(true);
    setNotifyMessage('');
  };

  const handleSendNotificationsConfirmed = async () => {
    if (!planToNotify) return;
    setNotifyLoading(true);
    setNotifyMessage('');
    try {
      await apiClient.post(`/VaccinationPlan/${planToNotify.id}/send-notifications`);
      setNotifyMessage('Gửi thông báo thành công!');
      setTimeout(() => {
        setShowConfirmModal(false);
        setPlanToNotify(null);
        setNotifyMessage('');
      }, 1200);
    } catch (error) {
      setNotifyMessage('Gửi thông báo thất bại!');
    } finally {
      setNotifyLoading(false);
    }
  };

  const normalize = str => (str || '').toLowerCase().replace(/\s+/g, ' ').trim();

  const handleEditPlan = (plan) => {
    console.log('plan object:', plan);
    const setEditData = (vaccineListData) => {
      // Lấy tên vaccine từ plan, có thể là planName, PlanName, hoặc vaccineName
      const planVaccineName = plan.planName || plan.PlanName || plan.vaccineName || plan.VaccineName || '';
      console.log('plan vaccine name:', planVaccineName);
      console.log('vaccineList:', vaccineListData.map(v => v.vaccineName || v.VaccineName));
      
      let matchedVaccine = '';
      if (vaccineListData.length > 0 && planVaccineName) {
        const found = vaccineListData.find(
          v => normalize(v.vaccineName || v.VaccineName) === normalize(planVaccineName)
        );
        matchedVaccine = found ? (found.vaccineName || found.VaccineName) : planVaccineName;
      } else {
        matchedVaccine = planVaccineName;
      }
      
      console.log('matched vaccine:', matchedVaccine);
      
      setEditFormData({
        id: plan.id,
        PlanName: matchedVaccine,
        ScheduledDate: plan.scheduledDate ? plan.scheduledDate.slice(0, 10) : '',
        Description: plan.description || plan.Description || '',
        Status: plan.status || plan.Status || 'Active',
        Grade: plan.grade || plan.Grade || 'Toàn trường',
      });
      setShowEditModal(true);
    };

          if (vaccineList.length === 0) {
        console.log('Calling API: /VaccineType/with-diseases (setEditData)');
        apiClient.get('/VaccineType/with-diseases').then(res => {
          console.log('API Response setEditData:', res.data);
          console.log('First vaccine diseases setEditData:', res.data[0]?.diseases);
          setVaccineList(res.data);
          setEditData(res.data);
        });
      } else {
      setEditData(vaccineList);
    }
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Lấy CreatorID từ selectedPlan, nếu không có thì lấy từ user đăng nhập
      let CreatorID = selectedPlan?.creatorID || selectedPlan?.CreatorID || '';
      if (!CreatorID) {
        const user = JSON.parse(localStorage.getItem('user'));
        CreatorID = user?.userID || user?.UserID || '';
      }
      if (Array.isArray(CreatorID)) {
        CreatorID = CreatorID[0] || '';
      }
      console.log('CreatorID gửi lên:', CreatorID);
      await apiClient.put(`/VaccinationPlan/${editFormData.id}`, {
        PlanName: editFormData.PlanName,
        ScheduledDate: editFormData.ScheduledDate ? new Date(editFormData.ScheduledDate).toISOString() : null,
        Description: editFormData.Description,
        Status: editFormData.Status,
        ID: editFormData.id,
        CreatorID,
        Grade: editFormData.Grade,
      });
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      setNotifyMessage('Có lỗi khi cập nhật kế hoạch!');
      console.error('Error updating plan:', error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm vaccine
  const handleAddVaccineInputChange = (e) => {
    const { id, value } = e.target;
    setAddVaccineData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddVaccine = async (e) => {
    e.preventDefault();
    setAddVaccineLoading(true);
    setNotifyMessage('');
    try {
      console.log('Adding vaccine with data:', addVaccineData);
      
      if (!addVaccineData.VaccineName?.trim() || !addVaccineData.Description?.trim()) {
        setNotifyMessage('Vui lòng nhập đầy đủ tên vaccine và mô tả!');
        setAddVaccineLoading(false);
        return;
      }
      
      // Kiểm tra độ dài tên vaccine (max 100 ký tự)
      if (addVaccineData.VaccineName.length > 100) {
        setNotifyMessage('Tên vaccine không được vượt quá 100 ký tự!');
        setAddVaccineLoading(false);
        return;
      }
      
      // Kiểm tra độ dài mô tả (max 255 ký tự)
      if (addVaccineData.Description.length > 255) {
        setNotifyMessage('Mô tả không được vượt quá 255 ký tự!');
        setAddVaccineLoading(false);
        return;
      }
      
      // Kiểm tra tên vaccine không được trùng
      const existingVaccine = vaccineList.find(v => 
        (v.vaccineName || v.VaccineName || '').toLowerCase() === addVaccineData.VaccineName.toLowerCase()
      );
      if (existingVaccine) {
        setNotifyMessage('Tên vaccine đã tồn tại! Vui lòng chọn tên khác.');
        setAddVaccineLoading(false);
        return;
      }
      
      await apiClient.post('/VaccineType', {
        VaccinationID: '', // Để backend tự sinh mã
        VaccineName: addVaccineData.VaccineName,
        Description: addVaccineData.Description
      });
      
      setAddVaccineData({ VaccineName: '', Description: '' });
      // Cập nhật lại danh sách vaccine
      const res = await apiClient.get('/VaccineType/with-diseases');
      setVaccineList(res.data);
      setNotifyMessage('Thêm vaccine thành công!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Error adding vaccine:', err);
      let msg = 'Có lỗi khi thêm vaccine!';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') msg += ' ' + err.response.data;
        else if (err.response.data.title) msg += ' ' + err.response.data.title;
        else if (err.response.data.error) msg += ' ' + err.response.data.error;
        else msg += ' ' + JSON.stringify(err.response.data);
      }
      setNotifyMessage(msg);
    } finally {
      setAddVaccineLoading(false);
    }
  };

  // Quản lý vaccine
  const openVaccineManager = async () => {
    setShowVaccineManager(true);
    try {
      console.log('Calling API: /VaccineType/with-diseases (openVaccineManager)');
      const res = await apiClient.get('/VaccineType/with-diseases');
      console.log('Vaccine data from API:', res.data);
      console.log('All vaccines diseases check:', res.data.map(v => ({ id: v.vaccinationID, diseases: v.diseases, hasDiseases: !!v.diseases })));
      setVaccineList(res.data);
    } catch (error) {
      console.error('Error fetching vaccine types:', error);
      setVaccineList([]);
    }
  };
  const closeVaccineManager = () => {
    setShowVaccineManager(false);
    setEditVaccineId(null);
    setEditVaccineData({ VaccineName: '', Description: '' });
    setDeleteVaccineId(null);
  };
  const handleEditVaccineClick = (v) => {
    setEditVaccineId(v.vaccinationID || v.VaccinationID);
    setEditVaccineData({ VaccineName: v.vaccineName || v.VaccineName, Description: v.description || v.Description });
  };
  const handleEditVaccineInputChange = (e) => {
    const { id, value } = e.target;
    setEditVaccineData(prev => ({ ...prev, [id]: value }));
  };
  const handleEditVaccineSave = async (id) => {
    try {
      console.log('Updating vaccine with data:', {
        VaccinationID: id,
        VaccineName: editVaccineData.VaccineName,
        Description: editVaccineData.Description
      });
      
      await apiClient.put(`/VaccineType/${id}`, {
        VaccinationID: id,
        VaccineName: editVaccineData.VaccineName,
        Description: editVaccineData.Description
      });
      
      const res = await apiClient.get('/VaccineType/with-diseases');
      setVaccineList(res.data);
      setEditVaccineId(null);
      setEditVaccineData({ VaccineName: '', Description: '' });
      setNotifyMessage('Cập nhật vaccine thành công!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Error updating vaccine:', err);
      let msg = 'Có lỗi khi cập nhật vaccine!';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') msg += ' ' + err.response.data;
        else if (err.response.data.title) msg += ' ' + err.response.data.title;
        else if (err.response.data.error) msg += ' ' + err.response.data.error;
        else msg += ' ' + JSON.stringify(err.response.data);
      }
      setNotifyMessage(msg);
    }
  };
  const handleDeleteVaccine = async (id) => {
    setDeleteLoading(true);
    try {
      console.log('Deleting vaccine with ID:', id);
      await apiClient.delete(`/VaccineType/${id}`);
      const res = await apiClient.get('/VaccineType/with-diseases');
      setVaccineList(res.data);
      setNotifyMessage('Xóa vaccine thành công!');
      setDeleteVaccineId(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Error deleting vaccine:', err);
      let msg = 'Có lỗi khi xóa vaccine!';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') msg += ' ' + err.response.data;
        else if (err.response.data.title) msg += ' ' + err.response.data.title;
        else if (err.response.data.error) msg += ' ' + err.response.data.error;
        else msg += ' ' + JSON.stringify(err.response.data);
      }
      setNotifyMessage(msg);
    } finally {
      setDeleteLoading(false);
    }
  };



  if (loading && vaccinationPlans.length === 0) {
    return (
      <div className="vaccination-management-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="vaccination-management-container">
      <div className="vaccination-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
        <h1>Quản lý tiêm chủng</h1>
        <p>Lên kế hoạch và quản lý tiêm chủng cho học sinh</p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={fetchData}
            disabled={loading}
          >
            <i className="fas fa-sync-alt"></i> Làm mới
          </button>
        </div>
        {notifyMessage && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10000,
            padding: '16px 24px',
            borderRadius: '12px',
            background: notifyMessage.includes('thành công') 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: '600',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out'
          }}>
            <i className={`fas ${notifyMessage.includes('thành công') ? 'fa-check-circle' : 'fa-exclamation-triangle'}`} 
               style={{ fontSize: '1.2rem' }}></i>
            <span>{notifyMessage}</span>
          </div>
        )}
      </div>

      {/* Thống kê */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card health-stat-card">
            <div className="card-body">
              <h5 className="card-title">Tổng số học sinh</h5>
              <p className="card-number">{totalStudents}</p>
              <p className="card-text">Đã đăng ký tiêm</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card health-stat-card">
            <div className="card-body">
              <h5 className="card-title">Đã xác nhận</h5>
              <p className="card-number">{confirmed}</p>
              <p className="card-text">Học sinh</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card health-stat-card">
            <div className="card-body">
              <h5 className="card-title">Đã tiêm</h5>
              <p className="card-number">{completed}</p>
              <p className="card-text">Học sinh</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card health-stat-card">
            <div className="card-body">
              <h5 className="card-title">Đợt tiêm</h5>
              <p className="card-number">{totalRounds.toString().padStart(2, '0')}</p>
              <p className="card-text">Năm học hiện tại</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Lọc danh sách kế hoạch</h5>
          <div className="row">
            <div className="col-md-4 mb-2">
          <input
                type="date"
                id="scheduleDate"
                className="form-control"
                value={filters.scheduleDate}
                onChange={(e) => setFilters(prev => ({ ...prev, scheduleDate: e.target.value }))}
                placeholder="Chọn ngày tiêm"
          />
        </div>
            <div className="col-md-4 mb-2">
          <select
                id="creatorId"
                className="form-select"
                value={filters.creatorId}
                onChange={(e) => setFilters(prev => ({ ...prev, creatorId: e.target.value }))}
          >
                <option value="">Chọn người tạo</option>
                <option value="medstaff01">medstaff01</option>
                <option value="admin01">admin01</option>
          </select>
            </div>
            <div className="col-md-4 mb-2">
              <select
                id="grade"
                className="form-select"
                value={filters.grade}
                onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
              >
                <option value="">Chọn khối</option>
                <option value="6">Khối 6</option>
                <option value="7">Khối 7</option>
                <option value="8">Khối 8</option>
                <option value="9">Khối 9</option>
                <option value="Toàn trường">Toàn trường</option>
              </select>
            </div>
            <div className="col-md-4 mb-2 d-flex align-items-end">
              <button className="btn btn-secondary" onClick={handleResetFilters}>Đặt lại</button>
            </div>
          </div>
        </div>
        </div>

      {/* Action Buttons */}
              <div className="d-flex justify-content-end mb-3">
          <button 
            className="btn btn-info me-2"
            onClick={openVaccineManager}
          >
            <i className="fas fa-syringe me-2"></i> QUẢN LÝ VACCINE
          </button>
          <button 
            className="btn btn-warning"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-plus-circle me-2"></i> TẠO KẾ HOẠCH MỚI
          </button>
      </div>

      {/* Vaccination Plans List */}
      <div className="vaccination-plans-list">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="vaccination-plan-card">
            <div className="plan-header">
              <div className="plan-title">
                <h3>{plan.PlanName}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(plan.status) }}
                >
                  {getStatusText(plan.status)}
                </span>
              </div>
              <div className="plan-date">
                <i className="fas fa-calendar"></i>
                {new Date(plan.scheduledDate).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div className="plan-content">
              <div className="plan-info-row">
              <div className="plan-description">
                <h4>Mô tả</h4>
                <p>{plan.description}</p>
                  <p><strong>Người tạo:</strong> {plan.creatorName || 'medstaff01'}</p>
              </div>

              <div className="plan-target">
                <h4>Đối tượng</h4>
                <p><strong>Khối:</strong> {plan.grade || 'Toàn trường'}</p>
                <p><strong>Vaccine:</strong> {plan.planName || plan.PlanName || 'Không xác định'}</p>
              </div>
              </div>

              <div className="plan-stats">
                <h4>Thống kê</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Tổng học sinh:</span>
                    <span className="stat-value">{plan.totalStudents || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Đã xác nhận:</span>
                    <span className="stat-value confirmed">{plan.confirmedCount || 0}</span>
                    {/* Debug info */}
                    <small style={{display: 'none'}}>Debug: {JSON.stringify({confirmedCount: plan.confirmedCount, totalStudents: plan.totalStudents})}</small>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Chờ phản hồi:</span>
                    <span className="stat-value pending">{plan.pendingCount || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Đã tiêm:</span>
                    <span className="stat-value completed">{plan.completedCount || 0}</span>
                  </div>
                </div>
              </div>

              <div className="plan-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => handleViewDetails(plan)}
                >
                  <i className="fas fa-eye"></i>
                  Xem chi tiết
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEditPlan(plan)}
                >
                  <i className="fas fa-edit"></i>
                  Chỉnh sửa
                </button>
                <button
                  className="send-notifications-btn"
                  onClick={() => handleOpenNotifyModal(plan)}
                  disabled={notifyLoading}
                >
                  <i className="fas fa-bell"></i>
                  Gửi thông báo
                </button>
              </div>
            </div>
          </div>
        ))}

        {vaccinationPlans.length === 0 && (
          <div className="no-results">
            <i className="fas fa-syringe"></i>
            <p>Không tìm thấy kế hoạch tiêm chủng nào</p>
          </div>
        )}
      </div>

      {/* Form tạo kế hoạch tiêm chủng mới - Synchronized with HealthCheckManagement */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Tạo kế hoạch tiêm chủng mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
            </div>
              <div className="modal-body">
                {/* Hiển thị thông tin người tạo */}
                <div className="alert alert-info mb-3">
                  <i className="fas fa-user me-2"></i>
                  <strong>Người tạo:</strong> {currentUser?.fullName || currentUser?.FullName || currentUser?.username || currentUser?.Username || 'Không xác định'}
                </div>
                
                <form onSubmit={handleCreatePlan} className="individual-form">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="PlanName" className="form-label">Tên kế hoạch (Tên vaccine) *</label>
                  <select
                        className="form-select"
                        id="PlanName"
                    name="PlanName"
                    value={formData.PlanName ?? ""}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn vaccine...</option>
                    {vaccineList.map(v => (
                      <option key={v.id} value={v.vaccineName || v.VaccineName}>{v.vaccineName || v.VaccineName}</option>
                    ))}
                  </select>
                </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="ScheduledDate" className="form-label">Ngày dự kiến *</label>
                  <input
                    type="date"
                        className="form-control"
                        id="ScheduledDate"
                    name="ScheduledDate"
                    value={formData.ScheduledDate ?? ""}
                    onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Description" className="form-label">Mô tả *</label>
                  <textarea
                        className="form-control"
                        id="Description"
                    name="Description"
                        rows="3"
                    value={formData.Description ?? ""}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết về kế hoạch tiêm chủng..."
                    required
                  />
                </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Status" className="form-label">Trạng thái *</label>
                  <select
                        className="form-select"
                        id="Status"
                    name="Status"
                    value={formData.Status ?? ""}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Active">Đang thực hiện</option>
                    <option value="Pending">Chờ thực hiện</option>
                    <option value="Completed">Hoàn thành</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Grade" className="form-label">Khối *</label>
                  <select
                        className="form-select"
                        id="Grade"
                    name="Grade"
                    value={formData.Grade}
                    onChange={handleInputChange}
                    required
                  >
                    {gradeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
                  

                  
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Hủy bỏ</button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-calendar-check me-2"></i>Xác nhận kế hoạch
                </button>
              </div>
            </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedPlan && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="vaccination-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-syringe"></i> Chi tiết kế hoạch tiêm chủng
              </h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowDetailsModal(false);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="vaccination-status-badge" data-status={selectedPlan.status}>
                {getStatusText(selectedPlan.status)}
              </div>
              
              <div className="vaccination-title-section">
                <h2>{selectedPlan.PlanName}</h2>
                <p className="scheduled-date">
                  <i className="far fa-calendar-alt"></i>
                  {new Date(selectedPlan.scheduledDate).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="detail-section">
                <h4><i className="fas fa-info-circle"></i> Thông tin cơ bản</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Tên vaccine:</label>
                    <span className="highlight-value">{selectedPlan.planName || selectedPlan.PlanName || selectedPlan.vaccineName || selectedPlan.VaccineName || 'Không xác định'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Người tạo:</label>
                    <span>{selectedPlan?.creatorInfo?.username || selectedPlan?.creatorInfo?.Username || selectedPlan?.creatorInfo?.fullName || selectedPlan?.creatorInfo?.FullName || selectedPlan?.Creator?.Username || selectedPlan?.creatorName || selectedPlan?.CreatorName || "Không rõ"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày tạo:</label>
                    <span>{selectedPlan.createdDate ? new Date(selectedPlan.createdDate).toLocaleDateString('vi-VN') : 'Không xác định'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4><i className="fas fa-align-left"></i> Mô tả</h4>
                <div className="description-box">
                  <p>{selectedPlan.description || "Không có mô tả"}</p>
                </div>
              </div>

              <div className="detail-section">
                <h4><i className="fas fa-users"></i> Đối tượng tiêm chủng</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Khối:</label>
                    <span className="highlight-value">{selectedPlan.grade || 'Toàn trường'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Lớp:</label>
                    <span className="highlight-value">{selectedPlan.targetClass || "Tất cả"}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4><i className="fas fa-chart-pie"></i> Thống kê tiêm chủng</h4>
                {/* Debug thống kê */}
                <div style={{ 
                  background: '#f0f0f0', 
                  padding: '10px', 
                  marginBottom: '10px', 
                  borderRadius: '5px',
                  fontSize: '12px',
                  display: 'none' // Ẩn debug trong production
                }}>
                  <strong>DEBUG:</strong> totalStudents={selectedPlan.totalStudents}, 
                  confirmedCount={selectedPlan.confirmedCount}, 
                  pendingCount={selectedPlan.pendingCount}, 
                  completedCount={selectedPlan.completedCount}
                </div>
                <div className="vaccination-stats">
                  <div className="stat-card total">
                    <div className="stat-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{selectedPlan.totalStudents || 0}</div>
                      <div className="stat-label">Tổng học sinh</div>
                    </div>
                  </div>
                  
                  <div className="stat-card confirmed">
                    <div className="stat-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{selectedPlan.confirmedCount || 0}</div>
                      <div className="stat-label">Đã xác nhận</div>
                    </div>
                  </div>
                  
                  <div className="stat-card pending">
                    <div className="stat-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{selectedPlan.pendingCount || 0}</div>
                      <div className="stat-label">Chờ phản hồi</div>
                    </div>
                  </div>
                  
                  <div className="stat-card completed">
                    <div className="stat-icon">
                      <i className="fas fa-syringe"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{selectedPlan.completedCount || 0}</div>
                      <div className="stat-label">Đã tiêm</div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPlan.notes && (
                <div className="detail-section">
                  <h4><i className="fas fa-sticky-note"></i> Ghi chú</h4>
                  <div className="notes-box">
                    <p>{selectedPlan.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="detail-actions">
                <button className="action-btn view-students" onClick={() => handleViewStudents(selectedPlan)}>
                  <i className="fas fa-users"></i> Xem danh sách học sinh
                </button>
                <button className="action-btn record-results" onClick={() => handleRecordResults(selectedPlan)}>
                  <i className="fas fa-clipboard-check"></i> Ghi nhận kết quả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && (
        <div className="modal-overlay" style={{ zIndex: 10001 }}>
          <div style={{
            background: '#fff',
            width: '95%',
            maxWidth: '600px',
            margin: '20px auto',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            animation: 'slideInUp 0.3s ease',
            maxHeight: '95vh'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fas fa-edit" style={{ fontSize: '1.5rem' }}></i>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>
                  Chỉnh sửa kế hoạch tiêm chủng
                </h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleUpdatePlan}>
              <div style={{ padding: '20px 24px', maxHeight: '60vh', overflowY: 'auto' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '0.95rem'
                  }}>
                    <i className="fas fa-syringe" style={{ marginRight: '8px', color: '#667eea' }}></i>
                    Tên kế hoạch (Tên vaccine):
                  </label>
                  <select
                    name="PlanName"
                    value={editFormData.PlanName ?? ""}
                    onChange={e => setEditFormData({ ...editFormData, PlanName: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '0.95rem',
                      background: '#fff',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">Chọn vaccine...</option>
                    {vaccineList.map(v => (
                      <option key={v.id} value={v.vaccineName || v.VaccineName}>{v.vaccineName || v.VaccineName}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '0.95rem'
                  }}>
                    <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#667eea' }}></i>
                    Ngày dự kiến:
                  </label>
                  <input
                    type="date"
                    name="ScheduledDate"
                    value={editFormData.ScheduledDate ?? ""}
                    onChange={e => setEditFormData({ ...editFormData, ScheduledDate: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '0.95rem',
                      background: '#fff',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '0.95rem'
                  }}>
                    <i className="fas fa-file-alt" style={{ marginRight: '8px', color: '#667eea' }}></i>
                    Mô tả:
                  </label>
                  <textarea
                    name="Description"
                    value={editFormData.Description ?? ""}
                    onChange={e => setEditFormData({ ...editFormData, Description: e.target.value })}
                    rows="4"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '0.95rem',
                      background: '#fff',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '0.95rem'
                  }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#667eea' }}></i>
                    Trạng thái:
                  </label>
                  <select
                    name="Status"
                    value={editFormData.Status ?? ""}
                    onChange={e => setEditFormData({ ...editFormData, Status: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '0.95rem',
                      background: '#fff',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="Active">Đang thực hiện</option>
                    <option value="Pending">Chờ thực hiện</option>
                    <option value="Completed">Hoàn thành</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '0.95rem'
                  }}>
                    <i className="fas fa-graduation-cap" style={{ marginRight: '8px', color: '#667eea' }}></i>
                    Khối:
                  </label>
                  <select
                    name="Grade"
                    value={editFormData.Grade}
                    onChange={e => setEditFormData({ ...editFormData, Grade: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '0.95rem',
                      background: '#fff',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    {gradeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '16px 24px',
                background: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '16px'
              }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '2px solid #d1d5db',
                    background: '#ffffff',
                    color: '#6b7280',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 6px 8px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                >
                  <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && planToNotify && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            width: '90%',
            maxWidth: '480px',
            minWidth: '350px',
            animation: 'slideIn 0.3s ease',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <i className="fas fa-bell" style={{ color: '#ffffff', fontSize: '1.2rem' }}></i>
                </div>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  Xác nhận gửi thông báo
                </h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <i className="fas fa-times" style={{ fontSize: '1rem' }}></i>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  flexShrink: 0
                }}>
                  <i className="fas fa-info" style={{ color: '#ffffff', fontSize: '1.3rem' }}></i>
          </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0,
                    color: '#374151',
                    fontSize: '1.05rem',
                    lineHeight: '1.6',
                    fontWeight: '500'
                  }}>
                    Bạn có chắc chắn muốn gửi thông báo kế hoạch{' '}
                    <span style={{
                      color: '#1e40af',
                      fontWeight: '600',
                      background: 'linear-gradient(120deg, #dbeafe, #eff6ff)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {planToNotify.PlanName}
                    </span>
                    {' '}đến phụ huynh không?
                  </p>
                </div>
              </div>

              {notifyMessage && (
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  marginTop: '16px',
                  background: notifyMessage.includes('thành công') 
                    ? 'linear-gradient(135deg, #d1fae5, #ecfdf5)' 
                    : 'linear-gradient(135deg, #fee2e2, #fef2f2)',
                  border: `2px solid ${notifyMessage.includes('thành công') ? '#10b981' : '#ef4444'}`,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className={`fas ${notifyMessage.includes('thành công') ? 'fa-check-circle' : 'fa-exclamation-triangle'}`} 
                     style={{
                       color: notifyMessage.includes('thành công') ? '#059669' : '#dc2626',
                       fontSize: '1.2rem',
                       marginRight: '12px'
                     }}></i>
                  <span style={{
                    color: notifyMessage.includes('thành công') ? '#065f46' : '#991b1b',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}>
                    {notifyMessage}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 24px',
              background: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={notifyLoading}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db',
                  background: '#ffffff',
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                <i className="fas fa-times" style={{ fontSize: '0.9rem' }}></i>
                Hủy
              </button>
              <button
                onClick={handleSendNotificationsConfirmed}
                disabled={notifyLoading}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: notifyLoading 
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: notifyLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: notifyLoading ? 'none' : '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!notifyLoading) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 8px -1px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!notifyLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                {notifyLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '0.9rem' }}></i>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check" style={{ fontSize: '0.9rem' }}></i>
                    Xác nhận
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm vaccine */}
      {showAddVaccineModal && (
        <div className="modal-overlay">
          <div className="create-plan-modal" style={{ background: '#f4f8fb', minWidth: 400 }}>
            <div className="modal-header">
              <h3>Thêm vaccine mới</h3>
              <button className="close-btn" onClick={() => setShowAddVaccineModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddVaccine}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên vaccine:</label>
                  <input
                    type="text"
                    name="VaccineName"
                    value={addVaccineData.VaccineName}
                    onChange={handleAddVaccineInputChange}
                    required
                    style={{ width: '100%', padding: 8, marginBottom: 12 }}
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả:</label>
                  <textarea
                    name="Description"
                    value={addVaccineData.Description}
                    onChange={handleAddVaccineInputChange}
                    rows={3}
                    style={{ width: '100%', padding: 8 }}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ textAlign: 'right' }}>
                <button type="button" className="close-btn" onClick={() => setShowAddVaccineModal(false)} style={{ marginRight: 8 }}>
                  Hủy
                </button>
                <button type="submit" className="create-plan-btn" disabled={addVaccineLoading}>
                  {addVaccineLoading ? 'Đang lưu...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form quản lý vaccine - Synchronized with HealthCheckManagement */}
      {showVaccineManager && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Quản lý vaccine</h5>
                <button type="button" className="btn-close" onClick={closeVaccineManager}></button>
            </div>
            <div className="modal-body">
                {/* Hiển thị thông tin người tạo */}
                <div className="alert alert-info mb-3">
                  <i className="fas fa-user me-2"></i>
                  <strong>Người tạo:</strong> {currentUser?.fullName || currentUser?.FullName || currentUser?.username || currentUser?.Username || 'Không xác định'}
                </div>
                
                <form onSubmit={handleAddVaccine} className="vaccine-form">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="VaccineName" className="form-label">Tên vaccine *</label>
                  <input
                    type="text"
                        className="form-control"
                        id="VaccineName"
                    value={addVaccineData.VaccineName}
                    onChange={handleAddVaccineInputChange}
                        placeholder="Nhập tên vaccine"
                    required
                  />
                </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Description" className="form-label">Mô tả *</label>
                      <textarea
                        className="form-control"
                        id="Description"
                        rows="2"
                    value={addVaccineData.Description}
                    onChange={handleAddVaccineInputChange}
                        placeholder="Nhập mô tả vaccine"
                    required
                  />
                </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-12 mb-3 d-flex justify-content-end">
                      <button type="submit" className="btn btn-primary" disabled={addVaccineLoading}>
                        <i className="fas fa-plus me-2"></i>
                        {addVaccineLoading ? 'Đang thêm...' : 'Thêm mới'}
                </button>
                    </div>
                  </div>
              </form>

                <div className="vaccine-list-section mt-4">
                  <h5 className="mb-3">Danh sách vaccine</h5>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                  <tr>
                          <th>Mã</th>
                          <th>Tên vaccine</th>
                          <th>Mô tả</th>
                          <th>Tên bệnh</th>
                          <th>Số mũi</th>
                          <th>Ghi chú</th>
                          <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                        {vaccineList.map((vaccine) => (
                          <tr key={vaccine.vaccinationID || vaccine.VaccinationID}>
                            <td>{vaccine.vaccinationID || vaccine.VaccinationID}</td>
                            <td>
                              {editVaccineId === (vaccine.vaccinationID || vaccine.VaccinationID) ? (
                          <input
                            type="text"
                                  className="form-control form-control-sm"
                                  id="VaccineName"
                            value={editVaccineData.VaccineName}
                            onChange={handleEditVaccineInputChange}
                          />
                              ) : (
                                vaccine.vaccineName || vaccine.VaccineName
                              )}
                      </td>
                            <td>
                              {editVaccineId === (vaccine.vaccinationID || vaccine.VaccinationID) ? (
                                <textarea
                                  className="form-control form-control-sm"
                                  id="Description"
                            value={editVaccineData.Description}
                            onChange={handleEditVaccineInputChange}
                                  rows="2"
                          />
                              ) : (
                                vaccine.description || vaccine.Description
                              )}
                      </td>
                            <td>
                              {console.log('Vaccine:', vaccine.vaccinationID, 'Diseases:', vaccine.diseases, 'Full vaccine object:', vaccine)}
                              {vaccine.diseases && Array.isArray(vaccine.diseases) && vaccine.diseases.length > 0 ? (
                                <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                  {vaccine.diseases.map((disease, index) => (
                                    <div key={index} style={{ 
                                      padding: '2px 0', 
                                      fontSize: '0.85rem',
                                      borderBottom: index < vaccine.diseases.length - 1 ? '1px solid #eee' : 'none'
                                    }}>
                                      <strong>{disease.diseaseName}</strong>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ color: '#999', fontStyle: 'italic' }}>Không có dữ liệu</span>
                              )}
                            </td>
                            <td>
                              {vaccine.diseases && Array.isArray(vaccine.diseases) && vaccine.diseases.length > 0 ? (
                                <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                  {vaccine.diseases.map((disease, index) => (
                                    <div key={index} style={{ 
                                      padding: '2px 0', 
                                      fontSize: '0.85rem',
                                      borderBottom: index < vaccine.diseases.length - 1 ? '1px solid #eee' : 'none'
                                    }}>
                                      {disease.requiredDoses || 'N/A'}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ color: '#999', fontStyle: 'italic' }}>N/A</span>
                              )}
                            </td>
                            <td>
                              {vaccine.diseases && Array.isArray(vaccine.diseases) && vaccine.diseases.length > 0 ? (
                                <div style={{ maxHeight: '100px', overflowY: 'auto', fontSize: '0.8rem' }}>
                                  {vaccine.diseases.map((disease, index) => (
                                    <div key={index} style={{ 
                                      padding: '2px 0', 
                                      borderBottom: index < vaccine.diseases.length - 1 ? '1px solid #eee' : 'none'
                                    }}>
                                      {disease.notes || 'Không có ghi chú'}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ color: '#999', fontStyle: 'italic' }}>Không có ghi chú</span>
                              )}
                            </td>
                            <td>
                              {editVaccineId === (vaccine.vaccinationID || vaccine.VaccinationID) ? (
                                <div className="btn-group btn-group-sm">
                                  <button 
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => handleEditVaccineSave(vaccine.vaccinationID || vaccine.VaccinationID)}
                                  >
                                    <i className="fas fa-save"></i>
                                  </button>
                                  <button 
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setEditVaccineId(null)}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                        ) : (
                                <div className="btn-group btn-group-sm">
                                  <button 
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleEditVaccineClick(vaccine)}
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => setDeleteVaccineId(vaccine.vaccinationID || vaccine.VaccinationID)}
                                    disabled={deleteLoading}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeVaccineManager}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal xác nhận xóa vaccine */}
      {deleteVaccineId && (
        <div className="modal-overlay" style={{ zIndex: 10001, background: 'rgba(0,0,0,0.25)' }}>
          <div style={{
            background: '#fff',
            minWidth: 340,
            maxWidth: 400,
            margin: '120px auto',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            padding: 32,
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: '#e53e3e' }}>Xác nhận xóa vaccine</div>
            <div style={{ marginBottom: 24 }}>Bạn có chắc chắn muốn xóa vaccine này không?</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button className="delete-btn" style={{ background: '#e53e3e', color: '#fff', padding: '8px 24px', borderRadius: 6 }} onClick={() => handleDeleteVaccine(deleteVaccineId)} disabled={deleteLoading}>Xóa</button>
              <button className="close-btn" style={{ padding: '8px 24px', borderRadius: 6 }} onClick={() => setDeleteVaccineId(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          background: '#38a169',
          color: '#fff',
          padding: '16px 32px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontSize: 18,
          fontWeight: 500
        }}>
          {notifyMessage}
        </div>
      )}
      {showDateErrorModal && (
        <div className="modal-overlay" style={{ zIndex: 10001, background: 'rgba(0,0,0,0.25)' }}>
          <div style={{
            background: '#fff',
            minWidth: 340,
            maxWidth: 400,
            margin: '120px auto',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            padding: 32,
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: '#e53e3e' }}>Lỗi ngày dự kiến</div>
            <div style={{ marginBottom: 24 }}>{dateErrorMessage}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button className="close-btn" style={{ padding: '8px 24px', borderRadius: 6 }} onClick={() => setShowDateErrorModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal danh sách học sinh */}
      {showStudentsModal && (
        <div className="modal-overlay" style={{ zIndex: 10001 }}>
          <div style={{
            background: '#fff',
            width: '90%',
            maxWidth: '800px',
            margin: '50px auto',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            maxHeight: '80vh'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fas fa-users" style={{ fontSize: '1.5rem' }}></i>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>
                  Danh sách học sinh đã xác nhận tiêm chủng
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowStudentsModal(false);
                  setStudentsListSearch('');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
              {/* Search Box */}
              <div style={{
                marginBottom: '20px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã học sinh, họ tên hoặc lớp..."
                    value={studentsListSearch}
                    onChange={(e) => setStudentsListSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      background: '#fff'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <i 
                    className="fas fa-search" 
                    style={{
                      position: 'absolute',
                      left: '16px',
                      color: '#9ca3af',
                      fontSize: '0.9rem'
                    }}
                  ></i>
                  {studentsListSearch && (
                    <button
                      onClick={() => setStudentsListSearch('')}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#ef4444';
                        e.target.style.background = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#9ca3af';
                        e.target.style.background = 'none';
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                {studentsListSearch && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    Tìm thấy {filteredStudentsList.length} học sinh
                  </div>
                )}
              </div>

              {filteredStudentsList.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280'
                }}>
                  <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '16px', color: '#d1d5db' }}></i>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                    {studentsListSearch ? 'Không tìm thấy học sinh nào phù hợp' : 'Không có học sinh nào đã xác nhận tiêm chủng'}
                  </div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    background: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <thead style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      borderBottom: '2px solid #e2e8f0'
                    }}>
                      <tr>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>STT</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Mã học sinh</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Họ tên</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Lớp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudentsList.map((student, idx) => (
                        <tr key={student?.userID || idx} style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = '#fff'}
                        >
                          <td style={{
                            padding: '14px 12px',
                            fontWeight: '500',
                            color: '#6b7280'
                          }}>{idx + 1}</td>
                          <td style={{
                            padding: '14px 12px',
                            fontWeight: '600',
                            color: '#374151'
                          }}>{student?.userID || 'Không rõ'}</td>
                          <td style={{
                            padding: '14px 12px',
                            fontWeight: '500',
                            color: '#374151'
                          }}>{student?.name || 'Không rõ tên'}</td>
                          <td style={{
                            padding: '14px 12px',
                            fontWeight: '500',
                            color: '#6b7280'
                          }}>{student?.classID || 'Không rõ'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 24px',
              background: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowStudentsModal(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db',
                  background: '#ffffff',
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ghi nhận kết quả tiêm chủng */}
      {showRecordResultsModal && (
        <div className="modal-overlay" style={{ zIndex: 10001 }}>
          <div style={{
            background: '#fff',
            width: '95%',
            maxWidth: '1000px',
            margin: '30px auto',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            maxHeight: '90vh'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fas fa-clipboard-check" style={{ fontSize: '1.5rem' }}></i>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>
                  Ghi nhận kết quả tiêm chủng
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowRecordResultsModal(false);
                  setRecordResultsSearch('');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Search Box */}
              {recordResultsList.length > 0 && (
                <div style={{
                  marginBottom: '20px',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    maxWidth: '400px'
                  }}>
                    <i className="fas fa-search" style={{ color: '#6b7280', fontSize: '1rem' }}></i>
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo mã học sinh, tên học sinh hoặc trạng thái..."
                      value={recordResultsSearch}
                      onChange={(e) => setRecordResultsSearch(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {recordResultsSearch && (
                      <button
                        onClick={() => setRecordResultsSearch('')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#e5e7eb';
                          e.target.style.color = '#374151';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'none';
                          e.target.style.color = '#6b7280';
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                  {recordResultsSearch && (
                    <div style={{
                      marginTop: '8px',
                      fontSize: '0.85rem',
                      color: '#6b7280'
                    }}>
                      Tìm thấy {filteredRecordResultsList.length} học sinh
                    </div>
                  )}
                </div>
              )}
              
              {recordResultsList.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280'
                }}>
                  <i className="fas fa-user-times" style={{ fontSize: '3rem', marginBottom: '16px', color: '#d1d5db' }}></i>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                    Không có học sinh nào đã xác nhận tiêm chủng
                  </div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    background: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <thead style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      borderBottom: '2px solid #e2e8f0'
                    }}>
                      <tr>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>STT</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Mã học sinh</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Tên Học Sinh</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Trạng Thái</th>
                        <th style={{
                          padding: '16px 12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                                              {filteredRecordResultsList.map((student, idx) => (
                        <tr key={student?.userID || idx} style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = '#fff'}
                        >
                          <td style={{
                            padding: '14px 12px',
                            fontWeight: '500',
                            color: '#6b7280'
                          }}>{idx + 1}</td>
                          <td style={{
                            padding: '14px 12px',
                            fontWeight: '600',
                            color: '#374151'
                          }}>{student?.userID || 'Không rõ'}</td>
                          <td style={{
                            padding: '14px 12px',
                            fontWeight: '500',
                            color: '#374151'
                          }}>{student?.name || 'Không rõ tên'}</td>
                          <td style={{
                            padding: '14px 12px',
                            textAlign: 'center'
                          }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              color: 'white',
                              backgroundColor: getVaccinationStatusColor(student?.vaccinationStatus),
                              display: 'inline-block',
                              minWidth: '100px',
                              textAlign: 'center'
                            }}>
                              {getVaccinationStatusText(student?.vaccinationStatus)}
                            </span>
                          </td>
                          <td style={{
                            padding: '14px 12px'
                          }}>
                            <button
                              onClick={() => handleOpenVaccinationModal(idx)}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.3)';
                              }}
                            >
                              <i className="fas fa-edit" style={{ marginRight: '6px' }}></i>
                              Ghi nhận
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 24px',
              background: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                  Tổng cộng: <strong>{recordResultsSearch ? filteredRecordResultsList.length : recordResultsList.length}</strong> học sinh
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowRecordResultsModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '2px solid #d1d5db',
                    background: '#ffffff',
                    color: '#6b7280',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                  Hủy
                </button>
                <button
                  onClick={handleSaveVaccinationResults}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 8px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                  Lưu kết quả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết ghi nhận kết quả tiêm chủng */}
      {showVaccinationDetailModal && selectedStudentIndex !== null && (
        <div className="modal-overlay" style={{ zIndex: 10002 }}>
          <div style={{
            background: '#fff',
            width: '70%',
            maxWidth: '500px',
            margin: '30px auto',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            maxHeight: '80vh'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-user-edit" style={{ fontSize: '1.3rem' }}></i>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
                  Ghi nhận kết quả tiêm chủng
                </h3>
              </div>
              <button
                onClick={() => setShowVaccinationDetailModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
              {(() => {
                const student = recordResultsList[selectedStudentIndex];
                return (
                  <div>
                    {/* Thông tin học sinh */}
                    <div style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      padding: '16px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h4 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: '1.1rem' }}>
                        <i className="fas fa-user" style={{ marginRight: '8px', color: '#667eea' }}></i>
                        Thông tin học sinh
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <strong>Mã học sinh:</strong> {student?.userID || 'Không rõ'}
                        </div>
                        <div>
                          <strong>Tên học sinh:</strong> {student?.name || 'Không rõ tên'}
                        </div>
                        <div>
                          <strong>Lớp:</strong> {student?.classID || 'Không rõ'}
                        </div>
                        <div>
                          <strong>Trạng thái hiện tại:</strong>
                          <span style={{
                            marginLeft: '8px',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: 'white',
                            backgroundColor: getVaccinationStatusColor(student?.vaccinationStatus),
                            display: 'inline-block'
                          }}>
                            {getVaccinationStatusText(student?.vaccinationStatus)}
                          </span>
                        </div>
                      </div>
                    </div>

                                         {/* Form ghi nhận kết quả */}
                     <form>
                       {/* Trạng thái tiêm chủng */}
                       <div style={{ marginBottom: '16px' }}>
                         <label style={{
                           display: 'block',
                           marginBottom: '8px',
                           fontWeight: '600',
                           color: '#374151'
                         }}>
                           <i className="fas fa-clipboard-check" style={{ marginRight: '8px', color: '#667eea' }}></i>
                           Trạng thái tiêm chủng *
                         </label>
                         <select
                           style={{
                             width: '100%',
                             padding: '10px',
                             borderRadius: '8px',
                             border: '1px solid #d1d5db',
                             fontSize: '0.95rem',
                             background: '#fff'
                           }}
                           value={student.vaccinationStatus || 'Pending'}
                           onChange={(e) => handleVaccinationStatusChange(selectedStudentIndex, e.target.value)}
                         >
                           <option value="Completed">Đã tiêm thành công</option>
                           <option value="Failed">Tiêm không thành công</option>
                           <option value="Postponed">Hoãn tiêm</option>
                           <option value="Refused">Từ chối tiêm</option>
                         </select>
                       </div>

                       {/* Ngày thực tế tiêm - chỉ hiển thị khi Completed */}
                       {student.vaccinationStatus === 'Completed' && (
                         <div style={{ marginBottom: '20px' }}>
                           <label style={{
                             display: 'block',
                             marginBottom: '8px',
                             fontWeight: '600',
                             color: '#374151'
                           }}>
                             <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#667eea' }}></i>
                             Ngày thực tế tiêm *
                           </label>
                           <input
                             type="date"
                             style={{
                               width: '100%',
                               padding: '12px',
                               borderRadius: '8px',
                               border: '1px solid #d1d5db',
                               fontSize: '1rem',
                               background: '#fff'
                             }}
                             value={student.actualVaccinationDate || ''}
                             onChange={(e) => handleVaccinationDateChange(selectedStudentIndex, e.target.value)}
                           />
                         </div>
                       )}

                       {/* Người thực hiện tiêm - chỉ hiển thị khi Completed */}
                       {student.vaccinationStatus === 'Completed' && (
                         <div style={{ marginBottom: '20px' }}>
                           <label style={{
                             display: 'block',
                             marginBottom: '8px',
                             fontWeight: '600',
                             color: '#374151'
                           }}>
                             <i className="fas fa-user-md" style={{ marginRight: '8px', color: '#667eea' }}></i>
                             Người thực hiện tiêm *
                           </label>
                           <input
                             type="text"
                             placeholder="Nhập tên người thực hiện..."
                             style={{
                               width: '100%',
                               padding: '12px',
                               borderRadius: '8px',
                               border: '1px solid #d1d5db',
                               fontSize: '1rem',
                               background: '#fff'
                             }}
                             value={student.performer || ''}
                             onChange={(e) => handlePerformerChange(selectedStudentIndex, e.target.value)}
                           />
                         </div>
                       )}

                       {/* Phản ứng sau tiêm - chỉ hiển thị khi Completed */}
                       {student.vaccinationStatus === 'Completed' && (
                         <div style={{ marginBottom: '20px' }}>
                           <label style={{
                             display: 'block',
                             marginBottom: '8px',
                             fontWeight: '600',
                             color: '#374151'
                           }}>
                             <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px', color: '#667eea' }}></i>
                             Phản ứng sau tiêm
                           </label>
                           <textarea
                             placeholder="Mô tả phản ứng sau tiêm (nếu có)..."
                             style={{
                               width: '100%',
                               padding: '12px',
                               borderRadius: '8px',
                               border: '1px solid #d1d5db',
                               fontSize: '1rem',
                               background: '#fff',
                               minHeight: '80px',
                               resize: 'vertical'
                             }}
                             value={student.postVaccinationReaction || ''}
                             onChange={(e) => handlePostVaccinationReactionChange(selectedStudentIndex, e.target.value)}
                           />
                         </div>
                       )}

                       {/* Lý do hoãn - chỉ hiển thị khi Postponed */}
                       {student.vaccinationStatus === 'Postponed' && (
                         <div style={{ marginBottom: '20px' }}>
                           <label style={{
                             display: 'block',
                             marginBottom: '8px',
                             fontWeight: '600',
                             color: '#374151'
                           }}>
                             <i className="fas fa-clock" style={{ marginRight: '8px', color: '#667eea' }}></i>
                             Lý do hoãn tiêm *
                           </label>
                           <textarea
                             placeholder="Nhập lý do hoãn tiêm..."
                             style={{
                               width: '100%',
                               padding: '12px',
                               borderRadius: '8px',
                               border: '1px solid #d1d5db',
                               fontSize: '1rem',
                               background: '#fff',
                               minHeight: '80px',
                               resize: 'vertical'
                             }}
                             value={student.postponementReason || ''}
                             onChange={(e) => handlePostponementReasonChange(selectedStudentIndex, e.target.value)}
                           />
                         </div>
                       )}

                       {/* Lý do thất bại - chỉ hiển thị khi Failed */}
                       {student.vaccinationStatus === 'Failed' && (
                         <div style={{ marginBottom: '20px' }}>
                           <label style={{
                             display: 'block',
                             marginBottom: '8px',
                             fontWeight: '600',
                             color: '#374151'
                           }}>
                             <i className="fas fa-times-circle" style={{ marginRight: '8px', color: '#667eea' }}></i>
                             Lý do tiêm không thành công *
                           </label>
                           <textarea
                             placeholder="Nhập lý do tiêm không thành công..."
                             style={{
                               width: '100%',
                               padding: '12px',
                               borderRadius: '8px',
                               border: '1px solid #d1d5db',
                               fontSize: '1rem',
                               background: '#fff',
                               minHeight: '80px',
                               resize: 'vertical'
                             }}
                             value={student.failureReason || ''}
                             onChange={(e) => handleFailureReasonChange(selectedStudentIndex, e.target.value)}
                           />
                         </div>
                       )}

                       {/* Lý do từ chối - chỉ hiển thị khi Refused */}
                       {student.vaccinationStatus === 'Refused' && (
                         <div style={{ marginBottom: '20px' }}>
                           <label style={{
                             display: 'block',
                             marginBottom: '8px',
                             fontWeight: '600',
                             color: '#374151'
                           }}>
                             <i className="fas fa-ban" style={{ marginRight: '8px', color: '#667eea' }}></i>
                             Lý do từ chối tiêm *
                           </label>
                           <textarea
                             placeholder="Nhập lý do từ chối tiêm..."
                             style={{
                               width: '100%',
                               padding: '12px',
                               borderRadius: '8px',
                               border: '1px solid #d1d5db',
                               fontSize: '1rem',
                               background: '#fff',
                               minHeight: '80px',
                               resize: 'vertical'
                             }}
                             value={student.refusalReason || ''}
                             onChange={(e) => handleRefusalReasonChange(selectedStudentIndex, e.target.value)}
                           />
                         </div>
                       )}

                       {/* Ghi chú chung */}
                       <div style={{ marginBottom: '20px' }}>
                         <label style={{
                           display: 'block',
                           marginBottom: '8px',
                           fontWeight: '600',
                           color: '#374151'
                         }}>
                           <i className="fas fa-comment-alt" style={{ marginRight: '8px', color: '#667eea' }}></i>
                           Ghi chú chung
                         </label>
                         <textarea
                           placeholder="Nhập ghi chú chung..."
                           style={{
                             width: '100%',
                             padding: '12px',
                             borderRadius: '8px',
                             border: '1px solid #d1d5db',
                             fontSize: '1rem',
                             background: '#fff',
                             minHeight: '80px',
                             resize: 'vertical'
                           }}
                           value={student.notes || ''}
                           onChange={(e) => handleVaccinationNotesChange(selectedStudentIndex, e.target.value)}
                         />
                       </div>

                       {/* Cần liên hệ phụ huynh */}
                       <div style={{ marginBottom: '20px' }}>
                         <label style={{
                           display: 'flex',
                           alignItems: 'center',
                           marginBottom: '8px',
                           fontWeight: '600',
                           color: '#374151',
                           cursor: 'pointer'
                         }}>
                           <input
                             type="checkbox"
                             style={{
                               marginRight: '8px',
                               transform: 'scale(1.2)'
                             }}
                             checked={student.needToContactParent || false}
                             onChange={(e) => handleNeedToContactParentChange(selectedStudentIndex, e.target.checked)}
                           />
                           <i className="fas fa-phone" style={{ marginRight: '8px', color: '#667eea' }}></i>
                           Cần liên hệ phụ huynh
                         </label>
                       </div>
                     </form>
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 20px',
              background: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                onClick={() => setShowVaccinationDetailModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db',
                  background: '#ffffff',
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                Hủy
              </button>
              <button
                onClick={handleSaveVaccinationDetail}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 8px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)';
                }}
              >
                <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                Lưu kết quả
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VaccinationManagement;
