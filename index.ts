import Server  from './classes/server'
import userRoutes from './routes/usuario'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import postRoutes from './routes/post'
import fileUpload from 'express-fileupload'
import cors from 'cors'

const server = new Server()


//middleware que me procesa la info que viene x post
server.app.use( bodyParser.urlencoded({extended:true}))
server.app.use( bodyParser.json())


//file upload
server.app.use( fileUpload({useTempFiles: true }))

//configuracion de CORS
server.app.use( cors({origin:true, credentials:true}) )


//rutas de usuario
server.app.use('/user', userRoutes)
server.app.use('/posts', postRoutes)
//conectar con mongo
mongoose.connect('mongodb://localhost:27017/fotosgram', { useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true},
                (err)=>{
                    if( err )throw err;

                    console.log('Base de datos online20')
                })

// levantar express
server.start(()=>{
    console.log(`servidor corriendo en puerto: ${server.port}`)
})