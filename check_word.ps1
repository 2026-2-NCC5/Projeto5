try {
    $word = [Runtime.InteropServices.Marshal]::GetActiveObject("Word.Application")
    Write-Host "Word application found!"
    foreach ($doc in $word.Documents) {
        Write-Host "Doc Name: $($doc.Name) | FullName: $($doc.FullName)"
    }
} catch {
    Write-Host "Error accessing Word COM: $($_.Exception.Message)"
}
