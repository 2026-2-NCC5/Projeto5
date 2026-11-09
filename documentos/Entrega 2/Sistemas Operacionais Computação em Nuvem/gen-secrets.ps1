# Gera segredos aleatórios, certificado TLS autoassinado e htpasswd do painel. Não sobrescreve existentes.
# Uso:  powershell -ExecutionPolicy Bypass -File scripts/gen-secrets.ps1 [-GeminiKey "AIza..."]
param([string]$GeminiKey = "")
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$sec = Join-Path $root "secrets"; New-Item -ItemType Directory -Force $sec | Out-Null
function New-Secret([int]$bytes = 32) { $b = New-Object byte[] ($bytes * 2); $rng = [Security.Cryptography.RandomNumberGenerator]::Create(); $rng.GetBytes($b); $s = ([Convert]::ToBase64String($b) -replace '[+/=]', ''); $s.Substring(0, [Math]::Min($bytes, $s.Length)) }
function Write-Once($name, $value) { $p = Join-Path $sec $name; if (-not (Test-Path $p)) { [IO.File]::WriteAllText($p, $value); Write-Host "criado  secrets/$name" } else { Write-Host "mantido secrets/$name" } }
Write-Once "db_password.txt" (New-Secret 32)
Write-Once "jwt_secret.txt" (New-Secret 48)
Write-Once "document_signing_secret.txt" (New-Secret 48)
Write-Once "grafana_admin_password.txt" (New-Secret 24)
Write-Once "gemini_api_key.txt" $(if ($GeminiKey) { $GeminiKey } else { "NAO_CONFIGURADA" })
$monPass = New-Secret 18
$certDir = Join-Path $root "infra/nginx/certs"; New-Item -ItemType Directory -Force $certDir | Out-Null
$ErrorActionPreference = "Continue"; $openssl = (Get-Command openssl -ErrorAction SilentlyContinue).Source
if (-not $openssl) { $openssl = "C:\Program Files\Git\usr\bin\openssl.exe" }
if (-not (Test-Path (Join-Path $certDir "server.crt"))) {
  & $openssl req -x509 -nodes -newkey rsa:2048 -days 365 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" -keyout (Join-Path $certDir "server.key") -out (Join-Path $certDir "server.crt") 2>$null
  Write-Host "criado  certificado TLS autoassinado (troque por Let's Encrypt em produção)"
}
$ht = Join-Path $root "infra/nginx/htpasswd"
if (-not (Test-Path $ht)) {
  $hash = & $openssl passwd -apr1 $monPass
  [IO.File]::WriteAllText($ht, "monitor:$hash`n")
  [IO.File]::WriteAllText((Join-Path $sec "monitor_basic_auth.txt"), "usuario=monitor`nsenha=$monPass`n")
  Write-Host "criado  htpasswd (credenciais em secrets/monitor_basic_auth.txt)"
}
Write-Host "`nOK. A pasta secrets/ está no .gitignore e NUNCA deve ser versionada."
