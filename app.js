const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const albumContainer = document.getElementById('album-container');
const trackContainer = document.getElementById('track-container');
const noResultsMessage = document.getElementById('no-results-message');
const backButton = document.getElementById('back-button');
const homeButton = document.getElementById('home-button');
const modeButton = document.getElementById('mode-button');

let previousResults = [];
let isDarkMode = false;
let currentIndex = -1; // Current index of the playing song

// Fetch data from the API
async function fetchData(query) {
    try {
        const response = await fetch(`https://saavn.dev/api/search/songs?query=${query}`);
        const data = await response.json();

        console.log("API Response:", data);

        if (data.success && data.data && data.data.results && data.data.results.length > 0) {
            previousResults = data.data.results; // Store the current results
            displayResults(data.data.results);
            backButton.style.display = 'inline';
        } else {
            console.error("No results found in the API response:", data);
            displayNoResults();
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        displayNoResults();
    }
}

// Display the search results
function displayResults(results) {
    albumContainer.innerHTML = '';
    trackContainer.innerHTML = '';
    noResultsMessage.innerHTML = '';

    results.forEach((song, index) => {
        const songElement = document.createElement('div');
        const audioUrl = song.downloadUrl ? song.downloadUrl.find(url => url.quality === '160kbps')?.url || song.downloadUrl[0]?.url : null;

        songElement.innerHTML = `
            <h4>${song.name} - ${song.language || 'Unknown'} (Song)</h4>
            <img src="${song.image ? song.image[0]?.url : ''}" alt="${song.name}" style="width: 100px; height: 100px;">
            <audio controls>
                <source src="${audioUrl || ''}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;

        // Add click event to open the modal with the song
        songElement.addEventListener('click', () => {
            openAudioPlayer(song, index, results);
        });

        trackContainer.appendChild(songElement);
    });
}

// Function to open the audio player modal
function openAudioPlayer(song, index, results) {
    currentIndex = index;
    document.getElementById('modal-song-title').textContent = `${song.name} - ${song.language || 'Unknown'}`;

    const modalAudio = document.getElementById('modal-audio');
    modalAudio.src = song.downloadUrl ? song.downloadUrl.find(url => url.quality === '160kbps')?.url || song.downloadUrl[0]?.url : '';

    const modal = document.getElementById('audio-player-modal');
    modal.style.display = 'flex'; // Show modal

    modalAudio.play();

    document.getElementById('prev-button').onclick = () => playPrevious(results);
    document.getElementById('next-button').onclick = () => playNext(results);

    document.querySelector('.close').onclick = () => {
        modal.style.display = 'none'; // Hide modal
        modalAudio.pause(); // Pause audio when closing
    };
}

// Function to play the previous song
function playPrevious(results) {
    if (currentIndex > 0) {
        openAudioPlayer(results[--currentIndex], currentIndex, results);
    }
}

// Function to play the next song
function playNext(results) {
    if (currentIndex < results.length - 1) {
        openAudioPlayer(results[++currentIndex], currentIndex, results);
    }
}

// Display 'No Results Found' message
function displayNoResults() {
    albumContainer.innerHTML = '';
    trackContainer.innerHTML = '';
    noResultsMessage.textContent = 'No results found for your search. Please try a different song.';
}

// Add event listener for the search button
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchData(query);
    }
});

// Add event listener for the back button
backButton.addEventListener('click', () => {
    if (previousResults.length > 0) {
        displayResults(previousResults);
        backButton.style.display = 'inline';
    } else {
        backButton.style.display = 'none';
    }
});

// Add event listener for the home button
homeButton.addEventListener('click', () => {
    searchInput.value = '';
    trackContainer.innerHTML = '';
    noResultsMessage.innerHTML = '';
    backButton.style.display = 'none';
});

// Add event listener for the dark/light mode toggle
modeButton.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    modeButton.textContent = isDarkMode ? 'Switch to Light' : 'Switch to Dark';
});
