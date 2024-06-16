FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY *.ts ./

# Install typescript
RUN npm install

# Start the app
CMD [ "npm", "run", "start" ]
