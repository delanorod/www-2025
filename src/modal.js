// Aguarda o carregamento completo do DOM
$(document).ready(function() {
    
    // Função para abrir modal
    window.openModal = function(modalId) {
        const modal = $('#' + modalId);
        if (modal.length) {
            modal.removeClass('modal-hidden').addClass('modal-visible');
            modal.find('.transform').removeClass('scale-90').addClass('scale-100');
        }
    };

    // Função para fechar modal
    window.closeModal = function() {
        const modal = $('.modal-visible');
        modal.find('.transform').removeClass('scale-100').addClass('scale-90');
        setTimeout(() => {
            modal.removeClass('modal-visible').addClass('modal-hidden');
        }, 150);
    };

    // Abrir modal ao clicar em qualquer botão com [data-modal]
    $(document).on('click', '[data-modal]', function(e) {
        e.preventDefault();
        const modalId = $(this).data('modal');
        openModal(modalId);
    });

    // Abrir modal para botões específicos por ID
    $(document).on('click', '#ECE', function(e) {
        e.preventDefault();
        openModal('ModalECE'); // Assumindo que existe um modal com esse ID
    });

    // Fechar ao clicar no botão de fechar
    $(document).on('click', '.close-btn', function(e) {
        e.preventDefault();
        closeModal();
    });

    // Fechar ao clicar no overlay (fundo escuro)
    $(document).on('click', '.modal-backdrop', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Fechar com tecla ESC
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeModal();
        }
    });

    // Prevenir que cliques dentro do modal o fechem
    $(document).on('click', '.modal-backdrop .bg-white', function(e) {
        e.stopPropagation();
    });
});