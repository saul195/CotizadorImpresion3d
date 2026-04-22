document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    // He cambiado el selector del botón para ser más específico y evitar conflictos
    const btnCalcular = document.querySelector('#btn-ejecutar-calculo'); 
    const divResultado = document.getElementById('resultado-cotizacion');
    const spanTotal = document.getElementById('span-total');
    const spanConf = document.getElementById('conf-actual');

    btnCalcular.addEventListener('click', () => {
        // 1. OBTENER CONFIGURACIÓN
        const config = JSON.parse(localStorage.getItem('config3D'));

        if (!config) {
            alert("⚠️ No se encontró una configuración. Por favor, ve a la sección de 'Configuración' y guarda tus costos primero.");
            return;
        }

        // 2. CAPTURAR DATOS DE LA PIEZA (Inputs numéricos)
        const horas = parseFloat(document.getElementById('horas').value) || 0;
        const minutos = parseFloat(document.getElementById('minutos').value) || 0;
        const gramosPieza = parseFloat(document.getElementById('filamento').value) || 0;
        
        if (horas === 0 && minutos === 0 && gramosPieza === 0) {
            alert("❌ Por favor, ingresa el tiempo y el peso de la pieza.");
            return;
        }

        const tiempoTotalHoras = horas + (minutos / 60);

        // 3. CAPTURAR MANO DE OBRA
        const tPrep = parseFloat(document.getElementById('tiempo_preparacion').value) || 0;
        const pPrep = parseFloat(document.getElementById('precio_preparacion').value) || 0;
        const tPost = parseFloat(document.getElementById('tiempo_post').value) || 0;
        const pPost = parseFloat(document.getElementById('precio_post').value) || 0;

        // --- LÓGICA DE CÁLCULO ---

        // A. Costo de Material
        const costoBaseGramo = config.precio_bobina / config.peso_bobina;
        const costoMaterial = gramosPieza * costoBaseGramo * (1 + (config.margen_error / 100));

        // B. Costo Eléctrico
        const costoLuz = (config.consumo_w / 1000) * tiempoTotalHoras * config.costo_kwh;

        // C. Desgaste de Máquina
        const diasVida = config.roi_anios * 365;
        const horasVidaUtil = diasVida * config.uso_diario;
        const inversionConMantenimiento = config.precio_maquina * (1 + (config.porcentaje_reparacion / 100));
        const costoHoraMaquina = inversionConMantenimiento / horasVidaUtil;
        const costoDesgasteMaquina = tiempoTotalHoras * costoHoraMaquina;

        // D. Mano de Obra
        const costoMO = ((tPrep / 60) * pPrep) + ((tPost / 60) * pPost);

        // E. Extras (Suma dinámica de todos los materiales adicionales agregados)
        const inputsPreciosExtras = document.querySelectorAll('#extras input[type="number"]');
        let totalExtras = 0;

        inputsPreciosExtras.forEach(input => {
            totalExtras += parseFloat(input.value) || 0;
        });

        // --- RESULTADO FINAL ---
        // Usamos totalExtras en lugar de precioExtra
        const totalFinal = costoMaterial + costoLuz + costoDesgasteMaquina + costoMO + totalExtras;

        // 4. MOSTRAR RESULTADOS
        spanTotal.innerText = `$${totalFinal.toFixed(2)}`;
        spanConf.innerText = `${config.tipo_filamento.toUpperCase()} ($${config.precio_bobina})`;
        
        // Aplicamos el color [#2ecc71] solicitado
        divResultado.style.borderColor = '[#2ecc71]';
        spanTotal.style.color = '[#2ecc71]';
        divResultado.style.display = 'block';

        divResultado.scrollIntoView({ behavior: 'smooth' });
    });
});