// Espera a que el DOM esté cargado para que los IDs existan
document.addEventListener('DOMContentLoaded', () => {

    const insumosDecimales = [
        "Agua", "Harina", "Levadura", "Sal", "Azúcar", "Oregano", "Pimienta", "Comino", 
        "Papel", "Pastor", "Tasajo", "Salchicha italiana", "Salchicha de costco", "Pepperoni", 
        "Jamón", "Tocino", "Elote", "Chile poblano", "Pimiento", "Cebolla", "Salsa", 
        "Queso para pizza", "Queso en tira", "Piña", "Champiñon", "Jalapeño", "Aderezo mar y campo"
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
        const valorStr = input.value;
        const valorNum = parseFloat(valorStr);

        error.style.display = 'none';

        if (isNaN(valorNum) || valorStr === "") return;

        if (!permiteDecimal && valorStr.includes('.')) {
            error.style.display = 'block';
            input.value = "";
            return;
        }

        totales[nombre] += valorNum;
        
        const resultadoSinRedondeo = Math.trunc((totales[nombre] + 0.0000001) * 1000) / 1000;
        
        document.getElementById(`total-${idBase}`).innerText = `Total: ${resultadoSinRedondeo}`;
        
        input.value = "";
        input.focus();
    }

    document.getElementById('btn-guardar-pdf').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.setTextColor(52, 152, 219); 
        doc.text("Reporte de Inventario de Insumos", 20, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 20, 28);
        
        doc.setDrawColor(52, 152, 219);
        doc.line(20, 32, 190, 32);

        let y = 45;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text("Insumo", 25, y);
        doc.text("Cantidad Total", 150, y);
        
        y += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        for (const [insumo, total] of Object.entries(totales)) {
            if (total > 0) {
                const totalTruncado = Math.trunc((total + 0.0000001) * 1000) / 1000;
                doc.text(insumo, 25, y);
                doc.text(totalTruncado.toString(), 150, y);
                y += 8;
                
                if (y > 275) {
                    doc.addPage();
                    y = 20;
                }
            }
        }

        doc.save(`Inventario_Pizzeria_${new Date().getTime()}.pdf`);
    });

    // Llamada inicial
    crearInterfaz();

});
