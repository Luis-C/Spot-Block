#!/bin/bash
cleos push action spotblock finish '['$(date +%m)'/'$(date +%e)'@'$(date +%H)-2']'
