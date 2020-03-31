From centos:7
RUN yum -y install httpd
#COPY /Spot-Block/dist/Spot-Block /var/www/html
COPY /Spot-Block /var/www/html
COPY /Spot-Block/backend-blockchain/ /var/www/
COPY /scripts /
RUN chmod +x start_up.sh
##for testing
RUN yum install -y wget
RUN yum install -y vim
RUN yum install -y git
RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -
RUN yum install -y nodejs
RUN npm install eosjs
RUN npm install express
RUN npm install node-fetch
RUN npm install -n -g @angular/cli 
RUN npm install stream
RUN wget https://github.com/EOSIO/eos/releases/download/v2.0.0/eosio-2.0.0-1.el7.x86_64.rpm
RUN yum -y install ./eosio-2.0.0-1.el7.x86_64.rpm
EXPOSE 80
EXPOSE 8888
EXPOSE 9090
CMD ["/bin/bash"]
##
#CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]
