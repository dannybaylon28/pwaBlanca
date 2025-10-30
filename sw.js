// Service Worker para Daniel Baylón - Portfolio PWA
// Versión: 1.0.0

const CACHE_NAME = 'daniel-baylon-portfolio-v1.0.0';
const STATIC_CACHE_NAME = 'daniel-baylon-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'daniel-baylon-dynamic-v1.0.0';

// Archivos estáticos para cachear
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/styles.css',
    '/js/script.js',
    '/js/main.js',
    '/js/counter.js',
    '/img/foto.jpeg',
    '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-16x16.png',
    '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-32x32.png',
    '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-64x64.png',
    '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-96x96.png',
    '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-128x128.png',
    '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-192x192.png',
    '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-256x256.png',
    '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-384x384.png',
    '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-512x512.png',
    '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-1024x1024.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// URLs externas que queremos cachear
const EXTERNAL_URLS = [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&auto=format'
];

// Evento de instalación
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando service worker...');
    
    event.waitUntil(
        Promise.all([
            // Cachear archivos estáticos
            caches.open(STATIC_CACHE_NAME).then((cache) => {
                console.log('[SW] Cacheando archivos estáticos...');
                return cache.addAll(STATIC_FILES);
            }),
            // Cachear recursos externos
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                console.log('[SW] Cacheando recursos externos...');
                return cache.addAll(EXTERNAL_URLS);
            })
        ]).then(() => {
            console.log('[SW] Service worker instalado correctamente');
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activando service worker...');
    
    event.waitUntil(
        Promise.all([
            // Limpiar caches antiguos
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME &&
                            cacheName !== CACHE_NAME) {
                            console.log('[SW] Eliminando cache antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            self.clients.claim()
        ]).then(() => {
            console.log('[SW] Service worker activado correctamente');
        })
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    if (request.method !== 'GET') {
        return;
    }
    
    if (isStaticFile(request.url)) {
        event.respondWith(
            caches.match(request).then((response) => {
                if (response) {
                    console.log('[SW] Sirviendo desde cache:', request.url);
                    return response;
                }
                
                return fetch(request).then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    const responseToCache = response.clone();
                    
                    caches.open(STATIC_CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                    
                    return response;
                }).catch(() => {
                    return caches.match(request);
                });
            })
        );
    }
    
    else if (isExternalImage(request.url)) {
        event.respondWith(
            caches.match(request).then((response) => {
                if (response) {
                    console.log('[SW] Sirviendo imagen desde cache:', request.url);
                    return response;
                }
                
                return fetch(request).then((response) => {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    
                    const responseToCache = response.clone();
                    caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                    
                    return response;
                }).catch(() => {
                    return new Response(
                        '<svg width="400" height="250" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Imagen no disponible</text></svg>',
                        { headers: { 'Content-Type': 'image/svg+xml' } }
                    );
                });
            })
        );
    }
    
    else {
        event.respondWith(
            fetch(request).then((response) => {
                if (!response || response.status !== 200) {
                    return response;
                }
                
                const responseToCache = response.clone();
                caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                    cache.put(request, responseToCache);
                });
                
                return response;
            }).catch(() => {
                return caches.match(request);
            })
        );
    }
});

function isStaticFile(url) {
    const staticExtensions = ['.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.svg', '.ico'];
    return staticExtensions.some(ext => url.includes(ext)) || 
           url.includes('/css/') || 
           url.includes('/js/') || 
           url.includes('/img/') ||
           url === self.location.origin + '/' ||
           url === self.location.origin + '/index.html';
}

function isExternalImage(url) {
    return url.includes('images.unsplash.com') || 
           url.includes('cdnjs.cloudflare.com') ||
           (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.svg'));
}

self.addEventListener('message', (event) => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'CACHE_STATUS':
            getCacheStatus().then((status) => {
                event.ports[0].postMessage({ status });
            });
            break;
    }
});

// Función para limpiar todos los caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('[SW] Todos los caches han sido limpiados');
}

// Función para obtener el estado de los caches
async function getCacheStatus() {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        status[cacheName] = keys.length;
    }
    
    return status;
}

// Evento para notificaciones push (opcional)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-192x192.png',
            badge: '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-64x64.png',
            vibrate: [200, 100, 200],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Ver Portfolio',
                    icon: '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-32x32.png'
                },
                {
                    action: 'close',
                    title: 'Cerrar',
                    icon: '/img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-32x32.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Evento para manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Evento para sincronización en segundo plano
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Función para sincronización en segundo plano
async function doBackgroundSync() {
    console.log('[SW] Ejecutando sincronización en segundo plano...');
    // Aquí puedes implementar lógica de sincronización
    // Por ejemplo, enviar datos pendientes, actualizar cache, etc.
}

console.log('[SW] Service Worker cargado correctamente');
