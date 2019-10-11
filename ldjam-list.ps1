param (
    $type = 'cool',
    $jamid = 159347,
    $title = "LDJam 45 by $type"
)

$offset = 0
$count = 50
$limit = 50
"<!DOCTYPE html>
<html>
    <head>
        <title>LDJam 45 by $title</title>
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
    </head>
    <body>
    <nav class=""navbar navbar-dark bg-dark navbar-expand"">
        <span class=""navbar-brand"">$title</span>
        <div class=""collapse navbar-collapse"" id=""navbarNav"">
        <ul class=""navbar-nav"">
            <li class=""nav-item$(if ($type -eq 'feedback') { " active" })"">
                <a href=""feedback.html"" class=""nav-link"">feedback</a>
            </li>
            <li class=""nav-item$(if ($type -eq 'grade') { " active" })"">
                <a href=""grade.html"" class=""nav-link"">grade</a>
            </li>
            <li class=""nav-item$(if ($type -eq 'cool') { " active" })"">
                <a href=""cool.html"" class=""nav-link"">cool</a>
            </li>
            <li class=""nav-item$(if ($type -eq 'smart') { " active" })"">
                <a href=""smart.html"" class=""nav-link"">smart</a>
            </li>
            <li class=""nav-item"">
                <a href=""about.html"" class=""nav-link"">about</a>
            </li>
        </ul>
        </div>
    </nav>
<div class=""container-fluid"">
<span id=""loading"">Big table is loading, please be patient.</span>
<table class=""table table-striped table-sm"" style=""display:none;"">
<tr class=""header-row"">
    <th>No</th>
    <th>Type</th>
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
    <th>Voted</th>
</tr>"
$i = 0
while($count -ge $limit) {
    $result = invoke-restmethod -Uri "https://api.ldjam.com/vx/node/feed/$($jamid)/parent+$($type)/item/game/jam+compo+release?offset=$($offset)&limit=$($limit)"
    $count = $result.feed.Count
    $offset += $count
    $result.feed | foreach-object { $idstring = "" } { $idstring += $_.id.ToString() + "+" } { $idstring = $idstring.TrimEnd("+") }
    $items = invoke-restmethod -Uri "https://api.ldjam.com/vx/node2/get/$($idstring)"
    $items.node `
        | sort-object { $_.magic.$type } -Descending `
        | foreach-object {
            $i = $i + 1
            Write-Progress -PercentComplete ((($offset / 1000) * 100) % 100) -Activity "Fetching $($type)" -CurrentOperation "Offset $($offset). (Progress loops at 1000)"
            "<tr>
<th>$($i)</th>
<th>$($_.subsubtype)</th>
<th><a href=""https://ldjam.com/events/ludum-dare/45/$($_.slug)"" target=""_blank"">$($_.name)</a></th>
<td>$($_.grade.'grade-01')</td>
<td>$($_.grade.'grade-02')</td>
<td>$($_.grade.'grade-03')</td>
<td>$($_.grade.'grade-04')</td>
<td>$($_.grade.'grade-05')</td>
<td>$($_.grade.'grade-06')</td>
<td>$($_.grade.'grade-07')</td>
<td>$($_.grade.'grade-08')</td>
<td>$([System.Math]::Round($_.magic.cool, 2))</td>
<td>$($_.magic.feedback)</td>
<td>$($_.magic.given)</td>
<td>$([System.Math]::Round($_.magic.grade, 2))</td>
<td>$([System.Math]::Round($_.magic.smart, 2))</td>
<td style=""text-align:center""><input type=""checkbox"" id=""$($_.id)""></td>
</tr>"
        }
    }
"
    </table>
</div>
<script src=""scripts.js"" type=""text/javascript""></script>
</body>
</html>
"