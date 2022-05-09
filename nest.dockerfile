FROM node:lts
COPY ./maria-tereza-api /var/www
WORKDIR /var/www
RUN npm install 
RUN npm run build 
ENTRYPOINT ["npm","run", "start:prod"]
EXPOSE 3000
