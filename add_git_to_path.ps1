$gitPath = "C:\Program Files\Git\cmd"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

if ($currentPath -notmatch [regex]::Escape($gitPath)) {
    $newPath = $currentPath + ";" + $gitPath
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    Write-Host "Git added to Machine PATH."
} else {
    Write-Host "Git is already in Machine PATH."
}

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notmatch [regex]::Escape($gitPath)) {
    $newUserPath = $userPath + ";" + $gitPath
    [Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
    Write-Host "Git added to User PATH."
} else {
    Write-Host "Git is already in User PATH."
}
