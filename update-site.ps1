.\ldjam-json.ps1 | set-content -path .\..\gh-pages\data.json -encoding UTF8
cd .\..\gh-pages
git add data.json
git commit -m 'Auto commit'
git push origin gh-pages
cd .\..\src