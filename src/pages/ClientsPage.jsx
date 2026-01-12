import React, { useState } from 'react';
import {
    Box, Paper, Typography, List, ListItemButton, ListItemText, ListItemIcon,
    Fab, TextField, InputAdornment, Snackbar, Alert, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Grid, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person'; // Icono para clientes
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Un componente de tarjeta simple para el detalle del cliente
function ClientDetail({ cliente, onEditar, onEliminar }) {
    if (!cliente) return <Typography sx={{ p: 4, color: '#94a3b8' }}>Selecciona un cliente para ver detalles</Typography>;

    return (
        <Paper sx={{ p: 4, m: 2, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: 2, fontSize: '1.5rem' }}>
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
                        <Typography>{cliente.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon color="action" sx={{ mr: 2 }} />
                        <Typography>{cliente.telefono}</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button variant="outlined" startIcon={<EditIcon />} onClick={onEditar}>
                    Editar Datos
                </Button>
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={onEliminar}>
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

    // Estado para el formulario (lo simplifico aquí dentro para no crear otro archivo hoy)
    const [formDatos, setFormDatos] = useState({ id: '', nombre: '', cif: '', email: '', telefono: '' });
    const [esEdicion, setEsEdicion] = useState(false);

    // Estado Notificaciones
    const [notificacion, setNotificacion] = useState({ open: false, mensaje: '', tipo: 'success' });

    const seleccionado = listaClientes.find(c => c.id === idSeleccionado);

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
            mostrarNotificacion('Cliente actualizado correctamente', 'success');
        } else {
            const nuevo = { ...formDatos, id: Date.now().toString() };
            setListaClientes([...listaClientes, nuevo]);
            mostrarNotificacion('Cliente creado correctamente', 'success');
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
        <Box sx={{ display: 'flex', gap: 3, flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            {/* LISTA LATERAL */}
            <Paper sx={{ width: 300, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Clientes ({listaClientes.length})</Typography>
                    <TextField
                        fullWidth size="small" placeholder="Buscar cliente..."
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

            {/* DETALLE PRINCIPAL */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <ClientDetail cliente={seleccionado} onEditar={() => abrirModal(seleccionado)} onEliminar={handleBorrar} />
            </Box>

            {/* BOTÓN FLOTANTE */}
            <Fab color="secondary" sx={{ position: 'fixed', bottom: 30, right: 30 }} onClick={() => abrirModal(null)}>
                <AddIcon />
            </Fab>

            {/* MODAL FORMULARIO (Simple) */}
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

            {/* NOTIFICACIONES */}
            <Snackbar open={notificacion.open} autoHideDuration={4000} onClose={() => setNotificacion({ ...notificacion, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 8 }}>
                <Alert severity={notificacion.tipo} variant="filled">{notificacion.mensaje}</Alert>
            </Snackbar>
        </Box>
    );
}

export default ClientsPage;