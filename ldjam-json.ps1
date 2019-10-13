param (
    $type = 'all',
    $jamid = 159347,
    $title = "LDJam 45 by $type"
)

$offset = 0
$count = 50
$limit = 50
$nodes = new-object System.Collections.ArrayList
while($count -ge $limit) {
    Write-Progress -PercentComplete ((($offset / 1000) * 100) % 100) -Activity "Fetching $($type)" -CurrentOperation "Offset $($offset). (Progress loops at 1000)"
    $result = invoke-restmethod -Uri "https://api.ldjam.com/vx/node/feed/$($jamid)/parent+$($type)/item/game/jam+compo+release?offset=$($offset)&limit=$($limit)"
    $count = $result.feed.Count
    $offset += $count
    $result.feed | foreach-object { $idstring = "" } { $idstring += $_.id.ToString() + "+" } { $idstring = $idstring.TrimEnd("+") }
    $items = invoke-restmethod -Uri "https://api.ldjam.com/vx/node2/get/$($idstring)"
    $nodes.AddRange($items.node)
}
"{
    ""updated"":""$([System.DateTime]::Now.ToString("yyyy-MM-dd HH:mm"))"",
    ""items"":"
$nodes | ConvertTo-Json
"}"