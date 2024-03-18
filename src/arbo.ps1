function Get-FolderStructure {
    param(
        [string]$FolderPath
    )

    $items = Get-ChildItem -Path $FolderPath

    foreach ($item in $items) {
        if ($item -is [System.IO.DirectoryInfo]) {
            Write-Output "Folder: $($item.FullName)"
            Get-FolderStructure -FolderPath $item.FullName
        }
        else {
            Write-Output "File: $($item.FullName)"
        }
    }
}

# Obtenir le chemin du dossier actuel
$currentFolderPath = (Get-Location).Path

# Utilisation : spécifier le chemin du dossier actuel pour obtenir sa structure
Get-FolderStructure -FolderPath $currentFolderPath
