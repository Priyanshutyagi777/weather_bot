// const API_BASE_URL = 'http://localhost:3000/admin'; //local host
const API_BASE_URL = 'https://weather-bot-ucep.onrender.com'; //local host


async function login() {
    const password = document.getElementById('password').value;
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        if (response.ok) {
            document.getElementById('admin-controls').style.display = 'block';
            showMessage('Login successful!', 'success');

        } else {
            showMessage('Invalid password!', 'error');
        }
    } catch (error) {
        showMessage('Error during login.', 'error');
    }
}

async function updateApiKey() {
    const newApiKey = document.getElementById('api-key').value;
    try {
        const response = await fetch(`${API_BASE_URL}/update-weather-api`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newApiKey }),
        });
        if (response.ok) {
            showMessage('API key updated successfully!', 'success');
        } else {
            showMessage('Failed to update API key.', 'error');
        }
    } catch (error) {
        showMessage('Error updating API key.', 'error');
    }
}

async function blockUser() {
    const chatId = document.getElementById('block-user-id').value;
        try {
        const response = await fetch(`${API_BASE_URL}/block-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId }),
        });
        if (response.ok) {
            showMessage(`User ${chatId} blocked successfully!`, 'success');
        } else {
            showMessage('Failed to block user.', 'error');
        }
    } catch (error) {
        showMessage('Error blocking user.', 'error');
    }
}

async function deleteUser() {
    const chatId = document.getElementById('delete-user-id').value;
    try {
        const response = await fetch(`${API_BASE_URL}/delete-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId }),
        });
        if (response.ok) {
            showMessage(`User ${chatId} deleted successfully!`, 'success');
        } else {
            showMessage('Failed to delete user.', 'error');
        }
    } catch (error) {
        showMessage('Error deleting user.', 'error');
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}
