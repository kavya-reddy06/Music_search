const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const trackContainer = document.getElementById('track-container');
const noResultsMessage = document.getElementById('no-results-message');
const backButton = document.getElementById('back-button');

let previousResults = [];
let currentIndex = -1;


// SEARCH SONGS
async function fetchData(query) {

    try {

        const response = await fetch(
            `https://saavn.sumit.co/api/search?query=${query}`
        );

        const data = await response.json();

        console.log("API Response:", data);

        const songs = data.data.songs.results;

        if (songs && songs.length > 0) {

            previousResults = songs;

            displayResults(songs);

            backButton.style.display = "inline";

        } else {

            displayNoResults();
        }

    } catch (error) {

        console.error("Fetch error:", error);

        displayNoResults();
    }
}


// DISPLAY RESULTS
function displayResults(results) {

    trackContainer.innerHTML = "";
    noResultsMessage.innerHTML = "";

    results.forEach((song, index) => {

        const songElement = document.createElement("div");

        songElement.innerHTML = `
            <h4>${song.title}</h4>
            <img src="${song.image[2].url}" width="120">
            <p>${song.primaryArtists}</p>
        `;

        songElement.addEventListener("click", () => {
            playSong(song, index);
        });

        trackContainer.appendChild(songElement);
    });
}


// PLAY SONG
async function playSong(song, index) {

    currentIndex = index;

    try {

        const response = await fetch(
            `https://saavn.sumit.co/api/songs?id=${song.id}`
        );

        const data = await response.json();

        console.log("Song data:", data);

        const audioUrl =
            data.data[0].downloadUrl.find(
                q => q.quality === "160kbps"
            ).url;

        const modalAudio = document.getElementById("modal-audio");

        document.getElementById("modal-song-title").textContent =
            `${song.title} - ${song.primaryArtists}`;

        modalAudio.src = audioUrl;

        const modal = document.getElementById("audio-player-modal");

        modal.style.display = "flex";

        modalAudio.load();

        modalAudio.play();

    } catch (error) {

        console.error("Audio fetch error:", error);
    }
}


// PREVIOUS SONG
function playPrevious() {

    if (currentIndex > 0) {

        currentIndex--;

        playSong(previousResults[currentIndex], currentIndex);
    }
}


// NEXT SONG
function playNext() {

    if (currentIndex < previousResults.length - 1) {

        currentIndex++;

        playSong(previousResults[currentIndex], currentIndex);
    }
}


// NO RESULTS
function displayNoResults() {

    trackContainer.innerHTML = "";

    noResultsMessage.textContent =
        "No results found. Try another song.";
}


// SEARCH BUTTON
searchButton.addEventListener("click", () => {

    const query = searchInput.value.trim();

    if (query) fetchData(query);
});


// ENTER KEY SEARCH
searchInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        const query = searchInput.value.trim();

        if (query) fetchData(query);
    }
});


// AUTO PLAY NEXT
document.getElementById("modal-audio")
.addEventListener("ended", playNext);
