document.addEventListener('DOMContentLoaded', () => {
    // Redirect to dashboard if already logged in
    if (localStorage.getItem('authToken')) {
        if (!window.location.pathname.includes('admin-dashboard.html')) {
           // window.location.href = 'admin-dashboard.html';
        }
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;
            const errorMessage = document.getElementById('error-message');

            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erreur de connexion');
                }

                localStorage.setItem('authToken', data.token);
                localStorage.setItem('username', data.username);
                window.location.href = 'admin-dashboard.html';

            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }
});

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    window.location.href = 'admin-login.html';
}
