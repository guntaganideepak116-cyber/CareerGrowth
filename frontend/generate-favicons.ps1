Add-Type -AssemblyName System.Drawing

$publicDir = "c:\Users\DELL\OneDrive\Desktop\Career Growth\frontend\public"

function Make-Icon {
    param([int]$Size)

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode    = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode  = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $s = $Size / 512.0
    $r = [int]($Size * 0.19)

    # Rounded rect path for background
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, ($r*2), ($r*2), 180, 90)
    $path.AddArc(($Size-$r*2), 0, ($r*2), ($r*2), 270, 90)
    $path.AddArc(($Size-$r*2), ($Size-$r*2), ($r*2), ($r*2), 0, 90)
    $path.AddArc(0, ($Size-$r*2), ($r*2), ($r*2), 90, 90)
    $path.CloseFigure()

    # Gradient background
    $c1 = [System.Drawing.ColorTranslator]::FromHtml("#0F766E")
    $c2 = [System.Drawing.ColorTranslator]::FromHtml("#059669")
    $gb = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($Size, $Size)),
        $c1, $c2
    )
    $g.FillPath($gb, $path)
    $g.SetClip($path)

    # Bars: x, y, w, h, alpha (0-255)
    $bars = @(80,340,72,172,76),(178,280,72,232,115),(276,210,72,302,153)
    foreach ($b in $bars) {
        $bx=[int]($b[0]*$s); $by=[int]($b[1]*$s); $bw=[int]($b[2]*$s); $bh=[int]($b[3]*$s)
        if ($bw -gt 0 -and $bh -gt 0) {
            $br2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($b[4],255,255,255))
            $g.FillRectangle($br2, $bx, $by, $bw, $bh)
            $br2.Dispose()
        }
    }

    # Trend line points
    $pts = @(
        (New-Object System.Drawing.PointF([float](90*$s),  [float](390*$s))),
        (New-Object System.Drawing.PointF([float](200*$s), [float](285*$s))),
        (New-Object System.Drawing.PointF([float](295*$s), [float](325*$s))),
        (New-Object System.Drawing.PointF([float](415*$s), [float](160*$s)))
    )
    $lw = [Math]::Max(2, [int](13*$s))
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(242,255,255,255), $lw)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $g.DrawLines($pen, $pts)

    # Arrowhead
    $tip  = $pts[3]
    $prev = $pts[2]
    $ang  = [Math]::Atan2(($tip.Y - $prev.Y), ($tip.X - $prev.X))
    $al   = 40*$s
    $aa   = [Math]::PI / 5.5
    $apen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, $lw)
    $apen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $apen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round
    $w1 = New-Object System.Drawing.PointF(($tip.X - $al*[Math]::Cos($ang-$aa)), ($tip.Y - $al*[Math]::Sin($ang-$aa)))
    $w2 = New-Object System.Drawing.PointF(($tip.X - $al*[Math]::Cos($ang+$aa)), ($tip.Y - $al*[Math]::Sin($ang+$aa)))
    $g.DrawLine($apen, $tip, $w1)
    $g.DrawLine($apen, $tip, $w2)

    # Accent dots
    $dots = @(90,390,9,180),(200,285,9,180),(295,325,11,230)
    foreach ($d in $dots) {
        $dx=[float]($d[0]*$s); $dy=[float]($d[1]*$s); $dr=[float]($d[2]*$s)
        $db = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($d[3],255,255,255))
        $g.FillEllipse($db, ($dx-$dr), ($dy-$dr), ($dr*2), ($dr*2))
        $db.Dispose()
    }

    $g.Dispose(); $gb.Dispose(); $pen.Dispose(); $apen.Dispose()
    return $bmp
}

Write-Host "`n🎨 Generating CareerGrowth favicons..." -ForegroundColor Cyan

$files = @(
    @{Name="favicon-16x16.png";       Size=16},
    @{Name="favicon-32x32.png";       Size=32},
    @{Name="apple-touch-icon.png";    Size=180},
    @{Name="android-chrome-192x192.png"; Size=192},
    @{Name="android-chrome-512x512.png"; Size=512},
    @{Name="favicon.ico";             Size=32}
)

foreach ($f in $files) {
    $bmp = Make-Icon -Size $f.Size
    $out = Join-Path $publicDir $f.Name
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "  ✅ $($f.Name) ($($f.Size)x$($f.Size))" -ForegroundColor Green
}

Write-Host "`n🎉 All favicon files generated!" -ForegroundColor Cyan
Get-ChildItem $publicDir | Where-Object { $_.Name -match "favicon|apple|android|manifest" } | Format-Table Name, @{L='Size(KB)';E={[Math]::Round($_.Length/1KB,1)}} -AutoSize
