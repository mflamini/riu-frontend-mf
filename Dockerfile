FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx ng build RIU-Frontend-MF --configuration production || \
    npx ng build RIU-Frontend-MF --aot=false --optimization=false

FROM nginx:alpine

COPY --from=build /app/dist/riu-frontend-mf/browser/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]