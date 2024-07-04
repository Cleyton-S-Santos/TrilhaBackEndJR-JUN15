FROM node:20.11-slim

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g prisma
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
