import express, {Application, NextFunction, Request, Response} from 'express'
import fs from 'fs/promises';
import fsRegular from 'fs';
import path from 'path';
import pdf from 'pdf-parse'

const PORT = process.env.PORT || 5000

const app: Application = express()




app.use("", async (req: Request, res: Response, next: NextFunction)=> {
    try{
        const files = await fs.readdir(path.join(`${process.cwd()}/files`))
        if(files.length > 0) {
            for(const file of files) {
                let filePath = path.join(`${process.cwd()}/files/${file}`)
                let readFile = await fs.readFile(filePath)
                let text = ""
                let textArray = []
                const data = await pdf(readFile)
                for(let i=0; i < data.text.length; i++) {
                    text+= data.text[i]
                }
                textArray = text.trim().toLowerCase().replace(/-/g, "").replace(/[.]/g, "").replace(/[js]/g, "").split(" ").join(" ").split("\n");
                if(!textArray.includes("react")) {
                    if(fsRegular.existsSync(filePath)){
                        console.log(file, "NOT MATCHED");
                        await fs.unlink(filePath)
                    }
                }
            }
        }
    }catch(err) {
        console.log(err);
    }
    return res.status(200).json({
        "message": "ok"
    })
})



app.listen(PORT, ()=> {
    console.log("SERVER IS RUNNING")
})