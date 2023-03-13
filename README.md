> > Creamos la arquitectura de capas. Dentro de src tendremos la carpeta routes con el auth.router. Debemos pasar todos los html con sus index que nos lleven a la ruta /auth/login o /auth/register segun corresponda. En el server.js debemos importar el auth.router. Además hacemos que nos redirija la raiz al login:
```
app.get('/', (req, res) => {
        res.redirect('/auth/login')
    })
```
> > Sucede que en el metodo POST tanto de login como de register de auth.router, me lleva al failureRedirect. Ésto se debió a que app.use('/auth', authRouter) debe ir más abajo, después de todo el código del server.js
