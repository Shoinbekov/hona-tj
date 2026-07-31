// ─────────────────────────────────────────────────────────────────────────
// Reusable filter config: describes, for every (режим × категория) pair,
// which fields the filter bar renders. SearchFilters.tsx renders purely
// from this data — add/remove a field here and the UI + reset logic follow.
// ─────────────────────────────────────────────────────────────────────────

export type FilterMode = 'sale' | 'rent';

export interface FilterState {
  mode: FilterMode;
  category: string;
  city: string;
  district: string;
  minPrice: string;
  maxPrice: string;
  priceUnit: string;
  query: string;
  values: Record<string, string | string[] | boolean>;
}

export type Option = { value: string; label: string };

export type FieldKind =
  | 'rooms'        // toggle buttons 1..N + "N+", multi-select, stored as string[]
  | 'buttons'      // toggle button group, stored as string[] (multi) or string (single)
  | 'select'       // native <select>, single value, stored as string
  | 'multiselect'  // dropdown checkbox-list with "Не важно", stored as string[]
  | 'range'        // От–До numeric pair, stored as `${id}From` / `${id}To`
  | 'checkbox'     // single boolean
  | 'text';        // free-text input (used for ЖК search), stored as string

export interface FieldDef {
  id: string;
  kind: FieldKind;
  label?: string;
  placeholder?: string;
  options?: Option[];
  unit?: string;      // suffix shown after a range, e.g. "м²", "соток"
  multi?: boolean;     // for 'buttons': true = multiple selectable at once
  maxRooms?: number;   // for 'rooms': last bucket label becomes `${maxRooms}+`
}

export interface PriceConfig {
  unitOptions?: Option[]; // e.g. за всё / за сотку — omitted = no toggle
}

export interface CategoryConfig {
  key: string;            // matches PropertyType, or a synthetic key ('rent_wanted')
  tabLabel: string;
  hasPrice: boolean;
  price?: PriceConfig;
  base: FieldDef[];        // fields in the always-visible row (city/price/search excluded — rendered separately)
  baseCheckboxes: FieldDef[];
  extra: FieldDef[];       // fields inside "Ещё настройки"
  extraCheckboxes: FieldDef[];
}

// ─── Shared option lists ───────────────────────────────────────────────────

const NA: Option = { value: '', label: 'Не важно' };

const HOUSE_TYPE: Option[] = [
  { value: 'brick', label: 'кирпичный' },
  { value: 'panel', label: 'панельный' },
  { value: 'monolith', label: 'монолитный' },
  { value: 'other', label: 'иной' },
];

const OBJECT_TYPE_HOUSE: Option[] = [
  { value: 'house', label: 'Отдельный дом' },
  { value: 'part', label: 'Часть дома' },
  { value: 'dacha', label: 'Дача' },
];

const MATERIAL: Option[] = [
  'Кирпич', 'Монолит', 'Дерево', 'Саман', 'Газосиликатный блок', 'Газобетонный блок',
  'Шлакоблок', 'Пеноблок', 'Теплоблок', 'Каркасно-камышитовый', 'Каркасно-щитовой',
  'СИП-панели', 'ЖБ-панели', 'Ракушняк', 'Финблок',
].map(l => ({ value: l, label: l }));

const CONDITION_BUY: Option[] = [
  'Свежий ремонт', 'Не новый, но аккуратный ремонт', 'Нужен ремонт',
  'Черновая отделка', 'Под снос', 'Недостроенный',
].map(l => ({ value: l, label: l }));

const CONDITION_RENT: Option[] = [
  'Свежий ремонт', 'Не новый, но аккуратный ремонт', 'Нужен ремонт', 'Черновая отделка',
].map(l => ({ value: l, label: l }));

const HEATING_BUY: Option[] = [
  'Центральное', 'На газе', 'На твёрдом топливе', 'На жидком топливе',
  'На электричестве', 'Смешанное', 'Нет',
].map(l => ({ value: l, label: l }));

const HEATING_RENT: Option[] = [
  'Центральное', 'На газе', 'На твёрдом топливе', 'На жидком топливе',
  'На электричестве', 'Смешанное',
].map(l => ({ value: l, label: l }));

const SEWAGE_BUY: Option[] = [
  'Центральная', 'Можно подвести', 'Септик', 'Нет',
].map(l => ({ value: l, label: l }));

const SEWAGE_RENT: Option[] = [
  'Центральная', 'Септик', 'Можно подвести',
].map(l => ({ value: l, label: l }));

const GARAGE_TYPE: Option[] = [
  { value: 'garage', label: 'Гараж' },
  { value: 'parking', label: 'Паркинг' },
];

const LAND_PURPOSE: Option[] = [
  'ИЖС', 'КХ', 'ЛПХ', 'Садоводство', 'Коммерческое', 'МЖС', 'Дачное строительство', 'Другое',
].map(l => ({ value: l, label: l }));

const YES_NO: Option[] = [
  { value: 'yes', label: 'да' },
  { value: 'no', label: 'нет' },
];

const DIVISIBILITY: Option[] = [
  { value: 'divisible', label: 'делимый' },
  { value: 'not_divisible', label: 'неделимый' },
];

const COMMERCIAL_PURPOSE: Option[] = [
  'свободное назначение', 'офисы', 'магазины и бутики', 'склады',
  'АЗС, автосервисы и автомойки', 'общепит', 'салоны красоты', 'сельское хозяйство',
  'бани, гостиницы и зоны отдыха', 'фитнес и спорт', 'медцентры и аптеки', 'образование',
  'развлечения', 'конференц-залы', 'кабинеты и рабочие места', 'студии',
].map(l => ({ value: l, label: l }));

const COMMERCIAL_LOCATION: Option[] = [
  'в бизнес-центре', 'в жилом доме или ЖК', 'в торговом центре',
  'на универсальном рынке', 'отдельностоящее здание',
].map(l => ({ value: l, label: l }));

const BUSINESS_SPHERE: Option[] = [
  'производство', 'магазины и оптовая торговля', 'общепит', 'салоны красоты',
  'развлечения', 'бани, гостиницы и зоны отдыха', 'автосервисы и автомойки',
  'сельское хозяйство', 'здоровье и мед. центры', 'фитнес', 'образование', 'услуги',
].map(l => ({ value: l, label: l }));

const INDUSTRIAL_SEEK: Option[] = [
  'Промбазу', 'Завод', 'Склад', 'Цех', 'Элеватор', 'Другое',
].map(l => ({ value: l, label: l }));

const FURNISHED: Option[] = [
  { value: 'full', label: 'полностью' },
  { value: 'partial', label: 'частично' },
  { value: 'none', label: 'без мебели' },
];

const SUITABLE_FOR: Option[] = [
  { value: 'children', label: 'Можно с детьми' },
  { value: 'pets', label: 'Можно с животными' },
  { value: 'commerce', label: 'Можно под коммерцию' },
];

const BATHROOM: Option[] = [
  { value: 'inside', label: 'в доме' },
  { value: 'outside', label: 'на улице' },
];

const PHONE_TYPE: Option[] = [
  { value: 'separate', label: 'отдельный' },
  { value: 'blocker', label: 'блокиратор' },
  { value: 'connectable', label: 'есть возможность подключения' },
  { value: 'none', label: 'нет' },
];

const RENT_WANTED_TYPES: Option[] = [
  'квартиру', 'дом', 'офис', 'помещение', 'участок', 'дачу',
  'магазин', 'бутик', 'кафе', 'автомойку', 'пекарню', 'прочее',
].map(l => ({ value: l, label: l }));

export { NA };

// ─── Field factory helpers ─────────────────────────────────────────────────

const range = (id: string, label: string, unit: string): FieldDef => ({ id, kind: 'range', label, unit });
const chk = (id: string, label: string): FieldDef => ({ id, kind: 'checkbox', label });
const ms = (id: string, label: string, options: Option[]): FieldDef => ({ id, kind: 'multiselect', label, options: [NA, ...options] });
const sel = (id: string, label: string, options: Option[]): FieldDef => ({ id, kind: 'select', label, options: [NA, ...options] });

// ─── BUY categories ─────────────────────────────────────────────────────────

const BUY_APARTMENT: CategoryConfig = {
  key: 'apartment', tabLabel: 'Квартиры', hasPrice: true,
  base: [
    { id: 'rooms', kind: 'rooms', maxRooms: 5 },
  ],
  baseCheckboxes: [chk('hasPhoto', 'есть фото'), chk('newBuilding', 'новостройки'), chk('fromOwner', 'от хозяев'), chk('fromAgents', 'от агентов')],
  extra: [
    ms('houseType', 'Тип дома', HOUSE_TYPE),
    range('floor', 'Этаж', ''),
    range('totalFloors', 'Этажей в доме', ''),
    range('year', 'Год постройки', ''),
    { id: 'complex', kind: 'text', label: 'Жилой комплекс', placeholder: 'Название ЖК' },
    range('area', 'Общая площадь', 'м²'),
    range('kitchenArea', 'Площадь кухни', 'м²'),
  ],
  extraCheckboxes: [chk('notFirstFloor', 'Не первый этаж'), chk('notLastFloor', 'Не последний этаж')],
};

const BUY_HOUSE: CategoryConfig = {
  key: 'house', tabLabel: 'Дома или дачи', hasPrice: true,
  base: [
    sel('objectType', 'Тип объекта', OBJECT_TYPE_HOUSE),
    { id: 'rooms', kind: 'rooms', maxRooms: 10 },
  ],
  baseCheckboxes: [],
  extra: [
    ms('material', 'Материал постройки', MATERIAL),
    ms('condition', 'Состояние дома', CONDITION_BUY),
    ms('heating', 'Отопление', HEATING_BUY),
    ms('sewage', 'Канализация', SEWAGE_BUY),
    range('landArea', 'Площадь участка', 'соток'),
    range('totalFloors', 'Этажей в доме', ''),
    range('area', 'Площадь дома', 'м²'),
    range('kitchenArea', 'Площадь кухни', 'м²'),
    range('year', 'Год постройки', ''),
  ],
  extraCheckboxes: [chk('hasPhoto', 'есть фото'), chk('fromOwner', 'от хозяев')],
};

const GARAGE: CategoryConfig = {
  key: 'garage', tabLabel: 'Гаражи и паркинги', hasPrice: true,
  base: [
    { id: 'garageType', kind: 'buttons', options: GARAGE_TYPE, multi: true },
  ],
  baseCheckboxes: [chk('hasPhoto', 'есть фото'), chk('fromOwner', 'от хозяев')],
  extra: [
    { id: 'complex', kind: 'text', label: 'Жилой комплекс', placeholder: 'Название ЖК' },
    range('area', 'Площадь объекта', 'м²'),
  ],
  extraCheckboxes: [],
};

const LAND: CategoryConfig = {
  key: 'land', tabLabel: 'Участки', hasPrice: true,
  price: { unitOptions: [{ value: 'total', label: 'за всё' }, { value: 'sotka', label: 'за сотку' }] },
  base: [
    range('landArea', 'Площадь участка', 'соток'),
  ],
  baseCheckboxes: [chk('hasPhoto', 'есть фото'), chk('fromOwner', 'от хозяев')],
  extra: [
    sel('landPurpose', 'Целевое назначение', LAND_PURPOSE),
    sel('divisibility', 'Делимость', DIVISIBILITY),
    sel('pledge', 'В залоге', YES_NO),
  ],
  extraCheckboxes: [chk('exchangePossible', 'Возможен обмен')],
};

const COMMERCIAL_BUY: CategoryConfig = {
  key: 'commercial', tabLabel: 'Коммерческая недвижимость', hasPrice: true,
  price: { unitOptions: [{ value: 'total', label: 'за всё' }, { value: 'sqm', label: 'за м²' }] },
  base: [
    ms('purpose', 'Назначение', COMMERCIAL_PURPOSE),
  ],
  baseCheckboxes: [chk('hasPhoto', 'есть фото'), chk('fromOwner', 'от хозяев')],
  extra: [
    ms('location', 'Где размещён объект', COMMERCIAL_LOCATION),
    range('area', 'Общая площадь', 'м²'),
  ],
  extraCheckboxes: [chk('hasTenants', 'Есть арендаторы'), chk('activeBusiness', 'Действующий бизнес')],
};

const BUSINESS: CategoryConfig = {
  key: 'business', tabLabel: 'Бизнес', hasPrice: true,
  base: [
    ms('sphere', 'Сфера деятельности', BUSINESS_SPHERE),
  ],
  baseCheckboxes: [chk('hasPhoto', 'есть фото'), chk('fromOwner', 'от хозяев')],
  extra: [
    range('area', 'Общая площадь', 'м²'),
  ],
  extraCheckboxes: [],
};

const INDUSTRIAL_BUY: CategoryConfig = {
  key: 'industrial', tabLabel: 'Промбазы и заводы', hasPrice: true,
  base: [
    sel('seek', 'Я ищу', INDUSTRIAL_SEEK),
  ],
  baseCheckboxes: [chk('hasPhoto', 'есть фото'), chk('fromOwner', 'от хозяев')],
  extra: [
    range('landArea', 'Площадь участка', 'соток'),
    sel('railway', 'Ж/д тупик', YES_NO),
    sel('substation', 'Своя подстанция', YES_NO),
  ],
  extraCheckboxes: [],
};

// ─── RENT categories ────────────────────────────────────────────────────────

const RENT_APARTMENT: CategoryConfig = {
  key: 'apartment', tabLabel: 'Квартиры', hasPrice: true,
  base: [
    { id: 'period', kind: 'buttons', options: [{ value: 'monthly', label: 'Помесячно' }, { value: 'daily', label: 'Посуточно' }, { value: 'hourly', label: 'По часам' }] },
    { id: 'rooms', kind: 'rooms', maxRooms: 5 },
  ],
  baseCheckboxes: [chk('hasPhoto', 'есть фото'), chk('fromOwner', 'от хозяев')],
  extra: [
    { id: 'complex', kind: 'text', label: 'Жилой комплекс', placeholder: 'Название ЖК' },
    range('floor', 'Этаж', ''),
    ms('furnished', 'Квартира меблирована', FURNISHED),
    range('area', 'Общая площадь', 'м²'),
  ],
  extraCheckboxes: [chk('notFirstFloor', 'Не первый этаж'), chk('notLastFloor', 'Не последний этаж'), chk('pets', 'Можно с животными'), chk('children', 'Можно с детьми')],
};

const RENT_HOUSE: CategoryConfig = {
  key: 'house', tabLabel: 'Дома или дачи', hasPrice: true,
  base: [
    { id: 'period', kind: 'buttons', options: [{ value: 'monthly', label: 'Помесячно' }, { value: 'daily', label: 'Посуточно' }] },
    { id: 'rooms', kind: 'rooms', maxRooms: 10 },
  ],
  baseCheckboxes: [],
  extra: [
    ms('objectType', 'Тип объекта', OBJECT_TYPE_HOUSE),
    ms('suitableFor', 'Кому подойдёт', SUITABLE_FOR),
    ms('furnished', 'Дом меблирован', FURNISHED),
    range('landArea', 'Площадь участка', 'соток'),
    range('area', 'Площадь дома', 'м²'),
    ms('condition', 'Состояние дома', CONDITION_RENT),
    ms('heating', 'Отопление', HEATING_RENT),
    ms('sewage', 'Канализация', SEWAGE_RENT),
    ms('bathroom', 'Санузел', BATHROOM),
  ],
  extraCheckboxes: [chk('hasPhoto', 'есть фото'), chk('fromOwner', 'от хозяев')],
};

const ROOM: CategoryConfig = {
  key: 'room', tabLabel: 'Комнаты', hasPrice: true,
  base: [],
  baseCheckboxes: [chk('hasPhoto', 'есть фото'), chk('fromOwner', 'от хозяев')],
  extra: [
    range('area', 'Общая площадь', 'м²'),
    ms('furnished', 'Квартира меблирована', FURNISHED),
    ms('phoneType', 'Телефон', PHONE_TYPE),
  ],
  extraCheckboxes: [],
};

const COMMERCIAL_RENT: CategoryConfig = {
  key: 'commercial', tabLabel: 'Коммерческая недвижимость', hasPrice: true,
  price: { unitOptions: [{ value: 'total', label: 'за всё' }, { value: 'sqm', label: 'за м²' }] },
  base: [
    ms('purpose', 'Назначение', COMMERCIAL_PURPOSE),
  ],
  baseCheckboxes: [chk('hasPhoto', 'есть фото'), chk('fromOwner', 'от хозяев')],
  extra: [
    ms('location', 'Где размещён объект', COMMERCIAL_LOCATION),
    range('area', 'Общая площадь', 'м²'),
  ],
  extraCheckboxes: [chk('activeBusiness', 'Действующий бизнес')],
};

const INDUSTRIAL_RENT: CategoryConfig = {
  key: 'industrial', tabLabel: 'Промбазы и заводы', hasPrice: true,
  base: [
    sel('seek', 'Я ищу', INDUSTRIAL_SEEK),
  ],
  baseCheckboxes: [chk('hasPhoto', 'есть фото'), chk('fromOwner', 'от хозяев')],
  extra: [
    range('landArea', 'Площадь участка', 'соток'),
    sel('railway', 'Ж/д тупик', YES_NO),
    sel('substation', 'Своя подстанция', YES_NO),
  ],
  extraCheckboxes: [],
};

const RENT_WANTED: CategoryConfig = {
  key: 'rent_wanted', tabLabel: 'Возьму в аренду', hasPrice: false,
  base: [
    ms('wantedTypes', 'Что именно', RENT_WANTED_TYPES),
  ],
  baseCheckboxes: [chk('fromOwner', 'от хозяев')],
  extra: [],
  extraCheckboxes: [],
};

// ─── Public tables ──────────────────────────────────────────────────────────

export const CATEGORIES: Record<FilterMode, CategoryConfig[]> = {
  sale: [BUY_APARTMENT, BUY_HOUSE, GARAGE, LAND, COMMERCIAL_BUY, BUSINESS, INDUSTRIAL_BUY],
  rent: [RENT_APARTMENT, RENT_HOUSE, ROOM, GARAGE, COMMERCIAL_RENT, INDUSTRIAL_RENT, RENT_WANTED],
};

export function getCategoryConfig(mode: FilterMode, category: string): CategoryConfig {
  const list = CATEGORIES[mode];
  return list.find(c => c.key === category) ?? list[0];
}

export function allFieldsOf(cfg: CategoryConfig): FieldDef[] {
  return [...cfg.base, ...cfg.baseCheckboxes, ...cfg.extra, ...cfg.extraCheckboxes];
}

/** Fresh, empty value bag matching a category's field set. */
export function defaultValues(cfg: CategoryConfig): Record<string, string | string[] | boolean> {
  const out: Record<string, string | string[] | boolean> = {};
  for (const f of allFieldsOf(cfg)) {
    switch (f.kind) {
      case 'rooms':
      case 'multiselect':
        out[f.id] = [];
        break;
      case 'buttons':
        out[f.id] = f.multi ? [] : '';
        break;
      case 'select':
      case 'text':
        out[f.id] = '';
        break;
      case 'checkbox':
        out[f.id] = false;
        break;
      case 'range':
        out[`${f.id}From`] = '';
        out[`${f.id}To`] = '';
        break;
    }
  }
  return out;
}

/** Initial state: buy → apartments, city "весь Таджикистан". */
export function emptyFilterState(): FilterState {
  const cfg = CATEGORIES.sale[0];
  return {
    mode: 'sale', category: cfg.key, city: 'tj', district: '',
    minPrice: '', maxPrice: '', priceUnit: cfg.price?.unitOptions?.[0].value ?? 'total',
    query: '', values: defaultValues(cfg),
  };
}
