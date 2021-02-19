# OpenJS Node.js Services Developer (JSNSD)

##### NodeJS
Imports y exports con módulos
```js
const x = require('dependency');
module.exports = y;
```

Manejo de ficheros
```js
const fs = require('fs').promises;
const countriesPath = path.join(__dirname, 'countries.json');

// file read - use JSON parse if content is a JSON
fs.readFile(countriesPath, 'utf-8');
JSON.parse(fileContent)

// file write - use JSON stringify if content is a JSON
JSON.stringify(fileContent)
fs.writeFile(outputPath, fileContent);
```	

Axios para requests
```js
const Http = axios.create();
await Http.get('http://localhost:3000')
```
<br>

##### Express
Dependencias y configuración básica
```js
'use strict'

const express = require('express');

// controllers and/or middlewares
const { controllerMethod } = require('./service.controller');

// express init
const app = express();
const port = 3052;

// express listen
app.listen(port, () => {
  console.log('Listening on port', port)
}).on('error', err => {
  console.log('Error listening', err)
});
```

Configuración body parser

```js
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
```

Configuración de middleware
```js
const middleware = (_req, _res, next) => {
	// Middleware logic
	next();
}
app.use(middleware);
app.use('/path', middleware);
```

Configuración de handlers y rutas
```js
app.get('/', controllerMethod);
app.post('/path', specificMiddleware, controllerMethod); // middleware being optional
```

Ruta por defecto
```js
// create default error middleware
const errorMiddleware = (_req, res) => {
  res.status(404).send('Invalid URL');
};

app.get('/countries', getCountries);
// fallback route
app.get('*', errorMiddleware)
```


Parámetros de requests, path y query
```js
app.get('/:id', controllerMethod);
const pathParam = req.param.id;
const queryParam = req.query.id;
```

Manejo de errores y propagación de estos
```js
catch (err) {
	res.sendStatus(500); // OR
  	res.status(404).send(err);
}
```

Servicio de ficheros estáticos
```js
const path = require('path');
const staticPath = path.join(__dirname, 'public');
app.use('/', express.static(staticPath, { fallthrough: false }));
```

Concatenación de respuestas de múltiples servicios (Promise.all)
```js
const _cities = Http.get('http://localhost:3051/cities').then(res => res.data);
const _countries = Http.get('http://localhost:3052/countries').then(res => res.data);
const [cities, countries] = await Promise.all([_cities, _countries]);
```

Gestionar servicio índice y EP base
```js
app.get('*', handler); // como último servicio
```

Propagación de peticiones
```js
// use default http for forwarding
const Http = require('http');

// handle posible invalid URL with try/catch
const url = new URL(urlParam);

const reqOpts = {
    port: url.port || 80,
    path: url.pathname || '/',
    protocol: url.protocol || 'http:',
    hostname: url.hostname,
    method: req.method,
    headers: req.headers,
}

// create the http connector
const connector = Http.request(reqOpts, response => {
    response.pipe(res).on('error', err => res.status(500).send(err))
});

// Pipe the original request into the connector
req.pipe(connector).on('error', err => res.status(500).send(err))
```

Middlewares básicos de seguridad
```js
req.headers['x-skip-request']
	? res.status(403).json({ error: 'The request has been skipped' })
	: next()

req.ip === '123.123.123.123'
    ? res.status(500).send('Stop DDOS pls')
    : next()
```

Middleware de autenticación
```js
const validateUserAccess = (req, res, next) => {
	const tokenHeader = req.headers['authorization'];
	const token = tokenHeader && tokenHeader.split(' ')[1];
	
	if (!token) {
		res.sendStatus(401);
	} else {
		jwt.verify(token, JWT_TOKEN_SECRET, (err, tokenData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				req.tokenData = tokenData;
				next();
			}
		});
	}
};
```


**Recordatorio: El orden de los middlewares y controladores es muy importante**
<br>

##### JS Commons
Promises
```
Promises and Promise.all
Array iterators: map, forEach, reduce, indexOf, _filter, _find
```
<br>

##### Exam environment
Hacer peticiones con CURL
```
Base:
curl -X GET/POST -H Header1 -H Header2 https://url.com

Headers comunes:
	-H 'Accept: application/json'
	-H 'Content-Type: application/json'
	-H 'Authorization: Bearer eyJhb...ghLA'

POST:
	--data '{"prop1": "value", "prop2": true}'

Ejemplo completo:
curl -H 'Accept: application/json' -H "Authorization: Bearer eyJhb...ghLA" http://localhost:3000/api/countries
```

APIs útiles
```
NodeJS
Express
JS Mozilla
```

Dependencias utilizadas habitualmente
```
express
body-parser
axios
```

Debuggear app en VSCode directamente

_Version de NodeJS: 14 LTS_

<br>

##### Pending
- Versiones y pruebas
- Conexión desde el portátil de Everis (instalar plugin, actualizar portátil y probar)
- Operadores package.json
