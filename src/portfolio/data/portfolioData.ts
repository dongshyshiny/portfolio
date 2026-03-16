export const navItems = ['about', 'skills', 'experience', 'projects', 'contact'];

export const typewriterWords = ['React Developer', 'Mobile Engineer', 'Team Leader', 'Problem Solver'];

export const skills = [
  { category: 'Frontend', icon: '🎨', items: ['React', 'React Native', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Redux', 'Next.js'], color: '#a78bfa' },
  { category: 'Mobile', icon: '📱', items: ['React Native', 'iOS', 'Android', 'Expo', 'App Store & Play Store'], color: '#c084fc' },
  { category: 'Backend', icon: '⚡', items: ['Node.js', 'Express.js', 'Java', 'Spring Boot', 'REST API', 'GraphQL'], color: '#22d3ee' },
  { category: 'Database', icon: '🗄️', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase'], color: '#34d399' },
  { category: 'DevOps & CI/CD', icon: '🚀', items: ['Docker', 'GitHub Actions', 'Jenkins', 'AWS', 'Nginx', 'Linux'], color: '#fbbf24' },
  { category: 'Tools', icon: '🛠️', items: ['Git', 'Jira', 'Figma', 'VS Code', 'Postman', 'Swagger'], color: '#fb7185' },
];

export const experiences = [
  {
    role: 'Lead Frontend Developer',
    company: 'Alohub',
    period: 'Nov 2022 — Present',
    description: 'Lead frontend & mobile team building a contact center platform with CRM, omnichannel communication, and real-time call management. Architect and develop WebApp & mobile applications for the Alohub ecosystem.',
    techs: ['React', 'React Native', 'TypeScript', 'Redux Toolkit', 'SCSS', 'Java', 'GitLab CI/CD', 'SQL'],
  },
  {
    role: 'Frontend Developer',
    company: 'InfoPlus',
    period: 'May 2022 — Feb 2025',
    description: 'Built WebApp & Backoffice systems for banking clients including Viet A Bank, BIDV, Woori Bank, and Shinhan Bank. Developed financial automation platforms powered by Korean fintech technology.',
    techs: ['React', 'TypeScript', 'Redux Toolkit', 'SCSS', 'Java', 'GitLab CI/CD', 'SQL'],
  },
  {
    role: 'Frontend Developer',
    company: 'Merchize',
    period: 'Apr 2019 — Apr 2022',
    description: 'Developed StoreFront app for sellers, Fulfillment app for order management & design approval, and Production app for manufacturing workflow including QC, packaging, labeling, and shipment tracking. Served global e-commerce customers (US & EU markets).',
    techs: ['React', 'Node.js', 'MongoDB', 'GitLab CI/CD'],
  },
  {
    role: 'Web Developer',
    company: 'Foobla',
    period: 'Jul 2014 — Apr 2019',
    description: 'Developed and customized WordPress themes (Charity, Eduma, Adot...) sold on ThemeForest marketplace. Provided technical support for customers including installation, issue resolution, and customization.',
    techs: ['WordPress', 'HTML/CSS', 'JavaScript', 'jQuery'],
  },
];

export interface Project {
  title: string;
  description: string;
  techs: string[];
  gradient: string;
  company: string;
  image: string;
  role: string;
  period: string;
  features: string[];
  highlights?: string[];
  url?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export const projects: Project[] = [
  // === Alohub ===
  {
    title: 'Alohub Mobile App',
    description: 'Ứng dụng mobile contact center cho iOS & Android — quản lý cuộc gọi, chat, CRM, và chăm sóc khách hàng ngay trên điện thoại.',
    techs: ['React Native', 'TypeScript', 'Redux Toolkit', 'VoIP/SIP'],
    gradient: 'linear-gradient(135deg, #7c3aed, #2563eb)',
    company: 'Alohub',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=700&h=300&fit=crop',
    role: 'Lead Mobile Developer',
    period: 'Nov 2022 — Present',
    features: [
      'Gọi VoIP/SIP trực tiếp từ app',
      'Chat real-time với khách hàng',
      'Quản lý danh bạ & CRM',
      'Push notification cho cuộc gọi đến',
      'Lịch sử cuộc gọi & ghi âm',
      'Hỗ trợ cả iOS và Android',
    ],
    highlights: ['10,000+ downloads', 'Rating 4.5+ trên App Store & Play Store'],
    appStoreUrl: 'https://apps.apple.com/vn/app/alohub-next/id6752806322?l=vi',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.callalohub&pcampaignid=web_share',
  },
  {
    title: 'Alohub WebApp',
    description: 'Nền tảng tổng đài & contact center trên web — tích hợp cuộc gọi real-time, omnichannel (call, chat, email, SMS), quản lý ticket và báo cáo thống kê.',
    techs: ['React', 'TypeScript', 'Redux Toolkit', 'SCSS', 'WebSocket'],
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    company: 'Alohub',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&h=300&fit=crop',
    role: 'Lead Frontend Developer',
    period: 'Nov 2022 — Present',
    features: [
      'Softphone tích hợp trên web browser',
      'Omnichannel: call, chat, email, SMS',
      'Dashboard real-time thống kê cuộc gọi',
      'Quản lý ticket & workflow',
      'Phân quyền agent/supervisor/admin',
      'Ghi âm & playback cuộc gọi',
    ],
    url: 'https://alohub.vn',
  },
  {
    title: 'Info CMS',
    description: 'Phần mềm quản lý admin cho hệ thống ngân hàng & thu hộ — cho phép cấu hình hợp đồng, quản lý ECC (Electronic Collection Center), ACC (Auto Collection Center), và nhiều tính năng nghiệp vụ ngân hàng.',
    techs: ['React', 'TypeScript', 'Redux Toolkit', 'Java', 'SQL', 'REST API'],
    gradient: 'linear-gradient(135deg, #a78bfa, #818cf8)',
    company: 'Alohub',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=300&fit=crop',
    role: 'Lead Frontend Developer',
    period: 'Nov 2022 — Present',
    features: [
      'Cấu hình & quản lý hợp đồng thu hộ',
      'Quản lý ECC (Electronic Collection Center)',
      'Quản lý ACC (Auto Collection Center)',
      'Cấu hình phí dịch vụ & biểu phí ngân hàng',
      'Quản lý đối tác & merchant thu hộ',
      'Phân quyền RBAC theo chi nhánh ngân hàng',
      'Báo cáo đối soát giao dịch & export dữ liệu',
      'Quản lý danh mục dịch vụ thanh toán',
    ],
    highlights: ['Phục vụ nhiều ngân hàng đối tác', 'Xử lý nghiệp vụ thu hộ phức tạp'],
  },
  // === InfoPlus ===
  {
    title: 'Banking Backoffice Systems',
    description: 'WebApp & Backoffice cho hệ thống thu hộ ngân hàng Việt Á, BIDV, Woori Bank, Shinhan Bank — dịch vụ tài chính tự động trên nền tảng công nghệ Hàn Quốc.',
    techs: ['React', 'TypeScript', 'Redux Toolkit', 'Java', 'SQL'],
    gradient: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
    company: 'InfoPlus',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=700&h=300&fit=crop',
    role: 'Frontend Developer',
    period: 'May 2022 — Feb 2025',
    features: [
      'Quản lý giao dịch thu hộ tự động',
      'Dashboard thống kê tài chính',
      'Backoffice cho nhân viên ngân hàng',
      'Quản lý khách hàng & hợp đồng',
      'Đối soát & báo cáo giao dịch',
      'Tích hợp nhiều ngân hàng đối tác',
    ],
    highlights: ['Phục vụ 4+ ngân hàng lớn', 'Xử lý hàng nghìn giao dịch/ngày'],
  },
  // === Merchize ===
  {
    title: 'Merchize StoreFront',
    description: 'WebApp cho nhà bán hàng (Seller) — quản lý shop, sản phẩm, thiết kế, đơn hàng trên nền tảng print-on-demand phục vụ thị trường EU & US.',
    techs: ['React', 'Node.js', 'MongoDB', 'GitLab CI/CD'],
    gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    company: 'Merchize',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&h=300&fit=crop',
    role: 'Frontend Developer',
    period: 'Apr 2019 — Apr 2022',
    features: [
      'Tạo & quản lý shop online',
      'Upload thiết kế & mockup sản phẩm',
      'Quản lý đơn hàng real-time',
      'Tích hợp thanh toán quốc tế',
      'Theo dõi tracking & shipment',
      'Dashboard doanh thu & analytics',
    ],
    highlights: ['Phục vụ thị trường EU & US', 'Hàng nghìn seller active'],
    url: 'https://merchize.com',
  },
  {
    title: 'Merchize Fulfillment (FFM)',
    description: 'WebApp cho bộ phận Fulfillment — kiểm soát đơn hàng, phân loại sản phẩm, phê duyệt thiết kế trước khi đưa vào sản xuất.',
    techs: ['React', 'Node.js', 'MongoDB', 'REST API'],
    gradient: 'linear-gradient(135deg, #f472b6, #a78bfa)',
    company: 'Merchize',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=700&h=300&fit=crop',
    role: 'Frontend Developer',
    period: 'Apr 2019 — Apr 2022',
    features: [
      'Kiểm soát & phân loại đơn hàng',
      'Phê duyệt thiết kế trước sản xuất',
      'Quản lý kho & inventory',
      'Scan barcode đơn hàng',
      'Dashboard theo dõi tiến độ',
      'Báo cáo fulfillment rate',
    ],
  },
  {
    title: 'Merchize Production',
    description: 'WebApp cho xưởng sản xuất — quản lý quy trình sản xuất, QC, đóng gói, dán label, theo dõi tracking cho tới khi sản phẩm giao tới khách hàng.',
    techs: ['React', 'Node.js', 'MongoDB', 'REST API'],
    gradient: 'linear-gradient(135deg, #e879f9, #7c3aed)',
    company: 'Merchize',
    image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=700&h=300&fit=crop',
    role: 'Frontend Developer',
    period: 'Apr 2019 — Apr 2022',
    features: [
      'Quản lý quy trình sản xuất step-by-step',
      'QC kiểm tra chất lượng sản phẩm',
      'In & dán label tự động',
      'Đóng gói & cân nặng',
      'Tạo tracking number & shipping label',
      'Theo dõi đơn hàng đến tay khách',
    ],
  },
  // === Foobla ===
  {
    title: 'Eduma - Education WordPress Theme',
    description: 'Theme giáo dục bán chạy trên ThemeForest — hỗ trợ LMS, khóa học online, quản lý học viên. Phát triển và customize theo yêu cầu khách hàng.',
    techs: ['WordPress', 'PHP', 'JavaScript', 'jQuery', 'HTML/CSS'],
    gradient: 'linear-gradient(135deg, #10b981, #3b82f6)',
    company: 'Foobla',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=700&h=300&fit=crop',
    role: 'Web Developer',
    period: 'Jul 2014 — Apr 2019',
    features: [
      'Hệ thống LMS quản lý khóa học',
      'Trang bán khóa học online',
      'Quản lý giảng viên & học viên',
      'Tích hợp thanh toán WooCommerce',
      'Responsive trên mọi thiết bị',
      'Hỗ trợ đa ngôn ngữ',
    ],
    highlights: ['Best-seller trên ThemeForest', 'Hàng nghìn khách hàng toàn cầu'],
  },
  {
    title: 'Starter Theme & Other Themes',
    description: 'Phát triển và hỗ trợ kỹ thuật các theme WordPress — Starter, starter developer ... trên ThemeForest marketplace.',
    techs: ['WordPress', 'PHP', 'JavaScript', 'jQuery', 'HTML/CSS'],
    gradient: 'linear-gradient(135deg, #34d399, #2563eb)',
    company: 'Foobla',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&h=300&fit=crop',
    role: 'Web Developer',
    period: 'Jul 2014 — Apr 2019',
    features: [
      'Theme framework cho developer',
      'Customize theo yêu cầu khách hàng',
      'Tối ưu SEO & performance',
      'Hỗ trợ kỹ thuật qua ticket system',
      'Cài đặt & migration cho khách',
      'Viết documentation & hướng dẫn',
    ],
  },
];

export const projectFilterOptions = ['All', 'Alohub', 'InfoPlus', 'Merchize', 'Foobla'];

export const socials = [
  { href: 'https://github.com/dongshyshiny', label: 'GitHub', path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
  { href: 'https://www.linkedin.com/in/dong-nguyen-577965213/', label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { href: 'mailto:dongshyshiny@gmail.com', label: 'Email', path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
];
