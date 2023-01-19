document.getElementById('title').innerHTML = "chau"

fetch('/logoutUser')
    .then(result => console.log(result))
    .then(json => console.log(json))
