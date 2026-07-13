// Dummy car catalog used to power the cascading brand → model → category
// dropdowns. Stands in for a real /general/car-* backend.

export const CAR_BRANDS = [
  { id: "toyota", name: { ar: "تويوتا", en: "Toyota" } },
  { id: "hyundai", name: { ar: "هيونداي", en: "Hyundai" } },
  { id: "kia", name: { ar: "كيا", en: "Kia" } },
  { id: "nissan", name: { ar: "نيسان", en: "Nissan" } },
  { id: "chevrolet", name: { ar: "شيفروليه", en: "Chevrolet" } },
];

export const CAR_MODELS = {
  toyota: [
    { id: "corolla", name: { ar: "كورولا", en: "Corolla" } },
    { id: "camry", name: { ar: "كامري", en: "Camry" } },
    { id: "yaris", name: { ar: "يارس", en: "Yaris" } },
  ],
  hyundai: [
    { id: "elantra", name: { ar: "النترا", en: "Elantra" } },
    { id: "tucson", name: { ar: "توسان", en: "Tucson" } },
    { id: "accent", name: { ar: "أكسنت", en: "Accent" } },
  ],
  kia: [
    { id: "cerato", name: { ar: "سيراتو", en: "Cerato" } },
    { id: "sportage", name: { ar: "سبورتاج", en: "Sportage" } },
  ],
  nissan: [
    { id: "sunny", name: { ar: "صني", en: "Sunny" } },
    { id: "sentra", name: { ar: "سنترا", en: "Sentra" } },
  ],
  chevrolet: [
    { id: "optra", name: { ar: "أوبترا", en: "Optra" } },
    { id: "aveo", name: { ar: "أفيو", en: "Aveo" } },
  ],
};

export const CAR_CATEGORIES = {
  corolla: [{ id: "sedan", name: { ar: "سيدان", en: "Sedan" } }],
  camry: [{ id: "sedan", name: { ar: "سيدان", en: "Sedan" } }],
  yaris: [
    { id: "hatchback", name: { ar: "هاتشباك", en: "Hatchback" } },
    { id: "sedan", name: { ar: "سيدان", en: "Sedan" } },
  ],
  elantra: [{ id: "sedan", name: { ar: "سيدان", en: "Sedan" } }],
  tucson: [{ id: "suv", name: { ar: "دفع رباعي", en: "SUV" } }],
  accent: [
    { id: "sedan", name: { ar: "سيدان", en: "Sedan" } },
    { id: "hatchback", name: { ar: "هاتشباك", en: "Hatchback" } },
  ],
  cerato: [{ id: "sedan", name: { ar: "سيدان", en: "Sedan" } }],
  sportage: [{ id: "suv", name: { ar: "دفع رباعي", en: "SUV" } }],
  sunny: [{ id: "sedan", name: { ar: "سيدان", en: "Sedan" } }],
  sentra: [{ id: "sedan", name: { ar: "سيدان", en: "Sedan" } }],
  optra: [{ id: "sedan", name: { ar: "سيدان", en: "Sedan" } }],
  aveo: [{ id: "hatchback", name: { ar: "هاتشباك", en: "Hatchback" } }],
};
