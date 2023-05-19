const readline = require('readline');
const { Configuration, OpenAIApi }  = require('openai')
const redis = require('redis');

const classessData = require('./classesData.json');


const redisClient = redis.createClient({
    url: `redis://default:@localhost:6379`
});

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY
  });
const openai = new OpenAIApi(configuration);


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function chat(question) {
    rl.question(question, async (answer) => {
        const text = answer.trim();
        const embeddingData = await openai.createEmbedding({
            // model: 'text-embedding-ada-002',
            model: 'davinci:ft-wellness-coach-ai:sushant-2023-04-27-13-20-12',
            input: text,
        })
        const queryVector = embeddingData.data.data[0].embedding;
        const queryNorm = Math.sqrt(queryVector.reduce((acc, val) => acc + val*val, 0));
        const normalizedQueryVector = queryVector.map(val => val / queryNorm);
        redisClient.zrangebyscore('classes_vector', -1, 1, 'WITHSCORES', (err, res) => {
            if (err) throw err;
            const nearestVectors = [];
            for (let i = 0; i < res.length; i += 2) {
              const classId = (JSON.parse(res[i])).id;
              const vector = (JSON.parse(res[i])).embeddings;
              const score = parseFloat(res[i+1]);
              // Compute the cosine similarity between the vector and the query vector
              const norm = Math.sqrt(vector.reduce((acc, val) => acc + val*val, 0));
              const normalizedVector = vector.map(val => val / norm);
              const cosineSimilarity = normalizedQueryVector.reduce((acc, val, idx) => acc + val*normalizedVector[idx], 0);
              nearestVectors.push({ vector, score, cosineSimilarity, classId });
            }
            // Sort the nearest vectors by cosine similarity score
            nearestVectors.sort((a, b) => b.cosineSimilarity - a.cosineSimilarity);
            // Return the K nearest vectors
            const result = nearestVectors.slice(0, 2).map(v => v.classId);
            console.log('recommendations', classessData.filter(c => result.includes(c.id)));
            redisClient.quit(); // quit the Redis client when done
            rl.close();
          });
      });
}

chat('What do you like to do? ');