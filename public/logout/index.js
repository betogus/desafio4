fetch('/logout').then(result => result.json())
    .then(json => {
        document.getElementById('title').innerHTML = `Hasta pronto ${json.username}`
        if (json.error) location.replace('../')
    })
    .catch(error => console.log(error))

fetch('/auth').then(result => {
    if (result.status === 401) location.replace('/login')
})