
document.addEventListener('DOMContentLoaded', function() {
            const counters = document.querySelectorAll('.stat-number');
            const speed = 200; // Quanto menor, mais rápido
            let animatedCounters = new Set(); //Pra evitar múltiplas animações

            // Função para iniciar a animação quando o elemento estiver visível
            function startCountingWhenVisible() {
                counters.forEach(counter => {
                    const target = +counter.dataset.target;
                    const count = +counter.innerText;
                 

                    // Se o elemento estiver visível na tela
                    if (isElementInViewport(counter)) {
                        // Animação de contagem
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(() => {
                                startCountingWhenVisible();
                            }, 1);
                        } else {
                            counter.innerText = target;
                        }
                    }
                });
            }

            // Verificar se um elemento está visível na viewport
            function isElementInViewport(el) {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            }

            // Iniciar a verificação de visibilidade quando a página carregar
            startCountingWhenVisible();

            // Também verificar quando o usuário scrollar
            window.addEventListener('scroll', startCountingWhenVisible);
        });
