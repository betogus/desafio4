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
        }).then(result => result.json())

        .then(json => {
            if (json.error) {
                location.replace('../failregister')
            } else {
                location.replace('../')
            }
        })
})

let loginBtn = document.getElementById('loginBtn')
loginBtn.addEventListener('click', evt => {
    evt.preventDefault()
    location.replace('/login')
})