document.getElementById('btn-exportar-pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // --- PALETA DE COLORES PROFESIONAL ---
    const azulMarino = [30, 58, 138]; // Azul marino profundo y elegante
    const grisOscuro = [50, 50, 50];
    const blanco = [255, 255, 255];

    // 1. ENCABEZADO "FUSION3D"
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(azulMarino[0], azulMarino[1], azulMarino[2]);
    doc.text("Fusion3D", 15, 25);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Servicio de Impresión 3D de Alta Precisión", 15, 32);

    // 2. INFORMACIÓN DE COTIZACIÓN
    doc.setFontSize(10);
    doc.setTextColor(grisOscuro[0], grisOscuro[1], grisOscuro[2]);
    const fecha = new Date().toLocaleDateString();
    const cliente = document.getElementById('nombre_cliente').value || "Cliente General";
    const trabajo = document.getElementById('nombre_trabajo').value || "Proyecto Personalizado";
    
    // Bloque derecho de metadatos
    doc.text(`FECHA: ${fecha}`, 140, 25);
    doc.setFont("helvetica", "bold");
    doc.text(`CLIENTE:`, 15, 45);
    doc.setFont("helvetica", "normal");
    doc.text(cliente.toUpperCase(), 15, 50);
    
    doc.setFont("helvetica", "bold");
    doc.text(`PROYECTO:`, 15, 58);
    doc.setFont("helvetica", "normal");
    doc.text(trabajo.toUpperCase(), 15, 63);

    // --- LOGICA DE DATOS ---
    const config = JSON.parse(localStorage.getItem('config3D'));
    const horas = parseFloat(document.getElementById('horas').value) || 0;
    const minutos = parseFloat(document.getElementById('minutos').value) || 0;
    const gramos = parseFloat(document.getElementById('filamento').value) || 0;
    const tTotal = horas + (minutos / 60);

    const costoMat = (gramos * (config.precio_bobina / config.peso_bobina) * (1 + (config.margen_error / 100))).toFixed(2);
    const costoLuz = ((config.consumo_w / 1000) * tTotal * config.costo_kwh).toFixed(2);
    const invMant = config.precio_maquina * (1 + (config.porcentaje_reparacion / 100));
    const costoHoraMaq = invMant / (config.roi_anios * 365 * config.uso_diario);
    const costoDesgaste = (tTotal * costoHoraMaq).toFixed(2);

    const tPrep = parseFloat(document.getElementById('tiempo_preparacion').value) || 0;
    const pPrep = parseFloat(document.getElementById('precio_preparacion').value) || 0;
    const tPost = parseFloat(document.getElementById('tiempo_post').value) || 0;
    const pPost = parseFloat(document.getElementById('precio_post').value) || 0;
    const costoMO = (((tPrep / 60) * pPrep) + ((tPost / 60) * pPost)).toFixed(2);

    // --- TABLA DE DESGLOSE ---
    const bodyTabla = [
        ['Material base', `Uso de ${gramos}g de filamento ${config.tipo_filamento.toUpperCase()}`, `$${costoMat}`],
        ['Energía Eléctrica', `Operación de maquinaria por ${tTotal.toFixed(2)} horas`, `$${costoLuz}`],
        ['Amortización', `Desgaste técnico y mantenimiento preventivo`, `$${costoDesgaste}`],
        ['Mano de Obra', `Servicio de preparación técnica y post-procesado`, `$${costoMO}`]
    ];

    // Extras
    const filasExtras = document.querySelectorAll('#extras > div');
    filasExtras.forEach(fila => {
        const nombre = fila.querySelector('input[type="text"]').value || "Concepto Adicional";
        const precio = parseFloat(fila.querySelector('input[type="number"]').value) || 0;
        bodyTabla.push(['Adicional', nombre, `$${precio.toFixed(2)}`]);
    });

    doc.autoTable({
        startY: 75,
        head: [['CONCEPTO', 'DESCRIPCIÓN', 'SUBTOTAL']],
        body: bodyTabla,
        theme: 'striped',
        headStyles: { 
            fillColor: azulMarino, 
            fontSize: 11, 
            cellPadding: 5 
        },
        bodyStyles: { 
            fontSize: 10, 
            cellPadding: 7, // Celdas amplias para llenar la hoja
            textColor: grisOscuro 
        },
        columnStyles: {
            2: { halign: 'right', fontStyle: 'bold' }
        }
    });

    // --- BLOQUE DE TOTAL (ESTILO ANTERIOR MEJORADO) ---
    const finalY = doc.lastAutoTable.finalY + 10;
    const totalFinal = document.getElementById('span-total').innerText;
    
    // Rectángulo sólido para el total
    doc.setFillColor(azulMarino[0], azulMarino[1], azulMarino[2]);
    doc.rect(130, finalY, 65, 14, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(blanco[0], blanco[1], blanco[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL:`, 135, finalY + 9);
    doc.text(`${totalFinal}`, 190, finalY + 9, { align: 'right' });

    // Pie de página
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Fusion3D | Soluciones de fabricación digital.", 105, 285, { align: 'center' });

    doc.save(`Fusion3D_Cotizacion_${trabajo}.pdf`);
});