#!/bin/bash
cleos push action spotblock expire '['$(date +%m)'/'$(date +%e)'@'$(date +%H)-2']'
