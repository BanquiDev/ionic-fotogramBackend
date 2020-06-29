import { FileUpload } from '../interfaces/file-upload';

import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem{

    constructor(){}

    guardarImagenTemporal(file: FileUpload, userId: string){
        

        return new Promise( (resolve, reject)=>{

            //crear Carpetas
            const path = this.crearCarpetaUsuario(userId)
    
            //Nombre Archivo
            const nombreArchivo = this.generarNombreUnico( file.name)
            console.log(nombreArchivo)
            console.log(file.name)
    
            //mover el archivo de temp a la carpeta
            file.mv(`${path}/${nombreArchivo}`, (err:any)=>{
    
                if(err){
                    reject (err)
                }else{
                    resolve()
                }
            })
        })
    }
    
    private generarNombreUnico(nombreOriginal: string){

        const nombreArr = nombreOriginal.split('.')
        const extension = nombreArr[nombreArr.length - 1]

        const idUnico = uniqid()

        return `${idUnico}.${extension}`

    }

    private crearCarpetaUsuario(userId:string){

        const pathUser = path.resolve(__dirname, '../uploads/', userId) 
        const pathUserTemp = pathUser + '/temp' 
        console.log(pathUser)
 
        const existe = fs.existsSync( pathUser )

        if(!existe){

            fs.mkdirSync(pathUser)
            fs.mkdirSync(pathUserTemp)
        }
        
        return pathUserTemp
    }

    imagenesdeTemphaciaPost(userId:string){

        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp')
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts')

        if(!fs.existsSync(pathTemp)){
            return[]
        }

        if(!fs.existsSync(pathPost)){
            fs.mkdirSync( pathPost )
        }

        const imagenesTemp = this.obtenerImagenesenTemp( userId )

        imagenesTemp.forEach(imagen =>{
            fs.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`)
        })

        return imagenesTemp
    }

    private obtenerImagenesenTemp(userId:string){

        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp')

        return fs.readdirSync( pathTemp ) || []
    }


    getFotoUrl(userId:string, img:string){

        //path post
        const pathFoto = path.resolve(__dirname, '../uploads', userId, 'posts', img)
        //existe la imagen?
        const existe = fs.existsSync( pathFoto )

        if( !existe ){
            return path.resolve(__dirname, '../assets/original.jpg')
        }

        return pathFoto

    }
}