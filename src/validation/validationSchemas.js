import * as yup from 'yup';

export const step1Schema = yup.object({
  role: yup.string().required('Vui lòng chọn vai trò')
});

export const step2Schema = yup.object({
  fullName: yup.string().required('Vui lòng nhập họ và tên'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  phoneNumber: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^\d{10}$/, 'Số điện thoại phải gồm đúng 10 chữ số'),
  greeting: yup.string().required('Vui lòng chọn cách xưng hô'),
  linkedinUrl: yup.string().url('LinkedIn URL không hợp lệ').required('Vui lòng nhập LinkedIn URL'),
  socialMediaUrl: yup.string().url('Social media URL không hợp lệ').required('Vui lòng nhập social media URL')
});

export const step3Schema = yup.object({
  menteeLevel: yup.array().min(1, 'Vui lòng chọn ít nhất một đối tượng mentee'),
  sharingContent: yup.array().min(1, 'Vui lòng chọn ít nhất một nội dung chia sẻ'),
  yearOfExperience: yup.number().when('role', {
    is: 'educator',
    then: (schema) => schema.typeError('Vui lòng nhập số năm kinh nghiệm').min(1, 'Số năm kinh nghiệm phải lớn hơn 0'),
    otherwise: (schema) => schema.optional()
  }),
  areaOfExpertise: yup.string().when('role', {
    is: 'educator', 
    then: (schema) => schema.required('Vui lòng chọn ít nhất một lĩnh vực chuyên môn'),
    otherwise: (schema) => schema.optional()
  }),
  educationBackground: yup.string().when('role', {
    is: 'educator',
    then: (schema) => schema.required('Vui lòng chọn trình độ học vấn'),
    otherwise: (schema) => schema.optional()
  }),
  certifications: yup.array().when('role', {
    is: 'educator',
    then: (schema) => schema.required('Vui lòng chọn chứng chỉ').min(1, 'Vui lòng chọn chứng chỉ'),
    otherwise: (schema) => schema.optional()
  }),
}); 

