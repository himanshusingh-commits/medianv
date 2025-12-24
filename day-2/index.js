import express from 'express';
import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
import cors from 'cors'


const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
console.log(__filename)
const __dirname = path.dirname(__filename);
console.log(__dirname)
const filePath = path.join(__dirname, 'input.txt');
console.log('filePath : ', filePath );
app.use(cors())
app.use(express.json())
app.post('/file', async (req, res) => {
    try {
        await fsPromises.writeFile(filePath, "medianv"); 
        res.status(201).json({ message: "File created successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create file', error: error.message });
    }
});

app.get('/file', async (req, res) => {
    try {
        const data = await fsPromises.readFile(filePath, 'utf-8');
        res.status(200).json({ message: "File retrieved successfully", content: data });
    } catch (error) {
      
        res.status(404).json({ message: 'File not found' });
    }
});

app.put('/file',async(req,res)=>{
    try{
        const data = fsPromises.appendFile(filePath,'welcome to medianv')
        console.log(data)
        res.status(200).json({message:'done filePath',data})
    }catch{
        return res.status(401).json({message:'its showing some error'})
    }
})

app.post('/stream-request', (req, res) => {
    const targetPath = path.join(__dirname, 'RequestBody.txt');
    const writableStream = fs.createWriteStream(targetPath);

    req.pipe(writableStream);

    writableStream.on('finish', () => {
        res.status(201).json({ message: "Request body streamed to file successfully" });
    });

    writableStream.on('error', (err) => {
        res.status(500).send("Streaming failed");
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
