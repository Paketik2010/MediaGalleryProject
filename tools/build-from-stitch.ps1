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

function Get-BodyParts([string]$html) {
  $body = [regex]::Match($html, '<body([^>]*)>([\s\S]*?)</body>', 'IgnoreCase')
  if (-not $body.Success) { throw "Body not found" }
  $attrs = $body.Groups[1].Value
  $class = [regex]::Match($attrs, 'class="([^"]*)"', 'IgnoreCase').Groups[1].Value
  [pscustomobject]@{
    Class = $class
    Inner = $body.Groups[2].Value
  }
}

foreach ($page in $pages) {
  $desktopFile = Join-Path $stitchPath ($page.desktop + "\code.html")
  $mobileFile = Join-Path $stitchPath ($page.mobile + "\code.html")

  $desktopHtml = Get-Content -LiteralPath $desktopFile -Raw -Encoding UTF8
  $mobileHtml = Get-Content -LiteralPath $mobileFile -Raw -Encoding UTF8

  $desktopHead = [regex]::Match($desktopHtml, '<head>([\s\S]*?)</head>', 'IgnoreCase').Groups[1].Value
  $mobileHead = [regex]::Match($mobileHtml, '<head>([\s\S]*?)</head>', 'IgnoreCase').Groups[1].Value

  $mobileStyles = ""
  [regex]::Matches($mobileHead, '<style[^>]*>([\s\S]*?)</style>', 'IgnoreCase') | ForEach-Object {
    $mobileStyles += '<style media="(max-width: 680px)">' + $_.Groups[1].Value + '</style>'
  }

  $desktopBody = Get-BodyParts $desktopHtml
  $mobileBody = Get-BodyParts $mobileHtml

  $document = '<!DOCTYPE html><html lang="ru"><head>' +
    '<script>document.documentElement.classList.add("mg-preinit");</script>' +
    '<style>html.mg-preinit .stitch-desktop-view,html.mg-preinit .stitch-mobile-view{visibility:hidden!important}</style>' +
    $desktopHead +
    $mobileStyles +
    '<link rel="stylesheet" href="' + $page.assetBase + '/css/stitch-merge.css">' +
    '<link rel="stylesheet" href="' + $page.assetBase + '/css/unified-cards.css">' +
    '<link rel="stylesheet" href="' + $page.assetBase + '/css/unified-filters.css">' +
    '<link rel="stylesheet" href="' + $page.assetBase + '/css/brand.css">' +
    '</head><body class="' + $desktopBody.Class + '">' +
    '<div class="stitch-desktop-view ' + $desktopBody.Class + '">' + $desktopBody.Inner + '</div>' +
    '<div class="stitch-mobile-view ' + $mobileBody.Class + '">' + $mobileBody.Inner + '</div>' +
    '<script src="' + $page.assetBase + '/js/route-adapter.js?v=7"></script>' +
    '<script src="' + $page.assetBase + '/js/brand-normalizer.js?v=7"></script>' +
    '<script src="' + $page.assetBase + '/js/card-normalizer.js?v=11"></script>' +
    '<script src="' + $page.assetBase + '/js/section-variant.js?v=7"></script>' +
    '<script src="' + $page.assetBase + '/js/detail-variant.js?v=7"></script>' +
    '<script src="' + $page.assetBase + '/js/search-behavior.js?v=9"></script>' +
    '<script src="' + $page.assetBase + '/js/filter-normalizer.js?v=13"></script>' +
    '<script>document.documentElement.classList.remove("mg-preinit");</script>' +
    '</body></html>'

  $document = $document.Replace('2024', '2026').Replace('2025', '2026')

  if ($page.output -in @('pages/images.html','pages/videos.html','pages/audio.html')) {
    $oldSubtitleClass = 'class="font-body-md text-body-md text-on-surface-variant mt-1"'
    $newSubtitleClass = 'class="font-body-lg text-body-lg text-on-surface-variant mt-1" style="font-size:16px!important;line-height:24px!important;font-weight:400!important"'
    $index = $document.IndexOf($oldSubtitleClass)
    if ($index -ge 0) {
      $document = $document.Substring(0, $index) + $newSubtitleClass + $document.Substring($index + $oldSubtitleClass.Length)
    }
  }

  $target = Join-Path $outputPath $page.output
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
  Set-Content -LiteralPath $target -Value $document -Encoding UTF8
  Write-Host ("Built {0} <- {1} + {2}" -f $page.output, $page.desktop, $page.mobile)
}
