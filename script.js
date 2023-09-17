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
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const loadRandomCountry = async () => {
    await getRandomCountry();  
    console.log('Random Country:', randomCountry);  
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
    const singularGuess = document.createElement('div');
    const name = document.createElement('p');
    const size = document.createElement('p');
    const population = document.createElement('p');
    const borders = document.createElement('p');
    //const currency = document.createElement('p');
    const continent = document.createElement('p');
    const languages = document.createElement('p');
    const flag = document.createElement('img');

    singularGuess.className = 'singularGuess';

    flag.src = countryData.flags.png;
    flag.className = 'box';
    
    name.textContent = countryData.name.common;
    name.className = 'box';
    if(randomCountry.name.common === countryData.name.common) {
        flag.className += ' green';
        name.className += ' green';
    }

    continent.textContent = countryData.continents; 
    continent.className = 'box';
    if(randomCountry.continents[0] === countryData.continents[0]) {
        continent.className += ' green';
    }
    
    if(countryData.borders === undefined) {
        borders.textContent = 'No boders';
    }
    else {
        borders.textContent = countryData.borders;
    }

    borders.className = 'box';

    /*const currencyCode = Object.keys(countryData.currencies)[0];  
    const currencyData = countryData.currencies[currencyCode];

    currency.textContent = currencyData.name;
    currency.className = 'box';
 
    const currencyRandomCountryCode = Object.keys(randomCountry.currencies)[0];  
    const currencyRandomCountryData = randomCountry.currencies[currencyRandomCountryCode];
 
    if(currencyRandomCountryData.name === currencyData.name) {
        currency.className += ' green';
    }*/

    const languageCode = Object.keys(countryData.languages)[0];  
    const languageData = countryData.languages[languageCode];

    languages.textContent = languageData;
    languages.className = 'box';

    const languageRandomCountryCode = Object.keys(randomCountry.languages)[0];  
    const languageRandomCountryData = randomCountry.languages[languageRandomCountryCode];

    if(languageRandomCountryData === languageData) {
        languages.className += ' green';
    }

    population.textContent = populationText(countryData.population);
    population.className = 'box';

    if(randomCountry.population === countryData.population) {
        population.className += ' green';
    }

    size.textContent = territoryText(countryData.area);
    size.className = 'box';

    if(randomCountry.area === countryData.area) {
        size.className += ' green';
    }
    
    guesses.appendChild(singularGuess);

    singularGuess.appendChild(flag);
    singularGuess.appendChild(name);
    singularGuess.appendChild(size);
    singularGuess.appendChild(borders);
    singularGuess.appendChild(continent);
    singularGuess.appendChild(population);
    singularGuess.appendChild(languages);
    //singularGuess.appendChild(currency);
}

function populationText (population) {
    const realCountryPopulation = randomCountry.population;
    const range = (realCountryPopulation*10/100);

    console.log(realCountryPopulation)
    
    if(population < range + realCountryPopulation && population > realCountryPopulation - range) {
        return "Population is similar to this country"
    }
    if(population > range + realCountryPopulation) {
        return "Population is smaller than this country"
    }
    if(population < realCountryPopulation - range) {
        return "Population is higher than this country"
    }
}

function territoryText (territory) {
    const realCountryTerritory = randomCountry.area;
    const range = (realCountryTerritory*10/100);

    console.log(realCountryTerritory)
    
    if(territory < range + realCountryTerritory && territory > realCountryTerritory - range) {
        return "Territory is similar than this country"
    }
    if(territory > range + realCountryTerritory) {
        return "Territory is smaller than this country"
    }
    if(territory < realCountryTerritory - range) {
        return "Territory is higher than this country"
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