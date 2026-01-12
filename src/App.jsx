import React, { useState } from 'react'; 
import { Box, Toolbar, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RentalsPage from './pages/RentalsPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import FleetPage from './pages/FleetPage';
import Footer from './components/Footer'; 
import ClientsPage from './pages/ClientsPage';

// DATOS INICIALES (O recuperados de localStorage si implementaste esa parte)
const datosIniciales = [
    { id: '1', matricula: "4589-KLP", modelo: "Iveco Daily", km: 154000, estado: "Disponible" },
    { id: '2', matricula: "9922-BBC", modelo: "Mercedes Sprinter", km: 89000, estado: "Taller" },
    { id: '3', matricula: "1234-GHT", modelo: "Ford Transit", km: 210500, estado: "Alquilado" },
    { id: '4', matricula: "7777-ZZZ", modelo: "Renault Master", km: 12000, estado: "Disponible" },
];

const clientesIniciales = [
    { id: '1', nombre: "Logística Express SL", cif: "B12345678", email: "info@logistica.com", telefono: "600111222" },
    { id: '2', nombre: "Construcciones Paco", cif: "A98765432", email: "paco@obras.com", telefono: "666777888" },
];

function App() {
    const [open, setOpen] = useState(true);
    const [listaVehiculos, setListaVehiculos] = useState(datosIniciales);
    const [listaClientes, setListaClientes] = useState(clientesIniciales); // <--- ESTADO NUEVO

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const [historialAlquileres, setHistorialAlquileres] = useState([
        { id: 'h1', vehiculoId: '3', matricula: '1234-GHT', clientId: '1', nombreCliente: 'Logística Express SL', fechaInicio: '2023-10-01', fechaFin: null, activo: true }
    ]);

    const handleFinalizarAlquiler = (alquilerId, vehiculoId) => {
        if (!window.confirm("¿Confirmar devolución del vehículo?")) return;

        // 1. Cerramos el ticket en el historial
        setHistorialAlquileres(prev => prev.map(a =>
            a.id === alquilerId
                ? { ...a, fechaFin: new Date().toISOString(), activo: false }
                : a
        ));

        // 2. Liberamos el vehículo en la Flota
        setListaVehiculos(prev => prev.map(v =>
            v.id === vehiculoId
                ? { ...v, estado: 'Disponible', clienteAsignado: null }
                : v
        ));
    };

    return (
        <BrowserRouter>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar handleDrawerToggle={handleDrawerToggle} />
                <Sidebar open={open} />

                {/* --- CONTENEDOR PRINCIPAL --- */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: '#f1f5f9',
                        minHeight: '100vh',
                        display: 'flex',        // Flex para organizar verticalmente
                        flexDirection: 'column',
                        overflow: 'hidden',     // Evita scrolls dobles raros
                        p: 0                    // <--- CLAVE: QUITAMOS EL PADDING GLOBAL AQUÍ
                    }}
                >
                    {/* Espaciador para que el contenido no quede bajo el Navbar */}
                    <Toolbar />

                    {/* --- ZONA DE CONTENIDO (PÁGINAS) --- */}
                    {/* Aquí sí ponemos el padding (p: 3) para que las páginas respiren, 
                        pero el Footer queda fuera de este padding */}
                    <Box sx={{
                        flexGrow: 1,  // Empuja el footer hacia abajo
                        p: 3,         // Padding solo para las páginas
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%' // Asegura que ocupe todo el ancho
                    }}>
                        <Routes>
                            <Route
                                path="/"
                                element={<Home listaVehiculos={listaVehiculos} />}
                            />
                            <Route path="/flota" element={
                                <FleetPage
                                    listaVehiculos={listaVehiculos}
                                    setListaVehiculos={setListaVehiculos}
                                    listaClientes={listaClientes}
                                    setHistorialAlquileres={setHistorialAlquileres}                                />
                                } />
                            <Route path="/clientes" element={
                                <ClientsPage
                                    listaClientes={listaClientes} 
                                    setListaClientes={setListaClientes} />
                            } />
                            <Route path="/flota" element={
                                <FleetPage
                                    listaVehiculos={listaVehiculos}
                                    setListaVehiculos={setListaVehiculos}
                                    listaClientes={listaClientes}  />
                             } />
                            <Route path="/alquileres" element={
                                <RentalsPage
                                    historialAlquileres={historialAlquileres}
                                    onFinalizarAlquiler={handleFinalizarAlquiler}
                                />
                            } />
                        </Routes>
                    </Box>

                    {/* --- FOOTER (FUERA DEL PADDING) --- */}
                    <Footer />

                </Box>
            </Box>
        </BrowserRouter>
    );
}

export default App;