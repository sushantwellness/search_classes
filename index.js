const fs = require('fs');
const { Configuration, OpenAIApi }  = require('openai')

const classessData = require('./classesData.json');

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY
  });
const openai = new OpenAIApi(configuration);

async function execute() {
    const classEmbeddings = [];
    for (let i = 0 ; i < 150; i++) {
        const classData = classessData[i];
        const inputString = `${classData.name} by ${classData.teacher} is ${classData.media_type.replace(/_/g, ' ')} and ${Math.ceil(classData.duration / 60)} minutes with mood ${classData.tag} and falls under ${classData.category} category, learnings:  ${classData.desc.replace(/<[^>]*>/g, '')}`;
        console.log(i ,inputString);
        const embeddingData = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: inputString,
        })
        classEmbeddings.push({
            id: classData.id,
            name: classData.name,
            embeddings: embeddingData.data.data[0],
        })
    }
    
    fs.writeFile('classes_embedding.json', JSON.stringify(classEmbeddings, null, 2), (err) => {
        if (err) throw err;
        console.log('Class Embedding pairs saved to output file!');
    });
}

execute();

