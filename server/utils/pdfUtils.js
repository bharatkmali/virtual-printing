const pdf = require('pdf-page-counter');

async function getPDFPageCount(filePath) {
    try {
        const dataBuffer = await require('fs').promises.readFile(filePath);
        const data = await pdf(dataBuffer);
        return data.numpages;
    } catch (error) {
        console.error('Error counting PDF pages:', error);
        return null;
    }
}

module.exports = { getPDFPageCount };