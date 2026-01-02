// -----------------------------
// DOM ELEMENTS
// -----------------------------
const playlistEl = document.getElementById("playlist");
const searchInput = document.getElementById("search-input");
const categoryFilters = document.getElementById("category-filters");
// filterButtons query moved into render function if static, but better as a constant if they don't change
const filterButtons = document.querySelectorAll(".filter-btn");

const playPauseBtn = document.querySelector(".play-pause");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

const progressBarWrapper = document.querySelector(".progress-bar-wrapper");
const progressBar = document.querySelector(".progress-bar");
const currentTimeEl = document.querySelector(".current-time");
const totalDurationEl = document.querySelector(".total-duration");

const volumeSlider = document.querySelector(".volume-slider");
const volumeIcon = document.querySelector(".volume-control i");

// -----------------------------
// AUDIO SETUP
// -----------------------------
const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let currentCategory = "All";
let searchQuery = "";
let filteredSongs = [];

// Song data
const songs = [
    {
        id: 1,
        title: "Lost in the Echo",
        artist: "MissyWhimsyArt",
        src: "assets/musics/song1.mp3",
        cover: "assets/images/cover1.jpg",
        duration: "4:00",
        genre: "Pop",
        isFavorite: true
    },
    {
        id: 2,
        title: "BeatKitchen - City of Dreams (161 BPM)",
        artist: "ThisIsBeatKitchen",
        src: "assets/musics/song2.mp3",
        cover: "assets/images/cover2.jpg",
        duration: "4:02",
        genre: "Electronic",
        isFavorite: false
    },
    {
        id: 3,
        title: "Chasing Starlight",
        artist: "Alexandr2266",
        src: "assets/musics/song3.mp3",
        cover: "assets/images/cover3.jpg",
        duration: "4:00",
        genre: "Chill",
        isFavorite: true
    }
];

// Initialize filtered songs with all songs
filteredSongs = [...songs];

// -----------------------------
// RENDER PLAYLIST
// -----------------------------
function renderPlaylist(songsToRender) {
    playlistEl.innerHTML = "";

    if (songsToRender.length === 0) {
        playlistEl.innerHTML = '<li class="no-results">No songs found</li>';
        return;
    }

    songsToRender.forEach((song, index) => {
        const li = document.createElement("li");
        li.className = `song-item ${index === currentSongIndex ? "active" : ""}`;
        li.dataset.index = index;

        li.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-thumbnail">
            <div class="song-info">
                <h3 class="song-title">${song.title}</h3>
                <p class="artist-name">${song.artist}</p>
            </div>
            <div class="song-meta">
                <span class="duration">${song.duration}</span>
            </div>
        `;

        li.addEventListener("click", () => {
            currentSongIndex = index;
            loadSong(index);
            playSong();
        });

        playlistEl.appendChild(li);
    });
}

// -----------------------------
// LOAD SONG
// -----------------------------
function loadSong(index) {
    if (filteredSongs.length === 0) return;

    // Ensure index is within range
    if (index >= filteredSongs.length) index = 0;
    if (index < 0) index = filteredSongs.length - 1;

    currentSongIndex = index;
    const song = filteredSongs[currentSongIndex];

    audio.src = song.src;
    totalDurationEl.textContent = song.duration;

    // Update UI highlights
    const items = document.querySelectorAll(".song-item");
    items.forEach(item => item.classList.remove("active"));
    if (items[currentSongIndex]) {
        items[currentSongIndex].classList.add("active");
    }
}

// -----------------------------
// PLAY / PAUSE
// -----------------------------
function playSong() {
    if (!audio.src) return;
    audio.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

playPauseBtn.addEventListener("click", () => {
    isPlaying ? pauseSong() : playSong();
});

// -----------------------------
// NEXT / PREVIOUS
// -----------------------------
function nextSong() {
    if (filteredSongs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % filteredSongs.length;
    loadSong(currentSongIndex);
    playSong();
}

function prevSong() {
    if (filteredSongs.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + filteredSongs.length) % filteredSongs.length;
    loadSong(currentSongIndex);
    playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// -----------------------------
// FILTERING LOGIC
// -----------------------------
function filterAndRender() {
    filteredSongs = songs.filter(song => {
        const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesCategory = true;
        if (currentCategory === "Favorites") {
            matchesCategory = song.isFavorite;
        } else if (currentCategory !== "All") {
            matchesCategory = song.genre === currentCategory;
        }

        return matchesSearch && matchesCategory;
    });

    currentSongIndex = 0; // Reset index when filtering
    renderPlaylist(filteredSongs);
    if (filteredSongs.length > 0) {
        loadSong(0);
        if (isPlaying) playSong(); // Keep playing if it was already playing? Or just load.
    } else {
        audio.src = "";
        totalDurationEl.textContent = "0:00";
    }
}

// -----------------------------
// EVENT LISTENERS
// -----------------------------
searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    filterAndRender();
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Update active button state
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Update category and filter
        currentCategory = btn.dataset.category;
        filterAndRender();
    });
});

// -----------------------------
// PROGRESS BAR UPDATE
// -----------------------------
audio.addEventListener("timeupdate", () => {
    const { currentTime, duration } = audio;
    if (!duration) return;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
});

progressBarWrapper.addEventListener("click", e => {
    const width = progressBarWrapper.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

// -----------------------------
// AUTO PLAY NEXT SONG
// -----------------------------
audio.addEventListener("ended", nextSong);

// -----------------------------
// VOLUME CONTROL
// -----------------------------
volumeSlider.addEventListener("input", e => {
    audio.volume = e.target.value / 100;
    if (audio.volume === 0) {
        volumeIcon.className = "fas fa-volume-mute";
    } else if (audio.volume < 0.5) {
        volumeIcon.className = "fas fa-volume-low";
    } else {
        volumeIcon.className = "fas fa-volume-high";
    }
});

// -----------------------------
// UTIL: FORMAT TIME
// -----------------------------
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

// -----------------------------
// INITIAL LOAD
// -----------------------------
renderPlaylist(filteredSongs);
loadSong(currentSongIndex);
audio.volume = volumeSlider.value / 100;
