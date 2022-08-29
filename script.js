//Defining speechRecognition engine
var defaultSpeechEngine = new webkitSpeechRecognition();
defaultSpeechEngine.lang = 'en-US';

//Wake words
const wakeWords = ["hello michael", "ok michael"];

//Button to start my AI
const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", () => {
    defaultSpeechEngine.start();
});

//Restart speech engine onend
defaultSpeechEngine.onend = function() {
    console.log("Ended");
    defaultSpeechEngine.start();
}

//Default recognition results (Run trigger or speak response)
defaultSpeechEngine.onresult = function(event) {
    var result = event.results[0][0].transcript.toLowerCase();
    console.log(result);

    wakeWords.forEach(element => {
        if(result.includes(element) && result.length > element.length) {
            runChatBot(result);
        }
    });
}

//Run neural net and then speak or call trigger
function runChatBot(result) {
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