document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombre_usuario = document.getElementById('login-username').value;
    const contrasena = document.getElementById('login-password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre_usuario: nombre_usuario,
            contrasena: contrasena
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            alert('Nombre de usuario o contraseña incorrectos');
        } else {
            alert('Inicio de sesión exitoso');
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
