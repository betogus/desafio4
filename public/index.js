fetch('/auth').then(response => {
   if (response.status === 200) location.replace('/dashboard')
   else if (response.status === 401) location.replace('/login')
})