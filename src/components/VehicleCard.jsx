import React from 'react';
import { Card, CardContent, Typography, Box, Button, Grid, Divider, CardMedia, IconButton, Tooltip, Chip } from '@mui/material'; // Añadido Chip
import AddRoadIcon from '@mui/icons-material/AddRoad';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key'; // Icono para alquilar
import PersonIcon from '@mui/icons-material/Person'; // Icono de cliente

import StatusBadge from './StatusBadge';

// AHORA RECIBIMOS 'onAlquilar'
function VehicleCard({ vehiculo, onSumarKm, onEditar, onEliminar, onAlquilar }) {

    if (!vehiculo) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', gap: 2 }}>
                <DirectionsCarIcon sx={{ fontSize: 80, opacity: 0.2 }} />
                <Typography variant="h5">Selecciona un vehículo</Typography>
            </Box>
        );
    }

    return (
        <Card sx={{ borderRadius: 4, boxShadow: 3, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>

            {vehiculo.imagen ? (
                <CardMedia component="img" height="250" image={vehiculo.imagen} alt={'Foto de ' + vehiculo.matricula} sx={{ objectFit: 'cover' }} />
            ) : (
                <Box sx={{ height: 250, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#cbd5e1', gap: 1, borderBottom: '1px solid #e2e8f0' }}>
                    <ImageNotSupportedIcon sx={{ fontSize: 60, opacity: 0.8 }} />
                    <Typography variant="button" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>Sin Imagen</Typography>
                </Box>
            )}

            <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* CABECERA */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            {vehiculo.matricula}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">Ficha Técnica</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <StatusBadge estado={vehiculo.estado} />

                        <Box sx={{ borderLeft: '1px solid #e2e8f0', pl: 1, ml: 1, display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Editar datos">
                                <IconButton color="primary" onClick={onEditar} sx={{ bgcolor: '#eff6ff' }}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Eliminar vehículo">
                                <IconButton color="error" onClick={onEliminar} sx={{ bgcolor: '#fef2f2' }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Typography variant="overline" color="text.secondary" fontWeight="bold">Modelo</Typography>
                        <Typography variant="h5">{vehiculo.modelo}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="overline" color="text.secondary" fontWeight="bold">Kilometraje</Typography>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                            {vehiculo.km.toLocaleString()} <Typography component="span" variant="h6">km</Typography>
                        </Typography>
                    </Grid>
                </Grid>

                {/* INFO DE ALQUILER SI APLICA */}
                {vehiculo.estado === 'Alquilado' && vehiculo.clienteAsignado && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#fff7ed', borderRadius: 2, border: '1px solid #fdba74' }}>
                        <Typography variant="caption" color="warning.main" fontWeight="bold">ALQUILADO A</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <PersonIcon color="warning" />
                            <Typography variant="h6" fontWeight="bold" color="#9a3412">{vehiculo.clienteAsignado}</Typography>
                        </Box>
                    </Box>
                )}

                <Box sx={{ flex: 1 }} /> {/* Espaciador */}

                {/* BOTONES INFERIORES */}
                <Box sx={{ mt: 5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddRoadIcon />}
                        onClick={onSumarKm}
                        sx={{ borderRadius: 3, px: 3, py: 1.5, textTransform: 'none', fontSize: '1rem' }}
                    >
                        Registrar Viaje
                    </Button>

                    {/* NUEVO BOTÓN ALQUILAR */}
                    <Button
                        variant="contained"
                        color="warning"
                        size="large"
                        startIcon={<KeyIcon />}
                        onClick={onAlquilar}
                        disabled={vehiculo.estado !== 'Disponible'}
                        sx={{ borderRadius: 3, px: 3, py: 1.5, textTransform: 'none', fontSize: '1rem' }}
                    >
                        {vehiculo.estado === 'Disponible' ? 'Alquilar Vehículo' : 'No Disponible'}
                    </Button>
                </Box>

            </CardContent>
        </Card>
    );
}

export default VehicleCard;