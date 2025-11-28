// logica para trabajar con archivos y rutas de proyecto

import {fileURLToPath} from "url";
import {dirname, join} from "path"

const __filename = fileURLToPath(import.meta.url)

const __dirname = join(dirname(__filename), "../../../") // apuntamos a carpeta root



export { 
    __dirname,
    join
}