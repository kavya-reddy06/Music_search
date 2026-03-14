const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const albumContainer = document.getElementById('album-container');
const trackContainer = document.getElementById('track-container');
const noResultsMessage = document.getElementById('no-results-message');
const backButton = document.getElementById('back-button');
const homeButton = document.getElementById('home-button');
const modeButton = document.getElementById('mode-button');

let previousResults = [];
let currentSearchIndex = -1;
let currentIndex = -1;
let isDarkMode = false;


// DISPLAY SEARCH RESULTS
function displayResults(results) {

    albumContainer.innerHTML = '';
    trackContainer.innerHTML = '';
    noResultsMessage.innerHTML = '';

    results.forEach((song, index) => {

        const songElement = document.createElement('div');

        songElement.classList.add("song-card");

        songElement.innerHTML = `
            <h4>${song.title}</h4>
            <img src="${song.image?.[2]?.url}" 
            style="width:120px;height:120px;">
            <p>${song.primaryArtists}</p>
        `;

        songElement.addEventListener('click', () => {
            openAudioPlayer(song, index, results);
        });

        trackContainer.appendChild(songElement);
    });
}



// OPEN MODAL AUDIO PLAYER
function openAudioPlayer(song, index, results) {

    currentIndex = index;

    const modal = document.getElementById('audio-player-modal');
    const modalAudio = document.getElementById('modal-audio');

    const audioUrl =
        song.downloadUrl?.find(q => q.quality === "160kbps")?.url ||
        song.downloadUrl?.[4]?.url ||
        "";

    document.getElementById('modal-song-title').textContent =
        `${song.title} - ${song.primaryArtists}`;

    modalAudio.src = audioUrl;

    modal.style.display = 'flex';

    modalAudio.load();
    modalAudio.play();

    document.getElementById('prev-button').onclick = () =>
        playPrevious(results);

    document.getElementById('next-button').onclick = () =>
        playNext(results);

    document.querySelector('.close').onclick = () => {
        modal.style.display = 'none';
        modalAudio.pause();
    };
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



// NO RESULTS
function displayNoResults() {

    albumContainer.innerHTML = '';
    trackContainer.innerHTML = '';

    noResultsMessage.textContent =
        'No results found. Try another song.';
}



// FETCH SONGS
async function fetchData(query) {

    try {

        const response = await fetch(
            `https://saavn.dev/api/search/songs?query=${query}`
        );

        const data = await response.json();

        console.log("API Response:", data);

        if (data.success && data.data.results.length > 0) {

            previousResults.push(data.data.results);

            currentSearchIndex = previousResults.length - 1;

            displayResults(data.data.results);

            backButton.style.display = 'inline';

        } else {

            displayNoResults();
        }

    } catch (error) {

        console.error("Fetch Error:", error);

        displayNoResults();
    }
}



// SEARCH BUTTON
searchButton.addEventListener('click', () => {

    const query = searchInput.value.trim();

    if (query) fetchData(query);
});



// ENTER KEY SEARCH
searchInput.addEventListener('keypress', (e) => {

    if (e.key === 'Enter') {

        const query = searchInput.value.trim();

        if (query) fetchData(query);
    }
});



// BACK BUTTON
backButton.addEventListener('click', () => {

    if (currentSearchIndex > 0) {

        currentSearchIndex--;

        displayResults(previousResults[currentSearchIndex]);

    } else {

        previousResults = [];

        trackContainer.innerHTML = '';

        backButton.style.display = 'none';
    }
});



// HOME BUTTON
homeButton.addEventListener('click', () => {

    searchInput.value = '';

    trackContainer.innerHTML = '';

    noResultsMessage.innerHTML = '';

    backButton.style.display = 'none';

    previousResults = [];

    currentSearchIndex = -1;
});



// DARK MODE
modeButton.addEventListener('click', () => {

    isDarkMode = !isDarkMode;

    document.body.classList.toggle('dark-mode', isDarkMode);

    modeButton.textContent =
        isDarkMode ? 'Switch to Light' : 'Switch to Dark';
});



// AUTO PLAY NEXT SONG
document.getElementById('modal-audio').addEventListener('ended', () => {

    if (previousResults[currentSearchIndex]) {

        playNext(previousResults[currentSearchIndex]);
    }
});
