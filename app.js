const searchButton=document.getElementById("search-button")
const searchInput=document.getElementById("search-input")
const trackContainer=document.getElementById("track-container")
const modal=document.getElementById("audio-player-modal")
const modalAudio=document.getElementById("modal-audio")
const modalTitle=document.getElementById("modal-song-title")
const modalImage=document.getElementById("modal-image")

let songs=[]
let currentIndex=0


async function fetchSongs(query){

const response=await fetch(`https://saavn.sumit.co/api/search?query=${query}`)

const data=await response.json()

songs=data.data.songs.results

displaySongs(songs)

}


function displaySongs(list){

trackContainer.innerHTML=""

list.forEach((song,index)=>{

const card=document.createElement("div")

card.className="song-card"

card.innerHTML=`

<img src="${song.image[2].url}">

<div>

<h4>${song.title}</h4>

<p>${song.primaryArtists}</p>

</div>

`

card.onclick=()=>playSong(index)

trackContainer.appendChild(card)

})

}


async function playSong(index){

currentIndex=index

const song=songs[index]

const response=await fetch(`https://saavn.sumit.co/api/songs?id=${song.id}`)

const data=await response.json()

const audio=data.data[0].downloadUrl.find(x=>x.quality==="160kbps").url

modalTitle.textContent=`${song.title} - ${song.primaryArtists}`

modalImage.src=song.image[2].url

modalAudio.src=audio

modal.style.display="flex"

modalAudio.play()

}


document.getElementById("prev-button").onclick=()=>{

if(currentIndex>0){

currentIndex--

playSong(currentIndex)

}

}


document.getElementById("next-button").onclick=()=>{

if(currentIndex<songs.length-1){

currentIndex++

playSong(currentIndex)

}

}


document.querySelector(".close").onclick=()=>{

modal.style.display="none"

modalAudio.pause()

}


searchButton.onclick=()=>{

const query=searchInput.value.trim()

if(query) fetchSongs(query)

}


searchInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

const query=searchInput.value.trim()

if(query) fetchSongs(query)

}

})


document.getElementById("mode-button").onclick=()=>{

document.body.classList.toggle("dark-mode")

}
