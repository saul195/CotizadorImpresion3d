document.getElementById('agregarMaterial').addEventListener('click', function() {
    // 1. Ubicamos el contenedor donde están los inputs
    const contenedor = document.getElementById('extras');
    const botonOriginal = document.getElementById('agregarMaterial');

    // 2. Creamos un nuevo contenedor para la fila extra
    const nuevaFila = document.createElement('div');
    nuevaFila.style.marginBottom = "10px";
    nuevaFila.className = "fila-dinamica"; // Útil para estilizarlas todas juntas después

    // 3. Insertamos los nuevos elementos
    // Importante: No repetimos IDs, usamos 'name' o 'class'
    nuevaFila.innerHTML = `
        <input type="text" name="material_extra" placeholder="Nombre del material" style="margin-right: 5px;">
        <input type="number" name="precio_extra" placeholder="$" style="width: 80px; margin-right: 5px;">
        <button type="button" class="btn-quitar" style="background-color: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 5px 10px;">X</button>
    `;

    // 4. Insertamos la nueva fila JUSTO ANTES del botón de "Agregar"
    contenedor.insertBefore(nuevaFila, botonOriginal);

    // 5. Lógica para eliminar solo esa fila cuando se presiona la 'X'
    nuevaFila.querySelector('.btn-quitar').addEventListener('click', function() {
        nuevaFila.remove();
    });
});