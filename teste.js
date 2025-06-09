//key api AIzaSyBBCL8YAHFkaR1IuUb1-kv_ZVaUXDia0pg

const section = document.querySelector("#videos")
const obj = []
const ids = []

//buscando videos já cadastrados no json
fetch("https://filipe520.github.io/api-cursoEmVideo/db/videos.json")
.then(res=>res.json())
.then(data=>ids.push(...(data.map(video=>video.id))))

function searchVideos() {
    let playlist = document.querySelector("#idplaylist").value
    let course = document.querySelector("#idcourse").value

    section.innerHTML = ""

    if(playlist == ""){
        alert("Adicone o id da playlist")
        return
    }

    if(course == ""){
        alert("Faltou o id do curso, json incompleto")
    }

    fteste(playlist, course)
}

function copyVideos() {
    const videos = JSON.stringify(obj).replace(/^\[(.+)\]$/, "$1") //retira os colchetes de array
    navigator.clipboard.writeText(videos).then(()=>alert('Videos copiados'))
}

async function fteste(id, course) {
    const BASE_URL = "https://www.googleapis.com/youtube/v3/playlistItems"
    const API_KEY = "AIzaSyBBCL8YAHFkaR1IuUb1-kv_ZVaUXDia0pg"

        const params = new URLSearchParams({
        part: 'snippet', // Quais informações você quer (snippet para título, descrição, thumbnail etc.)
        playlistId: id, //id da playlist,
        maxResults: 50, //numero maximo de resultados
        key: API_KEY     // Sua chave de API
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`)
    const data = await response.json()

    console.log(data)

    data.items.forEach(async (video, id) => {
        const snippet = video.snippet
        createVideo(snippet.title, snippet.description, snippet.thumbnails.medium.url)

        obj[id] = {}
        obj[id].id = await createId(ids)
        obj[id].course = course
        obj[id].order = id
        obj[id].slug = getSlug(snippet.title)
        obj[id].title = snippet.title
        obj[id].description = snippet.description
        obj[id].image = snippet.thumbnails.medium.url
        obj[id].video = `https://www.youtube.com/embed/${snippet.resourceId.videoId}`

    });
    
}

function createVideo(title, description, url) {
    const conteiner = document.createElement("div")
    const div = document.createElement("div")
    const h1 = document.createElement("h1")
    const p = document.createElement("p")
    const img = document.createElement("img")

    h1.textContent = title
    p.textContent = description.slice(0,300) + "..."
    img.src = url

    div.appendChild(h1)
    div.appendChild(p)

    conteiner.appendChild(img)
    conteiner.appendChild(div)
    conteiner.className = "conteiner-video"

    section.appendChild(conteiner)
}

/**
 * 
 * @param {string} title 
 * @returns 
 */

function getSlug(title) {
    let slug = title.toLowerCase()

    //removendo caracteres não necessarios = <|>|\/|~

    slug = slug.replaceAll(/@|#|-|\(|\)|!|\?|\$|%|&|\^|\*|_|\+|=|\[|\]|{|}|:|;|,|\.|'|"|`|<|>|\/|\\|\||~/g, "")
    
    //Removendo espaços em branco ex0tras
    slug = slug.replace(/\s{2,}/g, " ")

    //Alterando caracteres acentuados
    slug = slug.replaceAll("ç", "c")
    slug = slug.replaceAll(/ã|á|à|ä|â/g, "a")
    slug = slug.replaceAll(/é|è|ë|ê/g, "e")
    slug = slug.replaceAll(/í|ì|ï|î/g, "i")
    slug = slug.replaceAll(/ó|ò|õ|ö|õ/g, "o")
    slug = slug.replaceAll(/ú|ù|ü|û/g, "u")

    //Alterando espaços em branco por -
    slug = slug.replaceAll(" ", "-")

    return slug
}

async function createId(ids){
    const id = await randomsCaracter(8)
    
    if(ids.includes(id)){
        return createId(ids)
    }else{
        ids.push(id)
        return id
    }
}

async function randomsCaracter(quantity, base = "",  counter = 0){
    const option = random(2) // 0 ou 1
    const letters = "abcdefghijklmnopqrstuvwxyz"

    if(option == 0){ 
        //adiciona a base uma letra aleatoria
        base += letters[random(letters.length)]
    }else{
        //adiciona a base uma numero aleatório
        base += random(10)
    }

    if(counter == quantity){
        return base
    }else{
        return randomsCaracter(quantity, base, counter+1)
    }
}

//retorna um numero inteiro aleatório com base em um numero fornecido
//ex random(10) return 0 a 9
function random(number) {
    return Math.floor(Math.random() * number)
}
