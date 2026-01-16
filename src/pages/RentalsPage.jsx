import React from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, IconButton, Card, CardContent, Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

function RentalsPage({ historialAlquileres, onFinalizarAlquiler }) {

    // VISTA MÓVIL (Tarjeta estilo lista)
    const MobileRentalItem = ({ item }) => (
        <Card sx={{ mb: 2, borderLeft: item.activo ? '4px solid #f97316' : '4px solid #94a3b8' }}>
            <CardContent sx={{ pb: 1, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{item.nombreCliente}</Typography>
                    <Chip label={item.activo ? "En curso" : "Fin"} color={item.activo ? "warning" : "default"} size="small" />
                </Box>

                <Stack spacing={1} sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCarIcon fontSize="small" />
                        <Typography>{item.matricula}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon fontSize="small" />
                        <Typography>
                            {new Date(item.fechaInicio).toLocaleDateString()}
                            {item.fechaFin && ` ➔ ${new Date(item.fechaFin).toLocaleDateString()}`}
                        </Typography>
                    </Box>
                </Stack>

                {item.activo && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton
                            color="success"
                            onClick={() => onFinalizarAlquiler(item.id, item.vehiculoId)}
                            sx={{ bgcolor: '#dcfce7', borderRadius: 2 }}
                        >
                            <Typography variant="button" sx={{ mx: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>Devolver</Typography>
                            <CheckCircleIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Historial de Alquileres</Typography>

            {/* LISTA PARA ESCRITORIO (TABLA) */}
            <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' }, flex: 1, overflow: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Matrícula</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Desde</TableCell>
                            <TableCell>Hasta</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historialAlquileres.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell fontWeight="bold">{row.matricula}</TableCell>
                                <TableCell>{row.nombreCliente}</TableCell>
                                <TableCell>{new Date(row.fechaInicio).toLocaleDateString()}</TableCell>
                                <TableCell>{row.fechaFin ? new Date(row.fechaFin).toLocaleDateString() : '-'}</TableCell>
                                <TableCell>
                                    <Chip label={row.activo ? "En curso" : "Finalizado"} color={row.activo ? "warning" : "default"} size="small" />
                                </TableCell>
                                <TableCell align="right">
                                    {row.activo && (
                                        <IconButton color="success" onClick={() => onFinalizarAlquiler(row.id, row.vehiculoId)}>
                                            <CheckCircleIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* LISTA PARA MÓVIL (CARDS) */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, flex: 1, overflow: 'auto' }}>
                {historialAlquileres.map((item) => (
                    <MobileRentalItem key={item.id} item={item} />
                ))}
                {historialAlquileres.length === 0 && (
                    <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>No hay datos.</Typography>
                )}
            </Box>
        </Box>
    );
}

export default RentalsPage;