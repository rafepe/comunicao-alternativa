document.addEventListener('DOMContentLoaded', function() {
    displayFixedPictograms();
});

const fixedPictograms = ['não','eu', 'comer', 'lavar o cabelo', 'sair', 'brincar', 'dormir', 'sim'];

async function displayFixedPictograms() {
    const fixedResultsContainer = document.getElementById('fixedResultsContainer');

    for (const term of fixedPictograms) {
        try {
            const response = await fetch(`https://api.arasaac.org/v1/pictograms/pt/search/${term}`);
            const data = await response.json();

            if (data.length > 0) {
                const firstPictogramId = data[0]._id;
                const imageUrl = `https://api.arasaac.org/api/pictograms/${firstPictogramId}`;
                const pictogramElement = document.createElement('div');
                pictogramElement.className = 'fixedPictogram';
                pictogramElement.innerHTML = `
                    <img src="${imageUrl}" alt="${term}" onclick="setSearchTermAndSearch('${term}')">
                    <p>${term}</p>
                `;
                fixedResultsContainer.appendChild(pictogramElement);
            }
        } catch (error) {
            console.error(`Erro ao buscar o pictograma para "${term}":`, error);
        }
    }
}

function setSearchTermAndSearch(term) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = term;
    searchPictograms(term);
}

async function searchPictograms(term = null) {
    const searchText = term || document.getElementById('searchInput').value.trim();
    if (!searchText) {
        alert('Por favor, insira um termo de pesquisa.');
        return;
    }

    try {
        const searchResponse = await fetch(`https://api.arasaac.org/v1/pictograms/pt/search/${searchText}`);
        const searchData = await searchResponse.json();

        if (searchData.length === 0) {
            displayResults(null);
            return;
        }

        const firstPictogramId = searchData[0]._id;
        const imageUrl = `https://api.arasaac.org/api/pictograms/${firstPictogramId}`;

        displayResults(imageUrl);
    } catch (error) {
        console.error('Ocorreu um erro ao buscar os pictogramas:', error);
        alert('Ocorreu um erro ao buscar os pictogramas. Por favor, tente novamente.');
    }
}

function displayResults(imageUrl) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (!imageUrl) {
        resultsContainer.innerHTML = 'Nenhum resultado encontrado.';
        return;
    }

    const pictogramElement = document.createElement('div');
    pictogramElement.innerHTML = `
        <img src="${imageUrl}" alt="Pictograma" style="display: block; margin: 0 auto;">
    `;
    resultsContainer.appendChild(pictogramElement);
}
