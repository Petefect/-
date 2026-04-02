# setup-claude-proxy.ps1
# 自动为 Claude Code 配置代理，解决中国大陆无法连接 api.anthropic.com 的问题

Write-Host "=== Claude Code 代理配置工具 ===" -ForegroundColor Cyan
Write-Host ""

# 显示当前代理状态
$currentProxy = [System.Environment]::GetEnvironmentVariable("HTTPS_PROXY", "User")
if ($currentProxy) {
    Write-Host "当前系统代理: $currentProxy" -ForegroundColor Yellow
} else {
    Write-Host "当前未设置系统代理" -ForegroundColor Yellow
}
Write-Host ""

# 获取用户输入
$defaultProxy = "127.0.0.1:7890"
$input = Read-Host "请输入代理地址和端口（直接回车使用默认值 $defaultProxy）"
if ([string]::IsNullOrWhiteSpace($input)) {
    $proxyHost = $defaultProxy
} else {
    $proxyHost = $input.Trim()
}

$proxyUrl = "http://$proxyHost"
Write-Host ""
Write-Host "将使用代理: $proxyUrl" -ForegroundColor Green

# 1. 为当前会话设置环境变量
$env:HTTP_PROXY = $proxyUrl
$env:HTTPS_PROXY = $proxyUrl
$env:NO_PROXY = "localhost,127.0.0.1"
Write-Host "[OK] 已为当前会话设置环境变量" -ForegroundColor Green

# 2. 为当前用户永久设置环境变量
[System.Environment]::SetEnvironmentVariable("HTTP_PROXY", $proxyUrl, "User")
[System.Environment]::SetEnvironmentVariable("HTTPS_PROXY", $proxyUrl, "User")
[System.Environment]::SetEnvironmentVariable("NO_PROXY", "localhost,127.0.0.1", "User")
Write-Host "[OK] 已为当前用户永久设置环境变量" -ForegroundColor Green

# 3. 通过 claude config 设置代理
try {
    $claudeExists = Get-Command claude -ErrorAction SilentlyContinue
    if ($claudeExists) {
        claude config set --global httpProxy $proxyUrl 2>$null
        claude config set --global httpsProxy $proxyUrl 2>$null
        Write-Host "[OK] 已通过 claude config 设置全局代理" -ForegroundColor Green
    } else {
        Write-Host "[跳过] 未找到 claude 命令，跳过 claude config 配置" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[跳过] claude config 配置失败: $_" -ForegroundColor Yellow
}

# 4. 可选：写入 PowerShell Profile 实现持久化
Write-Host ""
$addToProfile = Read-Host "是否将代理设置写入 PowerShell Profile 以便每次启动自动生效？(y/N)"
if ($addToProfile -eq 'y' -or $addToProfile -eq 'Y') {
    $profileContent = @"

# Claude Code 代理设置 (由 setup-claude-proxy.ps1 添加)
`$env:HTTP_PROXY = "$proxyUrl"
`$env:HTTPS_PROXY = "$proxyUrl"
`$env:NO_PROXY = "localhost,127.0.0.1"
"@
    if (!(Test-Path $PROFILE)) {
        New-Item -ItemType File -Path $PROFILE -Force | Out-Null
    }
    Add-Content -Path $PROFILE -Value $profileContent
    Write-Host "[OK] 已写入 PowerShell Profile: $PROFILE" -ForegroundColor Green
}

# 5. 测试连接
Write-Host ""
Write-Host "正在测试代理连接..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://api.anthropic.com" -Proxy $proxyUrl -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "[成功] 可以通过代理访问 api.anthropic.com (HTTP $($response.StatusCode))" -ForegroundColor Green
} catch {
    $errMsg = $_.Exception.Message
    # 401/403 表示能连上但需要认证，说明代理工作正常
    if ($errMsg -match "401|403|Unauthorized|Forbidden") {
        Write-Host "[成功] 代理工作正常，可以访问 api.anthropic.com（需要 API Key 认证）" -ForegroundColor Green
    } elseif ($errMsg -match "407") {
        Write-Host "[失败] 代理需要认证 (407)，请检查代理账号密码" -ForegroundColor Red
    } else {
        Write-Host "[警告] 连接测试失败: $errMsg" -ForegroundColor Red
        Write-Host "  请确认代理程序正在运行，端口是否正确" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== 配置完成 ===" -ForegroundColor Cyan
Write-Host "请重新打开 PowerShell 或在当前窗口运行 claude，确认是否可以正常连接。" -ForegroundColor White
Write-Host "若仍无法连接，请确认您的代理软件（如 Clash、V2Ray 等）正在运行。" -ForegroundColor White
