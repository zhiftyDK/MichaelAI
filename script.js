//Defining speechRecognition engine
var defaultSpeechEngine = new webkitSpeechRecognition();
defaultSpeechEngine.lang = 'en-US';

//Wake words
const wakeWords = ["hello michael", "ok michael", "michael"];

//Button to start my AI
const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", () => {
    defaultSpeechEngine.start();
});

//Reply, if true then reply system is on
let reply = false;

//Restart speech engine onend
defaultSpeechEngine.onend = function() {
    if(reply == false) {
        console.log("Ended");
        defaultSpeechEngine.start();
    }
}

//Default recognition results (Run trigger or speak response)
defaultSpeechEngine.onresult = function(event) {
    var result = event.results[0][0].transcript.toLowerCase();
    console.log(result);

    for (let i = 0; i < wakeWords.length; i++) {
        const element = wakeWords[i];
        if(result.includes(element)) {
            if(result.length > element.length) {
                runChatBot(result.replace(element, "").trim());
            }
            break;
        }
    }
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
function weather(response, result) {
    const city = "silkeborg";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f4e80e2071fcae0bd7c122d2f82fd284`)
    .then(response => response.json())
    .then(data => {
        speak(`The temperature in ${city} is ${Math.floor(data.main.temp)} degrees, with ${data.weather[0].description}`);
    });
}

function time(response, result) {
    const date = new Date();

    let time;
    if(toString(date.getMinutes()).length == 1) {
        time = date.getHours() + " o " + date.getMinutes();
    } else {
        time = date.getHours() + " " + date.getMinutes();
    }

    speak(`the time is ${time}`);
}

let notes = [];
function note(response, result) {
    var noteSpeechEngine = new webkitSpeechRecognition();
    noteSpeechEngine.lang = 'en-US';
    speak("What should the note contain?")
    reply = true;
    defaultSpeechEngine.stop();
    noteSpeechEngine.start();

    noteSpeechEngine.onresult = function(event) {
        var result = event.results[0][0].transcript.toLowerCase();
        console.log(result);
        notes.push(result);
        speak("note has been created");
        console.log(notes);
        reply = false;
        defaultSpeechEngine.start();
    }
}

function readnote(response, result) {
    if(notes.length > 0) {
        if(notes.length == 1) {
            speak(`you currently have ${notes.length} note`);
            notes.forEach((note, i) => {
                speak(`the note is, ${note}`);
            });
        } else {
            speak(`you currently have ${notes.length} notes`);
            notes.forEach((note, i) => {
                speak(`number ${i + 1} note is, ${note}`);
            });
        }
    } else {
        speak("you have no notes sir");
    }
}

function clearnote(response, result) {
    notes = [];
    speak("your notes has been cleared");
}

function joke() {
    fetch("https://v2.jokeapi.dev/joke/Any?type=twopart")
    .then(response => response.json())
    .then(data => {
        speak(data.setup);
        speak(data.delivery);
    })
}

function compounds(response, result) {
    if(result.includes("consist")) {
        let compoundName = result.split(" ");
        compoundName = compoundName[compoundName.indexOf("consist") - 1];

        fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${compoundName}/property/MolecularFormula/json`)
        .then(response => response.json())
        .then(data => {
            let molecularFormula = data.PropertyTable.Properties[0].MolecularFormula;
            const characters = molecularFormula.replace(/(\d+)/g, "").split(/(?=[A-Z])/);
            console.log(characters);
    
            fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${compoundName}/property/MolecularWeight/json`)
            .then(response => response.json())
            .then(data => {
                let molarmass = data.PropertyTable.Properties[0].MolecularWeight;
    
                fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
                .then(response => response.json())
                .then(data => {
                    let elementSentence = `${compoundName} consists of`;
                    data.elements.forEach(element => {
                        characters.forEach(char => {
                            if(element.symbol == char) {
                                elementSentence = elementSentence + ", " + element.name;
                            }
                        });
                    });
                    elementSentence = elementSentence + `. the molar mass of ${compoundName} is about ${parseInt(molarmass)} g/mol`;
                    elementSentence = elementSentence.substring(0, elementSentence.lastIndexOf(',')) + " and" + elementSentence.substring(elementSentence.lastIndexOf(',')+1);
                    elementSentence = elementSentence + `. the molecular formula of ${compoundName} is ${molecularFormula.split(/(?=[A-Z])/).join(" ")}`;
                    console.log(elementSentence);
                    speak(elementSentence);
                });
            });
        }).catch(error => {
            speak(`It seams that the compound ${compoundName} doesnt exist`);
            console.log(error);
        });
    } else {
        speak("I cannot compute that sentence sir")
    }
}

function togglelights(response, result) {
    if(result.includes("off")) {
        const ids = [1, 2];
        ids.forEach(id => {
            fetch(`https://192.168.1.210/api/k0eIBlxj9p9AM5SMpWf9JhSQgM53dRNz33yCUxAF/lights/${id}/state`, {
                method: "PUT",
                body: JSON.stringify({"on": false}),
            })
            .then(response => response.json())
            .then(data => console.log(data)); 
        });
        speak("I have turned your lights off")
    } else {
        const ids = [1, 2];
        ids.forEach(id => {
            fetch(`https://192.168.1.210/api/k0eIBlxj9p9AM5SMpWf9JhSQgM53dRNz33yCUxAF/lights/${id}/state`, {
                method: "PUT",
                body: JSON.stringify({"on": true}),
            })
            .then(response => response.json())
            .then(data => console.log(data)); 
        });
        speak("I have turned your lights on")
    }
}

// {
//     "Properties": [
//         {
//             "CID": 5793,
//             "MolecularFormula": "C6H12O6"
//         }
//     ]
// }