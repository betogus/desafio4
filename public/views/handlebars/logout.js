let loginBtn = document.getElementById('loginBtn').addEventListener('click', (e) => {
    e.preventDefault()
    fetch('/logout').then(() => location.replace('/login'))
})