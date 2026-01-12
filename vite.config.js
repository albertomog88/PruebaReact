import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,      // Forzamos el puerto 5173 siempre
        open: true,      // <--- ESTA ES LA CLAVE: Abre el navegador solo
        strictPort: true,
    }
})