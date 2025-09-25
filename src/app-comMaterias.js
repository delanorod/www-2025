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
    {
      image: "imagens/slider/5.jpg",
      title: "9th ELAEE",
      description: "Energy Transition, Latin American Energy Markets and Development Paths",
      buttonText: "Assista",
      slideUrl: "https://www.youtube.com/playlist?list=PLmCee3fhT3CL1QuZH2vLP7e33Lybp0tqJ"
    },
    {
      image: "imagens/slider/4.jpg",
      title: "ENERCITY 2024",
      description: "Rio: Capital da Transição Energética em Cidades",
      buttonText: "Assista",
      slideUrl: "https://www.youtube.com/watch?v=nIi9z6mKsy0&feature=youtu.be"
    },
    {
      image: "imagens/slider/6.jpg",
      title: "Qual é o Gás Natural do Brasil?",
      description: "por Eloi Fernández Y Fernández e Edmar Almeida",
      buttonText: "Clique aqui",
      slideUrl: "https://valor.globo.com/opiniao/coluna/qual-e-o-gas-natural-do-brasil.ghtml"
    }
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
  // CÓDIGO DO MENU MOBILE
  // ==========================================

  $('#mobile-menu-button').on('click', function() {
    $('#mobile-menu').toggleClass('hidden');
  });

  // Toggle dos submenus mobile
  $('.mobile-menu-toggle').on('click', function() {
    const targetId = $(this).attr('data-target');
    const submenu = $('#' + targetId);
    const chevron = $(this).find('.mobile-menu-chevron');
    
    // Toggle do submenu
    submenu.toggleClass('expanded');
    
    // Rotação do chevron
    chevron.toggleClass('rotated');
  });

  // Fechar menu ao clicar fora
  $(document).on('click', function(event) {
    if (!$(event.target).closest('#mobile-menu').length && !$(event.target).closest('#mobile-menu-button').length) {
      $('#mobile-menu').addClass('hidden');
    }
  });

  // ==========================================
  // CÓDIGO DE NAVEGAÇÃO SUAVE
  // ==========================================

  $('a[href^="#"]').on('click', function(e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 100
      }, 1000);
    }
  });

  // ==========================================
  // CÓDIGO PARA CARREGAR MATÉRIAS (Google Sheets) - index.html
  // ==========================================

  // Função para carregar artigos do Google Sheets usando JSONP
  function loadMaterias() {
    const sheetID = "160ARd8yznqu0xcCTh3yXmxtotix9OmPVZfGDdy2uOpU";
    const sheetName = "materias";

    // Mostrar indicador de carregamento
    $('#loading-indicator').show();
    $('#materias-container').hide();
    $('#error-message').addClass('hidden');

    // Tentar diferentes abordagens
    tryLoadFromSheets(sheetID, sheetName);
  }

  function tryLoadFromSheets(sheetID, sheetName) {
    // Método 1: Tentar com callback JSONP
    const callbackName = 'gsheetsCallback' + Date.now();

    window[callbackName] = function(data) {
      processGoogleSheetsData(data);
      delete window[callbackName];
    };

    const script = document.createElement('script');
    script.src = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&callback=${callbackName}&sheet=${sheetName}`;

    script.onerror = function() {
      // Método 2: Tentar com fetch e parsing manual
      tryFetchMethod(sheetID, sheetName);
    };

    document.head.appendChild(script);

    // Limpeza após timeout
    setTimeout(() => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (window[callbackName]) {
        delete window[callbackName];
        tryFetchMethod(sheetID, sheetName);
      }
    }, 8000);
  }

  function tryFetchMethod(sheetID, sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    fetch(url)
      .then(response => response.text())
      .then(text => {
        // Remover wrapper JSONP do Google
        const jsonText = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonText);
        processGoogleSheetsData(data);
      })
      .catch(error => {
        console.error('Método fetch falhou:', error);
        showSampleData(); // Fallback para dados de exemplo
      });
  }

  function processGoogleSheetsData(data) {
    try {
      $('#loading-indicator').hide();

      if (!data.table || !data.table.rows) {
        throw new Error('Estrutura de dados inválida');
      }

      const rows = data.table.rows
        .map((row, index) => {
          // Pular linha de cabeçalho
          if (index === 0) return null;

          return {
            data: (row.c && row.c[0] && row.c[0].v) ? row.c[0].v.toString() : "",
            titulo: (row.c && row.c[1] && row.c[1].v) ? row.c[1].v.toString() : "",
            veiculo: (row.c && row.c[2] && row.c[2].v) ? row.c[2].v.toString() : "",
            resumo: (row.c && row.c[3] && row.c[3].v) ? row.c[3].v.toString() : "",
            link: (row.c && row.c[4] && row.c[4].v) ? row.c[4].v.toString() : "",
            imagem: (row.c && row.c[5] && row.c[5].v) ? row.c[5].v.toString() : ""
          };
        })
        .filter(row => row && row.titulo && row.titulo.trim() !== "");

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

  function displayMaterias(rows) {
    // Ordenar por data (formato DD/MM/YYYY)
    rows.sort((a, b) => {
      try {
        const parseDate = (dateStr) => {
          if (!dateStr) return new Date(0);
          const parts = dateStr.split("/");
          if (parts.length === 3) {
            return new Date(parts[2], parts[1] - 1, parts[0]);
          }
          return new Date(dateStr);
        };

        return parseDate(b.data) - parseDate(a.data);
      } catch (e) {
        return 0;
      }
    });

    // Função para formatar a data vinda do Google Sheets (Date(YYYY,MM,DD))
    const formatDate = (dateStr) => {
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
      return dateStr; // se não for Date(...), devolve como está
    };

    const html = rows.map((materia, index) => {
      const imageHTML = materia.imagem && materia.imagem.trim() !== ""
        ? `<img class="materia-img" src="${materia.imagem}" alt="${materia.titulo}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
           <div class="materia-img" style="display:none;"></div>`
        : `<div class="materia-img"></div>`;

      return `
        <article class="materia-card animate-fade-in" style="animation-delay: ${index * 0.1}s">
          ${imageHTML}
          <div class="materia-content">
            <h3>${materia.titulo}</h3>
            <p class="materia-meta">
              <i class="fas fa-newspaper mr-2"></i>
              ${materia.veiculo}${materia.data ? ' • ' + formatDate(materia.data) : ''}
            </p>
            <p class="materia-resumo">${materia.resumo}</p>
            <a href="${materia.link}" target="_blank" rel="noopener noreferrer" class="materia-link">
              Leia mais <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </article>`;
    }).join("");

    $("#materias-container").html(html);
    $('#materias-container').show();
  }

  function showSampleData() {
    console.log('Exibindo dados de exemplo');
    $('#loading-indicator').hide();

    // Dados de exemplo como fallback
    const sampleData = [
      {
        data: "10/08/2025",
        titulo: "IEPUC participa de conferência internacional sobre energias renováveis",
        veiculo: "Jornal do Brasil",
        resumo: "Instituto apresenta pesquisas sobre eficiência energética e sustentabilidade em evento global.",
        link: "#",
        imagem: ""
      },
      {
        data: "05/08/2025",
        titulo: "Nova parceria com empresa do setor elétrico brasileiro",
        veiculo: "Valor Econômico",
        resumo: "Acordo visa desenvolvimento de tecnologias inovadoras para o mercado nacional de energia.",
        link: "#",
        imagem: ""
      },
      {
        data: "01/08/2025",
        titulo: "Pesquisador do IEPUC recebe prêmio de inovação",
        veiculo: "O Globo",
        resumo: "Reconhecimento internacional por desenvolvimento de soluções em energia limpa.",
        link: "#",
        imagem: ""
      }
    ];

    displayMaterias(sampleData);
  }

  // Carregar matérias ao inicializar a página
  loadMaterias();

  // ==========================================
  // CÓDIGO DE NAVEGAÇÃO ATIVA
  // ==========================================

  function updateActiveNav() {
    const sections = $('section[id]');
    const navLinks = $('.nav-link');

    let currentSection = '';

    sections.each(function() {
      const sectionTop = $(this).offset().top - 150;
      const sectionHeight = $(this).height();
      const scrollTop = $(window).scrollTop();

      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSection = $(this).attr('id');
      }
    });

    navLinks.removeClass('text-puc-gold active');
    navLinks.filter(`[href="#${currentSection}"]`).addClass('text-puc-gold active');
  }

  $(window).on('scroll', updateActiveNav);
  updateActiveNav();

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