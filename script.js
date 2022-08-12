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
wakeWordSpeechEngine.onend = function() {
    console.log("Ended")
    wakeWordSpeechEngine.start();
}

//Wake word recognition results
wakeWordSpeechEngine.onresult = function(event) {
    var result = event.results[0][0].transcript.toLowerCase();;
    console.log(result);
    if(result.includes("michael")){
        defaultSpeechEngine.start();
    }
}

//Default recognition results
defaultSpeechEngine.onresult = function(event) {
    var result = event.results[0][0].transcript.toLowerCase();;
    console.log(result);
    const bot = new chatBot("./intents.json", "./model.json");
    bot.run(result).then((response) => {
        if(response.trigger == true) {
            eval(`${response.tag}("${result}")`);
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