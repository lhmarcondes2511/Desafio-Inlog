FROM node:18

WORKDIR /app

# Accept build-time variables for CRA
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_USE_MIRAGE

# Expose them as environment variables during build so react-scripts can read them
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
ENV REACT_APP_USE_MIRAGE=${REACT_APP_USE_MIRAGE}

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
