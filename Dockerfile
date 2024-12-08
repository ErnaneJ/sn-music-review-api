FROM node:22.7.0

WORKDIR /server

COPY package*.json ./

RUN if [ "$NODE_ENV" = "production" ]; then \
      npm install --only=production; \
    else \
      npm install; \
    fi

COPY . .

RUN npx prisma generate
RUN npx prisma migrate dev

EXPOSE 3000

RUN echo "Running in $NODE_ENV mode..."

CMD if [ "$NODE_ENV" = "production" ]; then \
      npm run start; \
    else \
      npm run start:dev& npx prisma studio; \
    fi
