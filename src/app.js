// Tailwind Configuration
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'puc-blue': '#42929d',
        'puc-light-blue': '#6ab7c2',
        'puc-gold': '#d2ab00',
        'puc-gray': '#666666',
        'puc-light-gray': '#F5F5F5'
      },
      fontFamily: {
        'puc': ['Arial', 'sans-serif']
      }
    }
  }
};

$(document).ready(function() {
  // ==========================================
  // CÓDIGO DO CARROSSEL
  // ==========================================

  // Dados dos slides
  const slides = [
     {
      image: "imagens/slider/13.jpg",
      title: "Josiel Alcolumbre recebe especialista da PUC-Rio no Sebrae Amapá",
      description: "Professor Eloi Fernández, referência em petróleo e gás, discutiu capacitações e entregou obra técnica ao presidente.",
      buttonText: "Leia aqui",
      slideUrl: "https://www.debubuia.com.br/noticia/josiel-alcolumbre-recebe-especialista-da-puc-rio-no-sebrae-amapa"
    },
    {
      image: "imagens/slider/12.jpg",
      title: "Clécio e comitiva visitam Porto de Niterói e PUC Rio",
      description: "O governador do Amapá foi recepcionado pelo reitor da PUC-RJ, Padre Anderson Pedroso, pelo professor Eloi Fernández, diretor do Iepuc e pela equipe técnica do instituto.",
      buttonText: "Leia aqui",
      slideUrl: "https://www.diariodoamapa.com.br/cadernos/politica/clecio-e-comitiva-visitam-porto-de-niteroi-e-puc-rio/"
    },
    {
      image: "imagens/slider/10.jpg",
      title: "O BRASIL DO GÁS: PROMESSAS, PARADOXOS E POTENCIAL",
      description: "Podcast Iluministas com Edmar Almeida, economista, doutor pela Universidade de Grenoble (França), e professor do Instituto de Energia da PUC-Rio",
      buttonText: "Assista aqui",
      slideUrl: "https://www.youtube.com/watch?si=sQCMozE2DvY-pyAi&v=30duTa-cEPA&feature=youtu.be"
    },
    {
      image: "imagens/slider/8.jpg",
      title: "Hybrid Power Plants In The Context Of The Energy Transition",
      description: "Artigo de autoria de Vinicius Santos Pereira, Edmar Luiz Fagundes Almeida, Marco Antonio Haikal Leite e Sergio Luiz Pinto Castiñeiras Filho",
      buttonText: "Leia aqui",
      slideUrl: "https://enerlac.olade.org/index.php/ENERLAC/article/view/297"
    },
    {
      image: "imagens/slider/1.jpg",
      title: "conectados podcast",
      description: "O que define o preço do gás no Brasil e em Santa Catarina? Com Edmar de Almeida(IEPUC)",
      buttonText: "Ouça o podcast",
      slideUrl: "https://www.youtube.com/watch?v=PkRwGQOkOlY"
    },

    {
      image: "imagens/slider/9.jpg",
      title: "Ensaio Energético",
      description: "Uma plataforma de difusão de conhecimento no mundo da economia da energia",
      buttonText: "Descubra",
      slideUrl: "https://ensaioenergetico.com.br/"
    },
    
  ];

  // Variáveis de controle do carrossel
  let currentSlide = 0;
  let slideInterval;

  // Inicializar o carrossel
  function initSlider() {
    const sliderContainer = $('.slider-container');
    const indicatorsContainer = $('.slider-indicators');

    // Limpar conteúdo existente
    sliderContainer.empty();
    indicatorsContainer.empty();

    // Adicionar slides
    slides.forEach((slide, index) => {
      const slideElement = `
        <div class="slider-item ${index === 0 ? 'active' : ''}">
          <div class="bg-cover bg-center h-full text-white flex items-center" style="background-image: url(${slide.image})">
            <div class="absolute inset-0 bg-black opacity-40"></div>
            <div class="container mx-auto px-10 relative z-10">
              <div class="md:w-1/2">
                <p class="font-bold text-sm uppercase text-yellow-400 mb-2">IEPUC</p>
                <h3 class="text-4xl font-bold mb-4">${slide.title}</h3>
                <p class="text-xl mb-8 leading-relaxed">${slide.description}</p>
                <a target="_blank" href=${slide.slideUrl} class="bg-blue-500 hover:bg-cyan-600 py-4 px-8 text-white font-bold uppercase text-sm rounded-lg transition-colors duration-300 inline-block">${slide.buttonText}</a>
              </div>
            </div>
          </div>
        </div>
      `;
      sliderContainer.append(slideElement);

      // Adicionar indicadores
      const indicator = $(`<div class="slider-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`);
      indicatorsContainer.append(indicator);
    });

    // Iniciar transição automática
    startSlideInterval();
  }

  // Iniciar intervalo para transição automática
  function startSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);
  }

  // Avançar para o próximo slide
  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  // Voltar para o slide anterior
  function prevSlide() {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  // Ir para um slide específico
  function goToSlide(index) {
    // Remover classe active do slide atual
    $(`.slider-item`).removeClass('active');
    $(`.slider-indicator`).removeClass('active');

    // Adicionar classe active ao novo slide
    $(`.slider-item:eq(${index})`).addClass('active');
    $(`.slider-indicator[data-index="${index}"]`).addClass('active');

    // Atualizar índice do slide atual
    currentSlide = index;

    // Reiniciar intervalo
    startSlideInterval();
  }

  // Event listeners para os controles do carrossel
  $('.slider-control.next').on('click', nextSlide);
  $('.slider-control.prev').on('click', prevSlide);

  // Event listener para os indicadores
  $(document).on('click', '.slider-indicator', function() {
    const index = $(this).data('index');
    goToSlide(index);
  });

  // Inicializar o slider
  initSlider();

  // ==========================================
// CÓDIGO DO MENU MOBILE - VERSÃO CORRIGIDA
// ==========================================

$('#mobile-menu-button').on('click', function(e) {
  e.stopPropagation(); // Impede propagação
  $('#mobile-menu').toggleClass('hidden');
});

// Toggle dos submenus mobile - VERSÃO CORRIGIDA
$('.mobile-menu-toggle').on('click', function(e) {
  e.stopPropagation(); // 🔥 IMPORTANTE: impede que o evento feche o menu
  e.preventDefault();  // 🔥 Evita comportamentos padrão indesejados
  
  const targetId = $(this).attr('data-target');
  const submenu = $('#' + targetId);
  const chevron = $(this).find('.mobile-menu-chevron');
  
  // Fecha outros submenus abertos (opcional)
  $('.mobile-submenu').not(submenu).removeClass('expanded');
  $('.mobile-menu-chevron').not(chevron).removeClass('rotated');
  
  // Toggle do submenu atual
  submenu.toggleClass('expanded');
  chevron.toggleClass('rotated');
});

// Fechar menu ao clicar fora - VERSÃO CORRIGIDA
$(document).on('click', function(event) {
  if (!$(event.target).closest('#mobile-menu').length && 
      !$(event.target).closest('#mobile-menu-button').length) {
    $('#mobile-menu').addClass('hidden');
    // Opcional: fecha todos os submenus ao fechar o menu
    $('.mobile-submenu').removeClass('expanded');
    $('.mobile-menu-chevron').removeClass('rotated');
  }
});

  // ==========================================
  // ANIMAÇÕES E EFEITOS
  // ==========================================

  // Animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).css({
          'opacity': '1',
          'transform': 'translateY(0)'
        });
      }
    });
  }, observerOptions);

  // Adicionar classes de animação
  $('.feature-card, .course-card, .news-card').each(function() {
    $(this).css({
      'opacity': '0',
      'transform': 'translateY(20px)',
      'transition': 'opacity 0.6s ease, transform 0.6s ease'
    });
    observer.observe(this);
  });

  // Adicionar animação fade-in ao hero
  const heroContent = $('.animate-fade-in');
  if (heroContent.length) {
    heroContent.css({
      'opacity': '0',
      'transform': 'translateY(30px)',
      'transition': 'opacity 1s ease, transform 1s ease'
    });

    setTimeout(() => {
      heroContent.css({
        'opacity': '1',
        'transform': 'translateY(0)'
      });
    }, 300);
  }
});


// Função principal para carregar artigos
function loadMaterias() {
    const sheetID = "160ARd8yznqu0xcCTh3yXmxtotix9OmPVZfGDdy2uOpU";
    const sheetName = "materias";
    const container = document.getElementById('materias-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');

    // Mostra o indicador de carregamento e esconde o conteúdo anterior
    loadingIndicator.style.display = 'block';
    container.style.display = 'none';
    errorMessage.classList.add('hidden');

    // Chama a função para buscar os dados usando fetch
    fetchGoogleSheetsData(sheetID, sheetName);
}

// Função para buscar dados da planilha usando a API v4 e fetch
async function fetchGoogleSheetsData(sheetID, sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        
        const text = await response.text();
        
        // Remove o wrapper JSONP 'google.visualization.Query.setResponse'
        const jsonText = text.substring(47, text.length - 2);
        const data = JSON.parse(jsonText);
        
        processAndDisplayData(data);
    } catch (error) {
        console.error('Falha ao carregar dados do Google Sheets:', error);
        showSampleData();
    }
}

// Processa e exibe os dados
function processAndDisplayData(data) {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'none';

    try {
        if (!data.table || !data.table.rows) {
            throw new Error('Estrutura de dados inválida');
        }

        // Mapeia os dados da API para um array de objetos mais amigável
        const rows = data.table.rows
            .map(row => {
                const c = row.c;
                // Pular linhas sem título (assumindo que o título é a 2ª coluna)
                if (!c || !c[1] || !c[1].v) return null;
                
                return {
                    data: c[0]?.v ?? null,
                    titulo: c[1]?.v ?? '',
                    veiculo: c[2]?.v ?? '',
                    resumo: c[3]?.v ?? '',
                    link: c[4]?.v ?? '',
                    imagem: c[5]?.v ?? ''
                };
            })
            .filter(Boolean); // Remove os valores nulos

        if (rows.length === 0) {
            showSampleData();
            return;
        }

        displayMaterias(rows);
    } catch (error) {
        console.error("Erro ao processar dados do Google Sheets:", error);
        showSampleData();
    }
}

// Formata e exibe os dados na página (sem alterações significativas, exceto a lógica de data)
function displayMaterias(rows) {
    // Função para formatar a data vinda do Google Sheets (Date(YYYY,MM,DD))
    const formatDate = (dateStr) => {
        if (typeof dateStr === 'string' && dateStr.startsWith('Date(')) {
            const match = /Date\((\d+),(\d+),(\d+)\)/.exec(dateStr);
            if (match) {
                const year = parseInt(match[1]);
                const month = parseInt(match[2]); // zero-based
                const day = parseInt(match[3]);
                const d = new Date(year, month, day);
                return d.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });
            }
        } else if (dateStr instanceof Date) {
            return dateStr.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        }
        return dateStr;
    };
    
    // Sort by date (DD/MM/YYYY or Date(YYYY,MM,DD) format)
    rows.sort((a, b) => {
        try {
            const parseDate = (dateVal) => {
                if (!dateVal) return new Date(0);
                if (typeof dateVal === 'string' && dateVal.startsWith('Date(')) {
                    const match = /Date\((\d+),(\d+),(\d+)\)/.exec(dateVal);
                    if (match) {
                         // Note: month is 0-indexed in JS Date object
                        return new Date(match[1], parseInt(match[2]), match[3]); 
                    }
                } else if (typeof dateVal === 'string') {
                    const parts = dateVal.split("/");
                    if (parts.length === 3) {
                         // Note: month is 0-indexed in JS Date object
                        return new Date(parts[2], parts[1] - 1, parts[0]); 
                    }
                }
                return new Date(0); // Return a valid date for sorting
            };
            return parseDate(b.data) - parseDate(a.data);
        } catch (e) {
            console.error("Erro ao ordenar datas:", e);
            return 0;
        }
    });
    
    const limitedRows = rows.slice(0, 3);

    const html = limitedRows.map(materia => {
        const imageHTML = materia.imagem && materia.imagem.trim() !== ""
            ? `<img class="materia-img" src="${materia.imagem}" alt="${materia.titulo}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div class="materia-img fallback-img" style="display:none;"></div>`
            : `<div class="materia-img fallback-img"></div>`;

        return `
            <article class="materia-card">
                ${imageHTML}
                <div class="materia-content">
                    <h3>${materia.titulo}</h3>
                    <p class="materia-meta">
                        <i class="fas fa-newspaper mr-2"></i>
                        ${materia.veiculo} • ${formatDate(materia.data)}
                    </p>
                    <p class="materia-resumo">${materia.resumo}</p>
                    <a href="${materia.link}" target="_blank" rel="noopener noreferrer" class="materia-link">
                        Leia mais <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </article>`;
    }).join("");

    const container = document.getElementById("materias-container");
    container.innerHTML = html;
    container.style.display = 'grid';
}

function showSampleData() {
    console.log('Exibindo dados de exemplo');
    document.getElementById('loading-indicator').style.display = 'none';

    // Sample data as fallback
    const sampleData = [
        { data: "10/08/2025", titulo: "IEPUC participa de conferência internacional sobre energias renováveis", veiculo: "Jornal do Brasil", resumo: "Instituto apresenta pesquisas sobre eficiência energética e sustentabilidade em evento global.", link: "#", imagem: "" },
        { data: "05/08/2025", titulo: "Nova parceria com empresa do setor elétrico brasileiro", veiculo: "Valor Econômico", resumo: "Acordo visa desenvolvimento de tecnologias inovadoras para o mercado nacional de energia.", link: "#", imagem: "" },
        { data: "01/08/2025", titulo: "Pesquisador do IEPUC recebe prêmio de inovação", veiculo: "O Globo", resumo: "Reconhecimento internacional por desenvolvimento de soluções em energia limpa.", link: "#", imagem: "" }
    ];

    displayMaterias(sampleData);
}

// Inicia o carregamento quando a página está pronta
document.addEventListener('DOMContentLoaded', loadMaterias);

