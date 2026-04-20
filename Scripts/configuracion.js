document.addEventListener('DOMContentLoaded', () => {
    const btnGuardar = document.querySelector('.btn-guardar');

    // --- FUNCIÓN GUARDAR Y EXPORTAR ---
    btnGuardar.addEventListener('click', (e) => {
        e.preventDefault();

        // 1. LISTA DE IDS REALES DEL HTML DE CONFIGURACIÓN
        const camposConfig = [
            { id: 'consumo_w', nombre: 'Consumo en Watts' },
            { id: 'costo_kwh', nombre: 'Costo por kWh' },
            { id: 'precio_maquina', nombre: 'Precio de impresora' },
            { id: 'roi_anios', nombre: 'Años de Retorno' },
            { id: 'uso_diario', nombre: 'Uso diario' },
            { id: 'porcentaje_reparacion', nombre: '% de Reparaciones' },
            { id: 'precio_bobina', nombre: 'Precio de Bobina' },
            { id: 'peso_bobina', nombre: 'Peso de Bobina' },
            { id: 'margen_error', nombre: 'Margen de error' }
        ];

        // 2. VALIDACIÓN: Revisar que no haya campos vacíos
        let faltantes = [];
        camposConfig.forEach(campo => {
            const el = document.getElementById(campo.id);
            if (!el || el.value === "") {
                faltantes.push(campo.nombre);
            }
        });

        if (faltantes.length > 0) {
            alert("❌ Faltan datos en Configuración:\n- " + faltantes.join("\n- "));
            return;
        }

        // 3. CREAR EL OBJETO DE CONFIGURACIÓN
        const config = {
            consumo_w: parseFloat(document.getElementById('consumo_w').value),
            costo_kwh: parseFloat(document.getElementById('costo_kwh').value),
            precio_maquina: parseFloat(document.getElementById('precio_maquina').value),
            roi_anios: parseFloat(document.getElementById('roi_anios').value),
            uso_diario: parseFloat(document.getElementById('uso_diario').value),
            porcentaje_reparacion: parseFloat(document.getElementById('porcentaje_reparacion').value),
            tipo_filamento: document.getElementById('tipo_filamento').value,
            precio_bobina: parseFloat(document.getElementById('precio_bobina').value),
            peso_bobina: parseFloat(document.getElementById('peso_bobina').value),
            margen_error: parseFloat(document.getElementById('margen_error').value)
        };

        // 4. GUARDAR EN NAVEGADOR
        localStorage.setItem('config3D', JSON.stringify(config));

        // 5. EXPORTAR ARCHIVO JSON
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'configuracion_3d.json';
        link.click();
        
        alert("Configuración guardada y archivo exportado ✅");
    });
});

// --- LÓGICA PARA CARGAR ARCHIVO ---

// 1. Detectar cuando el usuario selecciona un archivo
document.getElementById('cargar_config')?.addEventListener('change', function(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();

    // 2. Definir qué pasa cuando el archivo termina de leerse
    reader.onload = function(event) {
        try {
            // Convertimos el texto del archivo a un objeto JSON
            const config = JSON.parse(event.target.result);

            // 3. Mapear los datos del JSON a los inputs del HTML
            // Los IDs del JSON deben coincidir con los IDs de los inputs
            const campos = [
                'consumo_w', 'costo_kwh', 'precio_maquina', 'roi_anios', 
                'uso_diario', 'porcentaje_reparacion', 'tipo_filamento', 
                'precio_bobina', 'peso_bobina', 'margen_error'
            ];

            campos.forEach(id => {
                const input = document.getElementById(id);
                if (input && config[id] !== undefined) {
                    input.value = config[id];
                }
            });

            // 4. Guardar automáticamente en el navegador para que el Index lo reconozca
            localStorage.setItem('config3D', JSON.stringify(config));

            alert("Configuración cargada correctamente desde el archivo 📂✅");
            
        } catch (err) {
            console.error("Error al leer el archivo:", err);
            alert("❌ El archivo seleccionado no es válido o está dañado.");
        }
    };

    // Leemos el archivo como texto plano
    reader.readAsText(archivo);
});