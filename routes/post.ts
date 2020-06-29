import { Router, Response } from 'express'
import { verificaToken } from '../middlewares/autentication';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';




const postRoutes = Router()
const fileSystem = new FileSystem()
//mostrar posts y retornar paginados

postRoutes.get('/',  async (req:any, res:Response) =>{

    let pagina = Number(req.query.pagina) || 1
    let skip = pagina - 1
    skip = skip * 10

    const posts = await Post.find()
                            .sort({_id: -1})
                            .skip(skip)
                            .limit(10)
                            .populate('usuario', '-password')
                            .exec()



    res.json({
        ok:true,
        pagina,
        posts
    })


})


//Servicio para subir archivos

postRoutes.post('/upload', [verificaToken], async (req:any, res:Response)=>{

    if(!req.files){
    return res.status(400).json({
                ok:false, 
                mensaje: 'no se subio ningun archivo'
        })
    }

    const file: FileUpload = req.files.image

    if(!file){
        return res.status(400).json({
                    ok:false, 
                    mensaje: 'no se subio ningun archivo - imagen'
            })
        }
    
    if( !file.mimetype.includes('image') ){

        return res.status(400).json({
            ok:false, 
            mensaje: 'no es una imagen'
        })
    }    

    //guardo el archivo en la carpeta.

    await fileSystem.guardarImagenTemporal(file, req.usuario._id)

    return res.json({
        ok:true, 
        mensaje: 'Archivo subido correctamente',
        file: file.mimetype
    })
})



//crear un POst
postRoutes.post('/', [verificaToken], (req:any, res:Response) =>{

    const body = req.body
          body.usuario = req.usuario._id

    const imagenes = fileSystem.imagenesdeTemphaciaPost(req.usuario._id)
    body.imgs = imagenes

    Post.create( body).then(async postDB =>{

      await  postDB.populate('usuario', '-password').execPopulate()

        res.json({
            ok:true,
            post: postDB
        })

    }).catch( err =>{
        res.json({
            ok: true
        })
    })

} )

//mostrar imganenes

postRoutes.get('/imagen/:userid/:img',  (req:any, res:Response) =>{

    const userId = req.params.userid
    const img = req.params.img


    const pathFoto = fileSystem.getFotoUrl(userId, img)
    
    
    res.sendFile( pathFoto )
})


export default postRoutes