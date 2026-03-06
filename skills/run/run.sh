#!/bin/bash

# 检查node_modules目录是否存在
if [ ! -d "node_modules" ]; then
    echo "依赖未安装，正在执行安装..."
    npm install
fi

# 启动项目
npm run start
