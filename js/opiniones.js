document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const rating = parseInt(document.getElementById('rating').value);
    const comment = document.getElementById('comment').value;

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

    const feedback = {
        username: username,
        rating: rating,
        comment: comment,
        date: formattedDate // Fecha actual en formato YYYY-MM-DD HH:MM:SS
    };

    console.log("Enviando opinión:", feedback);

    fetch('http://localhost:3000/opiniones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedback)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar la opinión');
        }
        return response.json();
    })
    .then(data => {
        alert('Opinión enviada con éxito');
        loadReviews();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function loadReviews() {
    fetch('http://localhost:3000/opiniones')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener opiniones');
        }
        return response.json();
    })
    .then(data => {
        const reviewsContainer = document.getElementById('reviews-container');
        reviewsContainer.innerHTML = '';
        data.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.classList.add('review-card');
            reviewCard.innerHTML = `
                <p><strong>${review.username}</strong> (${new Date(review.date).toLocaleDateString()})</p>
                <p>Calificación: ${review.rating}/5</p>
                <p>${review.comment}</p>
            `;
            reviewsContainer.appendChild(reviewCard);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Cargar opiniones al cargar la página
document.addEventListener('DOMContentLoaded', loadReviews);
