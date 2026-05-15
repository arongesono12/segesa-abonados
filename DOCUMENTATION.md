# Documentación del Proyecto - Segesa Abonados

## Descripción General

App móvil React Native/Expo para gestionar facturas de electricidad. Permite a usuarios autenticarse, vincular cuentas eléctricas, consultar facturas pendientes y realizar pagos.

---

## Commits Realizados

### 1. `feat: Add core components...` (4245be4)
**Fundación del sistema** - Implementación inicial de autenticación, servicios y componentes UI.

### 2. `Mejora de UI` (ee41593)
**Refactorización visual** - Actualización según guías de Expo UI (SF Symbols, haptics, animaciones, colores, edge-18 rounded corners).

---

## Arquitectura

```
├── app/                          # Rutas Expo Router
│   ├── (auth)/                   # Flujo de autenticación
│   │   ├── welcome.tsx           # Bienvenida inicial
│   │   ├── login.tsx             # Login (email + social)
│   │   ├── register.tsx          # Registro
│   │   └── forgot-password.tsx   # Recuperación
│   ├── (tabs)/                   # Navegación nativa
│   │   ├── _layout.tsx           # NativeTabs + auth guard
│   │   ├── index.tsx             # Dashboard
│   │   ├── invoices.tsx          # Lista de facturas
│   │   ├── history.tsx           # Historial de pagos
│   │   ├── accounts.tsx          # Cuentas vinculadas
│   │   └── profile.tsx           # Perfil usuario
│   ├── onboarding/               # Onboarding cuenta eléctrica
│   │   ├── provider.tsx          # Selección proveedor
│   │   └── account.tsx           # Validación contrato
│   ├── payment/                  # Flujo de pago
│   │   ├── [invoiceId].tsx       # Formulario pago
│   │   └── confirmation.tsx      # Confirmación
│   └── invoice/                  # Detalles
│       └── [id].tsx              # Detalles factura
├── components/                   # Componentes UI reutilizables
│   ├── app-button.tsx            # Botón + SF Symbols + haptics
│   ├── app-text-field.tsx        # Input con label
│   ├── empty-state.tsx           # Estado vacío + SF icon
│   ├── full-screen-loader.tsx    # Loader pantalla completa
│   ├── invoice-card.tsx          # Card factura + Link.Preview
│   └── screen.tsx                # ScrollView wrapper
├── features/auth/                # Autenticación
│   ├── auth-context.tsx          # Context + session management
│   └── auth-service.ts           # Lógica login/register
├── services/                     # Capa de datos
│   ├── api-client.ts             # Cliente HTTP genérico
│   ├── electricity-api.ts        # API electricidad (facade)
│   ├── mock-api.ts               # Datos mock para desarrollo
│   └── storage.ts                # Expo SecureStore wrapper
├── hooks/                        # Custom hooks
│   ├── use-api-resource.ts       # Loader + error + refetch
│   └── use-*.ts                  # Theme, haptics, etc.
├── types/domain.ts               # Tipos TypeScript
├── theme/colors.ts               # Paleta de colores
└── utils/                        # Validación y formateo
```

---

## Características Implementadas

### Autenticación

- **Login**: Email/password, Google, Apple
- **Registro**: Nombre, email, contraseña
- **Recuperación**: Flujo de reset contraseña
- **Persistencia**: Tokens y sesión en SecureStore
- **Redirección**: Guard (welcome → onboarding → tabs)

### Gestión de Facturas

- **Dashboard**: Total pendiente, cuenta principal, facturas recientes
- **Lista**: Facturas pagadas y pendientes
- **Detalles**: Periodo, consumo, fechas, estado
- **Pagos**: Seleccionar método, confirmación

### Cuentas Eléctricas

- **Onboarding**: Selección proveedor + validación contrato
- **Múltiples**: Varios contratos por usuario
- **Principal**: Marcado de cuenta favorita
- **Sincronización**: Manual de datos

---

## Mejoras UI (Commit ee41593)

### Convenciones Expo

| Patrón | Implementación |
|--------|----------------|
| `borderCurve: 'continuous'` | Todos los componentes redondeados |
| `fontVariant: ['tabular-nums']` | Números alineados (importes) |
| `sf:name` via expo-image | SF Symbols en toda la app |
| `process.env.EXPO_OS` | Detección iOS/Android |
| Haptics iOS | Feedback en acciones relevantes |

### Animaciones

- `FadeIn` + `delay` para entradas escalonadas
- `FadeOut` para salidas
- `withSpring` en press de botones

### Componentes Mejorados

- **AppButton**: Scale animation, loading state, disabled state, 3 variantes
- **InvoiceCard**: Pressable, Link.Preview iOS, estado badge
- **EmptyState**: SF Symbol, mensaje configurable

### Colores

```typescript
const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF7F4',
  primary: '#006B5F',      // Segesa green
  primaryDark: '#064E45',
  secondary: '#E8B923',
  accent: '#1877C9',
  text: '#17201D',
  textSoft: '#3E4A46',
  muted: '#74817D',
  border: '#DDE5E2',
  danger: '#C0392B',
  success: '#12805C',
  warning: '#B7791F',
}
```

---

## Servicios y APIs

### `electricityApi`

```typescript
getProviders()           // Lista proveedores
validateAccount()        // Validar contrato
getAccounts()            // Cuentas usuario
getPendingInvoices()     // Facturas pendientes
getPaidInvoices()        // Facturas pagadas
getInvoice()             // Detalle factura
getPayments()            // Historial pagos
payInvoice()             // Procesar pago
syncCustomer()           // Sincronizar datos
```

### `useApiResource`

Hook estándar para carga de datos:
```typescript
const { data, isLoading, error, refetch } = useApiResource(loader);
```

---

## Tipos de Dominio

```typescript
type User = { id, name, email, authProvider }
type ElectricAccount = { id, providerId, contractNumber, status, isPrimary... }
type Invoice = { id, period, amount, status: 'pending' | 'paid' | 'processing' | 'expired', kwh... }
type Payment = { id, invoiceId, amount, method, status, reference... }
```

---

## Utilidades

| Archivo | Funciones |
|---------|-----------|
| `utils/format.ts` | `formatMoney()`, `formatDate()` |
| `utils/validation.ts` | `validateEmail()`, `validatePassword()`, `getErrorMessage()` |

---

## Stack Técnico

- **Framework**: React Native + Expo Router
- **Navegación**: NativeTabs + Stack
- **Estado**: React Context (auth)
- **Storage**: Expo SecureStore
- **Animaciones**: react-native-reanimated
- **Íconos**: SF Symbols (expo-image)
- **Haptics**: expo-haptics (iOS)
- **Auth**: Google + Apple (expo-auth-session, expo-apple-authentication)