inputCityName = $('#inputCityName')
var searchBttn = $("#searchBttn")
var listOfDestination = $('.listOfDestination')
var searchQuery = $(".searchQuery")
var covidData = $(".covidData")
var image = []
var storedList;
getHistory();
















searchBttn.click(function(event){
    event.preventDefault;
    if(inputCityName.val() == ""){
        showError()
        return
    }else{
        getLocationData();
        searchQuery.removeClass("col-sm-12 col-lg-12");
        searchQuery.addClass("col-sm-4 col-lg-4")
        covidData.css("display","block")
        handleHistory();
        getHistory();
    }
})
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

function getHistory() {
    $(".searchHistory").empty();
    storedList = JSON.parse(localStorage.getItem("history"))
    console.log(storedList);
    if (storedList !== null) {
    for(i=0; i < storedList.length; i++){
        $(".searchHistory").append('<button type="button" class="col-12 btn btn-info text-muted historyBttn">'+ storedList[i] +'</button><div class="p-1"></div>' )
    }
}
    console.log(storedList)
}

function handleHistory() {
    var history = inputCityName.val();
    console.log(history)
    if (!storedList) {
        storedList = [];
    }
    storedList.push(history);
    localStorage.setItem("history", JSON.stringify(storedList));
    console.log('History: ',inputCityName);
}

function getLocationData(){
    var getGeoURL = 'https://api.opentripmap.com/0.1/en/places/geoname?name='+inputCityName.val()+'&apikey=5ae2e3f221c38a28845f05b664787bf73f18d1d79a0f9b9fd9899b42'
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
                    console.log(name)
                    var previewImage = placesData.preview.source
                    image.push(previewImage)
                    var wikiText = placesData.wikipedia_extracts.text
                    listOfDestination.append('<button type="button" class="list-group-item list-group-item-action card">'+name+'</button><div class="p-1"></div>')
                    listOfDestination.children().eq(1).addClass("active")
                    $(".card").click(function(){
                        console.log("hello");
                        $(this).addClass("active");
                        $("#imageHolder").attr("src",previewImage);
                        $("#imageDetails").text(wikiText);
                        $(this).siblings().removeClass("active");
                    })
                })
            }
        })
    })
}
$(".card").click(function(){
console.log("hello")
})
console.log(image)
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
        covidData.empty();
        covidData.append('<h2>Summary of COVID Cases</h2><h4 class="covid_cases">Total Covid Cases</h4><h5 class="covid_cases_content">'+c_data[0].confirmed.toString()+'</h5><h4 class="recoveries">Recoveries</h4><h5 class="recoveries_content">'+c_data[0].recovered.toString()+'</h5><h4 class="critical">Critical Cases</h4><h5 class="critical_content">'+c_data[0].critical.toString()+'</h5> <h4 class="deaths">Deaths</h4><h5 class="deaths_content">'+c_data[0].deaths.toString()+'</h5>')
    })
}