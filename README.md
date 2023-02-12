# Desafio 14 

## Servidor con balance de carga


> Ejecutamos la base de datos de mongo desde el cmd:

```
Ejemplo: mongod --dbpath “C:\Program Files\MongoDB\miBaseDeDatos” 
```

> Iniciamos NGINX

```
Ejemplo:
cd C:\Users\Usuario\Desktop\Gustavo Dell\GUS\Programacion\CoderHouse\Backend\Clase 30\nginx-1.22.1
start nginx.exe
```

**Consigna:**
Tomando con base el proyecto que vamos realizando, agregar un parámetro más en
la ruta de comando que permita ejecutar al servidor en modo fork o cluster. Dicho
parámetro será 'FORK' en el primer caso y 'CLUSTER' en el segundo, y de no
pasarlo, el servidor iniciará en modo fork.
Agregar en la vista info, el número de procesadores presentes en el servidor.
Ejecutar el servidor (modos FORK y CLUSTER) con nodemon verificando el número de procesos tomados por node.


> Solucion

> > Ejecutamos con node (nos ubicamos dentro de la carpeta src)

```
node app.js --port=8080 --modo=cluster (Si no aclaramos por defecto será el puerto 8080 y modo fork)
```

> > Ejecutamos con nodemon

```
node app.js --port=8080 --modo=cluster (Si no aclaramos por defecto será el puerto 8080 y modo fork)
```

> > Ingresamos a la vista info

```
http://localhost/info
```

> > Ejecutar la app con pm2 en modo fork y cluster

```
Modo fork:
pm2 start app.js
┌─────┬────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name   │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ app    │ default     │ 1.0.0   │ fork    │ 9540     │ 3s     │ 0    │ online    │ 0%       │ 48.0mb   │ Usuario  │ disabled │
└─────┴────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘

Modo cluster:
pm2 start -i max app.js
┌─────┬────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name   │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ app    │ default     │ 1.0.0   │ cluster │ 3764     │ 3s     │ 0    │ online    │ 0%       │ 31.9mb   │ Usuario  │ disabled │
│ 1   │ app    │ default     │ 1.0.0   │ cluster │ 7976     │ 3s     │ 0    │ online    │ 0%       │ 31.0mb   │ Usuario  │ disabled │
│ 2   │ app    │ default     │ 1.0.0   │ cluster │ 7076     │ 3s     │ 0    │ online    │ 0%       │ 31.4mb   │ Usuario  │ disabled │
│ 3   │ app    │ default     │ 1.0.0   │ cluster │ 6804     │ 2s     │ 0    │ online    │ 0%       │ 31.2mb   │ Usuario  │ disabled │
│ 4   │ app    │ default     │ 1.0.0   │ cluster │ 5976     │ 2s     │ 0    │ online    │ 0%       │ 31.2mb   │ Usuario  │ disabled │
│ 5   │ app    │ default     │ 1.0.0   │ cluster │ 3308     │ 2s     │ 0    │ online    │ 0%       │ 30.7mb   │ Usuario  │ disabled │
│ 6   │ app    │ default     │ 1.0.0   │ cluster │ 9624     │ 2s     │ 0    │ online    │ 0%       │ 28.6mb   │ Usuario  │ disabled │
│ 7   │ app    │ default     │ 1.0.0   │ cluster │ 22620    │ 1s     │ 0    │ online    │ 0%       │ 30.6mb   │ Usuario  │ disabled │
└─────┴────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

**Consigna:**
Configurar Nginx para balancear cargas de nuestro servidor de la siguiente manera:
Redirigir todas las consultas a /api/randoms a un cluster de servidores escuchando en el puerto 8081. El cluster será creado desde node utilizando el módulo nativo cluster.
El resto de las consultas, redirigirlas a un servidor individual escuchando en el puerto 8080.
Verificar que todo funcione correctamente.
Luego, modificar la configuración para que todas las consultas a /api/randoms sean redirigidas a
un cluster de servidores gestionado desde nginx, repartiéndolas equitativamente entre 4
instancias escuchando en los puertos 8082, 8083, 8084 y 8085 respectivamente.

> Solucion

> > Ejecutamos con node como en la consigna anterior, pero utilizando el siguiente código en el archivo nginx.conf (recordar recargar nginx con el comando nginx -s reload y guardar el archivo en la carpeta correspondiente a nginx):

```

worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    upstream node_app {
        server localhost:8080;
    }

    upstream api_randoms {
        server localhost:8081;
    }
    
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   "C:\Users\Usuario\Desktop\Gustavo Dell\GUS\Programacion\CoderHouse\Backend\Clase 8\desafio4";
            index  index.html index.htm;
            proxy_pass http://node_app;    
        }


        location /api/randoms {
            index  index.html index.htm;
            proxy_pass http://api_randoms;
        }



        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

}

```

> > Redirigimos a un cluster de servidores. Modificamos el archivo nginx.conf con el siguiente código:

```

worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    upstream node_app {
        server localhost:8080;
    }

    upstream api_randoms {
        server localhost:8082;
        server localhost:8083;
        server localhost:8084;
        server localhost:8085;
    }

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   "C:\Users\Usuario\Desktop\Gustavo Dell\GUS\Programacion\CoderHouse\Backend\Clase 8\desafio4";
            index  index.html index.htm;
            proxy_pass http://node_app;    
        }


        location /api/randoms {
            index  index.html index.htm;
            proxy_pass http://api_randoms;
        }



        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

}

