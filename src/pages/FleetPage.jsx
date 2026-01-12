import React, { useState } from 'react';
import {
    Box, Paper, Typography, List, ListItemButton, ListItemText, ListItemIcon,
    Fab, TextField, InputAdornment, Snackbar, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';

import VehicleCard from '../components/VehicleCard';
import VehicleForm from '../components/VehicleForm';
import StatusBadge from '../components/StatusBadge';

// AHORA RECIBIMOS 'setHistorialAlquileres' TAMBIÉN
function FleetPage({ listaVehiculos, setListaVehiculos, listaClientes, setHistorialAlquileres }) {

    const [idSeleccionado, setIdSeleccionado] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [vehiculoAEditar, setVehiculoAEditar] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    // --- ESTADOS PARA ALQUILER ---
    const [modalAlquilerAbierto, setModalAlquilerAbierto] = useState(false);
    const [clienteParaAlquiler, setClienteParaAlquiler] = useState('');
    // ------------------------------------

    const [notificacion, setNotificacion] = useState({
        open: false, mensaje: '', tipo: 'success'
    });

    const seleccionado = listaVehiculos.find(v => v.id === idSeleccionado);

    const vehiculosFiltrados = listaVehiculos.filter(v =>
        v.matricula.toLowerCase().includes(busqueda.toLowerCase()) ||
        v.modelo.toLowerCase().includes(busqueda.toLowerCase())
    );

    const mostrarNotificacion = (mensaje, tipo = 'success') => {
        setNotificacion({ open: true, mensaje, tipo });
    };

    const handleCerrarNotificacion = (event, reason) => {
        if (reason === 'clickaway') return;
        setNotificacion({ ...notificacion, open: false });
    };

    // --- FUNCIONES DE ALQUILER ---
    const abrirModalAlquiler = () => {
        if (!seleccionado) return;
        setClienteParaAlquiler('');
        setModalAlquilerAbierto(true);
    };

    // ESTA ES LA ÚNICA VERSIÓN QUE NECESITAMOS (LA BUENA)
    const confirmarAlquiler = () => {
        if (!clienteParaAlquiler) {
            alert("Por favor selecciona un cliente");
            return;
        }

        const infoCliente = listaClientes.find(c => c.id === clienteParaAlquiler);
        const vehiculo = listaVehiculos.find(v => v.id === idSeleccionado);

        // 1. ACTUALIZAR ESTADO DEL VEHÍCULO
        setListaVehiculos(prev => prev.map(v => {
            if (v.id === idSeleccionado) {
                return {
                    ...v,
                    estado: 'Alquilado',
                    clienteAsignado: infoCliente.nombre
                };
            }
            return v;
        }));

        // 2. CREAR REGISTRO EN EL HISTORIAL
        if (setHistorialAlquileres) {
            const nuevoAlquiler = {
                id: Date.now().toString(),
                vehiculoId: vehiculo.id,
                matricula: vehiculo.matricula,
                clientId: infoCliente.id,
                nombreCliente: infoCliente.nombre,
                fechaInicio: new Date().toISOString(),
                fechaFin: null,
                activo: true
            };
            setHistorialAlquileres(prev => [nuevoAlquiler, ...prev]);
        }

        mostrarNotificacion(`Alquilado a ${infoCliente.nombre}`, 'success');
        setModalAlquilerAbierto(false);
    };
    // -----------------------------------------

    const sumarKilometros = () => {
        if (!seleccionado) return;
        setListaVehiculos(listaActual =>
            listaActual.map(v => v.id === idSeleccionado ? { ...v, km: v.km + 1000 } : v)
        );
        mostrarNotificacion(`Kilómetros actualizados: +1000`, 'info');
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
            setListaVehiculos(listaActual =>
                listaActual.map(v => v.id === vehiculoFinal.id ? vehiculoFinal : v)
            );
            mostrarNotificacion('Vehículo actualizado correctamente', 'success');
        } else {
            setListaVehiculos([...listaVehiculos, vehiculoFinal]);
            setIdSeleccionado(vehiculoFinal.id);
            mostrarNotificacion('Nuevo vehículo añadido a la flota', 'success');
        }
    };

    const handleEliminar = () => {
        if (window.confirm(`¿Seguro que quieres eliminar el vehículo ${seleccionado.matricula}?`)) {
            const nuevaLista = listaVehiculos.filter(v => v.id !== idSeleccionado);
            setListaVehiculos(nuevaLista);
            setIdSeleccionado(null);
            mostrarNotificacion('Vehículo eliminado permanentemente', 'warning');
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 3, flexGrow: 1, height: '100%', overflow: 'hidden' }}>

            <Paper sx={{ width: 300, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Vehículos ({listaVehiculos.length})
                    </Typography>
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
                            <ListItemIcon sx={{ minWidth: 30 }}><DirectionsCarIcon fontSize="small" /></ListItemIcon>
                            <ListItemText
                                primary={vehiculo.matricula}
                                secondary={<StatusBadge estado={vehiculo.estado} />}
                                secondaryTypographyProps={{ component: 'div' }}
                            />
                        </ListItemButton>
                    ))}
                    {vehiculosFiltrados.length === 0 && (
                        <Typography variant="body2" sx={{ p: 3, textAlign: 'center', color: '#94a3b8' }}>
                            No se encontraron vehículos.
                        </Typography>
                    )}
                </List>
            </Paper>

            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <VehicleCard
                    vehiculo={seleccionado}
                    onSumarKm={sumarKilometros}
                    onEditar={handleAbrirEditar}
                    onEliminar={handleEliminar}
                    onAlquilar={abrirModalAlquiler}
                />
            </Box>

            <Fab color="primary" sx={{ position: 'fixed', bottom: 30, right: 30 }} onClick={handleAbrirCrear}>
                <AddIcon />
            </Fab>

            <VehicleForm
                key={vehiculoAEditar ? vehiculoAEditar.id : 'alta_nueva'}
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onGuardar={handleGuardarVehiculo}
                vehiculoAEditar={vehiculoAEditar}
            />

            {/* --- MODAL DE ALQUILER --- */}
            <Dialog open={modalAlquilerAbierto} onClose={() => setModalAlquilerAbierto(false)} fullWidth maxWidth="xs">
                <DialogTitle>Asignar Cliente</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Selecciona el cliente para el vehículo <strong>{seleccionado?.matricula}</strong>.
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Cliente</InputLabel>
                            <Select
                                value={clienteParaAlquiler}
                                label="Cliente"
                                onChange={(e) => setClienteParaAlquiler(e.target.value)}
                            >
                                {listaClientes && listaClientes.map(cliente => (
                                    <MenuItem key={cliente.id} value={cliente.id}>
                                        {cliente.nombre}
                                    </MenuItem>
                                ))}
                                {(!listaClientes || listaClientes.length === 0) && (
                                    <MenuItem disabled>No hay clientes registrados</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalAlquilerAbierto(false)}>Cancelar</Button>
                    <Button onClick={confirmarAlquiler} variant="contained" color="warning">Confirmar Alquiler</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notificacion.open} autoHideDuration={4000} onClose={handleCerrarNotificacion}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 8 }}
            >
                <Alert onClose={handleCerrarNotificacion} severity={notificacion.tipo} variant="filled" sx={{ width: '100%', boxShadow: 3 }}>
                    {notificacion.mensaje}
                </Alert>
            </Snackbar>

        </Box>
    );
}

export default FleetPage;