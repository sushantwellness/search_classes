const redis = require('redis');
const client = redis.createClient({
    url: `redis://default:@localhost:6379`
});
client.del('classes_vector', (err, res) => {
    if (err) throw err;
    console.log(`Deleted ${res} keys`);
  });
const vectors = require('./classes_embedding.json');

const multi = client.multi();
// Store the embedding vectors in a Redis Sorted Set
for (let i = 0; i < vectors.length; i++) {
  multi.zadd('classes_vector', vectors[i].embeddings.index , JSON.stringify({
    title: vectors[i].name,
    id: vectors[i].id,
    embeddings: vectors[i].embeddings.embedding,
  }));
}

multi.exec(() => {
  console.log('Data Updated');
})