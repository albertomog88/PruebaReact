import React from 'react';
import { Drawer, Toolbar, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HistoryIcon from '@mui/icons-material/History'; // <--- IMPORTAMOS EL NUEVO ICONO
import { useNavigate, useLocation } from 'react-router-dom';

// Definimos los anchos exactos
const drawerWidth = 240;
const miniDrawerWidth = 65;

// Recibimos la variable 'open' del padre
function Sidebar({ open }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Inicio', icon: <HomeIcon />, path: '/' },
        { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
        { text: 'Gestión de Flota', icon: <LocalShippingIcon />, path: '/flota' },
        // --- NUEVA OPCIÓN AÑADIDA ---
        { text: 'Alquileres', icon: <HistoryIcon />, path: '/alquileres' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: open ? drawerWidth : miniDrawerWidth, // Ancho dinámico del contenedor
                flexShrink: 0,
                whiteSpace: 'nowrap', // Evita que el texto salte de línea al cerrar
                boxSizing: 'border-box',
                // Transición suave animada (CSS Magic de MUI)
                transition: (theme) => theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                [`& .MuiDrawer-paper`]: {
                    width: open ? drawerWidth : miniDrawerWidth, // Ancho dinámico del papel blanco
                    bgcolor: '#1e293b',
                    color: 'white',
                    overflowX: 'hidden', // Esconde lo que sobresalga
                    transition: (theme) => theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                },
            }}
        >
            <Toolbar />

            <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        selected={location.pathname === item.path}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center', // Si cerrado, centra el icono
                            px: 2.5,
                            mb: 1,
                            '&.Mui-selected': { bgcolor: '#f97316', color: 'white', '&:hover': { bgcolor: '#ea580c' } },
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto', // Si cerrado, quita el margen derecho
                                justifyContent: 'center',
                                color: 'inherit'
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>

                        {/* Texto: Opacidad 0 si está cerrado */}
                        <ListItemText
                            primary={item.text}
                            sx={{ opacity: open ? 1 : 0 }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
}

export default Sidebar;