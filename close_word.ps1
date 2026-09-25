$procs = Get-Process winword -ErrorAction SilentlyContinue
if ($procs) {
    Write-Host "Found WINWORD processes, closing gracefully..."
    foreach ($p in $procs) {
        $p.CloseMainWindow()
    }
    Start-Sleep -Seconds 2
} else {
    Write-Host "No WINWORD running."
}
