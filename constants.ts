
export const ISO_SEGMENTS = [
  { key: 'project', label: 'المشروع (Project)', pattern: /^[A-Z0-9]{2,10}$/, desc: 'رمز المشروع (2-10 أحرف)' },
  { key: 'originator', label: 'المنشئ (Originator)', pattern: /^[A-Z0-9]{3,6}$/, desc: 'رمز الشركة المنشئة (3-6 أحرف)' },
  { key: 'volume', label: 'المجلد/النظام (Volume/System)', pattern: /^[A-Z0-9]{2}$/, desc: 'رمز المنطقة أو النظام (حرفان)' },
  { key: 'level', label: 'المستوى/الموقع (Level/Location)', pattern: /^[A-Z0-9]{2}$/, desc: 'رمز الطابق أو الموقع (حرفان)' },
  { key: 'type', label: 'النوع (Type)', pattern: /^[A-Z]{2}$/, desc: 'نوع الملف (مثلاً M3 للنماذج)' },
  { key: 'role', label: 'الدور (Role)', pattern: /^[A-Z]{1,2}$/, desc: 'التخصص (مثلاً AR للمعمار)' },
  { key: 'number', label: 'الرقم (Number)', pattern: /^[0-9]{4,6}$/, desc: 'رقم تسلسلي (4-6 أرقام)' },
];

export const VALID_EXTENSIONS = ['.rvt', '.nwc', '.nwd', '.nwf'];

export const ROLE_CODES: Record<string, string> = {
  'AR': 'Architecture (معماري)',
  'ST': 'Structural (إنشائي)',
  'ME': 'Mechanical (ميكانيك)',
  'EL': 'Electrical (كهرباء)',
  'PL': 'Plumbing (صحي)',
  'CO': 'Coordinator (منسق)',
  'CI': 'Civil (مدني)',
};

export const TYPE_CODES: Record<string, string> = {
  'M3': '3D Model (نموذج ثلاثي الأبعاد)',
  'CR': 'Clash Report (تقرير تداخلات)',
  'DR': 'Drawing (رسم)',
  'SP': 'Specification (مواصفة)',
};
