# Instala los skills en ~/.claude/skills y revisa dependencias. No toca llaves.
$dst = Join-Path $HOME '.claude\skills'
New-Item -ItemType Directory -Force $dst | Out-Null
Get-ChildItem (Join-Path $PSScriptRoot 'prompt\skills') -Directory | ForEach-Object {
  $t = Join-Path $dst $_.Name
  Copy-Item $_.FullName $dst -Recurse -Force; "skill: $t"
}
"`nDependencias:"
foreach ($c in 'node','python','ffmpeg','npx') { "{0}: {1}" -f $c, [bool](Get-Command $c -ErrorAction SilentlyContinue) }
