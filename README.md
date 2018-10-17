# pegasus

## Start development environment
```bash
mkdir -p ~/Workspace/Databases/MongoDB

docker run \
  --name mongodb \
  --restart unless-stopped \
  --env "MONGO_INITDB_ROOT_USERNAME=root" \
  --env "MONGO_INITDB_ROOT_PASSWORD=root" \
  -v $HOME/Workspace/Databases/mongodb:/data/db \
  --publish 27017:27017 \
  -d mongo:4-xenial

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
