// Facts for the homepage. Source: veon/client.json only (ids in comments). Nothing here is invented.

export const contacts = {
  // company.contacts.phones[0] — підбір і замовлення запчастин
  phoneMain: { href: "tel:+380676444441", label: "(067) 644-44-41" },
  // company.contacts.phones[1]
  phoneSecond: { href: "tel:+380956444441", label: "(095) 644-44-41" },
  // company.contacts.messengers[0]
  viber: { href: "viber://chat?number=%2B380660154785", label: "(066) 015-47-85" },
  // company.contacts.emails[0]
  email: { href: "mailto:autoklondayk1@gmail.com", label: "autoklondayk1@gmail.com" },
  // company.contacts.addresses[0] (оф. 1 — за більшістю джерел; уточнюється у замовника, I-001)
  address: "вул. Кирилівська, 60П, оф. 1",
  city: "Київ",
  // company.contacts.addresses[1] — опис входу
  entrance:
    "Вхід з дороги з боку трамвайних колій, над входом прапор України. Сходами вгору і в кінець коридору.",
  // company.contacts.hours — збігається в обох джерелах; субота не вказується до підтвердження
  hours: "Пн–Пт 9:00–18:00",
  // company.contacts.maps[0]
  maps: "https://www.google.com.ua/maps/place/%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%BD%D0%B5%D1%82-%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD+%D0%B0%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BF%D1%87%D0%B0%D1%81%D1%82%D0%B5%D0%B9+AUTOKLONDAYK/@50.4695405,30.5071221,15.5z",
  // socials[0] (confirmed)
  instagram: "https://www.instagram.com/autoklondayk/",
  // company.legal_name
  legal: "ФОП Серганов Р. С.",
};

// company.products_services[0] — 20 груп; фото — рубрикатор клієнта (imgbank/_Rubricator, GROUP PARTS), локальні копії
// Для двох груп у клієнта немає фото — лінійна іконка в тому ж квадраті.
export const groups: { name: string; img?: string; icon?: "bolt" | "wrench" }[] = [
  { name: "Гібридний і електричний привід", icon: "bolt" },
  { name: "Випускна система", img: "vypuskna" },
  { name: "Головна передача", img: "holovna-peredacha" },
  { name: "Деталі для сервісу, ТО і догляду", icon: "wrench" },
  { name: "Двигун", img: "dvyhun" },
  { name: "Кондиціонер", img: "kondytsioner" },
  { name: "Коробка передач", img: "korobka" },
  { name: "Опалення і вентиляція", img: "opalennia" },
  { name: "Очищення вікон", img: "ochyshchennia" },
  { name: "Підвіска і ходова частина", img: "pidviska" },
  { name: "Привід колеса", img: "pryvid-kolesa" },
  { name: "Ремінний привід", img: "reminnyi" },
  { name: "Рульове керування", img: "rulove" },
  { name: "Система охолодження", img: "okholodzhennia" },
  { name: "Запалювання і розжарювання", img: "zapalennia" },
  { name: "Зчеплення", img: "zcheplennia" },
  { name: "Паливна система", img: "palyvna" },
  { name: "Гальмівна система", img: "halma" },
  { name: "Фільтри", img: "filtry" },
  { name: "Електроніка", img: "elektronika" },
];

// facts C-005: блок «Запчасти на AUDI … VW» для 25 марок на головній клієнта (veon/research/home.html, /cars/…)
export const brands = [
  "Audi", "BMW", "Chevrolet", "Citroën", "Daewoo", "Fiat", "Ford", "Honda", "Hyundai", "Kia",
  "Land Rover", "Mazda", "Mercedes-Benz", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Porsche",
  "Renault", "Seat", "Škoda", "Subaru", "Suzuki", "Toyota", "Volkswagen",
];

export const SOON = "Розділ у розробці";
