# pegasus

## Start development environment
```bash
mkdir -p ~/Workspace/mongodb/pegasus

sudo docker run \
  --env "MONGO_INITDB_ROOT_USERNAME=pegasus" \
  --env "MONGO_INITDB_ROOT_PASSWORD=pegasusPassword" \
  -v $HOME/Workspace/mongodb/pegasus:/data/db \
  --restart unless-stopped \
  --name mongodb_pegasus \
  --publish 27017:27017 \
  -d mongo:latest

EXPRESS_PORT=8080 \
MONGODB_USERNAME=pegasus \
MONGODB_PASSWORD=pegasusPassword \
MONGODB_HOST=localhost \
MONGODB_PORT=27017 \
MONGODB_DATABASE=pegasus_development \
MONGODB_AUTH_DATABASE=admin \
SALT_WORK_FACTOR=10 \
node app.js
```

## Run tests
```bash
EXPRESS_PORT=8080 \
MONGODB_USERNAME=pegasus \
MONGODB_PASSWORD=pegasusPassword \
MONGODB_HOST=localhost \
MONGODB_PORT=27017 \
MONGODB_DATABASE=pegasus_development \
MONGODB_AUTH_DATABASE=admin \
SALT_WORK_FACTOR=10 \
yarn run test
```
