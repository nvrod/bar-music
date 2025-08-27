const supabase = window.supabase.createClient(
  "https://infolitgflcxnnzetotv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluZm9saXRnZmxjeG5uemV0b3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNjE1MTUsImV4cCI6MjA3MTgzNzUxNX0.4n_Dbq7DastEEqlHUTySk752_zdYrEXD307VgUrAe7g"
);

async function loadQueue() {
  const { data } = await supabase
    .from("requests")
    .select("*")
    .neq("status", "played")
    .order("created_at", { ascending: true });

  const list = document.getElementById("queue");
  list.innerHTML = "";
  if (data) {
    data.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = `Mesa ${r.table_id}: ${r.song} [${r.status}]`;
      list.appendChild(li);
    });
  }

  return data || [];
}

// abrir según proveedor
function playTrack(request) {
  let url = "";

  if (request.provider === "youtube" && request.track_id) {
    url = `https://www.youtube.com/watch?v=${request.track_id}`;
  }

  if (request.provider === "ytmusic" && request.track_id) {
    url = `https://music.youtube.com/watch?v=${request.track_id}`;
  }

  if (request.provider === "spotify" && request.track_id) {
    // Deep link: abre Spotify app directamente
    url = `spotify:track:${request.track_id}`;
  }

  if (url) {
    window.open(url, "_blank");
  }
}

async function handleNewRequest(request) {
  playTrack(request);

  await supabase
    .from("requests")
    .update({ status: "playing" })
    .eq("id", request.id);
}

// ✅ realtime en supabase-js v2
supabase
  .channel("requests-channel")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "requests" },
    (payload) => {
      handleNewRequest(payload.new);
      loadQueue();
    }
  )
  .subscribe();

loadQueue();
