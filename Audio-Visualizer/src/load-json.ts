const loadJson = () => {
    const url = "data/av-data.json";
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
        //console.log(`In onload - HTTP Status Code = ${e.target.status}`);

        let json;
        try {
            json = JSON.parse(xhr.responseText)
        } catch {
            document.querySelector("#output").innerHTML = "BAD JSON";
            return;
        }

        const obj = json

        let html = "";

        html += `<h2>${obj.title = obj.title ? obj.title : "No title found"}</h2>`;
        html += `<ol>${obj["songlist"].map(w => `<li>${w}</li>`).join("")}</ol>`;
        html += `<p>${obj.instructions}</p>`

        //for title of app
        const titleElement = document.querySelector("title");
        if (titleElement) {
            titleElement.innerHTML = obj.title;
        }

        //for inside the info
        const outputElement = document.querySelector("#output");
        if (outputElement) {
            outputElement.innerHTML = html;
        }
    }
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${xhr.status}`)
    xhr.open("GET", url)
    xhr.send();

}

export { loadJson };