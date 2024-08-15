// Seleccionar elementos del DOM
const totalGastosElement = document.getElementById('totalGastos');
const iconosGastos = [
    { icon: "💧", monto: 10 },
    { icon: "🍔", monto: 20 },
    { icon: "🚗", monto: 50 },
    { icon: "🛒", monto: 100 }
];

const iconosIngresos = [
    { icon: "💰", monto: 100 },
    { icon: "🏦", monto: 200 },
    { icon: "🎁", monto: 50 },
    { icon: "🤑", monto: 150 }
];

const iconContainer = document.getElementById('icon-container');
const btnIngresos = document.getElementById('btnIngresos');
const btnGastos = document.getElementById('btnGastos');
const menuButton = document.getElementById('menuButton');
const menuItems = document.getElementById('menuItems');

let totalGastos = 0;
let iconosVisibles = ''; // Variable para rastrear qué íconos están visibles

function alternarIconos(tipo) {
    if (iconosVisibles === tipo) {
        iconContainer.innerHTML = '';
        iconContainer.classList.add('hidden');
    } else {
        iconContainer.innerHTML = ''; // Limpiar cualquier ícono previo
        const iconos = tipo === 'gastos' ? iconosGastos : iconosIngresos;

        iconos.forEach(function (icono) {
            const button = document.createElement('button');
            button.className = tipo === 'gastos' ? 'icono-gasto' : 'icono-ingreso';
            button.textContent = icono.icon;
            button.setAttribute('data-monto', icono.monto);
            button.addEventListener('click', function () {
                const monto = parseFloat(this.getAttribute('data-monto'));
                totalGastos += tipo === 'gastos' ? -monto : monto; // Egresos restan y ingresos suman
                totalGastosElement.textContent = `S/${totalGastos.toFixed(2)}`;
            });
            iconContainer.appendChild(button);
        });

        iconContainer.classList.remove('hidden');
        iconosVisibles = tipo; // Actualizamos el estado a los íconos visibles actuales
    }
}

// Eventos para los botones de ingresos y gastos
btnGastos.addEventListener('click', function () {
    alternarIconos('gastos');
});

btnIngresos.addEventListener('click', function () {
    alternarIconos('ingresos');
});

// Funcionalidad del botón de menú desplegable
menuButton.addEventListener('click', function () {
    menuItems.classList.toggle('hidden');
});
