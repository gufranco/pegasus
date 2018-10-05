# LATEST LTS release
FROM node:10-alpine

# Copy project, define workdir
RUN mkdir -p /opt/app
COPY . /opt/app
WORKDIR /opt/app

# Updates, uprades
RUN apk update && \
    apk upgrade --no-cache

# Timezone (Default: GMT)
# ENV TZ=America/Sao_Paulo
RUN apk add --no-cache --update ca-certificates tzdata && \
    update-ca-certificates

# Project
RUN yarn global add pm2 --ignore-optional && \
    yarn install --production --ignore-optional

# Clean up
RUN rm -rf ~/* /var/cache/* /tmp/*

# Expose port
EXPOSE 80

# Start your engine! <3
CMD ["pm2-docker", "ecosystem.config.js"]
