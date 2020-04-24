let voted;

const columns = [
    ['name', undefined],
    ['grade', 'grade-01'],
    ['grade', 'grade-02'],
    ['grade', 'grade-03'],
    ['grade', 'grade-04'],
    ['grade', 'grade-05'],
    ['grade', 'grade-06'],
    ['grade', 'grade-07'],
    ['grade', 'grade-08'],
    ['magic', 'feedback'],
    ['magic', 'given'],
    ['magic', 'grade'],
    ['magic', 'cool'],
    ['magic', 'smart']
];

try
{
    let stored = localStorage.getItem('voted');
    voted = JSON.parse(stored);
}
catch(e)
{
}
if (!voted) {
    voted = {};
}

function createVm(all) {
    new Vue({
        el: "#app",
        data: {
            games: [],
            message: "",
            filter: ["compo", "jam"],
            sortValue: function(x) {
                return (x.magic || {}).smart;
            },
            done: true,
            voted: {},
            importExport: "",
            showingCover: false,
            coverStyle: {
                position: 'fixed',
                zIndex: 99,
                left: 0,
                top: 0
            },
            cover: ""
        },
        computed: {
            sorted: function() {
                return this.list.sort((a, b) => {
                    // desc. *-1 to do it right.
                    return (this.sortValue(a) || 0) < (this.sortValue(b) || 0) ? 1 :
                           (this.sortValue(a) || 0) > (this.sortValue(b) || 0) ? -1 :
                           0;
                });
            },
            list: function() {
                return this.games.filter(x => this.filter.indexOf(x.subsubtype) > -1)
            }
        },
        methods: {
            setVoted: function(item) {
                voted[item.id] != voted[item.id];
                localStorage.setItem('voted', JSON.stringify(voted));
                this.importExport = btoa(JSON.stringify(voted));
            },
            exportVotes: function() {
                console.log(btoa(JSON.stringify(voted)));
            },
            importVotes: function() {
                this.voted = voted = JSON.parse(atob(this.importExport));
            },
            sort: function(index, arg1, arg2) {
                this.sortIndex = index;
                let col = columns[index];
                if (!col[1]) {
                    this.sortValue = x => x[col[0]];
                } else {
                    this.sortValue = x => (x[col[0]] || {})[col[1]];
                }
            },
            headerClass: function(index) {
                return this.sortIndex === index ? "sortedcolumn" : "";
            },
            sortClass: function(index) {
                return this.sortIndex === index ? "fas fa-angle-up" : "";
            },
            moveCover: function(evt) {
                if (this.showingCover) {
                    this.coverStyle.left = (evt.clientX + 5) + "px";
                    this.coverStyle.top = (evt.clientY + 5) + "px";
                }
            },
            showCover: function(game) {
                this.showingCover = true;
                this.cover = 'https://static.jam.vg' + (game.meta.cover || "").substr(2);
            },
            hideCover: function() {
                this.showingCover = false;
            }
        },
        created: function() {
            this.updated = all.updated;
            this.games = all.items;
            this.voted = voted;
            this.importExport = btoa(JSON.stringify(voted));
        },
        mounted: function() {
        }
    });
}

fetch("./data.json")
    .then(response => {
        console.log("got data");
        response.json().then(response => {
            console.log("got json");
            let data = response.items;
            data.forEach(x => {
                if (!x.grade) {
                    x.grade = {}
                }
            });
                 
            document.getElementsByTagName("table")[0].style.display = "";
            document.getElementById("loading").style.display = "none";

            createVm(response);
        })
        .catch(e => {
            console.log(e);
        });
    })
    .catch(e => {
        console.log(e);
    });
