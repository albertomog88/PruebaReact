import React from 'react';
import { Drawer, Toolbar, List, ListItemButton, ListItemText, ListItemIcon, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;
const miniDrawerWidth = 65;

function Sidebar({ open, mobileOpen, handleDrawerToggle }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Inicio', icon: <HomeIcon />, path: '/' },
        { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
        { text: 'Gestión de Flota', icon: <LocalShippingIcon />, path: '/flota' },
        { text: 'Alquileres', icon: <HistoryIcon />, path: '/alquileres' },
    ];

    const drawerContent = (
        <>
            <Toolbar /> {/* Espaciador para el Navbar */}
            <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        onClick={() => { navigate(item.path); handleDrawerToggle(); }} // Cierra el menú en móvil al hacer clic
                        selected={location.pathname === item.path}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            mb: 1,
                            '&.Mui-selected': { bgcolor: '#f97316', color: 'white', '&:hover': { bgcolor: '#ea580c' } },
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                ))}
            </List>
        </>
    );

    return (
        <Box component="nav" sx={{ width: { sm: open ? drawerWidth : miniDrawerWidth }, flexShrink: { sm: 0 } }}>
            {/* DRAWER PARA MÓVIL (Temporary) */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }} // Mejor rendimiento en móviles
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#1e293b', color: 'white' },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* DRAWER PARA ESCRITORIO (Permanent / Mini) */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: open ? drawerWidth : miniDrawerWidth,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                    transition: (theme) => theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    [`& .MuiDrawer-paper`]: {
                        width: open ? drawerWidth : miniDrawerWidth,
                        bgcolor: '#1e293b',
                        color: 'white',
                        overflowX: 'hidden',
                        transition: (theme) => theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    },
                }}
                open={open}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
}

export default Sidebar;