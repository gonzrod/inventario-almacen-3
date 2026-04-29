// Listado de insumos según requerimiento
const insumosDecimales = [
    "Agua", "Harina", "Levadura", "Sal", "Azúcar", "Oregano", "Pimienta", "Comino", 
    "Pastor", "Tasajo", "Salchicha italiana", "Salchicha de costco", "Pepperoni", 
    "Jamón", "Tocino", "Elote", "Chile poblano", "Pimiento", "Cebolla", "Salsa", 
    "Queso para pizza", "Queso en tira", "Piña", "Champiñon", "Jalapeño"
];

const insumosEnteros = [
    "Caja para pizza", "Caja mini", "Bolsas de papel", "Papel", "Pasta de tomate", 
    "Bola de pizza", "Bola mini", "Bola de pan", "Mantequilla", "Margarina"
];

const totales = {};
const container = document.getElementById('lista-insumos');

// Función para inicializar la aplicación
function crearInterfaz() {
    const todos = [
        ...insumosDecimales.map(i => ({nombre: i, decimal: true})), 
        ...insumosEnteros.map(i => ({nombre: i, decimal: false}))
    ];

    todos.forEach(insumo => {
        totales[insumo.nombre] = 0;
        const idLimpio = insumo.nombre.replace(/ /g, '-');

        const card = document.createElement('div');
        card.className = 'insumo-card';
        card.innerHTML = `
            <div class="insumo-header">
                <div class="blue-bar"></div>
                <div class="insumo-name">${insumo.nombre}</div>
                <div class="total-badge" id="total-${idLimpio}">Total: 0</div>
            </div>
            <input type="number" 
                   placeholder="Cantidad." 
                   id="input-${idLimpio}" 
                   step="${insumo.decimal ? '0.001' : '1'}">
            <div class="error-msg" id="error-${idLimpio}">Solo se permite un número entero</div>
            <button class="btn-add" id="btn-${idLimpio}">+ Añadir a la lista</button>
        `;
        container.appendChild(card);

        const input = document.getElementById(`input-${idLimpio}`);
        const btn = document.getElementById(`btn-${idLimpio}`);

        input.addEventListener('keypress', (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                agregarCantidad(insumo.nombre, insumo.decimal);
            }
        });

        btn.addEventListener('click', () => {
            agregarCantidad(insumo.nombre, insumo.decimal);
        });
    });
}

function agregarCantidad(nombre, permiteDecimal) {
    const idBase = nombre.replace(/ /g, '-');
    const input = document.getElementById(`input-${idBase}`);
    const error = document.getElementById(`error-${idBase}`);
    const valorStr = input.value;
    const valorNum = parseFloat(valorStr);

    error.style.display = 'none';

    if (isNaN(valorNum) || valorStr === "") return;

    // Validación de números enteros
    if (!permiteDecimal && valorStr.includes('.')) {
        error.style.display = 'block';
        input.value = "";
        return;
    }

    // Sumar al acumulado
    totales[nombre] += valorNum;
    
    /** * ACTUALIZACIÓN:
     * Se usa toFixed(3) para asegurar que se muestren/calculen 3 decimales.
     * Number(...) elimina ceros a la derecha innecesarios (ej: 1.500 -> 1.5)
     * pero mantiene la precisión hasta el tercer dígito.
     */
    const totalFormateado = Number(totales[nombre].toFixed(3));
    document.getElementById(`total-${idBase}`).innerText = `Total: ${totalFormateado}`;
    
    input.value = "";
    input.focus();
}

crearInterfaz();
