FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY pages ./pages
COPY components ./components
COPY styles ./styles
COPY utils ./utils
COPY public ./public
COPY next.config.js .
COPY tailwind.config.js .
COPY postcss.config.js .

EXPOSE 3000

ENV NEXT_PUBLIC_API_URL=http://localhost:5000

RUN npm run build

CMD ["npm", "start"]
