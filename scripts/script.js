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

//Wake word recognition results
wakeWordSpeechEngine.onresult = function(event) {
    var results = event.results[0][0].transcript.toLowerCase();;
    console.log(results);
    if(results.includes("michael")){
        intentHandler(results)
        .then(response => {
            speak(response);
        }).catch(() => {
            console.log("DAMN")
        });
    }
}

//Restart Wake word recognition when it has stopped
wakeWordSpeechEngine.onend = function() {
    console.log("Ended")
    wakeWordSpeechEngine.start();
}

//Handling intents, patterns and responses
function intentHandler(input) {
    return new Promise(
        function(resolve, reject) {
            fetch("./intents.json")
            .then(response => response.json())
            .then(data => {
                const intents = data.intents;
                let intentsArray = [];
                for (let i = 0; i < intents.length; i++) {
                    const intent = intents[i];
                    intent.patterns.forEach(pattern => {
                        if(input.includes(pattern.toLowerCase())) {
                            intentsArray.push({tag: intent.tag, response: intent.responses[Math.floor(Math.random() * intent.responses.length)]});
                        }
                    });
                    if(i == intents.length - 1){
                        intentsArray.forEach(intent => {
                            console.log(intentsArray);
                        });
                    }
                }
            });
        }
    )
}

let voices;
window.speechSynthesis.addEventListener("voiceschanged", () => {
    voices = window.speechSynthesis.getVoices();
});
function speak(input) {
    var utterance = new SpeechSynthesisUtterance(input);
    utterance.voice = voices[6];
    window.speechSynthesis.speak(utterance);
}