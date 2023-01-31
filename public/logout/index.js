
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
     fetch('/logout').then(()=>location.replace('/login'))

 })