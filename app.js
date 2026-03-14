const trackContainer = document.getElementById("track-container");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");

const modal = document.getElementById("audio-player-modal");
const modalAudio = document.getElementById("modal-audio");
const modalTitle = document.getElementById("modal-song-title");
const modalImage = document.getElementById("modal-image");

let songs = [];
let currentIndex = 0;


// SEARCH SONGS
async function searchSongs(query) {

    try {

        const response = await fetch(
            `https://saavn.sumit.co/api/search?query=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        console.log("Search API:", data);

        songs = data.data.songs.results || [];

        displaySongs(songs);

    } catch (error) {
        console.error("Search error:", error);
    }

}


// DISPLAY SONG CARDS
function displaySongs(songList) {

    trackContainer.innerHTML = "";

    songList.forEach((song, index) => {

        const card = document.createElement("div");
        card.className = "song-card";

        card.innerHTML = `
            <img src="${song.image?.[2]?.url || ""}">
            <div>
                <h4>${song.title}</h4>
                <p>${song.primaryArtists}</p>
            </div>
        `;

        card.onclick = () => playSong(index);

        trackContainer.appendChild(card);
    });

}


// PLAY SONG
async function playSong(index) {

    try {

        currentIndex = index;

        const song = songs[index];

        const response = await fetch(
            `https://saavn.sumit.co/api/songs?id=${song.id}`
        );

        const data = await response.json();

        console.log("Song API:", data);

        const urls = data.data?.[0]?.downloadUrl || [];

        // choose best available quality
        const audioUrl =
            urls.find(u => u.quality === "320kbps")?.url ||
            urls.find(u => u.quality === "160kbps")?.url ||
            urls[0]?.url;

        if (!audioUrl) {
            alert("Audio not available for this song.");
            return;
        }

        modalTitle.textContent = `${song.title} - ${song.primaryArtists}`;
        modalImage.src = song.image?.[2]?.url || "";

        modalAudio.src = audioUrl;

        modal.style.display = "flex";

        modalAudio.load();
        modalAudio.play();

    } catch (error) {
        console.error("Play error:", error);
    }

}


// PREVIOUS
document.getElementById("prev-button").onclick = () => {

    if (currentIndex > 0) {
        currentIndex--;
        playSong(currentIndex);
    }

};


// NEXT
document.getElementById("next-button").onclick = () => {

    if (currentIndex < songs.length - 1) {
        currentIndex++;
        playSong(currentIndex);
    }

};


// CLOSE PLAYER
document.querySelector(".close").onclick = () => {

    modal.style.display = "none";
    modalAudio.pause();

};


// SEARCH BUTTON
searchButton.onclick = () => {

    const query = searchInput.value.trim();
    if (query) searchSongs(query);

};


// ENTER KEY SEARCH
searchInput.addEventListener("keypress", e => {

    if (e.key === "Enter") {

        const query = searchInput.value.trim();
        if (query) searchSongs(query);

    }

});
