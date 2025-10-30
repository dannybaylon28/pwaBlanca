// Script para verificar que los estilos se carguen correctamente
// Daniel Baylón - Portfolio

console.log('[Style Checker] Verificando carga de estilos...');

// Función para verificar si los estilos se han cargado
function checkStylesLoaded() {
    const testElement = document.createElement('div');
    testElement.className = 'navbar';
    testElement.style.display = 'none';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const hasStyles = computedStyle.position === 'fixed' && computedStyle.top === '0px';
    
    testElement.remove();
    
    return hasStyles;
}

// Función para forzar recarga de estilos
function reloadStyles() {
    const styleLink = document.querySelector('link[href*="styles.css"]');
    if (styleLink) {
        const newHref = styleLink.href.split('?')[0] + '?v=' + Date.now();
        styleLink.href = newHref;
        console.log('[Style Checker] Estilos recargados con nueva versión');
    }
}

// Verificar estilos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Style Checker] DOM cargado, verificando estilos...');
    
    setTimeout(() => {
        if (!checkStylesLoaded()) {
            console.warn('[Style Checker] ⚠️ Los estilos no se han cargado correctamente');
            console.log('[Style Checker] Intentando recargar estilos...');
            reloadStyles();
            
            // Verificar nuevamente después de 1 segundo
            setTimeout(() => {
                if (checkStylesLoaded()) {
                    console.log('[Style Checker] ✅ Estilos cargados correctamente después de la recarga');
                } else {
                    console.error('[Style Checker] ❌ Los estilos aún no se cargan. Verifica la ruta del archivo CSS.');
                }
            }, 1000);
        } else {
            console.log('[Style Checker] ✅ Estilos cargados correctamente');
        }
    }, 100);
});

// Función para verificar elementos específicos
function checkSpecificElements() {
    const elements = [
        '.navbar',
        '.hero',
        '.hero-title',
        '.btn-primary',
        '.btn-secondary'
    ];
    
    elements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            const computedStyle = window.getComputedStyle(element);
            console.log(`[Style Checker] ${selector}:`, {
                display: computedStyle.display,
                position: computedStyle.position,
                backgroundColor: computedStyle.backgroundColor,
                color: computedStyle.color
            });
        }
    });
}

// Ejecutar verificación de elementos después de 2 segundos
setTimeout(checkSpecificElements, 2000);

// Función para mostrar información de debug
function showDebugInfo() {
    const debugInfo = {
        'User Agent': navigator.userAgent,
        'Viewport': `${window.innerWidth}x${window.innerHeight}`,
        'CSS Files': Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href),
        'Styles Loaded': checkStylesLoaded(),
        'DOM Ready': document.readyState
    };
    
    console.table(debugInfo);
}

// Mostrar información de debug
showDebugInfo();

// Función para verificar si hay errores de CSS
function checkCSSErrors() {
    const styleSheets = document.styleSheets;
    let errorCount = 0;
    
    for (let i = 0; i < styleSheets.length; i++) {
        try {
            const rules = styleSheets[i].cssRules || styleSheets[i].rules;
            if (rules) {
                console.log(`[Style Checker] CSS ${i + 1}: ${rules.length} reglas cargadas`);
            }
        } catch (e) {
            errorCount++;
            console.error(`[Style Checker] Error en CSS ${i + 1}:`, e.message);
        }
    }
    
    if (errorCount === 0) {
        console.log('[Style Checker] ✅ No se encontraron errores de CSS');
    } else {
        console.warn(`[Style Checker] ⚠️ Se encontraron ${errorCount} errores de CSS`);
    }
}

// Verificar errores de CSS
setTimeout(checkCSSErrors, 500);

// Función para forzar recarga completa de la página si es necesario
function forceReload() {
    if (confirm('Los estilos no se están cargando correctamente. ¿Deseas recargar la página?')) {
        window.location.reload(true);
    }
}

// Hacer funciones disponibles globalmente para debugging
window.styleChecker = {
    checkStylesLoaded,
    reloadStyles,
    checkSpecificElements,
    showDebugInfo,
    checkCSSErrors,
    forceReload
};

console.log('[Style Checker] Herramientas de debug disponibles en window.styleChecker');
