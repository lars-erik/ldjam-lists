param(
    $jamid = 159347,
    $title = "LDJam 45 by "
)

@('cool','feedback','smart','grade') | foreach-object { .\ldjam-list.ps1 -type $_ -jamid $jamid -title ($title + $_) > "..\gh-pages\$_.html" }