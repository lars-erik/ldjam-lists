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

let converter = new showdown.Converter();
Vue.directive('show-info', {
    bind: function(el, binding) {
        let child = document.createElement("div");
        let body = binding.value.replace("///raw", "https://static.jam.vg/raw"),
            html = converter.makeHtml(body);
        child.className = "info";
        el.addEventListener("mouseover", function(evt) {
            child.innerHTML = html;
            document.body.appendChild(child);
            child.style.width = (window.innerWidth * .7) + "px";
            child.style.left = evt.pageX + "px";
            child.style.top = (evt.pageY + 5) + "px";
        });
        el.addEventListener("mousemove", function(evt) {
            child.style.left = evt.pageX + "px";
            child.style.top = (evt.pageY + 5) + "px";
        });
        el.addEventListener("mouseout", function() {
            document.body.removeChild(child);
        });
    },
    update: function(el, binding) {
        let body = binding.value.replace("///raw", "https://static.jam.vg/raw");
        html = converter.makeHtml(body);
    }
});

function createVm(all) {
    new Vue({
        el: "#app",
        data: {
            games: [],
            message: "",
            sortValue: function(x) {
                return x.magic.smart;
            },
            done: true,
            voted: {}
        },
        computed: {
            sorted: function() {
                return this.games.sort((a, b) => {
                    // desc. *-1 to do it right.
                    return (this.sortValue(a) || 0) < (this.sortValue(b) || 0) ? 1 :
                           (this.sortValue(a) || 0) > (this.sortValue(b) || 0) ? -1 :
                           0;
                });
            }
        },
        methods: {
            setVoted: function(item) {
                voted[item.id] != voted[item.id];
                localStorage.setItem('voted', JSON.stringify(voted));
            },
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
            this.updated = all.updated;
            this.games = all.items;
            this.voted = voted;
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
