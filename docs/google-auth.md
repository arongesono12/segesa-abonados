# Google Auth — Guía de integración

Stack utilizado: **Expo** + **Supabase** + `expo-auth-session` + `expo-web-browser`

---

## 1. Google Cloud Console

### 1.1 Crear el proyecto OAuth

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear un proyecto o seleccionar el existente
3. Menú → **APIs & Services → OAuth consent screen**
   - User Type: **External**
   - Completar nombre de app, correo de soporte y correo del desarrollador
   - Scopes: añadir `email` y `profile`
   - Guardar y continuar

### 1.2 Crear credenciales

Ir a **APIs & Services → Credentials → Create Credentials → OAuth Client ID**

Necesitas crear **tres clientes** (uno por plataforma):

| Tipo | Para qué |
|---|---|
| **Web application** | Supabase + flujo web en Expo Go |
| **Android** | Build nativo Android |
| **iOS** | Build nativo iOS |

#### Cliente Web (obligatorio)
- Application type: **Web application**
- Authorized redirect URIs:
  ```
  https://<tu-proyecto>.supabase.co/auth/v1/callback
  ```
- Guardar → copiar el **Client ID** y el **Client Secret**

#### Cliente Android
- Application type: **Android**
- Package name: valor de `android.package` en `app.config.js` (ej. `com.segesa.abonados`)
- SHA-1: obtener con:
  ```bash
  # Keystore de desarrollo (Expo Go)
  eas credentials
  # o localmente:
  keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey -storepass android
  ```

#### Cliente iOS
- Application type: **iOS**
- Bundle ID: valor de `ios.bundleIdentifier` en `app.config.js` (ej. `com.segesa.abonados`)

---

## 2. Supabase Dashboard

1. Ir a tu proyecto en [supabase.com](https://supabase.com)
2. **Authentication → Providers → Google**
3. Activar el toggle **Enable**
4. Pegar el **Client ID** y **Client Secret** del cliente Web creado en el paso anterior
5. En **Authorized Client IDs** añadir también el Client ID de Android y el de iOS
6. Guardar

---

## 3. Variables de entorno

Actualizar `.env` con los valores reales:

```env
# ─── Supabase ──────────────────────────────────────────────────────────────────
EXPO_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# ─── Google OAuth ──────────────────────────────────────────────────────────────
# Client ID del cliente Web (para Supabase + Expo Go)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=<web-client-id>.apps.googleusercontent.com
```

> El Client ID de Android e iOS va en Supabase Dashboard, no en `.env`.

Añadir las nuevas variables a `app.config.js` dentro de `extra`:

```js
extra: {
  // ...existentes
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
},
```

---

## 4. Crear el cliente Supabase

Crear `services/supabase.ts`:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

> Instalar AsyncStorage si no está: `npx expo install @react-native-async-storage/async-storage`

---

## 5. Implementar el flujo Google en `auth-service.ts`

```ts
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '@/services/supabase';

// Necesario para cerrar el browser al volver a la app
WebBrowser.maybeCompleteAuthSession();

export const authService = {
  // ...métodos existentes (login, register, etc.)

  async signInWithGoogle() {
    const redirectTo = makeRedirectUri({ scheme: 'segesaabonados' });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) throw error ?? new Error('No se pudo iniciar Google OAuth');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type !== 'success') throw new Error('Login cancelado');

    // Supabase intercambia el código por una sesión (PKCE)
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(result.url);
    if (sessionError) throw sessionError;

    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
};
```

---

## 6. Actualizar `handleGoogleLogin` en `login.tsx`

Reemplazar la llamada mock:

```ts
const handleGoogleLogin = async () => {
  setError('');
  setLoadingAction('google');

  try {
    const session = await authService.signInWithGoogle();
    // session.user contiene email, name, avatar_url, etc.
    await socialLogin(
      'google',
      session?.user.email ?? '',
      session?.user.user_metadata?.full_name ?? 'Usuario Google',
    );
    router.replace('/');
  } catch (caughtError) {
    setError(getErrorMessage(caughtError));
  } finally {
    setLoadingAction(null);
  }
};
```

---

## 7. Deep link (scheme)

El scheme `segesaabonados` ya está configurado en `app.config.js`. Para que funcione en Android e iOS en builds de desarrollo, añadir en `app.config.js`:

```js
android: {
  // ...existente
  intentFilters: [
    {
      action: 'VIEW',
      autoVerify: true,
      data: [{ scheme: 'segesaabonados' }],
      category: ['BROWSABLE', 'DEFAULT'],
    },
  ],
},
```

---

## 8. Pruebas

| Entorno | Cómo probar |
|---|---|
| **Expo Go** | `npx expo start` — funciona con el cliente Web de Google |
| **Android (dev build)** | `npx expo run:android` — requiere cliente Android con SHA-1 de debug |
| **iOS (dev build)** | `npx expo run:ios` — requiere cliente iOS con Bundle ID |

### Flujo esperado

1. Usuario pulsa "Continuar con Google"
2. Se abre el navegador del sistema con la pantalla de cuentas de Google
3. El usuario selecciona su cuenta
4. Google redirige a Supabase → Supabase redirige a `segesaabonados://`
5. La app recibe el código, lo intercambia por sesión y el usuario queda autenticado

---

## 9. Errores comunes

| Error | Causa | Solución |
|---|---|---|
| `redirect_uri_mismatch` | La URI en Google Console no coincide | Añadir exactamente la URI que imprime `makeRedirectUri()` en la consola |
| `Provider not enabled` | Google no activado en Supabase | Activar en Authentication → Providers → Google |
| `invalid_client` | Client ID o Secret incorrectos en Supabase | Verificar que usas los del cliente **Web**, no Android/iOS |
| Browser no cierra | `maybeCompleteAuthSession()` no llamado | Añadirlo al top level del módulo donde se usa |
