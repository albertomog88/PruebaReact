import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Link } from 'react-router-dom';
// IMPORTAMOS LOS GRÁFICOS
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Home({ listaVehiculos }) {
    const vehiculos = listaVehiculos || [];

    // 1. CALCULAMOS LOS DATOS
    const total = vehiculos.length;
    const disponibles = vehiculos.filter(v => v.estado === 'Disponible').length;
    const taller = vehiculos.filter(v => v.estado === 'Taller').length;
    const alquilados = vehiculos.filter(v => v.estado === 'Alquilado').length;

    // 2. PREPARAMOS DATOS PARA LA GRÁFICA
    const datosGrafica = [
        { name: 'Disponibles', value: disponibles, color: '#16a34a' }, // Verde
        { name: 'En Taller', value: taller, color: '#dc2626' },      // Rojo
        { name: 'Alquilados', value: alquilados, color: '#ca8a04' }, // Amarillo
    ].filter(d => d.value > 0); // Solo mostramos los que tengan datos

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1e293b' }}>
                Panel de Control 📊
            </Typography>

            {/* TARJETAS DE NÚMEROS (Igual que antes) */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: 3, height: 140, bgcolor: 'white', borderLeft: '6px solid #2563eb' }}>
                        <Typography variant="h6" color="text.secondary">Total Flota</Typography>
                        <Typography variant="h3" fontWeight="bold" color="#1e293b">{total}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: 3, height: 140, bgcolor: 'white', borderLeft: '6px solid #16a34a' }}>
                        <Typography variant="h6" color="success.main">Disponibles</Typography>
                        <Typography variant="h3" fontWeight="bold" color="#16a34a">{disponibles}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: 3, height: 140, bgcolor: 'white', borderLeft: '6px solid #dc2626' }}>
                        <Typography variant="h6" color="error.main">En Taller</Typography>
                        <Typography variant="h3" fontWeight="bold" color="#dc2626">{taller}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: 3, height: 140, bgcolor: 'white', borderLeft: '6px solid #ca8a04' }}>
                        <Typography variant="h6" color="warning.main">Alquilados</Typography>
                        <Typography variant="h3" fontWeight="bold" color="#ca8a04">{alquilados}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* --- NUEVA SECCIÓN: GRÁFICAS --- */}
            <Grid container spacing={3}>
                {/* Gráfico a la izquierda */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, height: 400, bgcolor: 'white', borderRadius: 4 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Estado de la Flota</Typography>

                        {total > 0 ? (
                            <ResponsiveContainer width="100%" height="90%">
                                <PieChart>
                                    <Pie
                                        data={datosGrafica}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60} // Hace que sea un Donut
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {datosGrafica.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                No hay datos para mostrar
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Panel de Acción a la derecha */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 4, height: 400, textAlign: 'center', bgcolor: 'white', borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <DirectionsCarIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Acceso Rápido
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Gestiona incidencias, registra salidas o añade nuevos vehículos.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            component={Link}
                            to="/flota"
                            sx={{ mt: 2, px: 4, py: 1.5, borderRadius: 3, width: '100%' }}
                        >
                            Gestionar Flota
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Home;