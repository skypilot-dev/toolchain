#!/usr/bin/env bash
INIT_CWD=$(PWD) npm_config_user_agent=$(yarn config get user-agent) node node_modules/husky/husky.js install
