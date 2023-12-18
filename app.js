const express = require('express');
const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser');
const SftpClient = require('ssh2-sftp-client');
const { Client } = require('ssh2');
const { error } = require('console');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Configuración de Multer para gestionar la carga de archivos
//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });
app.use(bodyParser.json());

/*app.post('/uploadFile', async (req, res) => {

    const fileName = req[`body`][`fileName`];
    const fileUrl = req[`body`][`fileUrl`];
    const host = req[`body`][`host`];
    const port = req[`body`][`port`];
    const username = req[`body`][`username`];
    const remotePath = req[`body`][`remotePath`];
    const respuesta = await axios.get(fileUrl);

    console.log(`25. fileName: ${fileName} - fileUrl: ${fileUrl} - host: ${host} - port: ${port} - username: ${username} - remotePath: ${remotePath}\n`);
    //console.log(`26. Contenido archivo: ${respuesta.data}\n`);
    
    const SftpClient = require('ssh2-sftp-client');

    const config = {
        host: host,//'44.197.47.56',
        port: port,//22,
        username: username,//'ec2-user',
        privateKey: require('fs').readFileSync('PEM/SantaCarmen.pem'),
        timeout: 5000 // Tiempo de espera en milisegundos (5 segundos en este caso)
      };
    
    const sftp = new SftpClient();
    
    //CONEXION SERVIDOR SFTP
    sftp.connect(config)
      .then(() => {
        console.log(`43. Conexión establecida con el servidor SFTP - host: ${host}\n`);
      
        //RUTA DONDE SE ALMACENAN LOS ARCHIVOS TXT PROVENIENTES DE NETSUITE
        const rutaLocal = `ArchivosTXT/${fileName}`;
        
        //RUTA DEL SERVIDOR DONDE SE ALMACENAN LOS ARCHIVOS TXT PROVENIENTES DE NETSUITE
        const remotePath2 = `${remotePath}${fileName}`;//`/home/ec2-user/test/${fileName}`;
        
        //SE CREA ARCHIVO TXT EN CARPETA DE LA APLICACION PARA LUEGO PODER ENVIARLO A SERVIDOR SFPT
        require('fs').writeFileSync(rutaLocal, respuesta.data, 'utf-8');

        //SE ENVIA ARCHIVO TXT A SERVIDOR SFPT
        sftp.put(rutaLocal, remotePath2)
        .then(() => {

          //SE DESCONECTA DE SERVIDOR SFTP
          sftp.end();

          console.log(`60. Desconexión exitosa con el servidor SFTPT - host: ${host}\n`);
        
          res.status(200).json({
            error: false,
            message: 'Archivo cargado con éxito.',
            fileName: fileName,
            fileContent: respuesta.data
          });
        
        }).catch((err) => {

          res.status(400).json({
            error: true,
            message: `Error al cargar archivo en servidor SFPT - Details: ${JSON.stringify(err)}`,
            fileName: fileName,
            fileContent: null
          });

        });

      }).catch((err) => {

        res.status(400).json({
          error: true,
          message: `Error al intentar conectar con servidor SFPT - Details: ${JSON.stringify(err)}`,
          fileName: fileName,
          fileContent: null
        });
    });
});*/

/*app.post('/uploadFile2', async (req, res) => {

  const fileName = req[`body`][`fileName`];
  const fileUrl = req[`body`][`fileUrl`];
  const host = req[`body`][`host`];
  const port = req[`body`][`port`];
  const username = req[`body`][`username`];
  const password = req[`body`][`password`];
  const remotePath = req[`body`][`remotePath`];
  const respuesta = await axios.get(fileUrl);

  console.log(`25. fileName: ${fileName} - fileUrl: ${fileUrl} - host: ${host} - port: ${port} - username: ${username} - password: ${password} - remotePath: ${remotePath}\n`);
  //console.log(`26. Contenido archivo: ${respuesta.data}\n`);
  
  const SftpClient = require('ssh2-sftp-client');
  const { Client } = require('ssh2');

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(`111. hashedPassword: ${hashedPassword}\n`);
  const config = {
      host: host,
      port: port,
      username: username,
      password: password,
      algorithms: {
        kex: [
          "diffie-hellman-group1-sha1",
          "ecdh-sha2-nistp256",
          "ecdh-sha2-nistp384",
          "ecdh-sha2-nistp521",
          "diffie-hellman-group-exchange-sha256",
          "diffie-hellman-group14-sha1"
        ],
        cipher: [
          "3des-cbc",
          "aes128-ctr",
          "aes192-ctr",
          "aes256-ctr",
          "aes128-gcm",
          "aes128-gcm@openssh.com",
          "aes256-gcm",
          "aes256-gcm@openssh.com"
        ],
        serverHostKey: [
          "ssh-rsa",
          "ecdsa-sha2-nistp256",
          "ecdsa-sha2-nistp384",
          "ecdsa-sha2-nistp521"
        ],
        hmac: [
          "hmac-sha2-256",
          "hmac-sha2-512",
          "hmac-sha1"
        ]
    },
      timeout: 5000 // Tiempo de espera en milisegundos (5 segundos en este caso)
    }; 
  //CONEXION SERVIDOR SFTP
  sftp.connect(config)
    .then(() => {
      console.log(`43. Conexión establecida con el servidor SFTP - host: ${host}\n`);
    
      //RUTA DONDE SE ALMACENAN LOS ARCHIVOS TXT PROVENIENTES DE NETSUITE
      const rutaLocal = `ArchivosTXT/${fileName}`;
      
      //RUTA DEL SERVIDOR DONDE SE ALMACENAN LOS ARCHIVOS TXT PROVENIENTES DE NETSUITE
      const remotePath2 = `${remotePath}${fileName}`;//`/home/ec2-user/test/${fileName}`;
      
      //SE CREA ARCHIVO TXT EN CARPETA DE LA APLICACION PARA LUEGO PODER ENVIARLO A SERVIDOR SFPT
      require('fs').writeFileSync(rutaLocal, respuesta.data, 'utf-8');

      //SE ENVIA ARCHIVO TXT A SERVIDOR SFPT
      sftp.put(rutaLocal, remotePath2)
      .then(() => {

        //SE DESCONECTA DE SERVIDOR SFTP
        sftp.end();

        console.log(`60. Desconexión exitosa con el servidor SFTPT - host: ${host}\n`);
      
        res.status(200).json({
          error: false,
          message: 'Archivo cargado con éxito.',
          fileName: fileName,
          fileContent: respuesta.data
        });
      
      }).catch((err) => {

        res.status(400).json({
          error: true,
          message: `Error al cargar archivo en servidor SFPT - Details: ${JSON.stringify(err)}`,
          fileName: fileName,
          fileContent: null
        });

      });

    }).catch((err) => {

      res.status(400).json({
        error: true,
        message: `Error al intentar conectar con servidor SFPT - Details: ${JSON.stringify(err)}`,
        fileName: fileName,
        fileContent: null
      });
  });
});*/

app.post('/uploadFile3', async (req, res) => {

  const fileName = req[`body`][`fileName`];
  const fileUrl = req[`body`][`fileUrl`];
  const host = req[`body`][`host`];
  const port = req[`body`][`port`];
  const username = req[`body`][`username`];
  const password = req[`body`][`password`];
  const remotePath2 = req[`body`][`remotePath`];
  const respuesta = await axios.get(fileUrl);

  console.log(`25. fileName: ${fileName} - fileUrl: ${fileUrl} - host: ${host} - port: ${port} - username: ${username} - password: ${password} - remotePath: ${remotePath2}\n`);
  //console.log(`26. Contenido archivo: ${respuesta.data}\n`);

  const sftpConfig = {
    host: host,
    port: port,
    username: username,
    password: password,
    algorithms: {
      kex: [
        "diffie-hellman-group1-sha1",
        "ecdh-sha2-nistp256",
        "ecdh-sha2-nistp384",
        "ecdh-sha2-nistp521",
        "diffie-hellman-group-exchange-sha256",
        "diffie-hellman-group14-sha1"
      ],
      cipher: [
        "3des-cbc",
        "aes128-ctr",
        "aes192-ctr",
        "aes256-ctr",
        "aes128-gcm",
        "aes128-gcm@openssh.com",
        "aes256-gcm",
        "aes256-gcm@openssh.com"
      ],
      serverHostKey: [
        "ssh-rsa",
        "ecdsa-sha2-nistp256",
        "ecdsa-sha2-nistp384",
        "ecdsa-sha2-nistp521"
      ],
      hmac: [
        "hmac-sha2-256",
        "hmac-sha2-512",
        "hmac-sha1"
      ]
    }
  };

  const conn = new Client();

  try 
  {
    await conn.connect(sftpConfig);

    conn.on('ready', () => {
      console.log(`322. Conexión SFTP establecida`);

      // Realizar operaciones SFTP aquí, por ejemplo, subir un archivo
      const localPath = `ArchivosTXT/${fileName}`;
      const remotePath = `${remotePath2}${fileName}`;
      require('fs').writeFileSync(localPath, respuesta.data, 'utf-8');
      console.log(`328. localPath: ${localPath} - remotePath: ${remotePath}\n`);
      conn.sftp((err, sftp) => {
        if (err) {
          console.error('331. Error al establecer la conexión SFTP:', err);
          res.status(500).send('332. Error al establecer la conexión SFTP');
          return;
        }

        const readStream = require('fs').createReadStream(localPath);
        const writeStream = sftp.createWriteStream(remotePath);

        writeStream.on('close', () => {
          console.log('Archivo subido exitosamente');
          res.status(200).send('Archivo subido exitosamente');

          // Cerrar la conexión SFTP y SSH cuando hayas terminado
          sftp.end();
          conn.end();
        });

        writeStream.on('error', (uploadError) => {
          console.error('Error al subir el archivo:', uploadError.message);
          res.status(500).send('Error al subir el archivo');

          // Cerrar la conexión SFTP y SSH en caso de error
          sftp.end();
          conn.end();
        });

        readStream.pipe(writeStream);
      });
    });

    conn.on('error', (err) => {
      console.error('Error general - details:', err);
      // Puedes manejar el error de manera específica aquí
    });
  }
  catch (connectError)
  {
    console.error('Error de conexión SSH:', connectError.message);
    res.status(500).send('Error de conexión SSH');
  }

});

app.post('/getFile', async (req, res) => {

  const fileName = req[`body`][`fileName`];
  const host = req[`body`][`host`];
  const port = req[`body`][`port`];
  const username = req[`body`][`username`];
  const remotePath = req[`body`][`remotePath`];

  console.log(`25. fileName: ${fileName} - host: ${host} - port: ${port} - username: ${username} - remotePath: ${remotePath}\n`);
  
  try
  {
    const SftpClient = require('ssh2-sftp-client');

    const config = {
        host: host,
        port: port,
        username: username,
        privateKey: require('fs').readFileSync('PEM/SantaCarmen.pem')
      };
    
    const sftp = new SftpClient();
    
    //CONEXION SERVIDOR SFTP
    await sftp.connect(config)
      //.then(() => {
        console.log(`118. Conexión establecida con el servidor SFTP - host: ${host}\n`);
      
        //RUTA DONDE SE ALMACENAN LOS ARCHIVOS TXT PROVENIENTES DE NETSUITE
        const rutaLocal = `ArchivosTXT/${fileName}`;
        
        //RUTA DEL SERVIDOR DONDE SE ALMACENAN LOS ARCHIVOS TXT PROVENIENTES DE NETSUITE
        const remotePath2 = `${remotePath}${fileName}`;//`/home/ec2-user/test/${fileName}`;

        // Verificar si el archivo existe en el servidor SFTP
        const existeArchivo = await sftp.exists(remotePath2)
        console.log(`128. existeArchivo: ${existeArchivo}\n`);
        
        if (existeArchivo) {
          // Descargar el archivo
          const contenidoArchivo = await sftp.get(remotePath2)
          //.then(() => {
            console.log(`134. remotePath2: ${remotePath2} - contenidoArchivo: ${JSON.stringify(contenidoArchivo.toString())}\n`);
                // Configurar la respuesta HTTP para la descarga
                //res.setHeader('Content-Disposition', `attachment; fileName=${fileName}`);
                res.send(contenidoArchivo);
          //}).catch((err) => {

            //res.status(400).json({
              //error: true,
              //message: `Error al descargar archivo desde servidor SFPT - Details: ${JSON.stringify(err)}`,
              //fileName: fileName,
              //fileContent: null
            //});
    
          //});
        } else {
          res.status(404).json({ mensaje: 'Archivo no encontrado.' });
        }
      /*}).catch((err) => {

        res.status(400).json({
          error: true,
          message: `Error al intentar conectar con servidor SFPT - Details: ${JSON.stringify(err)}`,
          fileName: fileName,
          fileContent: null
        });
    });*/
  }
  catch(e)
  {
    
  }
});

app.post('/getFile2', async (req, res) => {

  const fileName = req[`body`][`fileName`];
  const host = req[`body`][`host`];
  const port = req[`body`][`port`];
  const username = req[`body`][`username`];
  const remotePath = req[`body`][`remotePath`];
  const password = req[`body`][`password`];

  console.log(`25. fileName: ${fileName} - host: ${host} - port: ${port} - username: ${username} - password: ${password} - remotePath: ${remotePath}\n`);
  
  const sftpConfig = {
    host: host,
    port: port,
    username: username,
    password: password,
    algorithms: {
      kex: [
        "diffie-hellman-group1-sha1",
        "ecdh-sha2-nistp256",
        "ecdh-sha2-nistp384",
        "ecdh-sha2-nistp521",
        "diffie-hellman-group-exchange-sha256",
        "diffie-hellman-group14-sha1"
      ],
      cipher: [
        "3des-cbc",
        "aes128-ctr",
        "aes192-ctr",
        "aes256-ctr",
        "aes128-gcm",
        "aes128-gcm@openssh.com",
        "aes256-gcm",
        "aes256-gcm@openssh.com"
      ],
      serverHostKey: [
        "ssh-rsa",
        "ecdsa-sha2-nistp256",
        "ecdsa-sha2-nistp384",
        "ecdsa-sha2-nistp521"
      ],
      hmac: [
        "hmac-sha2-256",
        "hmac-sha2-512",
        "hmac-sha1"
      ]
    }
  };

  const conn = new Client();

  try
  {
    await conn.connect(sftpConfig);

    conn.on('ready', () => {
      console.log(`322. Conexión SFTP establecida`);

      conn.sftp((err, sftp) => {
        if (err) {
          console.error('Error al establecer la conexión SFTP:', err);
          res.status(500).json({ mensaje: 'Error al establecer la conexión SFTP' });
          conn.end();
          return;
        }
  
        // Obtener lista de archivos en el directorio remoto
        sftp.readdir(remotePath, (readdirErr, listaArchivos) => {
          if (readdirErr) {
            console.error('Error al leer el directorio remoto:', readdirErr);
            res.status(500).json({ mensaje: 'Error al leer el directorio remoto' });
            sftp.end();
            conn.end();
            return;
          }
  
          // Buscar el archivo en la lista
          const archivoEncontrado = listaArchivos.find((archivo) => archivo.filename === fileName);
  
          if (archivoEncontrado)
          {
            console.log('Archivo encontrado:', archivoEncontrado);
            res.status(200).json({ mensaje: 'Archivo encontrado', archivo: archivoEncontrado });
          }
          else
          {
            console.log('Archivo no encontrado');
            res.status(404).json({ mensaje: 'Archivo no encontrado' });
          }
  
          // Cerrar la conexión SFTP y SSH cuando hayas terminado
          sftp.end();
          conn.end();
        });
      });
  });

    conn.on('error', (err) => {
      console.error('Error general - details:', err);
      // Puedes manejar el error de manera específica aquí
    });
  }
  catch(e)
  {
    console.error('Error de conexión SSH:', connectError.message);
    res.status(500).send('Error de conexión SSH');
  }

});

//SERVICIO DESTINADO A PROBAR LA DISPONIBLIDAD DE LA APLICACION
app.get("/", (req, res) => {
	res.json({
		Status: 'OK'
	})
}); 
  
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
