
const wordInput = document.getElementById('wordInput');
const displayWord = document.getElementById('displayWord');
const partOfSpeech = document.getElementById('partOfSpeech');
const phonetic = document.getElementById('phonetic');
const meaningText = document.getElementById('meaningText');
const errorMessage = document.getElementById('errorMessage');

const initialState = document.getElementById('initialState');
const resultWrapper = document.getElementById('resultWrapper');

const audioBtn = document.getElementById('audioBtn');
const defTab = document.getElementById('defTab');
const exTab = document.getElementById('exTab');
const synTab = document.getElementById('synTab');


let currentWordData = null;
let audioPlayer = new Audio();


async function getWordData(word) {
    try {
        errorMessage.innerText = ""; 
        
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
            throw new Error("Word not found. Try another one!");
        }

        const data = await response.json();
        currentWordData = data[0]; 
        displayResults(currentWordData);

    } catch (error) {
        errorMessage.innerText = error.message;
        resultWrapper.classList.add('hidden');
        initialState.classList.remove('hidden');
    }
}


function displayResults(data) {
   
    initialState.classList.add('hidden');
    resultWrapper.classList.remove('hidden');

  
    displayWord.innerText = data.word;
    partOfSpeech.innerText = data.meanings[0].partOfSpeech;
    phonetic.innerText = data.phonetic || "";
    
   
    showDefinition();

  
    const audioUrl = data.phonetics.find(p => p.audio !== "")?.audio;
    if (audioUrl) {
        audioBtn.style.display = "block";
        audioPlayer.src = audioUrl;
    } else {
        audioBtn.style.display = "none";
    }
}


function showDefinition() {
    setActiveTab(defTab);
    meaningText.innerText = currentWordData.meanings[0].definitions[0].definition;
}

function showExample() {
    setActiveTab(exTab);
    const example = currentWordData.meanings[0].definitions[0].example;
    meaningText.innerText = example ? `"${example}"` : "No example available.";
}

function showSynonyms() {
    setActiveTab(synTab);
    const synonyms = currentWordData.meanings[0].synonyms;
    meaningText.innerText = synonyms.length > 0 ? synonyms.join(", ") : "No synonyms found.";
}


function setActiveTab(clickedTab) {
    [defTab, exTab, synTab].forEach(btn => btn.classList.remove('active'));
    clickedTab.classList.add('active');
}



wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && wordInput.value.trim() !== "") {
        getWordData(wordInput.value);
    }
});


audioBtn.addEventListener('click', () => {
    audioPlayer.play();
});


defTab.addEventListener('click', showDefinition);
exTab.addEventListener('click', showExample);
synTab.addEventListener('click', showSynonyms);