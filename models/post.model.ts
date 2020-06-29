

import { Schema, Document, model} from 'mongoose'


const postSchema = new Schema ({

    created:{
        type: Date
    },
    mensaje:{
        type: String
    },
    imgs:[{
        type: String
    }],
    coords:{
        type: String // latitud y long.
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una referencia a un Usuario']
    }


})

postSchema.pre<IPost>('save', function( next ){
    this.created = new Date()
    next()
})

interface IPost extends Document {
    created: Date, 
    mensaje: string, 
    img:string[],
    coords: string, 
    usuario: string
}

export const Post = model<IPost>('Post', postSchema)