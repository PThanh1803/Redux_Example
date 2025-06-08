// Form configuration constants
export const STORAGE_KEY = 'edtronaut-form-data';

export const FORM_STEPS = [
  { 
    id: 1,
    label: 'Chọn vai trò', 
    key: 'role',
    description: 'Chọn vai trò phù hợp với bạn'
  },
  { 
    id: 2,
    label: 'Thông tin cá nhân', 
    key: 'personal',
    description: 'Điền thông tin cá nhân của bạn'
  },
  { 
    id: 3,
    label: 'Nội dung chia sẻ', 
    key: 'content',
    description: 'Chọn nội dung bạn muốn chia sẻ'
  }
];

export const ROLE_OPTIONS = [
  {
    value: 'mentor',
    label: 'Mentor',
    description: 'Hướng dẫn và chia sẻ kinh nghiệm với học viên'
  },
  {
    value: 'educator',
    label: 'Giảng viên', 
    description: 'Giảng dạy và truyền đạt kiến thức chuyên môn'
  }
];

export const GREETING_OPTIONS = [
  { value: 'anh', label: 'Anh' },
  { value: 'chi', label: 'Chị' },
  { value: 'ban', label: 'Bạn' }
];

export const MENTEE_LEVEL_OPTIONS = [
  'Sinh viên mới tốt nghiệp',
  'Junior',
  'Mid-level',
  'Senior'
];

export const CONTENT_SHARING_OPTIONS = [
  'Career coach',
  'Định hướng học tập',
  'Kỹ năng phỏng vấn',
  'Phát triển kỹ năng mềm',
  'Lập trình cơ bản',
  'Công nghệ mới',
  'Quản lý dự án',
  'Khởi nghiệp'
];



export const YEARS_OF_EXPERIENCE_OPTIONS = [  
  'Dưới 1 năm',
  '1-3 năm',
  '3-5 năm',
  'Trên 5 năm'
];
export const AREA_OF_EXPERTISE_OPTIONS = [
  'Lập trình web',
  'Lập trình di động',
  'Khoa học dữ liệu',
  'Trí tuệ nhân tạo',
  'Quản lý dự án',
  'Thiết kế UX/UI'
];


export const EDUCATION_BACKGROUND_OPTIONS = [
  'Cao đẳng',
  'Đại học',
  'Thạc sĩ',
  'Tiến sĩ',
  'Giáo sư'
];