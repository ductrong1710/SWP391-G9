import apiClient from './apiClient';

const healthRecordService = {
    // Lấy tất cả health records
    getAllHealthRecords: async () => {
        try {
            const response = await apiClient.get('/HealthRecord');
            console.log('GET /HealthRecord response:', response); // Thêm dòng này


            // Đảm bảo dữ liệu trả về là một mảng
            const records = Array.isArray(response.data) ? response.data : [response.data];

            // Chuyển đổi dữ liệu để phù hợp với frontend
            const formattedRecords = records.map(record => ({
                healthRecordId: record.healthRecordId,
                studentId: record.studentId,
                studentName: record.student?.fullName || '',
                studentClass: record.student?.className || '',
                recordDate: record.recordDate || new Date().toISOString(),
                allergies: record.allergies || '',
                chronicDiseases: record.chronicDiseases || '',
                treatmentHistory: record.treatmentHistory || '',
                eyesight: record.eyesight || '',
                hearing: record.hearing || '',
                vaccinationHistory: record.vaccinationHistory || '',
                note: record.note || '',
                parentContact: record.parentContact || '',
                parentId: record.parentId || ''
            }));

            return formattedRecords;
        } catch (error) {
            console.error('Error fetching health records:', error);
            // Trả về mảng rỗng trong trường hợp lỗi
            return [];
        }
    },

    // Lấy health record bằng ID
    getHealthRecordById: async (id) => {
        try {
            const response = await apiClient.get(`/HealthRecord/${id}`);
            const record = response.data;

            return {
                healthRecordId: record.healthRecordId,
                studentId: record.studentId,
                studentName: record.student?.fullName || '',
                studentClass: record.student?.className || '',
                recordDate: record.recordDate || new Date().toISOString(),
                allergies: record.allergies || '',
                chronicDiseases: record.chronicDiseases || '',
                treatmentHistory: record.treatmentHistory || '',
                eyesight: record.eyesight || '',
                hearing: record.hearing || '',
                vaccinationHistory: record.vaccinationHistory || '',
                note: record.note || '',
                parentContact: record.parentContact || '',
                parentId: record.parentId || ''
            };
        } catch (error) {
            console.error(`Error fetching health record with ID ${id}:`, error);
            throw error;
        }
    },

    // Lấy health records theo student ID
    getHealthRecordsByStudentId: async (studentId) => {
        try {
            const response = await apiClient.get(`/HealthRecord/student/${studentId}`);

            // Trong trường hợp backend trả về một record đơn lẻ thay vì mảng
            let records = [];
            if (response.data) {
                records = Array.isArray(response.data) ? response.data : [response.data];
            }

            // Chuyển đổi dữ liệu để phù hợp với frontend
            const formattedRecords = records.map(record => ({
                healthRecordId: record.healthRecordId,
                studentId: record.studentId,
                studentName: record.student?.fullName || '',
                studentClass: record.student?.className || '',
                recordDate: record.recordDate || new Date().toISOString(),
                allergies: record.allergies || '',
                chronicDiseases: record.chronicDiseases || '',
                treatmentHistory: record.treatmentHistory || '',
                eyesight: record.eyesight || '',
                hearing: record.hearing || '',
                vaccinationHistory: record.vaccinationHistory || '',
                note: record.note || '',
                parentContact: record.parentContact || '',
                parentId: record.parentId || ''
            }));

            console.log('Formatted health records:', formattedRecords);
            return formattedRecords;
        } catch (error) {
            console.error(`Error fetching health records for student ${studentId}:`, error);
            // Trả về mảng rỗng trong trường hợp lỗi
            return [];
        }
    },

    // Tạo health record mới
    createHealthRecord: async (healthRecordData) => {
        try {
            // Đảm bảo dữ liệu phù hợp với model backend
            const formattedData = {
                healthRecordId: healthRecordData.healthRecordId || '00000000-0000-0000-0000-000000000000', // Default Guid for new record
                studentId: healthRecordData.studentId,
                parentId: healthRecordData.parentId || localStorage.getItem('userId') || '',
                allergies: healthRecordData.allergies || '',
                chronicDiseases: healthRecordData.chronicDiseases || '',
                treatmentHistory: healthRecordData.treatmentHistory || '',
                eyesight: healthRecordData.eyesight || '',
                hearing: healthRecordData.hearing || '',
                vaccinationHistory: healthRecordData.vaccinationHistory || '',
                note: healthRecordData.note || '',
                parentContact: healthRecordData.parentContact || localStorage.getItem('userContact') || '',
                recordDate: healthRecordData.recordDate || new Date().toISOString()
            };

            console.log('Sending health record data to API:', formattedData);
            const response = await apiClient.post('/HealthRecord', formattedData);
            return response.data;
        } catch (error) {
            console.error('Error creating health record:', error);
            throw error;
        }
    },

    // Cập nhật health record
    updateHealthRecord: async (id, healthRecordData) => {
        try {
            // Đảm bảo dữ liệu phù hợp với model backend
            const formattedData = {
                healthRecordId: id,
                studentId: healthRecordData.studentId,
                parentId: healthRecordData.parentId || localStorage.getItem('userId') || '',
                allergies: healthRecordData.allergies || '',
                chronicDiseases: healthRecordData.chronicDiseases || '',
                treatmentHistory: healthRecordData.treatmentHistory || '', eyesight: healthRecordData.eyesight || '',
                hearing: healthRecordData.hearing || '',
                vaccinationHistory: healthRecordData.vaccinationHistory || '',
                note: healthRecordData.note || '',
                parentContact: healthRecordData.parentContact || localStorage.getItem('userContact') || '',
                recordDate: healthRecordData.recordDate || new Date().toISOString()
            };

            console.log('Updating health record data:', formattedData);
            const response = await apiClient.put(`/HealthRecord/${id}`, formattedData);
            return response.data;
        } catch (error) {
            console.error(`Error updating health record with ID ${id}:`, error);
            throw error;
        }
    },

    // Xóa health record
    deleteHealthRecord: async (id) => {
        try {
            const response = await apiClient.delete(`/HealthRecord/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting health record with ID ${id}:`, error);
            throw error;
        }
    },
    // Kiểm tra kết nối với backend
    checkBackendConnection: async () => {
        try {
            // Gọi đúng endpoint REST
            const response = await apiClient.get('/HealthRecord');
            if (response && (Array.isArray(response.data) || typeof response.data === 'object')) {
                return { connected: true, message: 'Kết nối thành công với backend' };
            }
            return { connected: false, message: 'API trả về dữ liệu không hợp lệ.' };
        } catch (error) {
            console.error('Backend connection error:', error);
            if (error.code === 'ERR_NETWORK') {
                return { connected: false, message: 'Không thể kết nối với backend. Hãy đảm bảo rằng backend đang chạy và cổng 5284 đang được mở.' };
            }
            if (error.response) {
                if (error.response.status === 401) {
                    return { connected: false, message: 'Không có quyền truy cập API. Vui lòng đăng nhập lại.' };
                }
                if (error.response.status === 404) {
                    return { connected: false, message: 'Không tìm thấy API endpoint. Vui lòng kiểm tra lại đường dẫn.' };
                }
                return { connected: false, message: `Lỗi từ server: ${error.response.status} - ${error.response.statusText}` };
            }
            return { connected: false, message: 'Không thể kết nối với backend. Vui lòng kiểm tra lại cấu hình hoặc liên hệ quản trị viên.' };
        }
    },
};

export default healthRecordService;
