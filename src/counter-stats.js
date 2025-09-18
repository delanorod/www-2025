// Contador para a seção "Nossos números"
function iniciarContador() {
    const counters = document.querySelectorAll('.counter');
    const speed = 2000; // Velocidade da contagem

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        const hasPlus = counter.classList.contains('has-plus');

        if (count < target) {
            const updateCount = () => {
                const nextCount = Math.ceil(count + increment);
                
                if (nextCount < target) {
                    counter.innerText = nextCount.toLocaleString('pt-BR');
                    setTimeout(updateCount, 1);
                } else {
                    // Formatação final com sinal de + se necessário
                    if (hasPlus) {
                        counter.innerText = '+' + target.toLocaleString('pt-BR');
                    } else {
                        counter.innerText = target.toLocaleString('pt-BR');
                    }
                }
            };
            updateCount();
        } else {
            // Já está no valor final, apenas formata
            if (hasPlus) {
                counter.innerText = '+' + target.toLocaleString('pt-BR');
            }
        }
    });
}

// Observador para iniciar a animação quando a seção estiver visível
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            iniciarContador();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observa a seção de números
const numerosSection = document.querySelector('.numeros-section');
if (numerosSection) {
    observer.observe(numerosSection);
}