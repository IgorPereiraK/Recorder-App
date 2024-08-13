document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        document.querySelector("#record").classList.add("recording")
        document.querySelector("#mic-icon").classList.add("hide")
    }, 2000)


})

window.onload = () => {
    document.body.classList.remove("preload")
}