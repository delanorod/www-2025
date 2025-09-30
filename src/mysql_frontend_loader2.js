/**
 * IEPUC na Mídia - Carregador MySQL
 *
 * Este script carrega matérias de um banco MySQL via API PHP
 * e as exibe automaticamente na página HTML.
 *
 * Autor: Assistant Claude
 * Data: Setembro 2025
 */

// ============================================================================
// CLASSE PRINCIPAL - MySQLLoader
// ============================================================================

class MySQLLoader {

    /**
     * Construtor da classe
     * @param {string} apiUrl - URL da API PHP
     */
    constructor(apiUrl = 'api.php') {
        // Configurações básicas
        this.apiUrl = apiUrl;
        this.postsPerPage = 6;  // Quantas matérias mostrar por vez
        this.currentPage = 0;   // Página atual (começando do 0)
        this.allPosts = [];     // Array para armazenar todas as matérias
        this.totalPosts = 0;    // Total de matérias no banco
    }

    // ========================================================================
    // MÉTODO PARA CARREGAR DADOS DA API
    // ========================================================================

    /**
     * Carrega os dados do banco MySQL via API PHP
     * @returns {Promise<Array>} - Promise com array de objetos contendo os dados
     */
    async loadData() {
        try {
            console.log('📡 Conectando à API do banco de dados...');

            // Faz a requisição HTTP para a API
            const response = await fetch(`${this.apiUrl}?action=getAll`);

            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }

            // Converte a resposta para JSON
            const result = await response.json();

            // Verifica se a API retornou sucesso
            if (!result.success) {
                throw new Error(result.error || 'Erro desconhecido ao buscar dados');
            }

            console.log('✅ Dados carregados com sucesso');
            console.log(`📊 Total de registros: ${result.count}`);

            return result.data;

        } catch (error) {
            console.error('❌ Erro ao carregar dados da API:', error);
            throw error;
        }
    }

    // ========================================================================
    // MÉTODO PARA CONTAR TOTAL DE MATÉRIAS
    // ========================================================================

    /**
     * Busca o total de matérias no banco
     * @returns {Promise<number>} - Total de matérias
     */
    async getTotalCount() {
        try {
            const response = await fetch(`${this.apiUrl}?action=count`);
            const result = await response.json();
            
            if (result.success) {
                this.totalPosts = result.total;
                return result.total;
            }
            
            return 0;
            
        } catch (error) {
            console.error('❌ Erro ao contar matérias:', error);
            return 0;
        }
    }

    // ========================================================================
    // MÉTODO PARA CARREGAR POR CATEGORIA
    // ========================================================================

    /**
     * Carrega matérias de uma categoria específica
     * @param {string} categoria - Nome da categoria
     * @returns {Promise<Array>} - Array com as matérias da categoria
     */
    async loadByCategory(categoria) {
        try {
            console.log(`🔍 Buscando matérias da categoria: ${categoria}`);

            const response = await fetch(
                `${this.apiUrl}?action=getByCategory&categoria=${encodeURIComponent(categoria)}`
            );

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Erro ao buscar por categoria');
            }

            console.log(`✅ ${result.count} matérias encontradas`);
            return result.data;

        } catch (error) {
            console.error('❌ Erro ao buscar por categoria:', error);
            throw error;
        }
    }

    // ========================================================================
    // MÉTODO PARA FORMATAR DATAS
    // ========================================================================

    /**
     * Formata datas para o padrão DD.MM.YYYY
     * @param {string} dateString - Data em string
     * @returns {string} - Data formatada
     */
    formatDate(dateString) {
        if (!dateString) return '';

        try {
            // Aceita formatos: DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY
            const parts = dateString.split(/[\/\.\-]/);

            if (parts.length === 3) {
                const [day, month, year] = parts;
                return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
            }
        } catch (error) {
            console.error('❌ Erro ao formatar data:', error);
        }

        return dateString;
    }

    // ========================================================================
    // MÉTODO PARA DEFINIR CORES DAS CATEGORIAS
    // ========================================================================

    /**
     * Retorna o HTML do badge de categoria com a cor apropriada
     * @param {string} category - Nome da categoria
     * @returns {string} - HTML do badge colorido
     */
    getCategoryBadge(category) {
        const categoryLower = (category || '').toLowerCase().trim();

        // Mapa de categorias para classes CSS do Tailwind
        const categoryMap = {
            // Petróleo e Gás - Azul
            'petróleo': 'bg-blue-100 text-blue-800',
            'petróleo & gás': 'bg-blue-100 text-blue-800',
            'petroleo': 'bg-blue-100 text-blue-800',
            'petroleo & gas': 'bg-blue-100 text-blue-800',
            'gás': 'bg-blue-100 text-blue-800',
            'gas': 'bg-blue-100 text-blue-800',

            // Biocombustíveis - Verde
            'biocombustível': 'bg-green-100 text-green-800',
            'biocombustiveis': 'bg-green-100 text-green-800',
            'biocombustíveis': 'bg-green-100 text-green-800',
            'etanol': 'bg-green-100 text-green-800',
            'biodiesel': 'bg-green-100 text-green-800',

            // Energia Renovável - Amarelo
            'energia renovável': 'bg-yellow-100 text-yellow-800',
            'renovavel': 'bg-yellow-100 text-yellow-800',
            'renovável': 'bg-yellow-100 text-yellow-800',
            'solar': 'bg-yellow-100 text-yellow-800',
            'eólica': 'bg-yellow-100 text-yellow-800',
            'eolica': 'bg-yellow-100 text-yellow-800',
            'hidrelétrica': 'bg-yellow-100 text-yellow-800',

            // Energia Nuclear - Roxo
            'nuclear': 'bg-purple-100 text-purple-800',
            'uranio': 'bg-purple-100 text-purple-800',
            'urânio': 'bg-purple-100 text-purple-800'
        };

        const colorClass = categoryMap[categoryLower] || 'bg-gray-100 text-gray-800';

        return `<span class="${colorClass} text-xs px-2.5 py-0.5 rounded">${category}</span>`;
    }

    // ========================================================================
    // MÉTODO PARA CRIAR HTML DE UMA MATÉRIA
    // ========================================================================

    /**
     * Gera o HTML de uma matéria individual
     * @param {Object} post - Objeto com dados da matéria
     * @returns {string} - HTML da matéria
     */
    createPostHTML(post) {
        console.log('🗂️ Criando HTML para matéria:', post.titulo);

        // Desestruturação do objeto com valores padrão
        const {
            titulo = '',
            url = '',
            veiculo = '',
            data = '',
            resumo = '',
            categoria = '',
            imagem = ''
        } = post;

        // Formata a data e cria o badge da categoria
        const formattedDate = this.formatDate(data);
        const categoryBadge = this.getCategoryBadge(categoria);

        // Define imagem padrão se não foi fornecida
        const imageUrl = imagem || 'imagens/iepuc-na-midia/default-news.jpg';
        const imageAlt = `Matéria ${veiculo}`;

        // Template HTML da matéria
        return `
            <article class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl">
                <div class="md:flex">
                    <!-- Container da Imagem -->
                    <div class="md:flex-shrink-0 md:w-64">
                        <img class="h-48 w-full object-contain bg-white md:h-full md:w-64"
                             src="${imageUrl}"
                             alt="${imageAlt}"
                             onerror="this.src='imagens/iepuc-na-midia/default-news.jpg'">
                    </div>

                    <!-- Container do Conteúdo -->
                    <div class="p-6">
                        <!-- Veículo e Data -->
                        <div class="flex items-center text-sm text-gray-500 mb-2">
                            <span class="mr-4">${veiculo}</span>
                            <span><i class="far fa-calendar-alt mr-1"></i> ${formattedDate}</span>
                        </div>

                        <!-- Título -->
                        <h3 class="text-xl font-bold text-gray-900 mb-3">
                            <a href="${url}"
                               class="hover:text-blue-700 transition-colors"
                               target="_blank"
                               rel="noopener noreferrer">
                                ${titulo}
                            </a>
                        </h3>

                        <!-- Resumo -->
                        <p class="text-gray-600 mb-4">
                            ${resumo}
                        </p>

                        <!-- Categoria e Link -->
                        <div class="flex items-center justify-between">
                            ${categoryBadge}
                            <a href="${url}"
                               class="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                               target="_blank"
                               rel="noopener noreferrer">
                                Ler matéria completa <i class="ml-1 fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    // ========================================================================
    // MÉTODO PARA EXIBIR MATÉRIAS NA PÁGINA
    // ========================================================================

    /**
     * Exibe as matérias na página HTML
     * @param {Array} posts - Array de matérias para exibir
     */
    displayPosts(posts) {
        console.log(`📺 Exibindo ${posts.length} matérias`);

        const blogContainer = document.getElementById('blogue');
        const loadMoreContainer = document.getElementById('loadMoreContainer');

        if (posts.length === 0) {
            blogContainer.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-600">Nenhuma matéria encontrada.</p>
                </div>
            `;
        } else {
            blogContainer.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
        }

        blogContainer.classList.remove('hidden');

        // Controla visibilidade do botão "Carregar mais"
        const hasMorePosts = (this.currentPage + 1) * this.postsPerPage < this.allPosts.length;
        if (hasMorePosts) {
            loadMoreContainer.classList.remove('hidden');
        } else {
            loadMoreContainer.classList.add('hidden');
        }
    }

    // ========================================================================
    // MÉTODO PARA CARREGAR MAIS MATÉRIAS
    // ========================================================================

    /**
     * Carrega e exibe mais matérias quando o botão é clicado
     */
    loadMorePosts() {
        console.log('➕ Carregando mais matérias...');

        this.currentPage++;

        const startIndex = this.currentPage * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const newPosts = this.allPosts.slice(startIndex, endIndex);

        if (newPosts.length > 0) {
            const blogContainer = document.getElementById('blogue');
            const newPostsHTML = newPosts.map(post => this.createPostHTML(post)).join('');
            blogContainer.insertAdjacentHTML('beforeend', newPostsHTML);

            console.log(`✅ Adicionadas ${newPosts.length} novas matérias`);
        }

        // Esconde botão se não há mais matérias
        const hasMorePosts = (this.currentPage + 1) * this.postsPerPage < this.allPosts.length;
        if (!hasMorePosts) {
            document.getElementById('loadMoreContainer').classList.add('hidden');
            console.log('🏁 Todas as matérias foram carregadas');
        }
    }

    // ========================================================================
    // MÉTODOS PARA CONTROLAR A INTERFACE
    // ========================================================================

    /**
     * Mostra mensagem de erro na interface
     */
    showError() {
        console.log('❌ Exibindo mensagem de erro');
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error').classList.remove('hidden');
    }

    /**
     * Esconde o indicador de carregamento
     */
    hideLoading() {
        console.log('✅ Removendo indicador de carregamento');
        document.getElementById('loading').classList.add('hidden');
    }

    // ========================================================================
    // MÉTODO PRINCIPAL DE INICIALIZAÇÃO
    // ========================================================================

    /**
     * Método principal que inicializa todo o processo
     */
    async init() {
        console.log('🚀 Inicializando carregador MySQL');

        try {
            // 1. Carrega os dados da API
            const data = await this.loadData();

            // 2. Armazena todos os posts
            this.allPosts = data;

            console.log(`📊 Total de matérias carregadas: ${this.allPosts.length}`);

            // 3. Esconde indicador de carregamento
            this.hideLoading();

            // 4. Exibe primeiro lote de matérias
            const initialPosts = this.allPosts.slice(0, this.postsPerPage);
            this.displayPosts(initialPosts);

            console.log('🎉 Inicialização concluída com sucesso!');

        } catch (error) {
            console.error('💥 Erro durante a inicialização:', error);
            this.showError();
        }
    }
}

// ============================================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================================================

/**
 * Configuração e inicialização automática quando a página carrega
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Página carregada, iniciando script...');

    // IMPORTANTE: Altere para o caminho correto da sua API
    const apiUrl = './src/api.php'; // API está na pasta src/

    // Cria uma instância do carregador
    const loader = new MySQLLoader(apiUrl);

    // Inicia o processo de carregamento
    loader.init();

    // Configura o botão "Carregar mais"
    const loadMoreButton = document.getElementById('loadMore');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            console.log('🖱️ Botão "Carregar mais" clicado');
            loader.loadMorePosts();
        });
    }

    console.log('⚙️ Event listeners configurados');
});

// ============================================================================
// FUNÇÕES AUXILIARES OPCIONAIS
// ============================================================================

/**
 * Função para debug - testa a conexão com a API
 * Use no console do navegador: testAPI()
 */
async function testAPI() {
    const apiUrl = 'api.php';
    
    console.log('🔍 Testando conexão com a API...');
    console.log('API URL:', apiUrl);
    
    try {
        const response = await fetch(`${apiUrl}?action=count`);
        const result = await response.json();
        
        console.log('✅ Resposta da API:', result);
        
        if (result.success) {
            console.log(`📊 Total de matérias no banco: ${result.total}`);
        }
    } catch (error) {
        console.error('❌ Erro ao testar API:', error);
    }
}

/**
 * Função para recarregar as matérias manualmente
 * Use no console do navegador: reloadPosts()
 */
function reloadPosts() {
    console.log('🔄 Recarregando matérias...');
    location.reload();
}