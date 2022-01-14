/*
var headers = new Headers();
headers.append("Content-Type", "application/x-www-form-urlencoded");


fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers,
    body: "grant_type=client_credentials&client_id=xI8qVT6AlfsQRwHtjnnnAZFBQR5PPsdi&client_secret=0jpefIf4PfAv2uDq"
}).then(function (response) {
    return response.json();
}).then(function (data) {
    console.log(data);
});


fetch("https://test.api.amadeus.com/v1/duty-of-care/disease/covid19-area-report",{
    method:"GET",
    headers: {"Authorization":"Bearer ZsLtEAnTOy418iUysiiu559M93GS", "Access-Control-Allow-Origin":"*"},
    mode:"cors",
}).then(function (response) {
    return response.json();
}).then(function (data) {
    console.log(data);
});


fetch("https://www.covid19-api.com/country?name=China&format=json"
    , {
}).then(function (response) {
    return response.json();
}).then(function (data) {
    //console.log(data);
    console.log(data.country);

});

*/

function country_data (event) {
event.preventDefault();
var country_name = "France"
var new_string = "https://www.covid19-api.com/country?name=" + country_name + "&format=json"
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
.then(function(data) {
	console.log(data);
})
.catch(err => {
	console.error(err);
});
}





document.querySelector("#country_form").addEventListener('submit', country_data);
