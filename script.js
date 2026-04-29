// Listado de insumos según requerimiento
const insumosDecimales = [
    "Agua", "Harina", "Levadura", "Sal", "Azúcar", "Oregano", "Pimienta", "Comino", 
    "Papel", "Pastor", "Tasajo", "Salchicha italiana", "Salchicha de costco", "Pepperoni", 
    "Jamón", "Tocino", "Elote", "Chile poblano", "Pimiento", "Cebolla", "Salsa", 
    "Queso para pizza", "Queso en tira", "Piña", "Champiñon", "Jalapeño"
];

const insumosEnteros = [
    "Caja para pizza", "Caja mini", "Bolsas de papel", "Pasta de tomate", 
    "Bola de pizza", "Bola mini", "Bola de pan", "Mantequilla", "Margarina"
];

const totales = {};
const container = document.getElementById('lista-insumos');

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
                   step="0.001">
            <div class="error-msg" id="error-${idLimpio}">solo se permite un número entero</div>
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

    if (!permiteDecimal && valorStr.includes('.')) {
        error.style.display = 'block';
        input.value = "";
        return;
    }

    // Sumar el valor al acumulado
    totales[nombre] += valorNum;
    
    /**
     * LÓGICA DE TRUNCADO A 3 DECIMALES (SIN REDONDEO)
     * Multiplicamos por 1000 para desplazar el punto, truncamos y regresamos.
     */
    const resultadoSinRedondeo = Math.trunc(totales[nombre] * 1000) / 1000;
    
    document.getElementById(`total-${idBase}`).innerText = `Total: ${resultadoSinRedondeo}`;
    
    input.value = "";
    input.focus();
}

crearInterfaz();
