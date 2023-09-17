const searchInput = document.getElementById('guess');
const guesses = document.getElementById('guesses');
const suggestionList = document.getElementById('suggestionList');

const apiUrlAll = 'https://restcountries.com/v3.1/all';

let randomCountry;

const getRandomCountry = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        } else {
            const data = await response.json();
            const randomIndex = Math.floor(Math.random() * data.length);
            randomCountry = data[randomIndex];  
            console.log(randomCountry);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const loadRandomCountry = async () => {
    try {
        await getRandomCountry(); 
        /*const countryData = await getCountryInformation('Australia');
        console.log('Country Information:', countryData);
        randomCountry = countryData;*/
    } catch (error) {
        console.error('Error:', error);
    }
};

window.addEventListener('load', loadRandomCountry);

async function getCountryInformation(selected) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${selected}?fullText=true`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else {
            const data = await response.json(); 
            return data[0];
        }
    } catch (error) {
        console.error('Error:', error);
    }

}

async function validate() {
    const selected = document.querySelector(`#suggestionList > option[value="${searchInput.value}"]`);
  
    if (selected) {
        try {
            const countryInfo = await getCountryInformation(selected.value);
            if (countryInfo) {
                addGuess(countryInfo);
            } else {
                alert("An problem has occurred");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Failed to find the country");
        }
    } else {
        alert("Invalid country");
    }
    
    searchInput.value='';
}

  async function validate() {
    const selectedValue = searchInput.value;
    if (selectedValue) {
        try {
            const countryInfo = await getCountryInformation(selectedValue);
            if (countryInfo) {
                addGuess(countryInfo);
            } else {
                alert("Invalid country");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Failed to validate country");
        }
    } else {
        alert("No country selected");
    }

    searchInput.value = '';
}



function addGuess(countryData) {
    let singularGuess = document.createElement('div');
    let name = document.createElement('p');
    let size = document.createElement('p');
    let population = document.createElement('p');
    let borders = document.createElement('p');
    let continent = document.createElement('p');
    let languages = document.createElement('p');
    let flag = document.createElement('img');

    singularGuess.className = 'singularGuess';

    flag.src = countryData.flags.png;
    flag.className = 'box';

    //Nome

    name = buildElement(name, countryData.name.common, randomCountry.name.common);

    //Continente

    continent = buildElement(continent, countryData.continents[0], randomCountry.continents[0]);
    
    //Bordas

    if (countryData.borders === undefined) {
        borders.textContent = 'No borders';
        if(randomCountry.borders === undefined) {
            borders.classList.add('green');
        }
    } else {
        borders.textContent = countryData.borders.join(', ');
        const isCloseTo = countryData.borders.some(border => randomCountry.cca3.includes(border));
    
        if (isCloseTo) {
            borders.classList.add('yellow');
        } else {
            borders.classList.remove('yellow');
        }
    }
    
    borders.classList.add('box')

    //lingua

    const languageNames = Object.values(countryData.languages);
    const languageRandomNames = Object.values(randomCountry.languages);
    
    const hasCommonLanguage = languageNames.some(language => languageRandomNames.includes(language));
    
    if (hasCommonLanguage) {
        languages.classList.add('yellow');
    }
    
    const languageString = languageNames.join(', ');
    const languageRandomString = languageRandomNames.join(', ');
    
    languages = buildElement(languages, languageString, languageRandomString);
    

    //População

    population = buildElement(population, countryData.population, randomCountry.population);
    population.textContent = populationText(countryData.population);

    //Território

    size = buildElement(size, countryData.area, randomCountry.area);
    size.textContent = territoryText(countryData.area);

    //Gambiarra para tudo ficar verde

    if(countryData.name.common === randomCountry.name.common) {
        flag.classList.add('green');
        borders.classList.add('green');
    }
    
    //Adicionando elemntos ao HTML

    guesses.appendChild(singularGuess);

    singularGuess.appendChild(flag);
    singularGuess.appendChild(name);
    singularGuess.appendChild(size);
    singularGuess.appendChild(borders);
    singularGuess.appendChild(continent);
    singularGuess.appendChild(population);
    singularGuess.appendChild(languages);
}

function buildElement (element, countryInfo, randomInfo) {
    element.textContent = countryInfo;
    element.classList.add('box');

    if(randomInfo === countryInfo) {
        element.classList.add('green');
    }

    return element;
}

function populationText (population) {
    const realCountryPopulation = randomCountry.population;
    const range = (realCountryPopulation*10/100);
    
    if(population < range + realCountryPopulation && population > realCountryPopulation - range) {
        return "Population is similar"
    }
    if(population > range + realCountryPopulation) {
        return "Population is smaller"
    }
    if(population < realCountryPopulation - range) {
        return "Population is higher"
    }
}

function territoryText (territory) {
    const realCountryTerritory = randomCountry.area;
    const range = (realCountryTerritory*10/100);
    
    if(territory < range + realCountryTerritory && territory > realCountryTerritory - range) {
        return "Territory is similar"
    }
    if(territory > range + realCountryTerritory) {
        return "Territory is smaller"
    }
    if(territory < realCountryTerritory - range) {
        return "Territory is higher"
    }
}

fetch(apiUrlAll) 
    .then(res => res.json())
    .then(data => { 
        data.forEach((obj) => {
            const option = document.createElement('option');
            option.value = obj.name.common;
            suggestionList.appendChild(option)
        })  
    })