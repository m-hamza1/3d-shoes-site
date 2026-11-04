Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('H:\3D\images\00001.png')
$bmp = New-Object System.Drawing.Bitmap($img)
$p1 = $bmp.GetPixel(5, 5)
$p3 = $bmp.GetPixel($bmp.Width - 10, 10)
$p4 = $bmp.GetPixel(10, $bmp.Height - 10)
$mid = $bmp.GetPixel(5, [int]($bmp.Height / 2))
$w = $bmp.Width
$h = $bmp.Height
$img.Dispose()
$bmp.Dispose()
"Dimensions: $w x $h"
"Top-Left: R=$($p1.R) G=$($p1.G) B=$($p1.B) Hex: #{0:X2}{1:X2}{2:X2}" -f $p1.R, $p1.G, $p1.B
"Top-Right: R=$($p3.R) G=$($p3.G) B=$($p3.B) Hex: #{0:X2}{1:X2}{2:X2}" -f $p3.R, $p3.G, $p3.B
"Bottom-Left: R=$($p4.R) G=$($p4.G) B=$($p4.B) Hex: #{0:X2}{1:X2}{2:X2}" -f $p4.R, $p4.G, $p4.B
"Mid-Left: R=$($mid.R) G=$($mid.G) B=$($mid.B) Hex: #{0:X2}{1:X2}{2:X2}" -f $mid.R, $mid.G, $mid.B
