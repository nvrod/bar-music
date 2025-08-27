    const totalMesas = 50; // ajusta según necesites
    const baseUrl = "https://bar-music.netlify.app/index.html?table_id=";

    const container = document.getElementById("qrs");

    for (let i = 1; i <= totalMesas; i++) {
      const url = baseUrl + i;
      const div = document.createElement("div");
      div.innerHTML = `<p>Mesa ${i}</p><canvas id="qr${i}"></canvas>`;
      container.appendChild(div);

      QRCode.toCanvas(document.getElementById(`qr${i}`), url, { width: 150 }, function (error) {
        if (error) console.error(error);
      });
    }