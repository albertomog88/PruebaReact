import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Recibimos la función para avisar al padre cuando hacen clic
function Navbar({ handleDrawerToggle }) {
    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#1e293b' }}>
            <Toolbar>
                {/* Ahora este botón SÍ funciona */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle} 
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <LocalShippingIcon sx={{ mr: 1, color: '#f97316' }} />
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    ON RENT <span style={{ color: '#f97316' }}>MANAGER</span>
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        Alberto Z.
                    </Typography>
                    <Avatar sx={{ bgcolor: '#f97316', width: 32, height: 32 }}>A</Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;