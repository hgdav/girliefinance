// Configuración inicial
const monthDisplay = document.getElementById('month-display');
const totalAmountDisplay = document.getElementById('total-amount');
const iconsContainer = document.getElementById('icons-container');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalInput = document.getElementById('modal-input');
const modalSave = document.getElementById('modal-save');
const closeModal = document.getElementsByClassName('close')[0];

let selectedIcon = null;
let currentAction = null; // Puede ser "ingreso" o "egreso"

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

// Función para mostrar íconos en círculo alrededor del monto
function showIcons(action) {
    const icons = ['🏠', '🚗', '🍎', '💻', '⚡'];
    const radius = 80; // Radio del círculo
    const centerX = 100; // Centro X del círculo
    const centerY = 100; // Centro Y del círculo

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
            selectedIcon = icon;
            currentAction = action;
            modalTitle.textContent = `Agregar ${icon} como ${action}`;
            modal.style.display = 'block';
        });
        iconsContainer.appendChild(iconElement);
    });

    iconsContainer.style.display = 'flex';
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

// Cerrar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    iconsContainer.style.display = 'none';
});

// Guardar monto desde el modal
modalSave.addEventListener('click', () => {
    const amount = parseFloat(modalInput.value);
    if (!isNaN(amount)) {
        if (currentAction === 'ingreso') {
            addIncome(amount);
        } else if (currentAction === 'egreso') {
            addExpense(amount);
        }
        modal.style.display = 'none';
        iconsContainer.style.display = 'none';
        modalInput.value = '';
    }
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
