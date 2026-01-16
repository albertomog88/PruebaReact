import React, { useState } from 'react';
import {
    Box, Paper, Typography, List, ListItemButton, ListItemText, ListItemIcon,
    Fab, TextField, InputAdornment, Snackbar, Alert, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Grid, Avatar, IconButton, useTheme, useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Nuevo icono para volver

// Componente de Detalle (Ligeramente ajustado para móvil)
function ClientDetail({ cliente, onEditar, onEliminar, onVolver }) {
    if (!cliente) return <Typography sx={{ p: 4, color: '#94a3b8' }}>Selecciona un cliente para ver detalles</Typography>;

    return (
        <Paper sx={{ p: { xs: 2, md: 4 }, m: { xs: 1, md: 2 }, borderRadius: 4, height: '100%', overflow: 'auto' }}>
            {/* Botón Volver solo visible si se pasa la función (en móvil) */}
            {onVolver && (
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={onVolver}
                    sx={{ mb: 2 }}
                >
                    Volver al listado
                </Button>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: { sm: 2 }, mb: { xs: 2, sm: 0 }, fontSize: '1.5rem' }}>
                    {cliente.nombre.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="h5" fontWeight="bold">{cliente.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary">CIF/NIF: {cliente.cif}</Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmailIcon color="action" sx={{ mr: 2 }} />
                        <Typography sx={{ wordBreak: 'break-all' }}>{cliente.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon color="action" sx={{ mr: 2 }} />
                        <Typography>{cliente.telefono}</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button variant="outlined" fullWidth startIcon={<EditIcon />} onClick={onEditar}>
                    Editar Datos
                </Button>
                <Button variant="outlined" fullWidth color="error" startIcon={<DeleteIcon />} onClick={onEliminar}>
                    Eliminar Cliente
                </Button>
            </Box>
        </Paper>
    );
}

function ClientsPage({ listaClientes, setListaClientes }) {
    const [idSeleccionado, setIdSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);

    // Hooks para Responsive
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Detecta si es pantalla pequeña (menos de 900px)

    const [formDatos, setFormDatos] = useState({ id: '', nombre: '', cif: '', email: '', telefono: '' });
    const [esEdicion, setEsEdicion] = useState(false);
    const [notificacion, setNotificacion] = useState({ open: false, mensaje: '', tipo: 'success' });

    const seleccionado = listaClientes.find(c => c.id === idSeleccionado);

    // Lógica de visualización:
    // En Móvil: Si hay seleccionado, ocultamos la lista. Si no, mostramos la lista.
    // En Desktop: Siempre mostramos ambos.
    const mostrarLista = !isMobile || (isMobile && !idSeleccionado);
    const mostrarDetalle = !isMobile || (isMobile && idSeleccionado);

    const filtrados = listaClientes.filter(c =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.cif.toLowerCase().includes(busqueda.toLowerCase())
    );

    const mostrarNotificacion = (msg, tipo) => setNotificacion({ open: true, mensaje: msg, tipo });

    // --- MANEJADORES ---
    const handleGuardar = () => {
        if (!formDatos.nombre || !formDatos.cif) return alert("Nombre y CIF obligatorios");
        if (esEdicion) {
            setListaClientes(prev => prev.map(c => c.id === formDatos.id ? formDatos : c));
            mostrarNotificacion('Cliente actualizado', 'success');
        } else {
            const nuevo = { ...formDatos, id: Date.now().toString() };
            setListaClientes([...listaClientes, nuevo]);
            mostrarNotificacion('Cliente creado', 'success');
        }
        setModalAbierto(false);
    };

    const handleBorrar = () => {
        if (window.confirm('¿Eliminar cliente?')) {
            setListaClientes(prev => prev.filter(c => c.id !== idSeleccionado));
            setIdSeleccionado(null);
            mostrarNotificacion('Cliente eliminado', 'warning');
        }
    };

    const abrirModal = (cliente = null) => {
        if (cliente) {
            setFormDatos(cliente);
            setEsEdicion(true);
        } else {
            setFormDatos({ id: '', nombre: '', cif: '', email: '', telefono: '' });
            setEsEdicion(false);
        }
        setModalAbierto(true);
    };

    return (
        <Box sx={{ display: 'flex', gap: 3, flexGrow: 1, height: '100%', overflow: 'hidden', flexDirection: 'row' }}>

            {/* LISTA LATERAL (Visible según lógica responsive) */}
            <Paper sx={{
                width: { xs: '100%', md: 300 },
                display: mostrarLista ? 'flex' : 'none',
                flexDirection: 'column',
                flexShrink: 0
            }}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Clientes ({listaClientes.length})</Typography>
                    <TextField
                        fullWidth size="small" placeholder="Buscar..."
                        value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
                    />
                </Box>
                <List sx={{ overflow: 'auto', flex: 1 }}>
                    {filtrados.map(cliente => (
                        <ListItemButton
                            key={cliente.id} selected={idSeleccionado === cliente.id}
                            onClick={() => setIdSeleccionado(cliente.id)} divider
                        >
                            <ListItemIcon><BusinessIcon /></ListItemIcon>
                            <ListItemText primary={cliente.nombre} secondary={cliente.cif} />
                        </ListItemButton>
                    ))}
                </List>
            </Paper>

            {/* DETALLE PRINCIPAL (Visible según lógica responsive) */}
            <Box sx={{
                flex: 1,
                overflow: 'auto',
                display: mostrarDetalle ? 'block' : 'none'
            }}>
                <ClientDetail
                    cliente={seleccionado}
                    onEditar={() => abrirModal(seleccionado)}
                    onEliminar={handleBorrar}
                    // Pasamos la función de volver solo si es móvil
                    onVolver={isMobile ? () => setIdSeleccionado(null) : null}
                />
            </Box>

            {/* BOTÓN FLOTANTE (Solo visible si estamos viendo la lista en móvil, o siempre en desktop) */}
            <Fab
                color="secondary"
                sx={{
                    position: 'fixed', bottom: 30, right: 30,
                    display: (isMobile && idSeleccionado) ? 'none' : 'flex'
                }}
                onClick={() => abrirModal(null)}
            >
                <AddIcon />
            </Fab>

            {/* MODAL FORMULARIO */}
            <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField label="Nombre / Razón Social" fullWidth value={formDatos.nombre} onChange={e => setFormDatos({ ...formDatos, nombre: e.target.value })} />
                        <TextField label="CIF / NIF" fullWidth value={formDatos.cif} onChange={e => setFormDatos({ ...formDatos, cif: e.target.value })} />
                        <TextField label="Email" fullWidth value={formDatos.email} onChange={e => setFormDatos({ ...formDatos, email: e.target.value })} />
                        <TextField label="Teléfono" fullWidth value={formDatos.telefono} onChange={e => setFormDatos({ ...formDatos, telefono: e.target.value })} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalAbierto(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={notificacion.open} autoHideDuration={4000} onClose={() => setNotificacion({ ...notificacion, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity={notificacion.tipo} variant="filled">{notificacion.mensaje}</Alert>
            </Snackbar>
        </Box>
    );
}

export default ClientsPage;