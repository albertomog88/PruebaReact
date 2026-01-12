import React, { useState } from 'react'; // <--- YA NO IMPORTAMOS useEffect
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
    FormControl, InputLabel, Select, MenuItem, Box, Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function VehicleForm({ open, onClose, onGuardar, vehiculoAEditar }) {

    // CARGAMOS DATOS INICIALES (Esto funciona gracias a la 'key' del padre)
    const [matricula, setMatricula] = useState(vehiculoAEditar?.matricula || '');
    const [modelo, setModelo] = useState(vehiculoAEditar?.modelo || '');
    const [estado, setEstado] = useState(vehiculoAEditar?.estado || 'Disponible');
    const [imagenPreview, setImagenPreview] = useState(vehiculoAEditar?.imagen || null);

    // --- BORRAMOS EL useEffect QUE DABA ERROR ---
    // Ya no es necesario.

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagenPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleGuardar = () => {
        if (!matricula || !modelo) return;

        const vehiculoFinal = {
            id: vehiculoAEditar ? vehiculoAEditar.id : crypto.randomUUID(),
            matricula: matricula.toUpperCase(),
            modelo: modelo,
            km: vehiculoAEditar ? vehiculoAEditar.km : 0,
            estado: estado,
            imagen: imagenPreview
        };

        onGuardar(vehiculoFinal);
        onClose();
    };

    // NUEVO: Limpiamos manualmente solo si el usuario da al botón
    const handleCancelar = () => {
        setMatricula('');
        setModelo('');
        setEstado('Disponible');
        setImagenPreview(null);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1e293b', color: 'white' }}>
                {vehiculoAEditar ? 'Editar Vehículo' : 'Alta de Nuevo Vehículo'}
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, gap: 2 }}>
                    {imagenPreview ? (
                        <Box
                            component="img" src={imagenPreview} alt="Preview"
                            sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2, border: '2px dashed #cbd5e1' }}
                        />
                    ) : (
                        <Box sx={{ width: '100%', height: 150, bgcolor: '#f1f5f9', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed #cbd5e1', color: '#94a3b8' }}>
                            <Typography variant="body2">Sin imagen</Typography>
                        </Box>
                    )}
                    <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                        {vehiculoAEditar ? 'Cambiar Foto' : 'Subir Foto'}
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </Button>
                </Box>

                <TextField
                    autoFocus margin="dense" label="Matrícula" fullWidth variant="outlined"
                    value={matricula} onChange={(e) => setMatricula(e.target.value)} sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense" label="Modelo" fullWidth variant="outlined"
                    value={modelo} onChange={(e) => setModelo(e.target.value)} sx={{ mb: 3 }}
                />

                <FormControl fullWidth>
                    <InputLabel id="estado-label">Estado</InputLabel>
                    <Select
                        labelId="estado-label"
                        value={estado}
                        label="Estado"
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <MenuItem value="Disponible">🟢 Disponible</MenuItem>
                        <MenuItem value="Taller">🔴 En Taller</MenuItem>
                        <MenuItem value="Alquilado">🟡 Alquilado</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                {/* Usamos handleCancelar en lugar de onClose directo */}
                <Button onClick={handleCancelar} color="error">Cancelar</Button>
                <Button onClick={handleGuardar} variant="contained" sx={{ px: 3 }}>
                    {vehiculoAEditar ? 'Guardar Cambios' : 'Crear Vehículo'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default VehicleForm;