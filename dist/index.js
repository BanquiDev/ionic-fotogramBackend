"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_1 = __importDefault(require("./routes/post"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
//middleware que me procesa la info que viene x post
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//file upload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
//configuracion de CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
//rutas de usuario
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
//conectar con mongo
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos online20');
});
// levantar express
server.start(() => {
    console.log(`servidor corriendo en puerto: ${server.port}`);
});
