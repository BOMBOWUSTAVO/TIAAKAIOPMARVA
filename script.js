const MODEL_URL = "https://teachablemachine.withgoogle.com/models/e5wx5rypj/"; 

let model, maxPredictions;
let targetColor = "";
let timer = 15;
let interval;
let stream;

const colors = ["Vermelho", "Laranja", "Amarelo", "Verde", "Azul", "Azul Marinho", "Roxo"]

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function startGame() {
    await setupCamera();
    await loadModel ();
    chooseNewColor ();
    startTimer();
    detectLoop();
}
async function setupCamera(){
    try{
        stream = await navigator.mediaDevices.getUserMedia({video:true});
        video.srcObject = stream;
        await video.onplay();
    } catch (err) {
        alert("Erro ao acessar a câmera" + err);
    }
}
async function loadModel() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}
function chooseNewColor() {
    targetColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById("target-color").textContent = `Mostre a cor ${targetColor}`;
}
function startTimer(){
    timer = 10;
    document.getElementById("timer").textContent = `Tempo: ${timer}`;
clearInterval (interval);
interval = setInterval(() => {
    timer--;
    document.getElementById("timer").textContent = `Tempo: ${timer} `;
    if (timer <= 0) {
        clearInterval (interval);
        alert("Tempo esgotado! Seja mais rápido, hein? Fim de Jogo!!!")
        stopCamera();
    }
}, 1000);
}
async function detectLoop() {
    ctx.drawImage(video, 0, 0, 224, 224);
    const predictions = await model.predict(canvas);

    const match = predictions.find(p => p.className === targetColor && p.probability > 0.85);

    if (match) {
        clearInterval(interval);
        alert(`Acertou! Era ${targetColor}`);
        chooseNewColor();
        startTimer();
    }

    setTimeout(detectLoop, 300);
}
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}