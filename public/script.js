document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = document.getElementById('user-input').value;
    if (!userInput) {
        alert("Kindly Enter Any Message To Proceed :");
    };

    addMessage('user', userInput);
    document.getElementById('user-input').value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput }),
        });
        const data = await response.json();
        addMessage('bot', data.text);
    } catch (error) {
        addMessage('bot', 'Error: ' + error.message);
    }
});

function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text;
    document.getElementById('messages').appendChild(messageDiv);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}