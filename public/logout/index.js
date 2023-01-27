
fetch('/auth').then(result => {
    if (result.status === 401) location.replace('/login')
})

fetch('/currentUser', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {

        document.getElementById('title').innerHTML = `Hasta pronto ${data.username}`
    });

   
 let loginBtn = document.getElementById('loginBtn').addEventListener('click', (e) => {
     e.preventDefault()
     fetch('/logout').then(response => {
        console.log(response.status)
     })

 })