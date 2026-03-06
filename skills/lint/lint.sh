#!/bin/bash

# 创建报告目录
mkdir -p skills/lint/reports

# 报告文件路径
report_file="skills/lint/reports/lint-report.html"

echo "🧹 检查代码质量..."

# 执行eslint检查并生成HTML报告
npm run lint -- --format html > "$report_file"

# 执行eslint检查并获取JSON格式输出，用于统计错误和警告数量
lint_output=$(npm run lint -- --format json 2>&1)

# 提取错误和警告数量
error_count=$(echo "$lint_output" | grep -o '"errorCount":[0-9]*' | head -1 | grep -o '[0-9]*')
warning_count=$(echo "$lint_output" | grep -o '"warningCount":[0-9]*' | head -1 | grep -o '[0-9]*')

# 确保错误和警告数量为数字，如果提取失败则设为0
if [[ ! "$error_count" =~ ^[0-9]+$ ]]; then
    error_count=0
fi
if [[ ! "$warning_count" =~ ^[0-9]+$ ]]; then
    warning_count=0
fi

# 简约输出
echo ""
echo "📊 代码质量报告"
echo "-----------------"
echo "错误: $error_count"
echo "警告: $warning_count"
echo "-----------------"

if [ "$error_count" -eq 0 ] && [ "$warning_count" -eq 0 ]; then
    echo "🎉 通过！"
elif [ "$error_count" -eq 0 ]; then
    echo "⚠️  基本通过（有警告）"
else
    echo "❌ 未通过（有错误）"
fi

echo ""
echo "📄 报告: $report_file"

# 打开报告文件
if command -v open &> /dev/null; then
    open "$report_file"
elif command -v xdg-open &> /dev/null; then
    xdg-open "$report_file"
elif command -v start &> /dev/null; then
    start "$report_file"
else
    echo "💡 请手动打开报告文件"
fi
