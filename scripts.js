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
    console.log(e);
    console.log("Soz, deleted your vote.")
    voted = {};
    localStorage.setItem('voted', JSON.stringify(voted));
}

function createVm(all) {
    new Vue({
        el: "#datatable",
        data: {
            games: [],
            message: "",
            sortValue: function(x) {
                return x.magic.smart;
            }
        },
        computed: {
            sorted: function() {
                return this.games.sort((a, b) => {
                    // desc. *-1 to do it right.
                    return this.sortValue(a) < this.sortValue(b) ? 1 :
                           this.sortValue(a) > this.sortValue(b) ? -1 :
                           0;
                });
            }
        },
        methods: {
            sort: function(index, arg1, arg2) {
                this.sortIndex = index;
                let col = columns[index];
                if (!col[1]) {
                    this.sortValue = x => x[col[0]];
                } else {
                    this.sortValue = x => x[col[0]][col[1]];
                }
            },
            headerClass: function(index) {
                return this.sortIndex === index ? "sortedcolumn" : "";
            },
            sortClass: function(index) {
                return this.sortIndex === index ? "fas fa-angle-up" : "";
            }
        },
        created: function() {
            this.games = all;
        },
        mounted: function() {
        }
    });
}

fetch("./data.json")
    .then(response => {
        console.log("got data");
        response.json().then(data => {
            console.log("got json");
            console.log(data.length);
            data.forEach(x => {
                if (!x.grade) {
                    x.grade = {}
                }
            });
                 
            document.getElementsByTagName("table")[0].style.display = "";
            document.getElementById("loading").style.display = "none";

            createVm(data);
        })
        .catch(e => {
            console.log(e);
        });
    })
    .catch(e => {
        console.log(e);
    });

// for some reason edge loses check state in gui unless slight timeout
// setTimeout(
//     function() {
//         Array
//         .from(document.getElementsByTagName("input"))
//         .forEach(element => {
//             element.addEventListener("click", function() {
//                 voted[this.id] = this.checked;
//                 localStorage.setItem('voted', JSON.stringify(voted));
//             });
//             if (voted[element.id]) {
//                 element.checked = true;
//             }
//         });
   
//     }, 
//     50
// );

console.log("gtf on with it, github. ;)")