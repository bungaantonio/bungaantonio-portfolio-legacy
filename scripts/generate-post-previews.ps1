param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$PostDir,

    [int]$MaxWidth = 1440,

    [ValidateRange(1, 100)]
    [int]$Quality = 88,

    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

function Resolve-ProjectPath {
    param([string]$PathValue)

    if ([System.IO.Path]::IsPathRooted($PathValue)) {
        return [System.IO.Path]::GetFullPath($PathValue)
    }

    return [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $PathValue))
}

function Get-JpegCodec {
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq 'image/jpeg' } |
        Select-Object -First 1

    if (-not $codec) {
        throw 'Codec JPEG não encontrado no sistema.'
    }

    return $codec
}

function New-EncoderParameters {
    param([int]$JpegQuality)

    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $parameters = New-Object System.Drawing.Imaging.EncoderParameters 1
    $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]$JpegQuality)
    return $parameters
}

function New-PreviewImage {
    param(
        [string]$SourceFile,
        [string]$TargetFile,
        [int]$PreviewWidth,
        [int]$JpegQuality,
        [switch]$Overwrite
    )

    if ((Test-Path -LiteralPath $TargetFile) -and -not $Overwrite) {
        Write-Host "Ignorado (já existe): $TargetFile"
        return
    }

    $sourceImage = [System.Drawing.Image]::FromFile($SourceFile)

    try {
        if ($sourceImage.Width -le $PreviewWidth) {
            $newWidth = $sourceImage.Width
            $newHeight = $sourceImage.Height
        }
        else {
            $ratio = $PreviewWidth / $sourceImage.Width
            $newWidth = [int][Math]::Round($sourceImage.Width * $ratio)
            $newHeight = [int][Math]::Round($sourceImage.Height * $ratio)
        }

        $bitmap = New-Object System.Drawing.Bitmap $newWidth, $newHeight

        try {
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            try {
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $graphics.DrawImage($sourceImage, 0, 0, $newWidth, $newHeight)

                $codec = Get-JpegCodec
                $encoderParameters = New-EncoderParameters -JpegQuality $JpegQuality
                try {
                    $bitmap.Save($TargetFile, $codec, $encoderParameters)
                }
                finally {
                    $encoderParameters.Dispose()
                }
            }
            finally {
                $graphics.Dispose()
            }
        }
        finally {
            $bitmap.Dispose()
        }
    }
    finally {
        $sourceImage.Dispose()
    }

    Write-Host "Preview gerado: $TargetFile"
}

$resolvedPostDir = Resolve-ProjectPath -PathValue $PostDir

if (-not (Test-Path -LiteralPath $resolvedPostDir)) {
    throw "Pasta do post não encontrada: $resolvedPostDir"
}

$imageFiles = Get-ChildItem -LiteralPath $resolvedPostDir -File |
    Where-Object {
        $_.Extension -match '^\.(png|jpg|jpeg)$' -and
        $_.BaseName -notlike '*-preview'
    }

if (-not $imageFiles) {
    Write-Host "Nenhuma imagem PNG/JPG encontrada em: $resolvedPostDir"
    exit 0
}

foreach ($image in $imageFiles) {
    $targetFile = Join-Path $image.DirectoryName ($image.BaseName + '-preview.jpg')
    New-PreviewImage `
        -SourceFile $image.FullName `
        -TargetFile $targetFile `
        -PreviewWidth $MaxWidth `
        -JpegQuality $Quality `
        -Overwrite:$Force
}

Write-Host ''
Write-Host 'Como usar no markdown:'
Write-Host '  [![Legenda](./imagem-preview.jpg)](./imagem-original.png)'
