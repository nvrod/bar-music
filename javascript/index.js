const supabase = window.supabase.createClient(
  "https://infolitgflcxnnzetotv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluZm9saXRnZmxjeG5uemV0b3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNjE1MTUsImV4cCI6MjA3MTgzNzUxNX0.4n_Dbq7DastEEqlHUTySk752_zdYrEXD307VgUrAe7g"
);

// mesa desde la URL
const urlParams = new URLSearchParams(window.location.search);
const tableId = urlParams.get("table_id") || "0"; 
document.getElementById("mesa-title").textContent = "Mesa " + tableId;

// tu clave de YouTube Data API v3 (pon la tuya aquí)
const YT_API_KEY = "AIzaSyBAMqB504FNAEgSZKrqXL8i_AdMTOF1lvc";

async function searchSongs() {
  const query = document.getElementById("songInput").value.trim();
  if (!query) {
    alert("Escribe algo para buscar");
    return;
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${YT_API_KEY}`
  );
  const data = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  if (!data.items) {
    results.innerHTML = "<li>No se encontraron resultados</li>";
    return;
  }

  data.items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.snippet.title}`;
    const btn = document.createElement("button");
    btn.textContent = "Seleccionar";
    btn.onclick = () => addRequest(item.id.videoId, item.snippet.title);
    li.appendChild(btn);
    results.appendChild(li);
  });
}

async function addRequest(videoId, title) {
  // contar pedidos pendientes de esta mesa
  const { data: pendientes } = await supabase
    .from("requests")
    .select("id", { count: "exact" })
    .eq("table_id", tableId)
    .eq("status", "pending");

  if (pendientes && pendientes.length >= 2) {
    alert("Solo puedes tener 2 pedidos pendientes. Espera a que se reproduzcan.");
    return;
  }

  const { error } = await supabase.from("requests").insert({
    table_id: tableId,
    song: title,
    provider: "youtube",
    track_id: videoId,
    status: "pending"
  });

  if (error) {
    console.error(error);
    alert("Error al guardar pedido");
  } else {
    alert("Pedido agregado!");
    document.getElementById("songInput").value = "";
    document.getElementById("results").innerHTML = "";
  }
}
