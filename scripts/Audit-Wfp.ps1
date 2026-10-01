param([Parameter(Mandatory=$true)][string[]]$ManifestPath)
$ErrorActionPreference='Stop'
Set-StrictMode -Version Latest
if([IntPtr]::Size -ne 8){throw 'Requires 64-bit Windows PowerShell.'}
Add-Type -Path (Join-Path $PSScriptRoot '../src/StrictWfpAudit.cs')
$results=@()
$controls=@()
$index=0
foreach($file in $ManifestPath){
    $manifest=Get-Content -LiteralPath $file -Raw|ConvertFrom-Json
    foreach($rule in $manifest.Rules){
        $port=[uint16]$rule.Port
        $result=[StrictWfpAudit]::Verify([string]$rule.Path,$port)
        $results += [ordered]@{Index=$index++;Status=$result}
        if($port -gt 0 -and $result -eq 'PASS'){
            $wrong=if($port -eq 65535){1}else{$port+1}
            $controls += [StrictWfpAudit]::Verify([string]$rule.Path,[uint16]$wrong) -eq 'FAIL:port-conditions'
        }
    }
}
$ok=$results.Count -gt 0 -and @($results|Where-Object {$_.Status -ne 'PASS'}).Count -eq 0 -and @($controls|Where-Object {-not $_}).Count -eq 0
[ordered]@{
    Schema=1;CheckedUtc=[DateTimeOffset]::UtcNow.ToString('o');Mode='LocalReadOnly';
    Status=$(if($ok){'PASS'}else{'FAIL'});Rules=$results;
    WrongPortControlCount=$controls.Count;
    WrongPortControlStatus=$(if(-not $controls.Count){'UNVERIFIED'}elseif(@($controls|Where-Object {-not $_}).Count){'FAIL'}else{'PASS'});
    ExternalProbes=0;Limit='Rule inspection only; no traffic, account or workflow assurance'
}|ConvertTo-Json -Depth 6
if(-not $ok){exit 1}
if(-not $controls.Count){exit 2}
