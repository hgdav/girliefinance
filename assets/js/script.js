// Configuración inicial
const monthDisplay = document.getElementById('month-display');
const totalAmountDisplay = document.getElementById('total-amount');
const iconsContainer = document.getElementById('icons-container');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalInput = document.getElementById('modal-input');
const modalSave = document.getElementById('modal-save');
const closeModal = document.getElementsByClassName('close')[0];
const chartCanvas = document.getElementById('income-expense-chart').getContext('2d');

let selectedIcon = null;
let currentAction = null; // Puede ser "ingreso" o "egreso"
let transactions = JSON.parse(localStorage.getItem('transactions')) || []; // Cargar transacciones previas
let chart = null; // Referencia para la gráfica

// Mapa de íconos a colores
const iconColors = {
    '💰': '#4CAF50',
    '🎁': '#FF9800',
    '🏦': '#F44336',
    '💼': '#2196F3',
    '💳': '#9C27B0',
    '🏠': '#673AB7',
    '🚗': '#00BCD4',
    '🍎': '#FF5722',
    '💻': '#795548',
    '⚡': '#E91E63'
};

// Función para actualizar el mes actual
function updateMonth() {
    const currentDate = new Date();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const currentMonth = monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
    monthDisplay.textContent = currentMonth;
}

// Función para obtener el balance total desde localStorage
function getTotalAmount() {
    return parseFloat(localStorage.getItem('totalAmount')) || 0;
}

// Función para actualizar la pantalla con el balance total
function updateTotalAmount() {
    const totalAmount = getTotalAmount();
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
}

// Función para agregar un ingreso
function addIncome(amount) {
    const totalAmount = getTotalAmount();
    localStorage.setItem('totalAmount', totalAmount + amount);
    updateTotalAmount();
}

// Función para agregar un egreso
function addExpense(amount) {
    const totalAmount = getTotalAmount();
    localStorage.setItem('totalAmount', totalAmount - amount);
    updateTotalAmount();
}

// Función para agregar una transacción al localStorage
function addTransaction(action, icon, amount) {
    const transaction = {
        action: action,
        icon: icon,
        amount: amount,
        date: new Date().toLocaleString()
    };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions)); // Guardar todas las transacciones en localStorage
}

// Función para calcular los porcentajes de ingresos y egresos por ícono
function calculatePercentages(action) {
    const totalAmount = transactions
        .filter(transaction => transaction.action === action)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const iconData = transactions
        .filter(transaction => transaction.action === action)
        .reduce((data, transaction) => {
            if (data[transaction.icon]) {
                data[transaction.icon] += transaction.amount;
            } else {
                data[transaction.icon] = transaction.amount;
            }
            return data;
        }, {});

    const labels = Object.keys(iconData);
    const values = Object.values(iconData).map(amount => (amount / totalAmount) * 100);
    const colors = labels.map(icon => iconColors[icon]); // Asignar colores basados en los íconos

    return { labels, values, colors };
}

// Función para mostrar la gráfica de anillo
function showChart(action) {
    const { labels, values, colors } = calculatePercentages(action);

    if (chart) {
        chart.destroy(); // Destruir el gráfico previo antes de crear uno nuevo
    }

    chart = new Chart(chartCanvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: `${action === 'ingreso' ? 'Ingresos' : 'Egresos'} por ícono`,
                data: values,
                backgroundColor: colors, // Usar los colores correspondientes a los íconos
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Función para mostrar íconos en círculo alrededor del monto
function showIcons(action) {
    let icons = [];

    // Definir diferentes íconos para ingresos y egresos
    if (action === 'ingreso') {
        icons = ['💰', '🎁', '🏦', '💼', '💳'];  // Íconos para ingresos
    } else if (action === 'egreso') {
        icons = ['🏠', '🚗', '🍎', '💻', '⚡'];  // Íconos para egresos
    }

    const radius = 120; // Aumentar el radio del círculo para expandir los íconos
    const centerX = 125; // Ajustar el centro del círculo
    const centerY = 135; // Ajustar el centro del círculo

    iconsContainer.innerHTML = '';
    icons.forEach((icon, index) => {
        const angle = (index / icons.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const iconElement = document.createElement('div');
        iconElement.className = 'icon';
        iconElement.style.left = `${x}px`;
        iconElement.style.top = `${y}px`;
        iconElement.textContent = icon;
        iconElement.addEventListener('click', () => {
            selectedIcon = icon; // Guardar ícono seleccionado
            currentAction = action; // Guardar si es ingreso o egreso
            modalTitle.textContent = `Agregar ${action} para ${icon}`; // Cambiar título del modal
            modal.style.display = 'block'; // Mostrar modal
        });
        iconsContainer.appendChild(iconElement);
    });

    iconsContainer.style.display = 'flex';

    // Mostrar la gráfica cuando se muestren los íconos
    showChart(action);
}

// Event Listeners
document.getElementById('add-income').addEventListener('click', () => {
    if (iconsContainer.style.display === 'flex') {
        iconsContainer.style.display = 'none';
    } else {
        showIcons('ingreso');
    }
});

document.getElementById('add-expense').addEventListener('click', () => {
    if (iconsContainer.style.display === 'flex') {
        iconsContainer.style.display = 'none';
    } else {
        showIcons('egreso');
    }
});

// Guardar monto desde el modal
modalSave.addEventListener('click', () => {
    const amount = parseFloat(modalInput.value);
    if (!isNaN(amount) && amount > 0) {  // Validar que el monto es un número válido
        // Guardar la transacción en localStorage
        addTransaction(currentAction, selectedIcon, amount);

        // Actualizar balance dependiendo de si es ingreso o egreso
        if (currentAction === 'ingreso') {
            addIncome(amount);
        } else if (currentAction === 'egreso') {
            addExpense(amount);
        }

        // Cerrar el modal y resetear
        modal.style.display = 'none';
        iconsContainer.style.display = 'none';
        modalInput.value = ''; // Limpiar el campo de entrada

        // Actualizar la gráfica después de guardar la transacción
        showChart(currentAction);
    }
});

// Cerrar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    iconsContainer.style.display = 'none';
});

// Cerrar modal si se hace clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
        iconsContainer.style.display = 'none';
    }
});

// Inicialización de la aplicación
updateMonth();
updateTotalAmount();
