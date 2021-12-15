var hrefDetail = "https://market-api.radiocaca.com/nft-sales/";
var totalViewMarket = 0;
var categories = 0;
var scoreFrom, scoreTo = 0;
var priceFrom, priceTo = 0;
var totalListShow,tb = [];
var xtb = [];
$(document).ready(function() { /* code here */ 

    // loadHistory();
    var view = document.getElementById('view');
    if (view) {
        view.addEventListener('click', function () {
            loadHistory();
        });
    };

    var reload = document.getElementById('reload');
    if (reload) {
        reload.addEventListener('click', function () {
            window.location.reload();
        });
    };
         // Setup - add a text input to each footer cell
    $('#bodyTable #searchHead  th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" class="form-control" placeholder="Search '+title+'" />' );
    } );
    tb = $('#bodyTable').DataTable({
        "orderCellsTop": true,
        "fixedHeader": true,
        "pageLength": 50,
        // initComplete: function () {
        //     this.api().columns().every( function () {
        //         var that = this;
        //         xtb = that;
        //         $('input', this.footer() ).on( 'keyup change clear', function () {
        //             console.log(this.value +'this')
        //             console.log(that)
        //             var val = $.fn.dataTable.util.escapeRegex(
        //                 $(this).val()
        //             );
        //             that
        //             .search( val ? '^'+val+'$' : '', true, false )
        //             .draw();
        //             // if ( that.search() !== this.value ) {
        //             //     console.log(that.search() +"-"+ this.value )
        //                 // that.search( this.value )
        //                 //     .draw();
        //             // }
        //         } );
        //         // tb.search(this.value).draw();
        //     } );
        // }

    });




        var select = document.getElementById('fatherNode');
        select.removeChild(select.lastChild);
});

var reloadPage = function(){
    priceFrom, priceTo = 0;
    totalListShow = [];
    tb.clear();
}
var loadHistory = function(){
    // this.href = "https://market-api.radiocaca.com/users/0xe9b5f08261ab5f1d59706286be6734b40c79deac/histories?pageNo=1&pageSize=100";
    totalViewMarket = 50;
    // priceFrom = document.getElementById('priceFrom').value;
    // priceTo = document.getElementById('priceTo').value;
    categories = document.getElementById('categories').value;
    scoreFrom = document.getElementById('scoreFrom').value;
    scoreTo = document.getElementById('scoreTo').value;
    reloadPage();
    this.href="https://market-api.radiocaca.com/nft-sales?pageNo=1&pageSize="+totalViewMarket+"&sortBy=created_at&order=desc&name=&saleType&category="+categories+"&tokenType&tokenId=-1";
    var newList =  [];
    // var table = document.getElementById("bodyTable");
    $.ajax(this.href, {
        success: function(data) {
            data.list.sort(function(a, b){
                return b.fixed_price - a.fixed_price;
            }).forEach(element => {
                newList.push(element.id);
                    switch(categories) {
                        
                        case "13":
                        case "23":
                            if(newList.length==data.list.length){
                                newList.forEach(dt=>{
                                    loadDetailMtm(dt,hrefDetail+dt,tb,data.list.length);
                                })
                            }
                        break;
                        default:
                        // code block
                            showDetailsOther(element,tb);
                    }
            });
            console.log(newList);
            
        //    $('#notification-bar').text('The page has been successfully loaded');
        //     showToast();
        },
        error: function() {
           $('#notification-bar').text('An error occurred');
            showToast();
        }
     });
};


var showToast = function(){
    $('.viewDetail').on("click",function(){
        var mtmId =  $(this).attr('data-id');
        loadDetailMtm(mtmId,hrefDetail+mtmId);
      })
    var toastLiveExample = document.getElementById('liveToast');
    var toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}

var showDetailsMetamon = function(data,tb){
    console.log(data)
            tb.row.add([
                "<a href='https://market.radiocaca.com/#/market-place/"+data.id+"' target='_blank'> "+ data.token_id+"</a>",
                data.properties[0].value, 
                data.properties[2].value,
                data.properties[4].value,
                data.properties[5].value,
                data.fixed_price,
                // new Intl.NumberFormat('de-DE').format(data.fixed_price),
                "<img src='"+ data.image_url+"' class='rounded me-2' style='width: 20px;' alt='...'>"
            ]).draw(false);
};

var showDetailsOther = function(data,tb){
        // var content = 
        //     "<tr>"+
        //         "<th scope='row'> <a href='https://market.radiocaca.com/#/market-place/"+data.id+"' target='_blank'> "+ data.token_id+"</a></th>"+
        //         // "<td>"+ convertUTCDateToLocalDate(new Date(data.created_at)).toLocaleString() +"</td>"+
        //         "<td></td>"+
        //         "<td>"+ data.name +"</td>"+
        //         "<td>"+ data.status +"</td>"+
        //         "<td></td>"+
        //         "<td>"+ new Intl.NumberFormat('de-DE').format(data.fixed_price)+"</td>"+
        //         "<td><img src='"+ data.image_url+"' class='rounded me-2' style='width: 20px;' alt='...'></td>"+
        //         // "<td><a class='viewDetail' href='javascript:void(0)' data-id="+element.id+">View Score</a></td>"+
        //     "</tr>";
        //     var row = table.insertRow(1);
        //     row.innerHTML = content;

            tb.row.add([
                "<a href='https://market.radiocaca.com/#/market-place/"+data.id+"' target='_blank'> "+ data.token_id+"</a>",
                "", 
                data.name ,
                data.status ,
                "",
                data.fixed_price,
                // new Intl.NumberFormat('de-DE').format(data.fixed_price),
                "<img src='"+ data.image_url+"' class='rounded me-2' style='width: 20px;' alt='...'>"
            ]).draw(false);
};


var loadDetailMtm = function(id,href,table,total){

    $.ajax(href, {
        success: function(data) {
            totalListShow.push(data.data);
            console.log(totalListShow.length+"-"+total)

            if(totalListShow.length==total)
            {
                console.log("abc");
                totalListShow
                .filter(function(element)
                    {
                        return element.properties[4].value >= scoreFrom && element.properties[4].value <= scoreTo; 
                    })
                .sort(function(a, b) {
                    return a.properties[5].value < b.properties[5].value
                })
                .forEach(element => {
                    showDetailsMetamon(element,table);
                });
            }
        }
        ,
        error: function() {
           $('#notification-bar').text('An error occurred');
            showToast();
        }
     });
};

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}