const fs = require('fs');

// Simple PNG chunk reader to check dimensions and data or we can sample via node
const { execSync } = require('child_process');

try {
  const psScript = `
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('H:\\\\3D\\\\images\\\\00001.png')
$bmp = New-Object System.Drawing.Bitmap($img)
$p1 = $bmp.GetPixel(5, 5)
$p2 = $bmp.GetPixel(10, 10)
$p3 = $bmp.GetPixel($bmp.Width - 10, 10)
$p4 = $bmp.GetPixel(10, $bmp.Height - 10)
$img.Dispose()
$bmp.Dispose()
Write-Output "$($p1.R),$($p1.G),$($p1.B) | $($p2.R),$($p2.G),$($p2.B) | $($p3.R),$($p3.G),$($p3.B)"
`;
  const res = execSync(`powershell -Command "${psScript.replace(/\n/g, ' ')}"`).toString();
  console.log('Colors:', res);
} catch (e) {
  console.error(e.message);
}
