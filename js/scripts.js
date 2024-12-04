const tablesMap = [
    { id: 1, available: true, guests: 0 },
    { id: 2, available: true, guests: 0 },
    { id: 3, available: true, guests: 0 },
    { id: 4, available: true, guests: 0 },
    { id: 5, available: true, guests: 0 },
    { id: 6, available: true, guests: 0 },
    { id: 7, available: true, guests: 0 },
    { id: 8, available: true, guests: 0 },
    { id: 9, available: true, guests: 0 },
    { id: 10, available: true, guests: 0 }
];

const schedule = [
    '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'
];

let selectedTables = [];
let selectedTimes = [];
let usuario = {
    id_usuario: 1, // Debe ser el ID del usuario autenticado
    nombre_usuario: 'Gissel3012', // Debe ser el nombre del usuario autenticado
    email: 'monse.cruz85@gmail.com', // Debe ser el email del usuario autenticado
    telefono: '7471674419' // Debe ser el teléfono del usuario autenticado
};

function renderTables() {
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.innerHTML = '';
        tablesMap.forEach(table => {
            const tableCard = document.createElement('div');
            tableCard.classList.add('table-card');
            if (!table.available) {
                tableCard.classList.add('unavailable');
            } else if (selectedTables.includes(table.id)) {
                tableCard.classList.add('selected');
            }

            tableCard.innerHTML = `
                <p>Mesa ${table.id}</p>
                <div class="guest-selection">
                    <label for="guests-${table.id}">Comensales:</label>
                    <input type="number" id="guests-${table.id}" name="guests" min="1" max="6" value="${table.guests}">
                </div>
            `;

            if (table.available) {
                tableCard.addEventListener('click', (event) => {
                    if (event.target.tagName !== 'INPUT') {
                        if (selectedTables.includes(table.id)) {
                            selectedTables = selectedTables.filter(id => id !== table.id);
                            table.guests = 0;
                        } else if (selectedTables.length < 2) {
                            selectedTables.push(table.id);
                        }
                        renderTables();
                    }
                });

                const guestsInput = tableCard.querySelector(`#guests-${table.id}`);
                guestsInput.addEventListener('input', (e) => {
                    const guests = parseInt(e.target.value) || 0;
                    if (guests > 6) {
                        e.target.value = 6;
                        table.guests = 6;
                    } else {
                        table.guests = guests;
                    }
                });
            }

            mapContainer.appendChild(tableCard);
        });

        const saveButton = document.getElementById('save-reservation');
        if (selectedTables.length > 0 && selectedTimes.length > 0) {
            saveButton.style.display = 'block';
        } else {
            saveButton.style.display = 'none';
        }
    }
}

function renderSchedule() {
    const scheduleContainer = document.getElementById('schedule-container');
    if (scheduleContainer) {
        scheduleContainer.innerHTML = '';
        schedule.forEach(time => {
            const timeCard = document.createElement('div');
            timeCard.classList.add('time-card');
            if (selectedTimes.includes(time)) {
                timeCard.classList.add('selected');
            }

            timeCard.innerHTML = `
                <p>${time}</p>
            `;

            timeCard.addEventListener('click', () => {
                if (selectedTimes.includes(time)) {
                    selectedTimes = selectedTimes.filter(t => t !== time);
                } else {
                    selectedTimes.push(time);
                }
                renderSchedule();
                renderTables();
            });

            scheduleContainer.appendChild(timeCard);
        });
    }
}

document.getElementById('save-reservation').addEventListener('click', () => {
    const reservaciones = selectedTables.map(id => {
        const table = tablesMap.find(table => table.id === id);
        return {
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            email: usuario.email,
            telefono: usuario.telefono,
            fecha_reservacion: new Date().toISOString().split('T')[0], // Fecha actual
            hora_reservacion: selectedTimes.join(', '), // Horarios seleccionados
            numero_personas: table.guests, // Número de comensales
            estado: 'activo'
        };
    });

    fetch('http://localhost:3000/mesaReservaciones', { // Ajustar la ruta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservaciones)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la reservación');
        }
        return response.json();
    })
    .then(data => {
        alert('Reservación guardada con éxito');
        selectedTables.forEach(id => {
            const table = tablesMap.find(table => table.id === id);
            table.available = false;
        });
        selectedTables = [];
        selectedTimes = [];
        renderTables();
        renderSchedule();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Llamar a la función para renderizar las mesas y los horarios al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderTables();
    renderSchedule();
});
