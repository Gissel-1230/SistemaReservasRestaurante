document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/reservaciones')
        .then(response => response.json())
        .then(data => {
            const reservationsTable = document.getElementById('reservations-table').getElementsByTagName('tbody')[0];
            data.forEach(reservacion => {
                const row = reservationsTable.insertRow();
                row.insertCell(0).innerText = reservacion.id_reservacion;
                row.insertCell(1).innerText = reservacion.id_usuario;
                row.insertCell(2).innerText = reservacion.nombre_usuario;
                row.insertCell(3).innerText = reservacion.email;
                row.insertCell(4).innerText = reservacion.telefono;
                row.insertCell(5).innerText = reservacion.fecha_reservacion;
                row.insertCell(6).innerText = reservacion.hora_reservacion;
                row.insertCell(7).innerText = reservacion.numero_personas;
                row.insertCell(8).innerText = reservacion.estado;
            });
        })
        .catch(error => {
            console.error('Error al obtener las reservaciones:', error);
        });
});
