let infoCardContainer = document.querySelector('.card-container');
let playerCarouselContainer = document.querySelector('.carousel-container');
let searchInput = document.querySelector('input[type="text"]');
let dados = [];
let player_cards = [];
let currentIndex = 0; // Representa o card que está no centro

async function iniciarBusca(){
    try {
        let resposta = await fetch('data.json');
        dados = await resposta.json();
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        infoCardContainer.innerHTML = "<p>Falha ao carregar conteúdo. Tente novamente mais tarde.</p>";
    }
}

function realizarBusca() {
    const termoBusca = searchInput.value.toLowerCase();
    const dadosFiltrados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) || 
        dado.descricao.toLowerCase().includes(termoBusca)        
    );
    
    // Esconde o carrossel e limpa o link ativo ao realizar uma busca
    document.querySelector('.carousel-wrapper').style.display = 'none';
    gerenciarLinkAtivo(null);

    renderizarCards(dadosFiltrados);
}

function renderizarCards(dadosParaRenderizar){
    infoCardContainer.innerHTML = '';
    playerCarouselContainer.innerHTML = '';

    if (dadosParaRenderizar.length === 0) {
        infoCardContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
    }

    for (let dado of dadosParaRenderizar){
        if (dado.tipo === 'jogador') {
            let article = document.createElement('article');
            article.classList.add('card');
            article.innerHTML = `
                <img src="${dado.imagemUrl}" alt="Foto de ${dado.nome}" class="player-photo">
                <div class="card-content">
                    <h2>${dado.nome}</h2>
                    <div class="player-info">
                        <div class="info-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.5 2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M9.05 11.293c.5-1.002.952-2.003 1.328-3.003.145-.388.298-.78.458-1.176l.21.844c.225.9.47 1.805.737 2.71.245.847.51 1.706.794 2.57.276.84.564 1.69.866 2.549l.33.99H16v-1.053l-1.215-3.24-.2-.533c-.27-.72-.564-1.448-.876-2.185-.323-.765-.68-1.536-1.06-2.322-.387-.798-.81-1.61-1.27-2.436H9.234l-.274.92c-.35.935-.75 1.853-1.184 2.753-.442.918-.92 1.82-1.424 2.712l-.244.43-.244-.43c-.504-.892-.982-1.794-1.424-2.712-.434-.9-.834-1.818-1.184-2.753l-.274-.92H.5l-1.27 2.436c-.46.826-.883 1.638-1.27 2.436-.38.786-.737 1.557-1.06 2.322-.312.737-.606 1.465-.876 2.185l-.2.533L0 15.947V17h3.09l.33-.99c.302-.858.59-1.71.866-2.549.283-.864.552-1.723.794-2.57.268-.905.512-1.81.737-2.71l.21-.844c.16.396.313.788.458 1.176.376 1 .828 2 1.328 3.003z"/></svg>
                            <span>${dado.posicao}</span>
                        </div>
                        <div class="info-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/></svg>
                            <span>${dado.idade} anos</span>
                        </div>
                        <div class="info-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"/></svg>
                            <span>${dado.descricao.replace("Valor de mercado: ", "")}</span>
                        </div>
                    </div>
                </div>
                <a href="${dado.link}" target="_blank" class="profile-button">Ver Perfil</a>
            `;
            playerCarouselContainer.appendChild(article);
        } else if (dado.tipo === 'produto') {
            let link = document.createElement('a');
            link.href = dado.link;
            link.target = '_blank';
            link.classList.add('card');
            link.innerHTML = `
                <img src="${dado.imagemUrl}" alt="Imagem de ${dado.nome}" class="info-photo">
                <div class="card-content">
                    <h2>${dado.nome}</h2>
                    <p>${dado.descricao}</p>
                </div>
                <span class="buy-button">Comprar</span>
            `;
            infoCardContainer.appendChild(link); // Exibe os produtos no container principal
        } else { // tipo 'info'
            let article = document.createElement('article');
            article.classList.add('card');
            article.innerHTML = `
                <img src="${dado.imagemUrl}" alt="Imagem sobre ${dado.nome}" class="info-photo">
                <div class="card-content">
                    <h2>${dado.nome}</h2>
                    <p>${dado.descricao}</p>
                    <a href="${dado.link}" target="_blank">Saiba mais</a>
                </div>
            `;
            infoCardContainer.appendChild(article);
        }
    };
}

function mostrarPaginaInicial() {
    const jogadores = dados.filter(dado => dado.tipo === 'jogador');
    currentIndex = 1; // Começa com o segundo jogador no centro para uma visão equilibrada

    infoCardContainer.innerHTML = ''; // Garante que a área de informações esteja limpa
    playerCarouselContainer.innerHTML = '';

    renderizarCards(jogadores); // Renderiza os jogadores no carrossel

    // Garante que o carrossel e as setas estejam visíveis
    document.querySelector('.carousel-wrapper').style.display = 'flex';

    searchInput.value = ''; // Limpa o campo de busca
}

function gerenciarLinkAtivo(linkClicado) {
    document.querySelectorAll('.info-nav a').forEach(link => {
        link.classList.remove('active-link');
    });
    if (linkClicado) {
        linkClicado.classList.add('active-link');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarBusca().then(() => {
        mostrarPaginaInicial();
        updateCarousel(); // Posiciona e destaca o carrossel inicial
        gerenciarLinkAtivo(document.querySelector('#home-link')); // Define Home como ativo no início
    });

    // Adiciona evento para os links de navegação de informações
    const searchButton = document.getElementById('search-button');
    const infoNavLinks = document.querySelectorAll('.info-nav a[data-search]');
    infoNavLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o comportamento padrão do link
            const termoBusca = event.target.dataset.search;
            searchInput.value = ''; // Limpa a busca ao navegar

            gerenciarLinkAtivo(event.target);

            // Esconde o carrossel e as setas ao exibir uma página de informação
            document.querySelector('.carousel-wrapper').style.display = 'none';

            let dadosFiltrados;
            if (termoBusca === '_products_') {
                // Filtra para mostrar todos os produtos
                dadosFiltrados = dados.filter(dado => dado.tipo === 'produto');
            } else {
                // Filtra pelo nome exato para os links de informação
                dadosFiltrados = dados.filter(dado => dado.nome.toLowerCase() === termoBusca.toLowerCase());
            }
            renderizarCards(dadosFiltrados);
        });
    });

    // Adiciona evento para o link "Home"
    const homeLink = document.querySelector('#home-link');
    homeLink.addEventListener('click', (event) => {
        event.preventDefault();
        gerenciarLinkAtivo(event.target);
        mostrarPaginaInicial();
        updateCarousel(); // Garante que o carrossel e as setas sejam resetados
    });

    // Lógica para as setas de navegação do carrossel
    const scrollLeftButton = document.getElementById('scroll-left');
    const scrollRightButton = document.getElementById('scroll-right');

    scrollLeftButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }); 

    scrollRightButton.addEventListener('click', () => {
        player_cards = Array.from(playerCarouselContainer.children);
        if (currentIndex < player_cards.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    }); 
    
    function updateCarousel() {
        const viewport = document.querySelector('.carousel-viewport');
        player_cards = Array.from(playerCarouselContainer.children);
        if (player_cards.length === 0) return;

        // Calcula o deslocamento para centralizar o card atual no viewport
        const cardWidth = player_cards[0].offsetWidth + parseInt(getComputedStyle(player_cards[0]).marginRight);
        const offset = -currentIndex * cardWidth + (viewport.offsetWidth / 2) - (cardWidth / 2);
        playerCarouselContainer.style.transform = `translateX(${offset}px)`;

        // Atualiza o destaque do card central
        player_cards.forEach((card, index) => {
            card.classList.toggle('center-card', index === currentIndex);
        });

        // Atualiza o estado das setas
        scrollLeftButton.disabled = currentIndex === 0;
        scrollRightButton.disabled = currentIndex === player_cards.length - 1;
    }
});
