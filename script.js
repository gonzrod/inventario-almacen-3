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
    // Unificar listas marcando cuáles permiten decimales
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
                   step="${insumo.decimal ? 'any' : '1'}">
            <div class="error-msg" id="error-${idLimpio}">Solo se permite un número entero</div>
            <button class="btn-add" id="btn-${idLimpio}">+ Añadir a la lista</button>
        `;
        container.appendChild(card);

        // Configurar eventos
        const input = document.getElementById(`input-${idLimpio}`);
        const btn = document.getElementById(`btn-${idLimpio}`);

        // Evento al presionar Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                agregarCantidad(insumo.nombre, insumo.decimal);
            }
        });

        // Evento al hacer clic en el botón
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

    // Ocultar error previo
    error.style.display = 'none';

    if (isNaN(valorNum) || valorStr === "") return;

    // Validación de números enteros
    if (!permiteDecimal && valorStr.includes('.')) {
        error.style.display = 'block';
        input.value = "";
        return;
    }

    // Actualizar lógica de suma
    totales[nombre] += valorNum;
    
    // Actualizar visualmente (redondeo a 2 decimales para evitar errores de coma flotante)
    document.getElementById(`total-${idBase}`).innerText = `Total: ${Number(totales[nombre].toFixed(2))}`;
    
    // Limpiar campo y mantener el foco para seguir escribiendo
    input.value = "";
    input.focus();
}

// Iniciar la app
crearInterfaz();
