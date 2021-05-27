"use strict";

let searchAnime = function () {
  let name = document.querySelector("#name").value;

  if (name === "" || name === " ") {
    alert("You have to write an anime name 😅");
    return;
  } else {
    document.querySelector("#name").value = "";

    document.querySelector("#cards-container").innerHTML = "";

    let newName = name.replace(" ", "%20");

    var request = new XMLHttpRequest();

    request.open(
      "GET",
      `https://kitsu.io/api/edge/anime?filter[text]=${newName}&page[limit]=20`
    );

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);

        let title = "";

        let counter = data["data"].length;

        if (data["data"].length > 12) {
          counter = 12;
        }

        for (let i = 0; i < counter; i++) {
          let url = data["data"][i]["attributes"]["youtubeVideoId"];
          let begin = data["data"][i]["attributes"]["startDate"]
            ? data["data"][i]["attributes"]["startDate"]
            : "Be pacient ⏰";
          let end = data["data"][i]["attributes"]["endDate"]
            ? data["data"][i]["attributes"]["endDate"]
            : "We are waiting too 😩";

          if (!data["data"][i]["attributes"]["titles"]["en_jp"]) {
            let [titleType] = Object.keys(
              data["data"][i]["attributes"]["titles"]
            );

            switch (titleType) {
              case "en":
                title = data["data"][i]["attributes"]["titles"]["en"];

                break;
              case "en_us":
                title = data["data"][i]["attributes"]["titles"]["en_us"];
                break;
            }
          } else {
            title = data["data"][i]["attributes"]["titles"]["en_jp"];
          }

          let htmlElement = `
    <section class="card">
    <div class="cover-container">
    
    <img src="${data["data"][i]["attributes"]["posterImage"]["small"]}" alt="${name}">
    </div>

    <div class="details">
      <div class='title'><h4>${title}</h4></div>
      <p class="date">From ${begin} to ${end}</p>
      <p class="synopsis" >${data["data"][i]["attributes"]["description"]}</p>
      <p>Trailer</p>
      <iframe src="https://www.youtube.com/embed/${url}" frameborder="0"></iframe>
      <p class="status">Status: ${data["data"][i]["attributes"]["status"]}</p>

    </div>
  </section>
    `;

          document
            .querySelector("#cards-container")
            .insertAdjacentHTML("beforeend", htmlElement);
        }
      }
    };

    request.send();
  }
};

document.querySelector("#button").addEventListener("click", searchAnime);
