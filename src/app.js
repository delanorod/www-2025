
    // Function to load articles from Google Sheets using JSONP
    function loadMaterias() {
      const sheetID = "160ARd8yznqu0xcCTh3yXmxtotix9OmPVZfGDdy2uOpU";
      const sheetName = "materias";

      // Show loading indicator
      document.getElementById('loading-indicator').style.display = 'block';
      document.getElementById('materias-container').style.display = 'none';
      document.getElementById('error-message').classList.add('hidden');

      // Try different approaches
      tryLoadFromSheets(sheetID, sheetName);
    }

    function tryLoadFromSheets(sheetID, sheetName) {
      // Method 1: Try with JSONP callback
      const callbackName = 'gsheetsCallback' + Date.now();

      window[callbackName] = function(data) {
        processGoogleSheetsData(data);
        delete window[callbackName];
      };

      const script = document.createElement('script');
      script.src = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&callback=${callbackName}&sheet=${sheetName}`;

      script.onerror = function() {
        // Method 2: Try with fetch and manual parsing
        tryFetchMethod(sheetID, sheetName);
      };

      document.head.appendChild(script);

      // Clean up after timeout
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
          // Remove Google's JSONP wrapper
          const jsonText = text.substring(47).slice(0, -2);
          const data = JSON.parse(jsonText);
          processGoogleSheetsData(data);
        })
        .catch(error => {
          console.error('Fetch method failed:', error);
          showSampleData(); // Fallback to sample data
        });
    }

    function processGoogleSheetsData(data) {
      try {
        document.getElementById('loading-indicator').style.display = 'none';

        if (!data.table || !data.table.rows) {
          throw new Error('Estrutura de dados inválida');
        }

        const rows = data.table.rows
          .map((row, index) => {
            // Skip header row
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
      // Sort by date (DD/MM/YYYY format)
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

    //   const html = rows.map(materia => {
    //     const imageHTML = materia.imagem && materia.imagem.trim() !== ""
    //       ? `<img class="materia-img" src="${materia.imagem}" alt="${materia.titulo}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
    //          <div class="materia-img" style="display:none;"></div>`
    //       : `<div class="materia-img"></div>`;

    //     return `
    //       <article class="materia-card">
    //         ${imageHTML}
    //         <div class="materia-content">
    //           <h3>${materia.titulo}</h3>
    //           <p class="materia-meta">
    //             <i class="fas fa-newspaper mr-2"></i>
    //             ${materia.veiculo}${materia.data ? ' • ' + materia.data : ''}
    //           </p>
    //           <p class="materia-resumo">${materia.resumo}</p>
    //           <a href="${materia.link}" target="_blank" rel="noopener noreferrer" class="materia-link">
    //             Leia mais <i class="fas fa-external-link-alt"></i>
    //           </a>
    //         </div>
    //       </article>
    //     `;
    //   }).join("");


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

const html = rows.map(materia => {
  const imageHTML = materia.imagem && materia.imagem.trim() !== ""
    ? `<img class="materia-img" src="${materia.imagem}" alt="${materia.titulo}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
       <div class="materia-img" style="display:none;"></div>`
    : `<div class="materia-img"></div>`;

  return `
    <article class="materia-card">
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

      document.getElementById("materias-container").innerHTML = html;
      document.getElementById('materias-container').style.display = 'grid';
    }

    function showSampleData() {
      console.log('Exibindo dados de exemplo');
      document.getElementById('loading-indicator').style.display = 'none';

      // Sample data as fallback
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

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Animation on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Add animation classes
    document.querySelectorAll('.feature-card, .course-card, .news-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });

    // Add fade-in animation to hero
    document.addEventListener('DOMContentLoaded', () => {
      const heroContent = document.querySelector('.animate-fade-in');
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(30px)';
      heroContent.style.transition = 'opacity 1s ease, transform 1s ease';

      setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 300);

      // Load articles from Google Sheets when page loads
      loadMaterias();
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('text-puc-gold');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('text-puc-gold');
        }
      });
    });

//Tailwind
tailwind.config = {
      theme: {
        extend: {
          colors: {
            'puc-blue': '#003366',
            'puc-light-blue': '#0066CC',
            'puc-gold': '#FFD700',
            'puc-gray': '#666666',
            'puc-light-gray': '#F5F5F5'
          },
          fontFamily: {
            'puc': ['Arial', 'sans-serif']
          }
        }
      }
    };

//Script do carousel - TailwindCSS
// var cont=0;
// function loopSlider(){
//   var xx= setInterval(function(){
//         switch(cont)
//         {
//         case 0:{
//             $("#slider-1").fadeOut(400);
//             $("#slider-2").delay(400).fadeIn(400);
//             $("#slider-3").delay(400).fadeIn(400);
//             $("#sButton1").removeClass("bg-blue-400");
//             $("#sButton2").addClass("bg-blue-400");
//             $("#sButton3").addClass("bg-blue-400");
//         cont=1;

//         break;
//         }
//         case 1:
//         {

//             $("#slider-3").fadeOut(400);
//             $("#slider-2").fadeOut(400);
//             $("#slider-1").delay(400).fadeIn(400);
//             $("#sButton3").removeClass("bg-blue-400");
//             $("#sButton2").removeClass("bg-blue-400");
//             $("#sButton1").addClass("bg-blue-400");

//         cont=0;

//         break;
//         }


//         }},8000);

// }

// function reinitLoop(time){
// clearInterval(xx);
// setTimeout(loopSlider(),time);
// }



// function sliderButton1(){

//     $("#slider-3").fadeOut(400);
//      $("#slider-2").fadeOut(400);
//     $("#slider-1").delay(400).fadeIn(400);
//     $("#sButton3").removeClass("bg-blue-800");
//     $("#sButton2").removeClass("bg-blue-800");
//     $("#sButton1").addClass("bg-blue-800");
//     reinitLoop(4000);
//     cont=0

//     }

//     function sliderButton2(){
//     $("#slider-1").fadeOut(400);
//     $("#slider-2").delay(400).fadeIn(400);
//     $("#slider-3").delay(400).fadeIn(400);
//     $("#sButton1").removeClass("bg-blue-800");
//     $("#sButton2").addClass("bg-blue-800");
//     $("#sButton3").addClass("bg-blue-800");
//     reinitLoop(4000);
//     cont=1

//     }

//     $(window).ready(function(){
//         $("#slider-3").hide();
//         $("#slider-2").hide();
//         $("#sButton1").addClass("bg-blue-800");


//         loopSlider();






//     });


//Novo script do carrossel
$(document).ready(function() {
    // ==========================================
    // CÓDIGO DO CARROSSEL
    // ==========================================

    // Dados dos slides - você pode adicionar/remover slides aqui
    const slides = [
        {
          image: "imagens/slider/1.jpg",
          title: "conectados podcast",
          description: "O que define o preço do gás no Brasil e em Santa Catarina? Com Edmar de Almeida(IEPUC)",
          buttonText: "Ouça o podcast",
          slideUrl: "https://www.youtube.com/watch?v=PkRwGQOkOlY"
        },
        {
            image: "imagens/slider/3.jpg",
            title: "PUC Cast 10",
            description: "G20: desenvolvimento Sustentável, entrevista com Edmar de Almeida (IEPUC)",
            buttonText: "Ouça o podcast",
            slideUrl: "https://www.youtube.com/watch?v=9srBK2i06Sw&t=352s"
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
                                <a href=${slide.slideUrl} class="bg-blue-600 hover:bg-blue-700 py-4 px-8 text-white font-bold uppercase text-sm rounded-lg transition-colors duration-300 inline-block">${slide.buttonText}</a>
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
    // CÓDIGO PARA CARREGAR MATÉRIAS (Google Sheets)
    // ==========================================

    const SHEET_ID = 'seu_sheet_id_aqui'; // Substitua pelo ID da sua planilha
    const API_KEY = 'sua_api_key_aqui'; // Substitua pela sua API key
    const RANGE = 'Sheet1!A:D'; // Ajuste conforme sua planilha

    function loadMaterias() {
        // Simulação de dados das matérias (remova quando implementar Google Sheets)
        const materiasMock = [
            {
                titulo: 'IEPUC participa de seminário sobre energia renovável',
                data: '15 AGO 2025',
                veiculo: 'Portal de Energia',
                resumo: 'Instituto apresenta pesquisas sobre eficiência energética em evento nacional.',
                link: '#'
            },
            {
                titulo: 'Nova parceria com empresa do setor elétrico',
                data: '12 AGO 2025',
                veiculo: 'Jornal da Energia',
                resumo: 'Acordo visa desenvolvimento de projetos de P&D em energias renováveis.',
                link: '#'
            },
            {
                titulo: 'Pesquisador do IEPUC ganha prêmio internacional',
                data: '10 AGO 2025',
                veiculo: 'Revista Científica',
                resumo: 'Trabalho sobre smart grids é reconhecido em congresso mundial.',
                link: '#'
            }
        ];

        displayMaterias(materiasMock);
    }

    function displayMaterias(materias) {
        const container = $('#materias-container');
        const loadingIndicator = $('#loading-indicator');
        const errorMessage = $('#error-message');

        // Esconder loading
        loadingIndicator.hide();

        if (!materias || materias.length === 0) {
            errorMessage.show();
            return;
        }

        // Mostrar container
        container.removeClass('hidden').show();

        // Limpar container
        container.empty();

        // Adicionar matérias
        materias.forEach((materia, index) => {
            const materiaHtml = `
                <article class="materia-card animate-fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="materia-img"></div>
                    <div class="materia-content">
                        <div class="materia-meta">${materia.data} • ${materia.veiculo}</div>
                        <h3>${materia.titulo}</h3>
                        <p class="materia-resumo">${materia.resumo}</p>
                        <a href="${materia.link}" target="_blank" class="materia-link">
                            Leia mais <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </article>
            `;
            container.append(materiaHtml);
        });
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

        navLinks.removeClass('active');
        navLinks.filter(`[href="#${currentSection}"]`).addClass('active');
    }

    $(window).on('scroll', updateActiveNav);
    updateActiveNav();
});
