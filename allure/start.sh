#!/bin/bash
IP=$(ifconfig | grep inet | grep -v "127.0.0.1"  | grep -v inet6 | grep -v "\-\-" | grep 10.6 |  awk '{print $2}')
echo $IP
docker-compose up -d