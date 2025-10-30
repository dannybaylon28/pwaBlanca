# Service Worker - Daniel Baylón Portfolio PWA

## Descripción
Este service worker proporciona funcionalidades de PWA (Progressive Web App) para el portfolio de Daniel Baylón, incluyendo cache offline, notificaciones push y sincronización en segundo plano.

## Características Implementadas

### 🚀 Cache Estratégico
- **Cache First**: Para archivos estáticos (HTML, CSS, JS, imágenes)
- **Network First**: Para recursos dinámicos
- **Fallback**: Imágenes placeholder cuando no hay conexión

### 📱 Funcionalidades PWA
- ✅ Instalación como app nativa
- ✅ Funcionamiento offline
- ✅ Notificaciones push
- ✅ Sincronización en segundo plano
- ✅ Actualizaciones automáticas

### 🔧 Gestión de Cache
- Limpieza automática de caches antiguos
- Actualización inteligente de recursos
- Indicador de estado de conexión
- Notificaciones de actualización

## Archivos Creados

### 1. `sw.js` - Service Worker Principal
- Maneja eventos de instalación, activación y fetch
- Implementa estrategias de cache
- Gestiona notificaciones push
- Controla sincronización en segundo plano

### 2. `js/sw-register.js` - Gestor del Service Worker
- Registra el service worker
- Maneja actualizaciones
- Proporciona interfaz para gestión de cache
- Muestra notificaciones al usuario

## Estrategias de Cache

### Archivos Estáticos (Cache First)
```
- index.html
- manifest.json
- CSS y JS files
- Imágenes locales
- Iconos de la app
```

### Recursos Externos (Network First)
```
- Imágenes de Unsplash
- CDN de Font Awesome
- Otros recursos externos
```

## Uso del Service Worker

### Instalación Automática
El service worker se registra automáticamente cuando el usuario visita la página por primera vez.

### Gestión Manual (Consola del Navegador)
```javascript
// Limpiar cache
swManager.clearCache();

// Obtener información del cache
swManager.getCacheInfo();

// Forzar actualización
swManager.updateApp();
```

### Notificaciones
- **Actualización disponible**: Cuando hay una nueva versión
- **Estado de conexión**: Cuando se pierde/restaura la conexión
- **Cache actualizado**: Cuando se actualiza el cache

## Configuración

### Versiones de Cache
- `daniel-baylon-portfolio-v1.0.0`: Cache principal
- `daniel-baylon-static-v1.0.0`: Archivos estáticos
- `daniel-baylon-dynamic-v1.0.0`: Recursos dinámicos

### Archivos Cacheados
- Todos los archivos estáticos del proyecto
- Imágenes externas de Unsplash
- CDN de Font Awesome
- Manifest y iconos PWA

## Compatibilidad

### Navegadores Soportados
- ✅ Chrome 40+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Edge 17+

### Funcionalidades por Navegador
- **Chrome/Edge**: Todas las funcionalidades
- **Firefox**: Cache y offline (notificaciones limitadas)
- **Safari**: Cache y offline (notificaciones limitadas)

## Debugging

### Herramientas de Desarrollo
1. **Chrome DevTools** → Application → Service Workers
2. **Cache Storage** → Ver contenido del cache
3. **Console** → Logs del service worker

### Comandos Útiles
```javascript
// Ver estado del service worker
navigator.serviceWorker.ready.then(reg => console.log(reg));

// Limpiar todos los caches
caches.keys().then(names => names.forEach(name => caches.delete(name)));

// Forzar actualización
navigator.serviceWorker.getRegistration().then(reg => reg.update());
```

## Mantenimiento

### Actualización de Versiones
1. Cambiar `CACHE_NAME` en `sw.js`
2. Actualizar lista de archivos estáticos
3. Probar funcionamiento offline
4. Verificar notificaciones

### Monitoreo
- Revisar logs en consola
- Verificar cache en DevTools
- Probar funcionalidad offline
- Validar notificaciones

## Troubleshooting

### Problemas Comunes
1. **Cache no se actualiza**: Limpiar cache manualmente
2. **Notificaciones no funcionan**: Verificar permisos
3. **Offline no funciona**: Verificar archivos en cache
4. **Actualización no aparece**: Forzar recarga

### Soluciones
```javascript
// Limpiar todo y reiniciar
swManager.clearCache().then(() => location.reload());

// Verificar estado
swManager.getCacheInfo();

// Forzar actualización
swManager.updateApp();
```

## Próximas Mejoras

### Funcionalidades Adicionales
- [ ] Sincronización de formularios offline
- [ ] Cache de datos de API
- [ ] Notificaciones programadas
- [ ] Métricas de uso offline

### Optimizaciones
- [ ] Compresión de cache
- [ ] Lazy loading de recursos
- [ ] Prefetch inteligente
- [ ] Análisis de patrones de uso

---

**Desarrollado por**: Daniel Baylón  
**Versión**: 1.0.0  
**Fecha**: 2025
