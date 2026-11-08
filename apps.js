/* قائمة الأقسام. لإضافة تطبيق جديد: ضع مجلده داخل apps/ ثم أضف سطرا هنا (انظر README.md) */
var APPS = [
  {
    id: "reservation",
    title: "الحجز",
    short: "الحجز",
    sub: "Réservation HAKKI",
    color: "#1f6feb",
    icon: "apps/reservation/icon-192.png",
    path: "apps/reservation/index.html",
    files: ["apps/reservation/index.html", "apps/reservation/icon-192.png", "apps/reservation/icon-512.png"],
    cdn: ["https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"]
  },
  {
    id: "crte",
    title: "CRTE والتحضير",
    short: "CRTE",
    sub: "تقرير الأشغال والاختبارات + ورقة التحضير",
    color: "#d9650b",
    icon: "apps/crte/icon-crte-192.png",
    path: "apps/crte/index.html",
    files: ["apps/crte/index.html", "apps/crte/icon-crte-192.png", "apps/crte/icon-crte-512.png"],
    cdn: ["https://cdn.jsdelivr.net/npm/docx-preview@0.3.3/dist/docx-preview.min.js", "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"]
  },
  {
    id: "mesure",
    title: "القياس",
    short: "القياس",
    sub: "فيش مراقبة واختبار المحول TAZA II",
    color: "#1d5fd0",
    icon: "apps/mesure/icon-v2-192.png",
    path: "apps/mesure/index.html",
    files: ["apps/mesure/index.html", "apps/mesure/icon-v2-192.png", "apps/mesure/icon-v2-512.png", "apps/mesure/template.docx"],
    cdn: []
  },
  {
    id: "postes",
    title: "المحطات",
    short: "المحطات",
    sub: "بحث محطات TAZA وأقسامي",
    color: "#0b3d91",
    icon: "apps/postes/icon-192.png",
    path: "apps/postes/index.html",
    files: ["apps/postes/index.html", "apps/postes/icon-192.png", "apps/postes/icon-512.png"],
    cdn: ["https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js", "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js", "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"]
  }
];
