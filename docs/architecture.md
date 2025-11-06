# Архитектура проекта CoinDesk

Проект построен на **React 19** с **TypeScript** и использует:
- **Yarn** в качестве пакетного менеджера
- **Redux Toolkit** для управления состоянием (включая RTK Query для API)
- **Chakra UI v3** для компонентов и стилизации
- **React Router v7** для маршрутизации
- **Vite** как инструмент сборки
- **SCSS Modules** для стилей

Архитектура следует гибридному подходу, сочетающему элементы **Feature-Based** и **Layered Architecture**.

## Структура каталогов

### Основная структура

```
src/app/
├── components/          # Общие компоненты приложения
├── config/             # Конфигурационные файлы (API endpoints, константы)
├── hooks/              # Общие кастомные хуки
├── pages/              # Страницы приложения (feature-based)
│   ├── coin_page/      # Страница деталей монеты
│   └── list_page/      # Страница списка активов
├── services/           # API сервисы (RTK Query)
├── store/              # Redux хранилище и слайсы
├── styles/             # Глобальные стили и переменные
├── types/              # TypeScript типы и интерфейсы
└── utils/              # Утилитарные функции
```

### Детальное описание

#### `components/` — Общие компоненты
Переиспользуемые компоненты, используемые на нескольких страницах:
- `NavBar` — навигационная панель
- `TopListWidget` — виджет топ-листа
- `Tooltip` — компонент подсказки

**Правило**: Компоненты, используемые только на одной странице, должны находиться в `pages/{page_name}/components/`.

#### `pages/` — Страницы приложения
Каждая страница имеет свою структуру:
```
pages/{page_name}/
├── {PageName}.tsx              # Основной компонент страницы
├── {PageName}.module.scss      # Стили страницы
├── components/                 # Компоненты, специфичные для страницы
│   ├── {Component}.tsx
│   └── {Component}.module.scss
└── hooks/                      # Хуки, специфичные для страницы
    └── use{Feature}.ts
```

**Примеры страниц**:
- `coin_page/` — страница деталей монеты с графиками и статистикой
- `list_page/` — страница списка активов с поиском и пагинацией

#### `services/` — API сервисы
Используется **RTK Query** для работы с API. Все API endpoints определены в `assetService.ts`:
- `getAssetList` — получение списка активов
- `assetMeta` — метаданные активов
- `assetSearch` — поиск активов
- `assetHistory` — история цены актива

#### `store/` — Управление состоянием
- `index.ts` — настройка Redux store
- `{feature}Slice.ts` — слайсы состояния (например, `coinPageSlice.ts`)

**Принцип**: Глобальное состояние хранится в Redux, локальное состояние компонентов — в `useState`.

#### `hooks/` — Кастомные хуки
- Общие хуки в `src/app/hooks/`
- Хуки, специфичные для страницы, в `src/app/pages/{page_name}/hooks/`

**Примеры**:
- `useDebounce` — дебаунсинг значений
- `usePagination` — управление пагинацией
- `useAssetList` — логика получения списка активов
- `useAssetSearch` — логика поиска активов

#### `types/` — TypeScript типы
Централизованное хранение всех типов и интерфейсов:
- `Asset.ts` — типы, связанные с активами
- `Language.ts` — типы языков
- `Sort.ts` — типы сортировки

#### `utils/` — Утилиты
Чистые функции без зависимостей от React/Redux:
- `ChartsColor.ts` — константы цветов для графиков
- `DateTimeUtils.ts` — утилиты для работы с датами

#### `styles/` — Глобальные стили
- `variables.scss` — SCSS переменные (цвета, отступы, размеры)
- `index.scss` — глобальные стили приложения

## Управление состоянием

### Настройка хранилища Redux Toolkit

Хранилище настраивается в `src/app/store/index.ts`:

```typescript
import {configureStore} from "@reduxjs/toolkit";
import {assetService} from "../services/assetService";
import {coinPageSlice} from "./coinPageSlice";

export const store = configureStore({
    reducer: {
        coinPage: coinPageSlice.reducer,
        assetService: assetService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(assetService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Важно**: RTK Query API сервисы должны быть добавлены в `middleware`, чтобы работали автоматические кеширование и инвалидация.

### Использование типизированных хуков

В `src/app/hooks/index.ts` определены типизированные хуки для работы с Redux:

```typescript
import {useDispatch, useSelector} from "react-redux";
import type {RootState, AppDispatch} from "../store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

**Всегда используйте** `useAppDispatch` и `useAppSelector` вместо стандартных хуков из `react-redux`.

### Создание среза (slice) состояния

Срезы создаются с помощью `createSlice`. Пример из `src/app/store/coinPageSlice.ts`:

```typescript
import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

export const coinPageSlice = createSlice({
    name: "coinPage",
    initialState,
    reducers: {
        setHistoryPayload: (state, action: PayloadAction<AssetHistoryQueryPayload>) => {
            state.assetHistoryPayload = action.payload;
        },
        // другие редьюсеры
    },
});

export const {setHistoryChartData, setChartType, setSortPeriodType, setHistoryPayload} = coinPageSlice.actions;

// Селекторы
export const selectAssetHistoryChartData = (state: RootState) => state.coinPage.assetHistoryChartData;
export const selectAssetHistoryPayload = (state: RootState) => state.coinPage.assetHistoryPayload;
```

**Правила**:
- Используйте `PayloadAction<T>` для типизации экшенов
- Всегда экспортируйте селекторы вместе с actions
- Именуйте слайсы по принципу: `{feature}Slice`
- Селекторы должны начинаться с префикса `select`

### RTK Query для работы с API

Проект использует **RTK Query** для всех API запросов. API сервисы определены в `src/app/services/assetService.ts`:

```typescript
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const assetService = createApi({
    reducerPath: "assetService",
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
    endpoints: (builder) => ({
        getAssetList: builder.query<AssetListResponse, AssetListQueryPayload>({
            query: (params) => ({
                url: "/asset/v1/top/list",
                method: "GET",
                params,
            }),
            transformResponse: (data: {Data: AssetListResponse}) => data.Data,
        }),
        // другие endpoints
    }),
});

export const {
    useGetAssetListQuery,
    useAssetMetaQuery,
    useAssetSearchQuery,
    useAssetHistoryQuery,
} = assetService;
```

**Использование в компонентах**:

```typescript
// Обычный запрос
const {data, isLoading, error} = useGetAssetListQuery({page: 1, page_size: 10});

// Ленивый запрос (только при вызове функции)
const [fetchAssetMeta, {data, isLoading}] = useLazyAssetMetaQuery();

// Условный запрос
const {data} = useAssetSearchQuery(
    {search_string: query},
    {skip: !query.trim()} // пропустить запрос, если query пустой
);
```

## Маршрутизация

Приложение использует **React Router v7** для маршрутизации. Настройка в `src/app/main.tsx`:

```typescript
import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import {Provider} from "react-redux";
import {store} from "./store";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <ChakraProvider value={defaultSystem}>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path={"/"} element={<Navigate to={"/list"} />} />
                    <Route path={"list"} element={<ListPage />} />
                    <Route path={"coin/:name"} element={<CoinPage />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </Provider>,
);
```

**Маршруты**:
- `/` — редирект на `/list`
- `/list` — страница списка активов
- `/coin/:name` — страница деталей монеты (динамический параметр `name`)

**Использование параметров маршрута**:

```typescript
import {useParams, useNavigate} from "react-router";

function CoinPage() {
    const {name} = useParams(); // получение параметра :name
    const navigate = useNavigate(); // навигация программно
    
    navigate("/list"); // переход на другую страницу
}
```

## Интеграция в приложение

В `src/app/main.tsx` приложение оборачивается в провайдеры:

```typescript
import {Provider} from "react-redux";
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter} from "react-router";
import {store} from "./store";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <ChakraProvider value={defaultSystem}>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    {/* маршруты */}
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </Provider>,
);
```

**Порядок провайдеров** важен:
1. `Provider` (Redux) — должен быть самым внешним
2. `ChakraProvider` — предоставляет тему и стили
3. `BrowserRouter` — обеспечивает маршрутизацию

## Работа с хуками

### Кастомные хуки

Хуки изолируют логику и делают компоненты более читаемыми. Структура хука:

```typescript
export function useAssetList({page, pageSize}: UseAssetListProps) {
    const {data, isFetching} = useGetAssetListQuery({
        page,
        page_size: pageSize
    });

    return {
        assetListData: data?.LIST,
        totalAssets: data?.STATS.TOTAL_ASSETS,
        isAssetListFetching: isFetching
    };
}
```

**Правила**:
- Хуки должны начинаться с префикса `use`
- Хуки должны возвращать объект с понятными именами свойств
- Используйте деструктуризацию для возвращаемых значений
- Общие хуки — в `src/app/hooks/`, специфичные для страницы — в `src/app/pages/{page}/hooks/`

### Паттерны работы с хуками

**Пример**: Хук с debounce и условными запросами:

```typescript
export function useAssetSearch() {
    const [searchStringQuery, setSearchStringQuery] = useState("");
    const debouncedSearchQuery = useDebounce<string>(searchStringQuery, 300);

    const {data: searchData, isFetching} = useAssetSearchQuery(
        {search_string: debouncedSearchQuery},
        {skip: !debouncedSearchQuery.trim()} // пропустить, если пусто
    );

    return {
        searchStringQuery,
        setSearchStringQuery,
        searchData: searchData?.LIST,
        isLoading: isFetching,
        isSearchMode: Boolean(debouncedSearchQuery.trim()),
    };
}
```

## Стилизация

Проект использует гибридный подход к стилизации: **SCSS Modules** для семантических и сложных стилей, **Chakra UI пропсы** для композиции и простых отступов.

### Философия: "SCSS для семантики, пропсы для композиции"

**Основной принцип**: SCSS Modules используются для стилей с семантическим значением и сложных визуальных эффектов, а Chakra UI пропсы — для быстрой композиции layout и простых отступов.

### SCSS Modules — когда использовать

#### ✅ Семантические блоки и контейнеры

Используйте SCSS для контейнеров с четким назначением в дизайне:

```typescript
// ListPage.tsx
<Box className={styles.pageContainer}>
    <Container className={styles.contentContainer}>
        <Box className={styles.heroSection}>
            <Heading className={styles.heroTitle}>CoinDesk</Heading>
        </Box>
    </Container>
</Box>
```

```scss
// ListPage.module.scss
@use '../../styles/variables.scss' as *;

.pageContainer {
    min-height: 100vh;
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.contentContainer {
    max-width: 80rem;
    padding: 0 1rem;
}

.heroSection {
    text-align: center;
    margin-bottom: 3rem;
}

.heroTitle {
    background: $gradient-primary;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

#### ✅ Сложные визуальные эффекты

Градиенты, backdrop-filter, тени, трансформации:

```scss
.card {
    background: $bg-surface;
    backdrop-filter: $blur-light;
    border: 1px solid $border-primary;
    box-shadow: $shadow-lg;
    transition: $transition-normal;
    
    &:hover {
        transform: translateY(-2px);
        background: $bg-surface-hover;
        border-color: $border-accent;
        box-shadow: $shadow-lg;
    }
}
```

#### ✅ Состояния компонентов

Классы для состояний (active, hover, disabled):

```scss
.chartToggle {
    color: $text-primary;
    background: $bg-elevated;

    &.active {
        background: $accent-active;
        border-color: $border-accent-strong;
    }

    &:hover {
        background: $accent-hover;
    }
}
```

#### ✅ Тематические стили

Использование переменных из дизайн-системы:

```scss
@use '../../styles/variables.scss' as *;

.headerText {
    color: $text-primary;
}

.mutedText {
    color: $text-muted;
}
```

#### ✅ Сложные layout-правила

Медиа-запросы и сложные правила:

```scss
.navbarContent {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    @media (max-width: 768px) {
        height: auto;
        flex-wrap: wrap;
        gap: 1rem;
    }
}
```

**Преимущества SCSS Modules**:
- Изоляция стилей (нет конфликтов имен классов)
- Автодополнение в IDE
- Типобезопасность (TypeScript проверяет существование классов)
- Возможность использования SCSS функций и миксинов
- Поддержка переменных из дизайн-системы

### Chakra UI пропсы — когда использовать

#### ✅ Простые отступы (spacing)

Используйте Chakra пропсы для простых отступов:

```typescript
<Box mt={10} mb={5}>
<Stack gap={4}>
<Flex gap={5}>
```

**Стандартные пропсы отступов**:
- `mt`, `mb`, `ml`, `mr` — margin
- `pt`, `pb`, `pl`, `pr` — padding
- `p`, `px`, `py` — padding по осям
- `m`, `mx`, `my` — margin по осям
- `gap` — отступ между элементами в Flex/Stack

#### ✅ Flex/Grid layout свойства

Быстрая композиция layout:

```typescript
<Flex justifyContent={"space-between"} alignItems={"center"}>
<Stack direction={"row"} gap={5}>
<HStack justify={"space-between"} align={"center"}>
```

**Стандартные layout пропсы**:
- `justifyContent`, `justify` — выравнивание по главной оси
- `alignItems`, `align` — выравнивание по поперечной оси
- `direction` — направление (row, column)
- `wrap` — перенос элементов

#### ✅ Размеры компонентов

Стандартные размеры компонентов:

```typescript
<IconButton size={"xs"}>
<Avatar.Root size={"md"}>
<Heading size={"2xl"}>
```

#### ✅ Позиционирование

Простое позиционирование:

```typescript
<Box position={"relative"}>
<Box pos={"absolute"} inset={"0"}>
```

**Преимущества Chakra пропсов**:
- Быстрая разработка без написания CSS
- Консистентность через дизайн-систему Chakra
- Адаптивность из коробки
- Читаемость кода (стили видны прямо в JSX)

### Глобальные стили

Глобальные переменные определены в `src/app/styles/variables.scss`:

```scss
// Цвета
$bg-primary: #0B0E11;
$bg-surface: rgba(30, 35, 41, 0.8);
$text-primary: white;
$text-muted: #B7B7B7;
$accent-primary: #F0B90B;

// Градиенты
$gradient-primary: linear-gradient(135deg, #F0B90B, #FCD535);

// Тени
$shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4);

// Эффекты
$blur-light: blur(10px);
$transition-normal: all 0.3s ease;
```

Импортируйте переменные в SCSS модули:

```scss
@use '../../styles/variables.scss' as *;

.container {
    background: $bg-surface;
    color: $text-primary;
    box-shadow: $shadow-lg;
}
```

### Правила принятия решений

#### Когда использовать SCSS Modules?

- ✅ Стиль имеет **семантическое значение** (`.card`, `.heroSection`, `.navbar`)
- ✅ Нужны **сложные визуальные эффекты** (градиенты, тени, трансформации)
- ✅ Есть **состояния** (hover, active, disabled)
- ✅ Используются **тематические переменные** из `variables.scss`
- ✅ Нужны **медиа-запросы**
- ✅ Стиль **переиспользуется** в нескольких местах

#### Когда использовать Chakra UI пропсы?

- ✅ **Простые отступы** (spacing: mt, mb, gap)
- ✅ **Быстрая композиция layout** (Flex, Stack, HStack)
- ✅ **Стандартные размеры** компонентов
- ✅ **Временные/экспериментальные** стили
- ✅ **Условные стили**, зависящие от пропсов/состояния компонента

### Примеры правильного использования

#### ✅ Правильно: SCSS для семантики + Chakra для композиции

```typescript
// ListPage.tsx
<Box className={styles.pageContainer}>
    <Container className={styles.contentContainer}>
        <Box className={styles.heroSection}>
            <Heading size={"2xl"} className={styles.heroTitle}>
                CoinDesk
            </Heading>
            <Text className={styles.heroSubtitle} fontSize={"xl"}>
                Discover, track, and analyze cryptocurrency markets
            </Text>
        </Box>
        
        <Box className={styles.searchSection}>
            <SearchBar ... />
        </Box>
        
        <Flex className={styles.paginationSection} justify={"center"}>
            <AssetPagination ... />
        </Flex>
    </Container>
</Box>
```

```scss
// ListPage.module.scss
.heroSection {
    text-align: center;
    margin-bottom: 3rem;
}

.heroTitle {
    background: $gradient-primary;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

#### ✅ Правильно: Комбинация по смыслу

```typescript
// AssetCard.tsx
<Box className={styles.card} onClick={...}>
    <Flex className={styles.cardHeader} gap={3}>
        <HStack gap={2}>
            <Avatar.Root size={"md"}>...</Avatar.Root>
            <VStack align={"start"} gap={1}>
                <Heading size={"sm"} className={styles.cardTitle}>
                    {item.NAME}
                </Heading>
            </VStack>
        </HStack>
    </Flex>
</Box>
```

```scss
// AssetCard.module.scss
.card {
    padding: 1rem;
    background: $bg-surface;
    border: 1px solid $border-primary;
    backdrop-filter: $blur-light;
    transition: $transition-normal;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-lg;
    }
}

.cardHeader {
    display: flex;
    justify-content: space-between;
}
```

#### ❌ Неправильно: Смешение без смысла

```typescript
// Не делайте так:
<Box className={styles.container} mt={10} mb={5}>
    <Flex className={styles.flex} gap={4} justifyContent={"space-between"}>
```

**Проблема**: Дублирование стилей — если отступы уже в SCSS, не дублируйте в пропсах.

### Таблица решений

| Стиль | SCSS Modules | Chakra пропсы | Пример |
|-------|--------------|---------------|--------|
| Отступы простые | ❌ | ✅ | `mt={10}`, `gap={4}` |
| Отступы сложные | ✅ | ❌ | `.section { padding: 2rem 1rem; }` |
| Цвета темы | ✅ | ✅ | SCSS: `$text-primary`, Chakra: `color={"yellow.solid"}` |
| Градиенты | ✅ | ❌ | `.heroTitle { background: $gradient-primary; }` |
| Тени | ✅ | ❌ | `.card { box-shadow: $shadow-lg; }` |
| Layout простой | ❌ | ✅ | `justifyContent={"space-between"}` |
| Layout сложный | ✅ | ❌ | `.navbarContent { @media ... }` |
| Состояния | ✅ | ❌ | `.active`, `:hover` |
| Размеры стандартные | ❌ | ✅ | `size={"xs"}`, `size={"md"}` |
| Размеры кастомные | ✅ | ❌ | `.customSize { width: 150px; }` |

### Итоговая формула

```
SCSS Modules = Семантика + Сложность + Состояния + Тема
Chakra пропсы = Простота + Композиция + Скорость разработки
```

### Рекомендации

1. **Минимизируйте SCSS**: Используйте только для семантических блоков и сложных эффектов
2. **Максимизируйте Chakra пропсы**: Для spacing, layout, размеров
3. **Избегайте дублирования**: Если `gap` в SCSS, не дублируйте в пропсах
4. **Семантические классы**: `.card`, `.heroSection`, `.navbar` — в SCSS
5. **Композиционные пропсы**: `mt`, `gap`, `justifyContent` — через Chakra
6. **Консистентность**: Следуйте единому стилю во всем проекте

## Принципы именования

### Файлы и каталоги

- **Компоненты**: `PascalCase` — `NavBar.tsx`, `AssetCard.tsx`
- **Хуки**: `camelCase` с префиксом `use` — `useAssetList.ts`, `useDebounce.ts`
- **Утилиты**: `camelCase` — `DateTimeUtils.ts`, `ChartsColor.ts`
- **Типы**: `PascalCase` — `Asset.ts`, `Sort.ts`
- **Стили**: `PascalCase.module.scss` — `NavBar.module.scss`
- **Слайсы**: `camelCase` с суффиксом `Slice` — `coinPageSlice.ts`

### Переменные и функции

- **Компоненты**: `PascalCase` — `const NavBar = () => {}`
- **Функции/хуки**: `camelCase` — `const useAssetList = () => {}`
- **Константы**: `UPPER_SNAKE_CASE` — `const BASE_URL = "..."` или `const CHART_TYPE = {...}`
- **Типы/интерфейсы**: `PascalCase` — `interface AssetHistory {}`, `type SortPeriodType = ...`

### Селекторы и экшены

- **Селекторы**: префикс `select` — `selectAssetHistoryChartData`
- **Экшены**: префикс `set` для сеттеров — `setHistoryChartData`, `setChartType`

## Организация компонентов

### Структура компонента

Каждый компонент должен следовать структуре:

```typescript
// 1. Импорты (внешние библиотеки)
import {Box, Button} from "@chakra-ui/react";
import * as React from "react";

// 2. Импорты (локальные компоненты и хуки)
import {useAppSelector} from "../../hooks";
import {selectAssetHistoryChartData} from "../../store/coinPageSlice";

// 3. Импорты (типы)
import type {Asset} from "../../types/Asset";

// 4. Импорты (стили)
import styles from "./Component.module.scss";

// 5. Интерфейсы и типы компонента
interface ComponentProps {
    data: Asset[];
    onItemClick?: (id: string) => void;
}

// 6. Компонент
export function Component({data, onItemClick}: ComponentProps) {
    // Хуки
    const chartData = useAppSelector(selectAssetHistoryChartData);
    
    // Локальное состояние
    const [isOpen, setIsOpen] = React.useState(false);
    
    // Обработчики
    const handleClick = React.useCallback(() => {
        // логика
    }, []);
    
    // Эффекты
    React.useEffect(() => {
        // логика
    }, []);
    
    // Рендер
    return (
        <Box className={styles.container}>
            {/* JSX */}
        </Box>
    );
}
```

## Конфигурация проекта

### Пакетный менеджер

**Важно**: Проект использует **Yarn** в качестве пакетного менеджера. Все команды установки и управления зависимостями должны выполняться через Yarn.

**Основные команды**:
- `yarn install` — установка зависимостей
- `yarn add <package>` — добавление новой зависимости
- `yarn add -D <package>` — добавление dev-зависимости
- `yarn remove <package>` — удаление зависимости
- `yarn upgrade` — обновление зависимостей

**Правила**:
- ❌ **Не используйте** `npm` или `pnpm` для установки зависимостей
- ✅ **Всегда используйте** `yarn` для работы с пакетами
- ✅ Файл `yarn.lock` должен быть закоммичен в репозиторий
- ✅ При клонировании проекта используйте `yarn install` для установки зависимостей

### TypeScript

Настройки TypeScript находятся в:
- `tsconfig.json` — основная конфигурация
- `tsconfig.app.json` — конфигурация для приложения
- `tsconfig.node.json` — конфигурация для Node.js (Vite)

### Vite

Конфигурация сборщика в `vite.config.ts`. Используется:
- **SWC** для быстрой компиляции TypeScript
- **TypeScript path aliases** (`@/app/...`) для абсолютных импортов
- **SCSS** поддержка из коробки

### ESLint

Конфигурация линтера в `eslint.config.js`. Используются:
- TypeScript ESLint
- React ESLint
- Правила форматирования

## Дополнительные библиотеки

- **Chakra UI v3**: Компонентная библиотека для стилизации и UI компонентов
- **React Router v7**: Маршрутизация SPA
- **RTK Query**: Инструмент для работы с API (часть Redux Toolkit)
- **SCSS Modules**: Изоляция стилей компонентов
- **React Icons**: Иконки для интерфейса
- **Recharts**: Библиотека для графиков (используется в Chakra UI Charts)

## Рекомендации по разработке

### Что хранить в Redux, а что в useState?

**В Redux** (глобальное состояние):
- Данные, которые используются на нескольких страницах
- Состояние, которое должно сохраняться при навигации
- Состояние, связанное с бизнес-логикой (например, фильтры, период графика)

**В useState** (локальное состояние):
- Состояние UI компонента (открыт/закрыт, значение input)
- Временные данные, используемые только в одном компоненте
- Состояние форм, которое не нужно сохранять

### Когда создавать новый слайс?

Создавайте новый слайс, если:
- Состояние относится к отдельной фиче/странице
- Состояние имеет сложную логику обновления
- Состояние используется на нескольких страницах

### Когда использовать RTK Query vs обычный fetch?

**Всегда используйте RTK Query** для:
- Любых API запросов
- Кеширования данных
- Автоматической инвалидации кеша

**Не используйте** обычный `fetch` или `axios` напрямую в компонентах.

## Дополнительные ресурсы

- [Redux Toolkit Quick Start](https://redux-toolkit.js.org/tutorials/quick-start)
- [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)
- [React Redux with TypeScript](https://react-redux.js.org/using-react-redux/usage-with-typescript)
- [Chakra UI Documentation](https://chakra-ui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Feature-Sliced Design](https://feature-sliced.design/) (концептуальная основа)
