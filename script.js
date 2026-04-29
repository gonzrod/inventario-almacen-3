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
    // Limpiamos el contenedor por si acaso
    container.innerHTML = "";

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
                   step="any"> 
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
    
    // Usamos el valor tal cual viene del input
    const valorStr = input.value;
    const valorNum = parseFloat(valorStr);

    error.style.display = 'none';

    if (isNaN(valorNum) || valorStr === "") return;

    // Si NO permite decimal y el usuario escribió un punto
    if (!permiteDecimal && valorStr.includes('.')) {
        error.style.display = 'block';
        input.value = "";
        return;
    }

    // Sumar el valor
    totales[nombre] += valorNum;
    
    // Lógica de truncado a 3 decimales para evitar el redondeo de JS
    // Usamos un pequeño margen de error (0.000001) para compensar la precisión binaria
    const resultadoSinRedondeo = Math.trunc((totales[nombre] + 0.0000001) * 1000) / 1000;
    
    document.getElementById(`total-${idBase}`).innerText = `Total: ${resultadoSinRedondeo}`;
    
    input.value = "";
    input.focus();
}

crearInterfaz();
