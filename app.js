const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const trackContainer = document.getElementById("track-container");
const noResultsMessage = document.getElementById("no-results-message");
const backButton = document.getElementById("back-button");
const homeButton = document.getElementById("home-button");
const modeButton = document.getElementById("mode-button");

let previousResults = [];
let currentIndex = -1;
let isDarkMode = false;


// SEARCH API
async function fetchData(query) {
    try {

        const response = await fetch(
            `https://saavn.sumit.co/api/search?query=${query}`
        );

        const data = await response.json();

        console.log("API DATA:", data);

        const songs = data.data.songs.results;

        if (songs && songs.length > 0) {

            previousResults = songs;

            displayResults(songs);

            backButton.style.display = "inline";

        } else {
            displayNoResults();
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        displayNoResults();
    }
}



// DISPLAY SONG LIST
function displayResults(results) {

    trackContainer.innerHTML = "";
    noResultsMessage.innerHTML = "";

    results.forEach((song, index) => {

        const songElement = document.createElement("div");

        songElement.classList.add("song-card");

        songElement.innerHTML = `
            <h4>${song.title}</h4>
            <img src="${song.image[2].url}" width="120">
            <p>${song.primaryArtists}</p>
        `;

        songElement.addEventListener("click", () => {
            openAudioPlayer(song, index, results);
        });

        trackContainer.appendChild(songElement);
    });
}



// GET SONG AUDIO
async function openAudioPlayer(song, index, results) {

    currentIndex = index;

    try {

        const response = await fetch(
            `https://saavn.sumit.co/api/songs?id=${song.id}`
        );

        const data = await response.json();

        const audioUrl =
            data.data[0].downloadUrl.find(q => q.quality === "160kbps").url;

        const modal = document.getElementById("audio-player-modal");
        const modalAudio = document.getElementById("modal-audio");

        document.getElementById("modal-song-title").textContent =
            song.title + " - " + song.primaryArtists;

        modalAudio.src = audioUrl;

        modal.style.display = "flex";

        modalAudio.play();


        document.getElementById("prev-button").onclick = () =>
            playPrevious(results);

        document.getElementById("next-button").onclick = () =>
            playNext(results);

        document.querySelector(".close").onclick = () => {
            modal.style.display = "none";
            modalAudio.pause();
        };

    } catch (error) {

        console.error("Audio fetch error:", error);
    }
}



// PREVIOUS SONG
function playPrevious(results) {

    if (currentIndex > 0) {

        currentIndex--;

        openAudioPlayer(results[currentIndex], currentIndex, results);
    }
}



// NEXT SONG
function playNext(results) {

    if (currentIndex < results.length - 1) {

        currentIndex++;

        openAudioPlayer(results[currentIndex], currentIndex, results);
    }
}



// NO RESULTS MESSAGE
function displayNoResults() {

    trackContainer.innerHTML = "";

    noResultsMessage.textContent =
        "No results found. Try another song.";
}



// SEARCH BUTTON
searchButton.addEventListener("click", () => {

    const query = searchInput.value.trim();

    if (query) {
        fetchData(query);
    }
});



// BACK BUTTON
backButton.addEventListener("click", () => {

    if (previousResults.length > 0) {

        displayResults(previousResults);
    }
});



// HOME BUTTON
homeButton.addEventListener("click", () => {

    searchInput.value = "";

    trackContainer.innerHTML = "";

    noResultsMessage.innerHTML = "";

    backButton.style.display = "none";
});



// DARK MODE
modeButton.addEventListener("click", () => {

    isDarkMode = !isDarkMode;

    document.body.classList.toggle("dark-mode");

    modeButton.textContent =
        isDarkMode ? "Switch to Light" : "Switch to Dark";
});
