import { Property } from '@/types';

export const DISTRICTS = ['Сино', 'Фирдавси', 'Исмоили Сомони', 'Шохмансур'];
export const USD_TO_TJS = 10.9;

export function formatPrice(amount: number, currency: 'USD' | 'TJS'): string {
  if (currency === 'USD') return `$${amount.toLocaleString('ru-RU')}`;
  return `${amount.toLocaleString('ru-RU')} сом.`;
}

const ru = (s: string) => ({ tj: s, ru: s, en: s });

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: ru('3-комнатная квартира в центре'),
    description: ru('Светлая просторная квартира с евроремонтом в самом центре Душанбе. Рядом парк, магазины, остановки. Мебель и техника включены. Отличный вариант для семьи.'),
    type: 'apartment', listingType: 'sale',
    priceUSD: 85000, priceTJS: 926500,
    area: 85, rooms: 3, floor: 5, totalFloors: 9,
    district: 'Сино',
    address: ru('просп. Рудаки 42, Сино'),
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    ],
    features: ['Мебель', 'Интернет', 'Кондиционер', 'Балкон', 'Лифт'],
    phone: '+992900000001', whatsapp: '+992900000001',
    agentName: 'Алишер К.', views: 412, isTop: true, isNew: false,
    createdAt: '2024-11-01',
  },
  {
    id: '2',
    title: ru('1-комнатная квартира в аренду'),
    description: ru('Уютная однокомнатная квартира с хорошим ремонтом. Чистая, светлая. Вся необходимая мебель. Коммунальные услуги отдельно. Тихий двор.'),
    type: 'apartment', listingType: 'rent',
    priceUSD: 350, priceTJS: 3815,
    area: 38, rooms: 1, floor: 3, totalFloors: 5,
    district: 'Фирдавси',
    address: ru('ул. Айни 14, Фирдавси'),
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    ],
    features: ['Мебель', 'Wi-Fi', 'Кондиционер'],
    phone: '+992900000002', whatsapp: '+992900000002',
    agentName: 'Нилуфар Р.', views: 289, isTop: false, isNew: true,
    createdAt: '2024-11-10',
  },
  {
    id: '3',
    title: ru('Дом с садом, 5 комнат'),
    description: ru('Просторный частный дом с ухоженным садом. Пять комнат, большая кухня, гараж на 2 машины. Собственная скважина, газ. Тихий зелёный район.'),
    type: 'house', listingType: 'sale',
    priceUSD: 145000, priceTJS: 1580500,
    area: 220, rooms: 5, floor: 0, totalFloors: 2,
    district: 'Исмоили Сомони',
    address: ru('ул. Садовая 7, Исмоили Сомони'),
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    ],
    features: ['Гараж', 'Сад', 'Газ', 'Отопление', 'Охрана'],
    phone: '+992900000003', whatsapp: '+992900000003',
    agentName: 'Фирдавс М.', views: 534, isTop: true, isNew: false,
    createdAt: '2024-10-20',
  },
  {
    id: '4',
    title: ru('4-комнатная квартира с видом'),
    description: ru('Элитная квартира в новом жилом комплексе. Потрясающий вид на город. Высококачественная отделка, умный дом, закрытая территория с охраной.'),
    type: 'apartment', listingType: 'sale',
    priceUSD: 130000, priceTJS: 1417000,
    area: 115, rooms: 4, floor: 12, totalFloors: 16,
    district: 'Исмоили Сомони',
    address: ru('Проспект Сомониён 5, Исмоили Сомони'),
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
    ],
    features: ['Мебель', 'Кондиционер', 'Охрана', 'Лифт', 'Видеонаблюдение', 'Бассейн'],
    phone: '+992900000004', whatsapp: '+992900000004',
    agentName: 'Санавбар Т.', views: 671, isTop: true, isNew: false,
    createdAt: '2024-10-15',
  },
  {
    id: '5',
    title: ru('2-комнатная квартира'),
    description: ru('Двухкомнатная квартира в хорошем состоянии. Тихий район, развитая инфраструктура. Документы готовы. Торг уместен.'),
    type: 'apartment', listingType: 'sale',
    priceUSD: 48000, priceTJS: 523200,
    area: 58, rooms: 2, floor: 2, totalFloors: 5,
    district: 'Шохмансур',
    address: ru('ул. Борбад 23, Шохмансур'),
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&q=80',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=600&q=80',
    ],
    features: ['Балкон', 'Кладовка'],
    phone: '+992900000005', whatsapp: '+992900000005',
    agentName: 'Баходур Н.', views: 198, isTop: false, isNew: false,
    createdAt: '2024-11-05',
  },
  {
    id: '6',
    title: ru('Коммерческий офис в центре'),
    description: ru('Офисное помещение в центре города на первом этаже. Отдельный вход, большие витринные окна. Идеально для магазина, офиса или медицинского кабинета.'),
    type: 'commercial', listingType: 'rent',
    priceUSD: 1200, priceTJS: 13080,
    area: 95, rooms: 0, floor: 1, totalFloors: 4,
    district: 'Сино',
    address: ru('просп. Рудаки 88, Сино'),
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80',
    ],
    features: ['Интернет', 'Кондиционер', 'Парковка', 'Охрана'],
    phone: '+992900000006', whatsapp: '+992900000006',
    agentName: 'Гулнора С.', views: 320, isTop: false, isNew: true,
    createdAt: '2024-11-08',
  },
  {
    id: '7',
    title: ru('Земельный участок 10 соток'),
    description: ru('Земельный участок в живописном месте. Все коммуникации подведены: газ, вода, электричество. Документы чистые, готовы к сделке.'),
    type: 'land', listingType: 'sale',
    priceUSD: 35000, priceTJS: 381500,
    area: 1000, rooms: 0, floor: 0, totalFloors: 0,
    district: 'Шохмансур',
    address: ru('ул. Зафарободская 3, Шохмансур'),
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    ],
    features: ['Газ', 'Вода', 'Электричество'],
    phone: '+992900000007', whatsapp: '+992900000007',
    agentName: 'Рустам А.', views: 147, isTop: false, isNew: false,
    createdAt: '2024-10-28',
  },
  {
    id: '8',
    title: ru('Дом в районе Сино'),
    description: ru('Уютный дом в спокойном жилом квартале района Сино. Три спальни, гостиная, современная кухня. Небольшой ухоженный двор.'),
    type: 'house', listingType: 'sale',
    priceUSD: 78000, priceTJS: 850200,
    area: 140, rooms: 4, floor: 0, totalFloors: 2,
    district: 'Сино',
    address: ru('ул. Дружбы 18, Сино'),
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
    ],
    features: ['Гараж', 'Двор', 'Отопление', 'Газ'],
    phone: '+992900000008', whatsapp: '+992900000008',
    agentName: 'Камола Б.', views: 263, isTop: false, isNew: true,
    createdAt: '2024-11-12',
  },
];

export const DASHBOARD_LISTINGS = MOCK_PROPERTIES.map((p, i) => ({
  ...p,
  myViews: [412, 289, 534, 671, 198, 320, 147, 263][i],
  myInquiries: [18, 7, 24, 31, 5, 12, 3, 9][i],
}));
