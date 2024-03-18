# Compter le nombre de fichiers .ts et .tsx dans votre projet
$totalLines = 0
Get-ChildItem -Path src -Recurse | Where-Object { $_.Extension -eq ".ts" -or $_.Extension -eq ".tsx" } | ForEach-Object {
    $lines = Get-Content $_.FullName | Measure-Object -Line | Select-Object -ExpandProperty Lines
    $totalLines += $lines
}

Write-Output "Nombre total de lignes de code TypeScript : $totalLines"
