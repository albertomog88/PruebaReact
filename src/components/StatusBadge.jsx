import React from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import KeyIcon from '@mui/icons-material/Key';

// 1. Lógica de colores encapsulada
const getAttributes = (estado) => {
    switch (estado) {
        case 'Disponible':
            return { color: 'success', icon: <CheckCircleIcon /> };
        case 'Taller':
            return { color: 'error', icon: <BuildIcon /> }; // Rojo
        case 'Alquilado':
            return { color: 'warning', icon: <KeyIcon /> }; // Naranja
        default:
            return { color: 'default', icon: null };
    }
};

function StatusBadge({ estado }) {
    const { color, icon } = getAttributes(estado);

    return (
        <Chip
            label={estado}
            color={color}
            icon={icon}
            variant="outlined"
            sx={{
                fontWeight: 'bold',
                borderRadius: 5,
                px: 1, // Un poco de padding horizontal extra
                borderWidth: 2 // Borde un pelín más gordito
            }}
        />
    );
}

export default StatusBadge;