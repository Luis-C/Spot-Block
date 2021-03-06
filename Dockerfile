From centos:7
#install apache
RUN yum -y install httpd
#install linux tools
RUN yum install -y wget
RUN yum install -y vim
RUN yum install -y git
RUN yum install -y cronie
#install nodejs
RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -
RUN yum install -y nodejs
#install modules
RUN npm install eosjs
RUN npm install express
RUN npm install cors
RUN npm install node-fetch
RUN npm install prom-client
RUN npm install -n -g @angular/cli
RUN npm install stream
#install nodeos
RUN wget https://github.com/EOSIO/eos/releases/download/v2.0.0/eosio-2.0.0-1.el7.x86_64.rpm
RUN yum -y install ./eosio-2.0.0-1.el7.x86_64.rpm
#Deploy compiled frontend to web-root
COPY /Spot-Block/dist/Spot-Block /var/www/html
#move contract to container
RUN mkdir contracts
COPY /Spot-Block/backend-blockchain/contracts /contracts
#copy scripts and make them executable
COPY /scripts /
COPY /Spot-Block/api.js /
RUN chmod +x start_up.sh
RUN chmod +x create_test_accounts.sh
RUN chmod +x tests.sh
RUN chmod +x finish.sh
RUN chmod +x expire.sh
#set cronjobs for every 2 hours
RUN echo "0 */2 * * * /expire.sh" >> /etc/crontab
RUN echo "0 */2 * * * /finish.sh" >> /etc/crontab
#make ports accessible
EXPOSE 80
EXPOSE 8888
EXPOSE 9090
#entrypoint is empty, will be set in docker-compose
ENTRYPOINT []
