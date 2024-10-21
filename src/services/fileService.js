import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const BUCKET_NAME = 'navgo-etec-bucket'; 

const keyFilename = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH);

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: keyFilename
});

async function uploadFile(classDirectory, file) {
    const bucket = storage.bucket(BUCKET_NAME);
    const destination = `${classDirectory}/${file.originalname}`; // originalname é propriedade do multer

    try {

        // Usa um buffer e cria uma 'stream'
        const fileUpload = bucket.file(destination);
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });
        stream.end(file.buffer);

        // Aguarda o resultado
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        console.log(`Arquivo ${file.originalname} enviado para o bucket ${BUCKET_NAME} no diretório ${classDirectory}`);
    } catch (error) {
        throw new Error('Erro ao enviar arquivo: ' + error.message);
    }
}

async function listFiles(subject_id, course_id) {
    try {
        const classDirectoryPrefix = `class/${subject_id}/${course_id}/`;

        const [files] = await storage.bucket(BUCKET_NAME).getFiles({
            prefix: classDirectoryPrefix, // Prefixo que define o diretório
        });

        return files.map(file => ({
            name: file.name.replace(classDirectoryPrefix, ''), // Remove o prefixo do nome exibido
            url: `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`
        }));
    } catch (error) {
        throw new Error(`Erro ao listar arquivos no diretório ${classDirectoryPrefix}: ${error.message}`);
    }
}

//QUEBRADO TAMBÉM
// async function downloadFile(bucketName, fileName) {
//     const bucket = storage.bucket(bucketName);
//     const destination = path.join(__dirname, '..', 'downloads', fileName);
//     try {
//         await bucket.file(fileName).download({ destination });
//         console.log(`Arquivo ${fileName} baixado para ${destination}`);
//         return destination;
//     } catch (error) {
//         throw new Error('Erro ao baixar arquivo: ' + error.message);
//     }
// }

export default { uploadFile, listFiles };