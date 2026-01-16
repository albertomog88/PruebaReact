import React, { useState } from 'react';
import {
    Box, Paper, Typography, List, ListItemButton, ListItemText, ListItemIcon,
    Fab, TextField, InputAdornment, Snackbar, Alert, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
    useTheme, useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import VehicleCard from '../components/VehicleCard';
import VehicleForm from '../components/VehicleForm';
import StatusBadge from '../components/StatusBadge';

function FleetPage({ listaVehiculos, setListaVehiculos, listaClientes, setHistorialAlquileres }) {

    const [idSeleccionado, setIdSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    // --- ESTADOS DE MODALES ---
    const [modalAbierto, setModalAbierto] = useState(false); // Crear/Editar Vehículo
    const [vehiculoAEditar, setVehiculoAEditar] = useState(null);

    const [modalAlquilerAbierto, setModalAlquilerAbierto] = useState(false); // Alquilar
    const [clienteParaAlquiler, setClienteParaAlquiler] = useState('');

    const [notificacion, setNotificacion] = useState({ open: false, mensaje: '', tipo: 'success' });

    // --- RESPONSIVE (Igual que ClientsPage) ---
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Lógica de visualización:
    const mostrarLista = !isMobile || (isMobile && !idSeleccionado);
    const mostrarDetalle = !isMobile || (isMobile && idSeleccionado);

    const seleccionado = listaVehiculos.find(v => v.id === idSeleccionado);

    const vehiculosFiltrados = listaVehiculos.filter(v =>
        v.matricula.toLowerCase().includes(busqueda.toLowerCase()) ||
        v.modelo.toLowerCase().includes(busqueda.toLowerCase())
    );

    const mostrarNotificacion = (msg, tipo = 'success') => setNotificacion({ open: true, mensaje: msg, tipo });

    // --- LÓGICA DEL NEGOCIO ---

    const handleSumarKm = () => {
        if (!seleccionado) return;
        setListaVehiculos(prev => prev.map(v => v.id === idSeleccionado ? { ...v, km: v.km + 1000 } : v));
        mostrarNotificacion(`+1000 km registrados`, 'info');
    };

    const handleEliminar = () => {
        if (window.confirm(`¿Eliminar ${seleccionado.matricula}?`)) {
            setListaVehiculos(prev => prev.filter(v => v.id !== idSeleccionado));
            setIdSeleccionado(null);
            mostrarNotificacion('Vehículo eliminado', 'warning');
        }
    };

    const handleAbrirCrear = () => {
        setVehiculoAEditar(null);
        setModalAbierto(true);
    };

    const handleAbrirEditar = () => {
        setVehiculoAEditar(seleccionado);
        setModalAbierto(true);
    };

    const handleGuardarVehiculo = (vehiculoFinal) => {
        if (vehiculoAEditar) {
            setListaVehiculos(prev => prev.map(v => v.id === vehiculoFinal.id ? vehiculoFinal : v));
            mostrarNotificacion('Vehículo actualizado', 'success');
        } else {
            setListaVehiculos([...listaVehiculos, vehiculoFinal]);
            setIdSeleccionado(vehiculoFinal.id); // Seleccionamos el nuevo
            mostrarNotificacion('Vehículo creado', 'success');
        }
        setModalAbierto(false);
    };

    // --- ALQUILER ---
    const abrirModalAlquiler = () => {
        setClienteParaAlquiler('');
        setModalAlquilerAbierto(true);
    };

    const confirmarAlquiler = () => {
        if (!clienteParaAlquiler || !seleccionado) return alert("Selecciona un cliente");
        const cliente = listaClientes.find(c => c.id === clienteParaAlquiler);

        // 1. Actualizar estado vehículo
        setListaVehiculos(prev => prev.map(v =>
            v.id === seleccionado.id ? { ...v, estado: 'Alquilado', clienteAsignado: cliente.nombre } : v
        ));

        // 2. Crear historial
        if (setHistorialAlquileres) {
            setHistorialAlquileres(prev => [{
                id: Date.now().toString(),
                vehiculoId: seleccionado.id,
                matricula: seleccionado.matricula,
                clientId: cliente.id,
                nombreCliente: cliente.nombre,
                fechaInicio: new Date().toISOString(),
                fechaFin: null,
                activo: true
            }, ...prev]);
        }

        mostrarNotificacion(`Alquilado a ${cliente.nombre}`, 'success');
        setModalAlquilerAbierto(false);
    };


    return (
        <Box sx={{ display: 'flex', gap: 3, flexGrow: 1, height: '100%', overflow: 'hidden' }}>

            {/* --- LISTA LATERAL (Master) --- */}
            <Paper sx={{
                width: { xs: '100%', md: 300 },
                display: mostrarLista ? 'flex' : 'none',
                flexDirection: 'column',
                flexShrink: 0
            }}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Flota ({listaVehiculos.length})</Typography>
                    <TextField
                        fullWidth size="small" placeholder="Buscar matrícula..."
                        value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
                        sx={{ bgcolor: 'white' }}
                    />
                </Box>

                <List sx={{ overflow: 'auto', flex: 1 }}>
                    {vehiculosFiltrados.map(vehiculo => (
                        <ListItemButton
                            key={vehiculo.id}
                            selected={idSeleccionado === vehiculo.id}
                            onClick={() => setIdSeleccionado(vehiculo.id)}
                            divider
                        >
                            <ListItemIcon sx={{ minWidth: 35 }}><DirectionsCarIcon /></ListItemIcon>
                            <ListItemText
                                primary={vehiculo.matricula}
                                secondary={vehiculo.modelo}
                            />
                            {/* Pequeño badge de estado en la lista */}
                            <StatusBadge estado={vehiculo.estado} />
                        </ListItemButton>
                    ))}
                    {vehiculosFiltrados.length === 0 && (
                        <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>Sin resultados</Typography>
                    )}
                </List>
            </Paper>

            {/* --- DETALLE PRINCIPAL (Detail) --- */}
            <Box sx={{
                flex: 1,
                overflow: 'auto',
                display: mostrarDetalle ? 'flex' : 'none',
                flexDirection: 'column'
            }}>
                {/* Botón Volver (Solo Móvil) */}
                {isMobile && (
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => setIdSeleccionado(null)}
                        sx={{ alignSelf: 'flex-start', mb: 1 }}
                    >
                        Volver al listado
                    </Button>
                )}

                {/* Reutilizamos el VehicleCard existente */}
                <VehicleCard
                    vehiculo={seleccionado}
                    onSumarKm={handleSumarKm}
                    onEditar={handleAbrirEditar}
                    onEliminar={handleEliminar}
                    onAlquilar={abrirModalAlquiler}
                />
            </Box>

            {/* BOTÓN FLOTANTE (Solo visible en la vista de lista) */}
            <Fab
                color="primary"
                sx={{
                    position: 'fixed', bottom: 30, right: 30,
                    display: (isMobile && idSeleccionado) ? 'none' : 'flex'
                }}
                onClick={handleAbrirCrear}
            >
                <AddIcon />
            </Fab>

            {/* --- MODALES --- */}

            {/* 1. Formulario Vehículo */}
            <VehicleForm
                key={vehiculoAEditar ? vehiculoAEditar.id : 'nuevo'}
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onGuardar={handleGuardarVehiculo}
                vehiculoAEditar={vehiculoAEditar}
            />

            {/* 2. Asignar Alquiler */}
            <Dialog open={modalAlquilerAbierto} onClose={() => setModalAlquilerAbierto(false)} fullWidth maxWidth="xs">
                <DialogTitle>Nuevo Alquiler</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <Typography paragraph>Vehículo: <strong>{seleccionado?.matricula}</strong></Typography>
                        <FormControl fullWidth>
                            <InputLabel>Cliente</InputLabel>
                            <Select
                                value={clienteParaAlquiler}
                                label="Cliente"
                                onChange={(e) => setClienteParaAlquiler(e.target.value)}
                            >
                                {listaClientes?.map(c => (
                                    <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalAlquilerAbierto(false)}>Cancelar</Button>
                    <Button variant="contained" color="warning" onClick={confirmarAlquiler}>Confirmar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={notificacion.open} autoHideDuration={4000} onClose={() => setNotificacion({ ...notificacion, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity={notificacion.tipo} variant="filled">{notificacion.mensaje}</Alert>
            </Snackbar>

        </Box>
    );
}

export default FleetPage;