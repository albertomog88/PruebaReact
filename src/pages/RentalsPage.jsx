import React, { useState } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, IconButton, Tooltip, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'; // Icono devolver
import HistoryIcon from '@mui/icons-material/History';
import CircleIcon from '@mui/icons-material/Circle';

function RentalsPage({ historialAlquileres, onFinalizarAlquiler }) {

    const [busqueda, setBusqueda] = useState('');

    // Ordenamos: Primero los activos, luego por fecha más reciente
    const alquileresOrdenados = [...historialAlquileres].sort((a, b) => {
        if (a.activo === b.activo) {
            return new Date(b.fechaInicio) - new Date(a.fechaInicio);
        }
        return a.activo ? -1 : 1;
    });

    const filtrados = alquileresOrdenados.filter(alquiler =>
        alquiler.matricula.toLowerCase().includes(busqueda.toLowerCase()) ||
        alquiler.nombreCliente.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Box sx={{ p: 3, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="#1e293b">
                    Gestión de Alquileres
                </Typography>
                <TextField
                    size="small"
                    placeholder="Buscar por cliente o matrícula..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                    }}
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                />
            </Box>

            <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto', borderRadius: 2, boxShadow: 2 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Vehículo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha Inicio</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha Fin</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtrados.map((row) => (
                            <TableRow key={row.id} hover sx={{ bgcolor: row.activo ? '#f0fdf4' : 'inherit' }}>
                                <TableCell>
                                    <Chip
                                        icon={<CircleIcon sx={{ fontSize: '0.8rem !important' }} />}
                                        label={row.activo ? "En Curso" : "Finalizado"}
                                        color={row.activo ? "success" : "default"}
                                        size="small"
                                        variant={row.activo ? "filled" : "outlined"}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{row.matricula}</TableCell>
                                <TableCell>{row.nombreCliente}</TableCell>
                                <TableCell>{new Date(row.fechaInicio).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {row.fechaFin ? new Date(row.fechaFin).toLocaleDateString() : '-'}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    {row.activo && (
                                        <Tooltip title="Finalizar Alquiler (Devolver)">
                                            <IconButton
                                                color="primary"
                                                onClick={() => onFinalizarAlquiler(row.id, row.vehiculoId)}
                                            >
                                                <AssignmentReturnIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {!row.activo && (
                                        <Tooltip title="Registro Histórico">
                                            <HistoryIcon color="disabled" />
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtrados.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                    No hay registros de alquileres.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default RentalsPage;