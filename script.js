
let input = document.getElementById("input");
let input_box = document.querySelector(".input_box");
let send_btn = document.getElementById("send_btn");
let content = document.querySelector(".content");
let section = document.querySelector(".section");
let mic = document.getElementById('mic')
input.addEventListener("input", checkIfValue);
let modal = document.querySelector('.dialog')
let apps = document.querySelector('.apps')

function checkIfValue() {
  if (input.value === "" || input.value == null) {
    send_btn.disabled = true;
  } else {
    send_btn.disabled = false;
  }
  validateInput(input)
}

input.onfocus = () => {
  input_box.style.border = "1px solid var(--primaryBlue)";
};
input.onblur = () => {
  input_box.style.border = "1px solid gray";
};

function sendName() {
  appendToBody(input.value, "user");
  getData();
  send_btn.disabled = true;
}

function appendToBody(name, type) {
  var div = document.createElement("div");
  if (type === "user") {
    div.innerHTML = `<div class = "ai">
     <i class="material-icons">account_circle</i>
   <p class="content"> 
   ${name}
   </p>
    </div>`;
    section.insertAdjacentElement("beforeend", div.firstChild);
  } else {
    div.innerHTML = `<div  class = "ai">
    <img id="loader_img" src="ai.gif">
   <p class="content"> 
${name}
   </p>
    </div>
     `;
    section.insertAdjacentElement("beforeend", div.firstChild);
  }
}

window.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    sendName();

  }
});

function getData() {
  let val = input.value
  appendToBody("", "ranjan");
  section.scrollTop = section.scrollHeight;
  let allContent = document.querySelectorAll(".content");
  let images = document.querySelectorAll("#loader_img");

  let url = `https://api.genderize.io/?name=${val.split(" ")[0]}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setTimeout(() => {

        allContent[allContent.length - 1].innerHTML = data.gender || `Oops! I searched for long but i didn't find gender for "${val}". May be name is strange.`;
        images[images.length - 1].src = "bard.gif";

        for (let i = 0; i < images.length - 1; i++) {
          images[i].src = "logo.svg";
        }
      }, 2000)

      section.scrollTop = section.scrollHeight;
      let ge;

      if (data.gender == "male") {
        ge = "mel";
      } else {
        ge = "female";
      }

      var utterance = new SpeechSynthesisUtterance(
        Math.round(data.probability * 100) + "%" + "Chance That " + input.value + "is " + ge
      );
      // utterance.voice = window.speechSynthesis.getVoices()[12];
      if (data.gender) {
        speechSynthesis.speak(utterance);
      } else {
        let b = new SpeechSynthesisUtterance(`Oops! I searched for long but i didn't find gender for "${input.value}". May be name is strange.`)
        speechSynthesis.speak(b);
        setTimeout(() => {
          images[images.length - 1].src = "red.svg";
          section.scrollTop = section.scrollHeight;

        }, 2000)

      }
      input.value = ""
    })
    .catch(error => {
      allContent[allContent.length - 1].innerHTML = "Network error ):"
      images[i].src = "red.svg";

      confirm(error)
    });
}

mic.addEventListener('click', speechRecognition)

function speechRecognition() {
  let speechRecogniton = new webkitSpeechRecognition();

  speechRecogniton.onstart = () => {

    mic.innerHTML = "hearing";

  };
  speechRecogniton.onend = () => {

    mic.innerHTML = 'mic'
    if (input.value) {

      sendName()
    }
  };

  speechRecogniton.onresult = (event) => {
    output = event.results[0][0].transcript

    input.value = output;



  };

  speechRecogniton.start();

}

function closeme() {
  modal.close()
}
function showme() {
  modal.showModal()

}

function openApps() {
  alert("Apps are currently not avilable")
}
function validateInput(input) {
  var hindiRegex = /[\u0900-\u097F]/;

  if (hindiRegex.test(input.value)) {

    input.value = ""
    send_btn.disabled = true;
    alert("We don't support Hindi language\nहम हिन्दी भाषा को सपोर्ट नहीं करते ");
  }
}