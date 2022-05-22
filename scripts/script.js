const wrapper = document.querySelector(".wrapper"),
userInput = wrapper.querySelector(".user-input"),
infoTxt = userInput.querySelector(".info-txt"),
inputField = userInput.querySelector("input"),
locationBtn = userInput.querySelector("button"),
icon = document.querySelector(".weather-card img"),
arrowBack = wrapper.querySelector("header i");

let api;

const icons = {
    "2": "public/img/storm.svg",
    "6": "public/img/snow.svg",
    "7": "public/img/haze.svg",
    "8": "public/img/cloud.svg",
    "3": "public/img/rain.svg",
    "5": "public/img/rain.svg",
}

inputField.addEventListener("keyup", e=>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSucess, onError);
    }else{
        alert("Your browser doesn't support geolocation");
    }
})
function onSucess(position){
    const {latitude, longitude} = position.coords;
    api =  `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=2ae299f0d75d5cb20021181f34a5c95d`;
    fetchData();

}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}


function requestApi(city){
    api =  `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=2ae299f0d75d5cb20021181f34a5c95d`;

    fetchData()
}

function fetchData(){
    infoTxt.innerText = "Getting weather details, be patient...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function capitalize(text){
    const str = text;
    const arr = str.split(" ");
    for(var i=0; i < arr.length; i++){
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");
    return str2;
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending","error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name `;
        
    }else{
        // data for weather
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        
        var descriptionC = capitalize(description)
        var index = String(id)[0]
        console.log(index);
        if(id == 800){
            icon.src = "public/img/clear.svg";
        }else{
            icon.src = icons[index];
        }

        // put data in html

        wrapper.querySelector(".temp .num").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = descriptionC;
        wrapper.querySelector(".location span").innerText = city + ", "+country;
        wrapper.querySelector(".temp .num-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = humidity + "%";

        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
    }
    
}

arrowBack.addEventListener("click", () =>{
    wrapper.classList.remove("active");
})