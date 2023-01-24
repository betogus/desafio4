let btn = document.getElementById('loginBtn')
btn.addEventListener('click', evt => {
    evt.preventDefault()
    let sendObject = {}
    let form = document.getElementById('loginForm')
    let data = new FormData(form)
    data.forEach((value, key) => sendObject[key] = value)
    fetch('/login', {
        method: "POST",
        body: JSON.stringify(sendObject),
        headers: {
            'Content-Type': "application/json"
        }
    }).then(response => {
           
    }); 
})

let registerBtn = document.getElementById('registerBtn')
registerBtn.addEventListener('click', evt => {
    evt.preventDefault()
    location.replace('/register')
})

