fetch('/auth').then(result => {
    console.log(result)
   if (result.status ===401) location.replace('/login')
   else location.replace('/dashboard')
})