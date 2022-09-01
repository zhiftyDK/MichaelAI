//Username: k0eIBlxj9p9AM5SMpWf9JhSQgM53dRNz33yCUxAF
function toggleLights(state) {
    const ids = [1, 2];
    ids.forEach(id => {
        fetch(`https://192.168.1.210/api/k0eIBlxj9p9AM5SMpWf9JhSQgM53dRNz33yCUxAF/lights/${id}/state`, {
            method: "PUT",
            body: JSON.stringify({"on": state}),
        })
        .then(response => response.json())
        .then(data => console.log(data)); 
    });
}

function toggleFan(state) {
    fetch(`https://192.168.1.210/api/k0eIBlxj9p9AM5SMpWf9JhSQgM53dRNz33yCUxAF/lights/3/state`, {
        method: "PUT",
        body: JSON.stringify({"on": state}),
    })
    .then(response => response.json())
    .then(data => console.log(data)); 
}