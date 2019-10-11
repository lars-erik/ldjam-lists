param (
    $type = 'cool'
)
$offset = 0
$count = 50
$limit = 50
"<html>
    <head>
        <title>LDJam 45 by $($type)</title>
    <link rel=""stylesheet"" 
          href=""https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"" 
          integrity=""sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"" 
          crossorigin=""anonymous"">
    <style>
        th, td {
            font-size: .8rem;
        }
        th {
            text-align: left;
        }
        td {
            text-align: right;
        }
        .table-sm th {
            padding-left: .5rem;
        }
    </style>
    <body>
<table class=""table table-striped table-sm"">
<tr class=""header-row"">
    <th>No</th>
    <th>Name</th>
    <th>Overall</th>
    <th>Fun</th>
    <th>Innovation</th>
    <th>Theme</th>
    <th>Graphics</th>
    <th>Sound</th>
    <th>Humor</th>
    <th>Mood</th>
    <th>Cool</th>
    <th>Feedback</th>
    <th>Given</th>
    <th>Grade</th>
    <th>Smart</th>
</tr>
"
$i = 0while($count -ge $limit) {
    $result = invoke-restmethod -Uri "https://api.ldjam.com/vx/node/feed/159347/parent+$($type)/item/game/jam+compo+release?offset=$($offset)&limit=$($limit)"
    $count = $result.feed.Count
    $offset += $count
    $result.feed | foreach-object { $idstring = "" } { $idstring += $_.id.ToString() + "+" } { $idstring = $idstring.TrimEnd("+") }
    $items = invoke-restmethod -Uri "https://api.ldjam.com/vx/node2/get/$($idstring)"
    $items.node `        | sort-object { $_.magic.$type } -Descending `        | foreach-object {
            $i = $i + 1
            Write-Progress -PercentComplete ((($offset / 1000) * 100) % 100) -CurrentOperation "Fetching" -Activity "Fetching offset $($offset)"
            "<tr>
<th>$($i)</th>
<th><a href=""https://ldjam.com/events/ludum-dare/45/$($_.slug)"" target=""_blank"">$($_.name)</a></th>
<td>$($_.grade.'grade-01')</td>
<td>$($_.grade.'grade-02')</td>
<td>$($_.grade.'grade-03')</td>
<td>$($_.grade.'grade-04')</td>
<td>$($_.grade.'grade-05')</td>
<td>$($_.grade.'grade-06')</td>
<td>$($_.grade.'grade-07')</td>
<td>$($_.grade.'grade-08')</td>
<td>$([System.Math]::Round($_.magic.cool, 0))</td>
<td>$($_.magic.feedback)</td>
<td>$($_.magic.given)</td>
<td>$([System.Math]::Round($_.magic.grade, 0))</td>
<td>$([System.Math]::Round($_.magic.smart, 0))</td>
</tr>
"
        }
    }
"
    </table>
</body>
</html>
"