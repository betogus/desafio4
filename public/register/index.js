let btn = document.getElementById('registerBtn')
btn.addEventListener('click', evt => {
    evt.preventDefault()
    let sendObject = {}
    let form = document.getElementById('registerForm')
    let data = new FormData(form)
    data.forEach((value, key) => sendObject[key] = value)
    fetch('/register', {
            method: "POST",
            body: JSON.stringify(sendObject),
            headers: {
                'Content-Type': "application/json"
            }
        }).then(response => {
            if (response.status === 200) location.replace('/dashboard')
            else if (response.status === 401) location.replace('/failregister')
        });
})

let loginBtn = document.getElementById('loginBtn')
loginBtn.addEventListener('click', evt => {
    evt.preventDefault()
    location.replace('/login')
})