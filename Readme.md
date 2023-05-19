# Requirements

1. Redis - Install Redis (Redis)[https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/]
2. Node - 


# Setup Open AI Key
1. run command
` export OPEN_API_KEY={{YOUR KEY}} `
2. run comamnd 
`npm install`


# Push Data to redis
1. Run command 
`node redis_save_embeddings.js`
2. This will push already prepared data (classes_embedding.json) to redis


# If you want to prepare data for new classes data
1. Prepare json data as in classData.json
2. run command 
` node index.js `
3. this is prepeare you data which is ready to push to redis


# For Content searching
1. Run `node seaerch.js`
2. Start searching content
