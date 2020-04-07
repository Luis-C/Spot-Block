From centos:7
RUN yum -y install httpd
RUN yum install -y wget
RUN yum install -y vim
RUN yum install -y git
RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -
RUN yum install -y nodejs
RUN npm install eosjs
RUN npm install express
RUN npm install cors
RUN npm install node-fetch
RUN npm install prom-client
RUN npm install -n -g @angular/cli
RUN npm install stream
RUN wget https://github.com/EOSIO/eos/releases/download/v2.0.0/eosio-2.0.0-1.el7.x86_64.rpm
RUN yum -y install ./eosio-2.0.0-1.el7.x86_64.rpm
COPY /Spot-Block/dist/Spot-Block /var/www/html
#temp
RUN mkdir code
COPY /Spot-Block /code
#COPY /Spot-Block /var/www/html
RUN mkdir contracts
COPY /Spot-Block/backend-blockchain/contracts /contracts
COPY /scripts /
COPY /Spot-Block/api.js /
RUN chmod +x start_up.sh
RUN chmod +x create_test_accounts.sh
RUN chmod +x tests.sh
RUN chmod +x finish.sh
EXPOSE 80
EXPOSE 8888
EXPOSE 9090
ENTRYPOINT []
#CMD ["/bin/bash"]
##
#CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]
