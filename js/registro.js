document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombre_usuario = document.getElementById('username').value;
    const contrasena = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const nombre_completo = document.getElementById('fullname').value;
    const telefono = document.getElementById('phone').value;
    const direccion = document.getElementById('address').value;

    fetch('http://localhost:3000/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre_usuario: nombre_usuario,
            contrasena: contrasena,
            email: email,
            nombre_completo: nombre_completo,
            telefono: telefono,
            direccion: direccion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error al registrar el usuario');
        } else {
            alert(`Usuario registrado con éxito. ID de usuario: ${data.id_usuario}`);
            // Quitar el enlace de iniciar sesión
            const loginLink = document.getElementById('login-link');
            if (loginLink) {
                loginLink.remove();
            }
            // Mostrar el mensaje de bienvenida
            const welcomeMessage = document.getElementById('welcome-message');
            welcomeMessage.innerText = `Hola, ${nombre_usuario}`;
            welcomeMessage.style.display = 'inline';
            // Redirigir al enlace de Reservar Mesa
            window.location.href = 'reserva.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
