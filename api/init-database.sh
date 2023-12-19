#!/bin/bash
echo 'creating database...'
psql -c "CREATE DATABASE uber;"
echo 'database creation successful!'
echo 'starting restore dump process...'
psql -U postgres uber < ./uber.sql
echo 'dump restored successfully...'
