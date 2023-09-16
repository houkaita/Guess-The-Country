const searchInput = document.getElementById('guess');
const guesses = document.getElementById('guesses');
const suggestionList = document.getElementById('suggestionList');

const apiUrlAll = 'https://restcountries.com/v3.1/all';

let randomCountry;  // Variable to store the random country information

// Function to get a random country
const getRandomCountry = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        } else {
            const data = await response.json();
            const randomIndex = Math.floor(Math.random() * data.length);
            randomCountry = data[randomIndex];  // Store the random country information
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Function to handle loading the random country
const loadRandomCountry = async () => {
    await getRandomCountry();  // Call the function to get a random country
    console.log('Random Country:', randomCountry);  // Log the random country
};

// Call the function when the page loads
window.addEventListener('load', loadRandomCountry);

// Now you can access the randomCountry variable throughout your code
// For example:
// console.log(randomCountry);

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
    const currency = document.createElement('p');
    const continent = document.createElement('p');
    const flag = document.createElement('img');

    singularGuess.className = 'singularGuess';

    flag.src = countryData.flags.png;
    flag.className = 'box';

    name.textContent = countryData.name.common;
    name.className = 'box';

    continent.textContent = countryData.continents; 
    continent.className = 'box';
    
    borders.textContent = countryData.borders;
    borders.className = 'box';

    const currencyCode = Object.keys(countryData.currencies)[0];  // Assuming there's only one currency for simplicity
    const currencyData = countryData.currencies[currencyCode];

    currency.textContent = currencyData.name;
    currency.className = 'box';

    population.textContent = populationText(countryData.population);
    population.className = 'box';

    size.textContent = territoryText(countryData.area);
    size.className = 'box';
    
    guesses.appendChild(singularGuess);

    singularGuess.appendChild(flag);
    singularGuess.appendChild(name);
    singularGuess.appendChild(size);
    singularGuess.appendChild(borders);
    singularGuess.appendChild(continent);
    singularGuess.appendChild(population);
    singularGuess.appendChild(currency);
}

function checkCorrect () {

}

function populationText (population) {
    const realCountryPopulation = randomCountry.population;
    const range = (realCountryPopulation*10/100);

    console.log(realCountryPopulation)
    
    if(population < range + realCountryPopulation && population > realCountryPopulation - range) {
        return "Population is similar to this country"
    }
    if(population > range + realCountryPopulation) {
        return "Population is higher to this country"
    }
    if(population < realCountryPopulation - range) {
        return "Population is smaller to this country"
    }
}

function territoryText (territory) {
    const realCountryTerritory = randomCountry.area;
    const range = (realCountryTerritory*10/100);

    console.log(realCountryTerritory)
    
    if(territory < range + realCountryTerritory && territory > realCountryTerritory - range) {
        return "Territory is similar to this country"
    }
    if(territory > range + realCountryTerritory) {
        return "Territory is higher to this country"
    }
    if(territory < realCountryTerritory - range) {
        return "Territory is smaller to this country"
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