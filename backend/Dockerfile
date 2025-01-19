FROM node:22.7.0

WORKDIR /server

COPY package*.json ./

RUN if [ "$NODE_ENV" = "production" ]; then \
      npm install --only=production; \
    else \
      npm install; \
    fi

COPY . .

EXPOSE 3000

CMD npx prisma generate && npx prisma migrate dev && npm run start:dev& npx prisma studio