document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Quanto menor, mais rápido
    let animatedCounters = new Set(); // Para evitar múltiplas animações

    // Função para iniciar a animação quando o elemento estiver visível
    function startCountingWhenVisible() {
        counters.forEach(counter => {
            // Se já foi animado, pular
            if (animatedCounters.has(counter)) return;

            const target = +counter.dataset.target;
            const hasPlus = counter.dataset.showPlus === 'true';
            
            // Se o elemento estiver visível na tela
            if (isElementInViewport(counter)) {
                animatedCounters.add(counter); // Marcar como animado
                animateCounter(counter, target, hasPlus);
            }
        });
    }

    // Função de animação individual
    function animateCounter(counter, target, hasPlus) {
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            const newValue = Math.ceil(count + inc);
            counter.innerText = hasPlus ? `${newValue.toLocaleString('pt-BR')}+` : newValue.toLocaleString('pt-BR');
            
            setTimeout(() => {
                animateCounter(counter, target, hasPlus);
            }, 1);
        } else {
            // Valor final
            counter.innerText = hasPlus ? `${target.toLocaleString('pt-BR')}+` : target.toLocaleString('pt-BR');
        }
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