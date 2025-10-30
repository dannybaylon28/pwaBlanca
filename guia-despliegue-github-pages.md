# Guía de Despliegue PWA en GitHub Pages

## Pasos para Desplegar tu PWA

### 1. Preparar el Repositorio

1. **Crear repositorio en GitHub:**
   - Ve a [GitHub](https://github.com)
   - Crea un nuevo repositorio llamado `project` (o el nombre que prefieras)
   - **NO** inicialices con README, .gitignore o licencia

2. **Subir tu código:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PWA Portfolio"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/project.git
   git push -u origin main
   ```

### 2. Configurar GitHub Pages

1. **Habilitar GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Click en "Settings" (Configuración)
   - Scroll hasta "Pages" en el menú lateral
   - En "Source" selecciona "GitHub Actions"

2. **Configurar permisos:**
   - Ve a "Settings" > "Actions" > "General"
   - En "Workflow permissions" selecciona "Read and write permissions"
   - Marca "Allow GitHub Actions to create and approve pull requests"

### 3. Desplegar Automáticamente

El workflow ya está configurado. Cada vez que hagas push a la rama `main`, se desplegará automáticamente.

**Para desplegar manualmente:**
```bash
npm install
npm run deploy
```

### 4. Verificar el Despliegue

1. **URL de tu PWA:**
   - `https://TU_USUARIO.github.io/project`

2. **Verificar PWA:**
   - Abre Chrome DevTools (F12)
   - Ve a "Application" > "Manifest"
   - Verifica que todos los campos estén correctos
   - Ve a "Service Workers" y confirma que esté activo
   - Ve a "Cache Storage" para ver los recursos cacheados

### 5. Instalar la PWA

1. **En Chrome/Edge:**
   - Busca el ícono de instalación en la barra de direcciones
   - Click en "Instalar" o "Add to Home Screen"

2. **En móviles:**
   - Abre la PWA en el navegador
   - Busca "Agregar a pantalla de inicio" en el menú

## Archivos Importantes Creados

- ✅ `vite.config.js` - Configuración de Vite para GitHub Pages
- ✅ `.github/workflows/deploy.yml` - Workflow de despliegue automático
- ✅ `package.json` - Actualizado con scripts de despliegue
- ✅ `manifest.json` - Ya configurado para PWA
- ✅ `sw.js` - Service Worker ya implementado

## Solución de Problemas

### Error: "Page not found"
- Verifica que el `base` en `vite.config.js` sea `/project/`
- Confirma que el repositorio se llame `project`

### Error: "Service Worker not found"
- Verifica que `sw.js` esté en la raíz del proyecto
- Confirma que el Service Worker esté registrado en `index.html`

### Error: "Manifest not found"
- Verifica que `manifest.json` esté en la raíz
- Confirma que esté referenciado en `index.html`

## URLs Importantes

- **PWA Live:** `https://TU_USUARIO.github.io/project`
- **Repositorio:** `https://github.com/TU_USUARIO/project`
- **Actions:** `https://github.com/TU_USUARIO/project/actions`

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Desplegar manualmente
npm run deploy

# Ver logs de GitHub Actions
gh run list
gh run view [RUN_ID]
```
