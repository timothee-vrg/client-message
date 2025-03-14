function fact(n) {
  if (n === 0) {
    return 1;
  }
  return n * fact(n - 1);
}

// console.log(fact(6)); // 720

function applique(f, tab) {
  return tab.map(f);
}

// applique(fact, [1, 2, 3, 4, 5, 6]); // [1, 2, 6, 24, 120, 720]
// applique(
//   function (n) {
//     return n + 1;
//   },
//   [1, 2, 3, 4, 5, 6]
// ); // [2, 3, 4, 5, 6, 7]

// let msgs = [
//   { msg: "Hello World", pseudo: "Alice", date: new Date().toLocaleString() },
//   { msg: "Blah Blah", pseudo: "Bob", date: new Date().toLocaleString() },
//   { msg: "I love cats", pseudo: "Charlie", date: new Date().toLocaleString() },
// ];

function update(messages) {
  const messageList = document.querySelector("ul");
  messageList.innerHTML = "";

  applique((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.pseudo} (${item.date}) : ${item.msg}`;
    messageList.appendChild(li);
  }, messages);
}

function getAndUpdateAllMessages() {
  fetch(`${getServerUrl()}/msg/getAll`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      update(data);
    })
    .catch(function (error) {
      console.error("Erreur lors de la récupération des messages :", error);
    });
}

document
  .getElementById("messageForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const pseudo = document.getElementById("pseudo").value;
    const message = document.getElementById("message").value;

    if (!pseudo || !message) {
      alert("Tous les champs doivent être remplis !");
      return;
    }

    fetch(
      `${getServerUrl()}/msg/post/${encodeURIComponent(
        message
      )}?pseudo=${pseudo}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function () {
        getAndUpdateAllMessages();
      })
      .catch(function (error) {
        console.error("Erreur lors de l'envoi du message :", error);
      });

    document.getElementById("messageForm").reset();
  });

// Dark mode
document.getElementById("themeButton").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Modularité du setting
function getServerUrl() {
  return localStorage.getItem("serverUrl") || "http://localhost:8080";
}
document.getElementById("serverUrl").value = getServerUrl();
document.getElementById("saveServerUrl").addEventListener("click", () => {
  const url = document.getElementById("serverUrl").value.trim();
  if (url) {
    localStorage.setItem("serverUrl", url);
  }
});

getAndUpdateAllMessages();
