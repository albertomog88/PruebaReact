import React from 'react';
import { Box, Typography, Link, Divider } from '@mui/material';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto', // ESTO ES CLAVE: Empuja el footer al fondo
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto' }}>

                {/* Izquierda: Copyright */}
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} On Rent Manager. Todos los derechos reservados.
                </Typography>

                {/* Derecha: Enlaces */}
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Link href="#" color="inherit" underline="hover" variant="body2">
                        Soporte
                    </Link>
                    <Link href="#" color="inherit" underline="hover" variant="body2">
                        Privacidad
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}

export default Footer;