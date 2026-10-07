param(
  [string]$StitchRoot = "..\..\stitch_mediagallery_ui_design_system",
  [string]$OutputRoot = "..\src"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$mapPath = Join-Path $projectRoot "config\stitch-pages.json"
$stitchPath = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot $StitchRoot))
$outputPath = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot $OutputRoot))
$pages = Get-Content -LiteralPath $mapPath -Raw -Encoding UTF8 | ConvertFrom-Json

function Get-BodyInner([string]$html) {
  $match = [regex]::Match($html, '<body[^>]*>([\s\S]*?)</body>', 'IgnoreCase')
  if (-not $match.Success) { throw "Body not found" }
  return $match.Groups[1].Value
}

function Get-Hash([string]$text) {
  $bytes = [Text.Encoding]::UTF8.GetBytes($text)
  $hash = [Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
  return [BitConverter]::ToString($hash).Replace("-", "").Substring(0, 12)
}

$results = foreach ($page in $pages) {
  $desktopSource = Get-Content -LiteralPath (Join-Path $stitchPath ($page.desktop + "\code.html")) -Raw -Encoding UTF8
  $mobileSource = Get-Content -LiteralPath (Join-Path $stitchPath ($page.mobile + "\code.html")) -Raw -Encoding UTF8
  $built = Get-Content -LiteralPath (Join-Path $outputPath $page.output) -Raw -Encoding UTF8

  $desktopInner = Get-BodyInner $desktopSource
  $mobileInner = Get-BodyInner $mobileSource

  $desktopBuiltMatch = [regex]::Match(
    $built,
    '<div class="stitch-desktop-view[^"]*">([\s\S]*?)</div><div class="stitch-mobile-view',
    'IgnoreCase'
  )

  $mobileBuiltMatch = [regex]::Match(
    $built,
    '<div class="stitch-mobile-view[^"]*">([\s\S]*?)</div><script src="[^"]*route-adapter\.js"></script><script src="[^"]*brand-normalizer\.js"></script><script src="[^"]*card-normalizer\.js"></script><script src="[^"]*section-variant\.js"></script><script src="[^"]*detail-variant\.js"></script><script src="[^"]*search-behavior\.js\?v=3"></script><script src="[^"]*filter-normalizer\.js"></script>',
    'IgnoreCase'
  )

  $desktopBuilt = $desktopBuiltMatch.Groups[1].Value
  $mobileBuilt = $mobileBuiltMatch.Groups[1].Value

  [pscustomobject]@{
    Page = $page.label
    DesktopExact = (Get-Hash $desktopInner) -eq (Get-Hash $desktopBuilt)
    MobileExact = (Get-Hash $mobileInner) -eq (Get-Hash $mobileBuilt)
    DesktopHash = Get-Hash $desktopInner
    MobileHash = Get-Hash $mobileInner
  }
}

$results | Format-Table -AutoSize

if ($results.DesktopExact -contains $false -or $results.MobileExact -contains $false) {
  exit 2
}
