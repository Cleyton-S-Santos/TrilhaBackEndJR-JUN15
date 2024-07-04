FROM node:20.11-slim

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g prisma
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
