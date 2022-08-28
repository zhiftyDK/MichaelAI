//Defining speechRecognition engine
var wakeWordSpeechEngine = new webkitSpeechRecognition();
var defaultSpeechEngine = new webkitSpeechRecognition();
wakeWordSpeechEngine.lang = 'en-US';
defaultSpeechEngine.lang = 'en-US';

//Button to start my AI
const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", () => {
    wakeWordSpeechEngine.start();
});

//Restart Wake word recognition when it has stopped
let wakeWordResult = "";
wakeWordSpeechEngine.onend = function() {
    console.log("Ended");
    if(!wakeWordResult.includes("michael")) {
        wakeWordSpeechEngine.start();
    }
}

//Wake word recognition results
wakeWordSpeechEngine.onresult = function(event) {
    var result = event.results[0][0].transcript.toLowerCase();
    console.log(result);
    wakeWordResult = result;
    if(result.includes("michael")) {
        defaultSpeechEngine.start();
    }
}

//Restart Wake word recognition when default recognition is done
defaultSpeechEngine.onend = function() {
    console.log("Ended");
    wakeWordSpeechEngine.start();
}

//Default recognition results (Run trigger or speak response)
defaultSpeechEngine.onresult = function(event) {
    var result = event.results[0][0].transcript.toLowerCase();
    console.log(result);
    const bot = new chatBot("./networkdata/intents.json", "./networkdata/model.json");
    bot.run(result).then((response) => {
        if(response.trigger == true) {
            eval(`${response.tag}(${JSON.stringify(response)}, "${result}")`);
        } else {
            speak(response.rnd_response);
        }
    });
}

//Get and apply voices to the speak function
let voices;
window.speechSynthesis.addEventListener("voiceschanged", () => {
    voices = window.speechSynthesis.getVoices();
});
function speak(input) {
    var utterance = new SpeechSynthesisUtterance(input);
    utterance.voice = voices[6];
    window.speechSynthesis.speak(utterance);
}

//Triggers
function open_minecraft(response, result) {
    speak(response.rnd_response);
}

function weather(response, result) {
    weatherFromSentence("Silkeborg", "f4e80e2071fcae0bd7c122d2f82fd284")
    .then(data => {
        speak(`The temperature in ${data.city} is ${Math.floor(data.weather.main.temp)} degrees, with ${data.weather.info.description}`);
    })
}

function time(response, result) {
    const date = new Date();
    const time = date.getHours() + " " + date.getMinutes();
    speak(`the time is ${time}`);
}