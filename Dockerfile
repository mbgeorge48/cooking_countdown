FROM node:18

RUN mkdir /app
WORKDIR /app

COPY package*.json /app/

# RUN npm install
# If you are building your code for production
RUN npm ci --omit=dev

COPY . /app


EXPOSE 3000
CMD [ "npm", "start" ]