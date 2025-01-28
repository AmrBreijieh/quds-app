export const navigationData = [
  {
    title: "الرئيسية",
    path: "/",
    icon: "HomeIcon",
    subMenu: [],
  },
  {
    title: "أسئلة التؤوريا",
    path: "/teoria",
    icon: "QuizIcon",
    subMenu: [
      { title: "أسئلة تؤوريا خصوصي", path: "/teoria/private" },
      { title: "أسئلة تؤوريا شحن خفيف", path: "/teoria/light" },
      { title: "أسئلة تؤوريا شحن ثقيل", path: "/teoria/heavy" },
      { title: "أسئلة تؤوريا عمومي", path: "/teoria/taxi" },
      { title: "أسئلة تؤوريا دراجة نارية", path: "/teoria/motorcycle" },
      { title: "أسئلة تؤوريا تراكتور", path: "/teoria/tractor" },
    ],
  },
  {
    title: "دراسة التؤوريا",
    path: "studyTeoria",
    icon: "BookIcon",
    subMenu: [
      { title: "اشارات المرور", path: "/studyTeoria/signals" },
      { title: "كتاب التؤوريا", path: "/studyTeoria/book" },
    ],
  },
  {
    title: "الحصول على رخصة",
    path: "/license",
    icon: "DriveEtaIcon",
    subMenu: [
      { title: "إجراءات رخصة السياقة", path: "/license/steps" },
      { title: "مواعيد خدمات الدوائر", path: "/license/services" },
      { title: "اسعار الدروس والتستات", path: "/license/pricing/lessons" },
      { title: "اسعار الدورات الاستكمالية", path: "/license/pricing/courses" },
    ],
  },
  {
    title: "اتصل بنا",
    path: "/contact",
    icon: "PhoneIcon",
    subMenu: [],
  },
];
