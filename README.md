# ApiExpress

## Cómo iniciar

Para iniciar y ejecutar la API, sigue estos pasos:

### Paso 1: Editar la configuración de MongoDB

1. Abre el archivo `config/mongodb/mongodb-config.json`.

   ```json
   {
     "mongo": {
       "servidor": "127.0.0.1:27018",
       "basedatos": "ApiExpress",
       "usuario": "saul",
       "contrasena": "1234"
     }
   }
   ```

2. Edita los valores para que coincidan con tu configuración de MongoDB:
   - `servidor`: Dirección y puerto de tu servidor MongoDB.
   - `basedatos`: Nombre de la base de datos que utilizará la API.
   - `usuario`: Nombre de usuario de tu base de datos.
   - `contrasena`: Contraseña del usuario de la base de datos.

### Paso 2: Instalar los paquetes necesarios

1. Abre una terminal y navega al directorio del proyecto.

2. Instala las dependencias de npm:
   ```bash
   npm install
   ```

### Paso 3: Instalar paquetes adicionales

3. Instala los paquetes específicos necesarios para MongoDB:
   ```bash
   npm install mongoose
   ```

### Paso 4: Iniciar la API

4. Una vez que todas las dependencias estén instaladas, puedes iniciar la API con el siguiente comando:
   ```bash
   npm start
   ```
