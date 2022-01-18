var cityName = $('#inputCityName')
inputCityName = cityName
var searchBttn = $("#searchBttn")
var listOfDestination = $('.listOfDestination')
var searchQuery = $(".searchQuery")
var covidData = $(".covidData")
var storedList;
getHistory();

$(".historyBttn").click(function(){
    console.log("Hello")
    //$(this).text=inputCityName.val()
    inputCityName = $(this).text()
    console.log(inputCityName)
    getLocationData();
    searchQuery.removeClass("col-sm-12 col-lg-12");
        searchQuery.addClass("col-sm-4 col-lg-4")
        covidData.css("display","block")
        $(".searchHistory").empty()

}) 


searchBttn.click(function(event){
    event.preventDefault;if(inputCityName == ""){
        showError()
        return
    }else{
        handleHistory();
        getLocationData();
        searchQuery.removeClass("col-sm-12 col-lg-12");
        searchQuery.addClass("col-sm-4 col-lg-4")
        covidData.css("display","block")
        $(".searchHistory").empty()
        getHistory()

    }
});
function getHistory() {
    storedList = JSON.parse(localStorage.getItem("history"))
    for(i=0; i < storedList.length; i++){
        $(".searchHistory").append('<button type="button" class="col-12 btn btn-info text-muted historyBttn">'+ storedList[i] +'</button><div class="p-1"></div>' )
    }
    
    console.log(storedList)
}

function handleHistory() {
    var history = inputCityName;

    if (!storedList) {
        storedList = [];
    }

    storedList.push(history);

    localStorage.setItem("history", JSON.stringify(storedList));
    console.log('History: ',inputCityName);
    // if(localStorage.history != undefined) {
    //     history = localStorage.history;
    // };

// function getHistory() {
//     $('.searchHistory').each(function(){
//         $(this).append("<button type="button" class="col-12 btn btn-info text-muted historyBttn">Secondary</button><div class="p-1"></div>")
//         var historyItem = localStorage.getItem(history);
//         $(this).child.text(historyItem)
//     }) 

    
// }

    //if(history) {
       //localStorage.history = history.split(',').push(inputCityName.val()).join(',');
    //} else {
    //    localStorage.history = inputCityName;
    //}

}


function showError(){
    searchBttn.before('<p id="showError">City name cannot be blank</p>');
    var showResult = 1
    var timeResultID = setInterval(function(){
        if(showResult>0){
            showResult--;
        } else if(showResult===0){
            clearInterval(timeResultID);
            $("#showError").remove()
        }
    },1000)
}

function getLocationData(){
    var getGeoURL = 'https://api.opentripmap.com/0.1/en/places/geoname?name='+inputCityName +'&apikey=5ae2e3f221c38a28845f05b664787bf73f18d1d79a0f9b9fd9899b42'
    fetch(getGeoURL)
    .then(function(response){
        return response.json();
    })
    .then(function(geoData){
        $('#inputCityName').empty();
        $('#inputCityName').append('<p id="countryCode">'+geoData.country+'</p>')
        $('#countryCode').css("display","none");
        country_data();
        var lat = geoData.lat
        var long = geoData.lon
        var getXIDURL = 'https://api.opentripmap.com/0.1/en/places/radius?radius=100000&lon='+long+'&lat='+lat+'&src_attr=wikidata&rate=3&apikey=5ae2e3f221c38a28845f05b664787bf73f18d1d79a0f9b9fd9899b42'
        fetch(getXIDURL)
        .then(function(response){
            return response.json();
        })
        .then(function(xidData){
            listOfDestination.empty();
            listOfDestination.append('<h5>Top Tourist Destinations</h5>')
            for (i=0;i<5;i++){
                var xidId = xidData.features[i].properties.xid
                var placesURL = 'https://api.opentripmap.com/0.1/en/places/xid/'+xidId+'?apikey=5ae2e3f221c38a28845f05b664787bf73f18d1d79a0f9b9fd9899b42'
                fetch(placesURL)
                .then(function(response){
                    return response.json();
                })
                .then(function(placesData){
                    var name = placesData.name
                    var previewImage = placesData.preview.source
                    var wikiText = placesData.wikipedia_extracts.text
                    listOfDestination.append('<button type="button" class="list-group-item list-group-item-action card">'+name+'</button><div class="p-1"></div>')
                    listOfDestination.children().eq(1).addClass("active")
                    $(".card").click(function(){
                        $(this).addClass("active");
                        $(this).siblings().removeClass("active")
                    })
                })
            }
        })
    })
}

function country_data () {
    var new_string = 'https://www.covid19-api.com/country/code?code='+$('#countryCode').html()+'&format=json'
    fetch(new_string, {
	    "method": "GET",
	    "headers": {
		"x-rapidapi-host": "covid-19-data.p.rapidapi.com",
		"x-rapidapi-key": "7656eb3a5emsh21a5b41565b69d6p110da4jsn033e5b9f1a60"
	}
    })
    .then(function (response) {
        return response.json();
    })
    .then(function(c_data) {
        covidData.empty()
        covidData.append('<h2>Summary of COVID Cases</h1><h4 class="covid_cases">Total Covid Cases</h4><h5 class="covid_cases_content">'+c_data[0].confirmed.toString()+'</h5><h4 class="recoveries">Recoveries</h4><h5 class="recoveries_content">'+c_data[0].recovered.toString()+'</h5><h4 class="critical">Critical Cases</h4><h5 class="critical_content">'+c_data[0].critical.toString()+'</h5> <h4 class="deaths">Deaths</h4><h5 class="deaths_content">'+c_data[0].deaths.toString()+'</h5>')
    })
}
