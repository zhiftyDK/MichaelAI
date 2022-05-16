var recognition = new webkitSpeechRecognition();
recognition.lang = 'en-US';

const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
    recognition.start();
});

recognition.onresult = function(event){
    var results = event.results[0][0].transcript.toLowerCase();;
    console.log(results);
    if(results.includes("michael")){
        fetch("./intents.json")
        .then(response => response.json())
        .then(data => {
            const intents = data.intents;
            console.log(intents);
            intents.forEach(intent => {
                intent.patterns.forEach(pattern => {
                    if(results.includes(pattern.toLowerCase())){
                        console.log(intent.responses[Math.floor(Math.random() * intent.responses.length)]);
                    }
                });
            });
        });
    }
}

recognition.onend = function() {
    console.log("Ended")
    recognition.start();
}