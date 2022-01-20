var inputCityName = $('#inputCityName')
var searchCityName = inputCityName.val()
var searchBttn = $("#searchBttn")
var listOfDestination = $('.listOfDestination')
var searchQuery = $(".searchQuery")
var covidData = $(".covidData")
var topFiveDestination = []
var storedList;
getSearchHistory();

//Event Listners
//User entry search
searchBttn.click(function(){
    if(inputCityName.val() == ""){
        showError()
        return
    }else{
        searchCityName = inputCityName.val()
        topFiveDestination = []
        getLocationData();
        resize();
        covidData.css("display","block")
        storeSearchHistory();
        getSearchHistory();
    }
})
//History Button search
$(".historyBttn").each(function(){
    $(this).click(function(){
        searchCityName = $(this).text()
        getLocationData();
        resize();
        covidData.css("display","block")
    })
})

//API function
//First API to pull top 5 destination
function getLocationData(){
    var getGeoURL = 'https://api.opentripmap.com/0.1/en/places/geoname?name='+searchCityName+'&apikey=5ae2e3f221c38a28845f05b664787bf73f18d1d79a0f9b9fd9899b42'
    fetch(getGeoURL)
    .then(function(response){
        return response.json();
    })
    .then(function(geoData){
        inputCityName.empty();
        inputCityName.append('<p id="countryCode">'+geoData.country+'</p>')
        $('#countryCode').css("display","none");
        country_data();
        var lat = geoData.lat
        var long = geoData.lon
        var getXIDURL = 'https://api.opentripmap.com/0.1/en/places/radius?radius=10000000&lon='+long+'&lat='+lat+'&src_attr=wikidata&rate=3&apikey=5ae2e3f221c38a28845f05b664787bf73f18d1d79a0f9b9fd9899b42'
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
                    topFiveDestination.push(placesData)
                    console.log(placesData)
                    var name = placesData.name
                    var previewImage = placesData.preview.source
                    var wikiText = placesData.wikipedia_extracts.text
                    listOfDestination.append('<button type="button" onclick="rendersTopFiveDestinations(event)" class="list-group-item list-group-item-action card" id = "'+placesData.xid+'">'+name+'</button><div class="p-1"></div>')
                    listOfDestination.children().eq(1).addClass("active")
                })
            }
        })
    })
}

function rendersTopFiveDestinations(event){
    for(i=0;i<topFiveDestination.length;i++){
        if(event.target.id === topFiveDestination[i].xid){
            $("#imageHolder").attr("src",topFiveDestination[i].preview.source);
            $("#imageDetails").text(topFiveDestination[i].wikipedia_extracts.text);
        }}
        $(".card").click(function(){
            $(this).addClass("active");        
            $(this).siblings().removeClass("active");})
        }

//Second API to pull COVID data
function country_data () {
    var new_string = 'https://www.covid19-api.com/country/code?code='+$('#countryCode').html()+'&format=json'
    console.log(new_string)
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
        var totalCovidCases =new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(c_data[0].confirmed)
        covidData.empty();
        covidData.append('<h2 class = "bg-info text-white">Summary of COVID Cases '+c_data[0].country+'</h2><h4 class="covid_cases">Total Covid Cases</h4><h5 class="covid_cases_content">'+c_data[0].confirmed.toLocaleString()+'</h5><h4 class="recoveries">Recoveries</h4><h5 class="recoveries_content">'+c_data[0].recovered.toLocaleString()+'</h5><h4 class="critical">Critical Cases</h4><h5 class="critical_content">'+c_data[0].critical.toLocaleString()+'</h5> <h4 class="deaths">Deaths</h4><h5 class="deaths_content">'+c_data[0].deaths.toLocaleString()+'</h5>')
    })
}

//Utilities function
//get history from local storage and render to page
function getSearchHistory(){
    $(".searchHistory").empty();
    storedList = JSON.parse(localStorage.getItem("history"))
        if (storedList !== null) {
            if(storedList.length>3){
                var slicedList = storedList.slice(1).slice(-3)
                for(i=0; i < slicedList.length; i++){
                    $(".searchHistory").append('<button type="button" class="col-12 btn btn-info text-muted historyBttn">'+ slicedList[i] +'</button><div class="p-1"></div>' )
                }
            }else{
            for(i=0; i < storedList.length; i++){
            $(".searchHistory").append('<button type="button" class="col-12 btn btn-info text-muted historyBttn">'+ storedList[i] +'</button><div class="p-1"></div>' )
            }        
        }
    }
}
//save search history to local storage
function storeSearchHistory() {
    var history = inputCityName.val();
    if (!storedList) {
        storedList = [];
    }
    storedList.push(history);
    localStorage.setItem("history", JSON.stringify(storedList));
}
//show error and  stop function if user entry is blank
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

function resize(){
    searchQuery.removeClass("col-sm-12 col-lg-12");
    searchQuery.addClass("col-sm-4 col-lg-4")
}