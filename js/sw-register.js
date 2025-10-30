// Script para registrar y manejar el Service Worker
// Daniel Baylón - Portfolio PWA

class ServiceWorkerManager {
    constructor() {
        this.registration = null;
        this.isOnline = navigator.onLine;
        this.init();
    }

    async init() {
        // Verificar soporte para Service Workers
        if (!('serviceWorker' in navigator)) {
            console.warn('[SW Manager] Service Workers no soportados en este navegador');
            return;
        }

        // Registrar el Service Worker
        await this.registerServiceWorker();
        
        // Configurar listeners
        this.setupEventListeners();
        
        // Mostrar estado de conexión
        this.updateConnectionStatus();
    }

    async registerServiceWorker() {
        try {
            console.log('[SW Manager] Registrando Service Worker...');
            
            this.registration = await navigator.serviceWorker.register('./sw.js', {
                scope: './'
            });

            console.log('[SW Manager] Service Worker registrado exitosamente:', this.registration);

            // Manejar actualizaciones
            this.registration.addEventListener('updatefound', () => {
                console.log('[SW Manager] Nueva versión del Service Worker disponible');
                this.handleUpdate();
            });

            // Verificar si hay una nueva versión esperando
            if (this.registration.waiting) {
                this.handleUpdate();
            }

        } catch (error) {
            console.error('[SW Manager] Error al registrar Service Worker:', error);
        }
    }

    setupEventListeners() {
        // Listener para cambios de conexión
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus();
            this.showNotification('Conexión restaurada', 'Ya tienes acceso a internet');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus();
            this.showNotification('Sin conexión', 'Algunas funciones pueden estar limitadas');
        });

        // Listener para mensajes del Service Worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            this.handleServiceWorkerMessage(event);
        });

        // Listener para control de Service Worker
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[SW Manager] Service Worker controlado cambiado');
            window.location.reload();
        });
    }

    handleUpdate() {
        const newWorker = this.registration.waiting;
        
        if (newWorker) {
            // Mostrar notificación de actualización
            this.showUpdateNotification();
            
            // Escuchar mensajes del nuevo worker
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                    console.log('[SW Manager] Nueva versión activada');
                    this.showNotification('Aplicación actualizada', 'Se ha instalado una nueva versión');
                }
            });
        }
    }

    showUpdateNotification() {
        // Crear notificación de actualización
        const updateBanner = document.createElement('div');
        updateBanner.id = 'update-banner';
        updateBanner.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #3B82F6, #1D4ED8);
                color: white;
                padding: 12px 20px;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <span style="margin-right: 15px;">🔄 Nueva versión disponible</span>
                <button onclick="swManager.updateApp()" style="
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                ">Actualizar</button>
                <button onclick="swManager.dismissUpdate()" style="
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Más tarde</button>
            </div>
        `;
        
        document.body.appendChild(updateBanner);
        
        // Ajustar el padding del body para la notificación
        document.body.style.paddingTop = '60px';
    }

    updateApp() {
        if (this.registration.waiting) {
            // Enviar mensaje al Service Worker para activar la nueva versión
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    }

    dismissUpdate() {
        const banner = document.getElementById('update-banner');
        if (banner) {
            banner.remove();
            document.body.style.paddingTop = '0';
        }
    }

    updateConnectionStatus() {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.textContent = this.isOnline ? 'En línea' : 'Sin conexión';
            statusElement.className = this.isOnline ? 'online' : 'offline';
        }
    }

    showNotification(title, message) {
        // Verificar soporte para notificaciones
        if (!('Notification' in window)) {
            console.log('[SW Manager] Notificaciones no soportadas');
            return;
        }

        // Solicitar permiso si es necesario
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.createNotification(title, message);
                }
            });
        } else if (Notification.permission === 'granted') {
            this.createNotification(title, message);
        }
    }

    createNotification(title, message) {
            const notification = new Notification(title, {
            body: message,
            icon: './img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-192x192.png',
            badge: './img/Custom/Gemini_Generated_Image_ibcxssibcxssibcx-64x64.png',
            tag: 'portfolio-notification'
        });

        // Cerrar la notificación después de 5 segundos
        setTimeout(() => {
            notification.close();
        }, 5000);
    }

    handleServiceWorkerMessage(event) {
        const { type, payload } = event.data;
        
        switch (type) {
            case 'CACHE_UPDATED':
                console.log('[SW Manager] Cache actualizado:', payload);
                break;
            case 'OFFLINE_DETECTED':
                this.showNotification('Sin conexión', 'Algunas funciones pueden estar limitadas');
                break;
        }
    }

    // Método para limpiar cache manualmente
    async clearCache() {
        try {
            if (navigator.serviceWorker.controller) {
                const messageChannel = new MessageChannel();
                
                return new Promise((resolve) => {
                    messageChannel.port1.onmessage = (event) => {
                        if (event.data.success) {
                            console.log('[SW Manager] Cache limpiado exitosamente');
                            this.showNotification('Cache limpiado', 'Se ha limpiado el cache de la aplicación');
                        }
                        resolve(event.data);
                    };
                    
                    navigator.serviceWorker.controller.postMessage(
                        { type: 'CLEAR_CACHE' },
                        [messageChannel.port2]
                    );
                });
            }
        } catch (error) {
            console.error('[SW Manager] Error al limpiar cache:', error);
        }
    }

    // Método para obtener información del cache
    async getCacheInfo() {
        try {
            if (navigator.serviceWorker.controller) {
                const messageChannel = new MessageChannel();
                
                return new Promise((resolve) => {
                    messageChannel.port1.onmessage = (event) => {
                        console.log('[SW Manager] Estado del cache:', event.data.status);
                        resolve(event.data.status);
                    };
                    
                    navigator.serviceWorker.controller.postMessage(
                        { type: 'CACHE_STATUS' },
                        [messageChannel.port2]
                    );
                });
            }
        } catch (error) {
            console.error('[SW Manager] Error al obtener información del cache:', error);
        }
    }
}

// Inicializar el Service Worker Manager
const swManager = new ServiceWorkerManager();

// Hacer disponible globalmente para uso en consola
window.swManager = swManager;

// Agregar indicador de estado de conexión al DOM
document.addEventListener('DOMContentLoaded', () => {
    const connectionStatus = document.createElement('div');
    connectionStatus.id = 'connection-status';
    connectionStatus.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    // Aplicar estilos según el estado
    if (navigator.onLine) {
        connectionStatus.textContent = 'En línea';
        connectionStatus.style.background = '#10B981';
        connectionStatus.style.color = 'white';
    } else {
        connectionStatus.textContent = 'Sin conexión';
        connectionStatus.style.background = '#EF4444';
        connectionStatus.style.color = 'white';
    }
    
    document.body.appendChild(connectionStatus);
});

console.log('[SW Manager] Service Worker Manager inicializado correctamente');
