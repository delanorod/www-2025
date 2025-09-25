/**
 * IEPUC na Mídia - Carregador Automático do Google Sheets
 */
class GoogleSheetsLoader {

    /**
     * Construtor da classe
     * @param {string} sheetId - ID do Google Sheets (extraído da URL)
     * @param {string} sheetName - Nome da aba/sheet (padrão: 'Sheet1')
     */
    constructor(sheetId, sheetName = 'materias_iepuc_completo') {
        this.sheetId = sheetId;
        this.sheetName = sheetName;
        this.postsPerPage = 6;
        this.currentPage = 0;
        this.allPosts = [];

        // Adiciona um timestamp para limpar o cache em cada carregamento
        const timestamp = new Date().getTime();
        this.csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}&timestamp=${timestamp}`;
    }

    /**
     * Carrega os dados do Google Sheets via fetch API
     * @returns {Promise<Array>} - Promise com array de objetos contendo os dados
     */
    async loadData() {
        try {
            console.log('🔄 Iniciando carregamento do Google Sheets...');
            const response = await fetch(this.csvUrl);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            const csvText = await response.text();
            console.log('✅ Dados CSV carregados com sucesso');
            return this.parseCSV(csvText);
        } catch (error) {
            console.error('❌ Erro ao carregar dados do Google Sheets:', error);
            throw error;
        }
    }

    /**
     * Converte texto CSV em array de objetos JavaScript
     * @param {string} csvText - Texto no formato CSV
     * @returns {Array} - Array de objetos com os dados estruturados
     */
    parseCSV(csvText) {
        console.log('🔧 Processando dados CSV...');
        const lines = csvText.split('\n').filter(line => line.trim() !== '');

        if (lines.length <= 1) {
            console.warn('⚠️ CSV sem dados. Apenas cabeçalho ou vazio.');
            return [];
        }

        const headers = this.parseCSVLine(lines[0]).map(header => header.trim().toLowerCase());
        console.log('📋 Cabeçalhos encontrados:', headers);

        const data = lines.slice(1).map(line => {
            const values = this.parseCSVLine(line);
            const row = {};
            headers.forEach((header, index) => {
                row[header] = (values[index] || '').trim();
            });
            return row;
        });

        console.log(`✅ Processados ${data.length} registros`);
        return data;
    }

    /**
     * Processa uma linha individual do CSV, tratando aspas e vírgulas
     * @param {string} line - Linha do CSV para processar
     * @returns {Array} - Array com os valores da linha
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result.map(value => value.replace(/^"(.*)"$/, '$1'));
    }

    // ========================================================================
    // MÉTODOS PARA EXIBIR E FORMATAR DADOS (não alterados)
    // ========================================================================

    /**
     * Formata datas para o padrão DD.MM.YYYY
     * @param {string} dateString - Data em string
     * @returns {string} - Data formatada
     */
    formatDate(dateString) {
        if (!dateString) return '';
        try {
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

    /**
     * Retorna o HTML do badge de categoria com a cor apropriada
     * @param {string} category - Nome da categoria
     * @returns {string} - HTML do badge colorido
     */
    getCategoryBadge(category) {
        const categoryLower = (category || '').toLowerCase().trim();
        const categoryMap = {
            'petróleo': 'bg-blue-100 text-blue-800', 'petróleo & gás': 'bg-blue-100 text-blue-800',
            'biocombustível': 'bg-green-100 text-green-800', 'biocombustíveis': 'bg-green-100 text-green-800',
            'energia renovável': 'bg-yellow-100 text-yellow-800', 'solar': 'bg-yellow-100 text-yellow-800',
            'nuclear': 'bg-purple-100 text-purple-800'
        };
        const colorClass = categoryMap[categoryLower] || 'bg-gray-100 text-gray-800';
        return `<span class="${colorClass} text-xs px-2.5 py-0.5 rounded">${category}</span>`;
    }

    /**
     * Gera o HTML de uma matéria individual
     * @param {Object} post - Objeto com dados da matéria
     * @returns {string} - HTML da matéria
     */
    createPostHTML(post) {
        console.log('🏗️ Criando HTML para matéria:', post.titulo);
        const { titulo = '', url = '', veiculo = '', data = '', resumo = '', categoria = '', imagem = '' } = post;
        const formattedDate = this.formatDate(data);
        const categoryBadge = this.getCategoryBadge(categoria);
        const imageUrl = imagem || 'imagens/iepuc-na-midia/default-news.jpg';
        const imageAlt = `Matéria ${veiculo}`;

        return `
            <article class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl">
                <div class="md:flex">
                    <div class="md:flex-shrink-0 md:w-64">
                        <img class="h-48 w-full object-contain bg-white md:h-full md:w-64" src="${imageUrl}" alt="${imageAlt}" onerror="this.src='imagens/iepuc-na-midia/default-news.jpg'">
                    </div>
                    <div class="p-6">
                        <div class="flex items-center text-sm text-gray-500 mb-2">
                            <span class="mr-4">${veiculo}</span>
                            <span><i class="far fa-calendar-alt mr-1"></i> ${formattedDate}</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">
                            <a href="${url}" class="hover:text-blue-700 transition-colors" target="_blank" rel="noopener noreferrer">${titulo}</a>
                        </h3>
                        <p class="text-gray-600 mb-4">${resumo}</p>
                        <div class="flex items-center justify-between">
                            ${categoryBadge}
                            <a href="${url}" class="text-cyan-700 hover:text-cyan-800 font-medium flex items-center" target="_blank" rel="noopener noreferrer">
                                Ler matéria completa <i class="ml-1 fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    // ========================================================================
    // MÉTODOS DE CONTROLE DA INTERFACE (não alterados)
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
            blogContainer.innerHTML = `<div class="text-center py-8"><p class="text-gray-600">Nenhuma matéria encontrada.</p></div>`;
        } else {
            blogContainer.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
        }
        blogContainer.classList.remove('hidden');
        const hasMorePosts = (this.currentPage + 1) * this.postsPerPage < this.allPosts.length;
        if (hasMorePosts) {
            loadMoreContainer.classList.remove('hidden');
        } else {
            loadMoreContainer.classList.add('hidden');
        }
    }

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
        const hasMorePosts = (this.currentPage + 1) * this.postsPerPage < this.allPosts.length;
        if (!hasMorePosts) {
            document.getElementById('loadMoreContainer').classList.add('hidden');
            console.log('🏁 Todas as matérias foram carregadas');
        }
    }

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

    /**
     * Método principal que inicializa todo o processo
     */
    async init() {
        console.log('🚀 Inicializando carregador do Google Sheets');
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('error').classList.add('hidden');
        document.getElementById('blogue').classList.add('hidden');
        document.getElementById('loadMoreContainer').classList.add('hidden');

        try {
            const data = await this.loadData();
            this.allPosts = data
                .filter(post => post.titulo && post.titulo.trim())
                .sort((a, b) => {
                    const dateA = a.data ? a.data.split(/[\/\.]/).reverse().join('') : '';
                    const dateB = b.data ? b.data.split(/[\/\.]/).reverse().join('') : '';
                    return dateB.localeCompare(dateA);
                });
            console.log(`📊 Total de matérias processadas: ${this.allPosts.length}`);
            this.hideLoading();
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
// INICIALIZAÇÃO E FUNÇÕES DE DEBUG
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Página carregada, iniciando script...');
    const sheetId = '1KtKF2EMfuzPlr3p6g5fc0x5bZ43DYSR3W9XB6PSyPCk';
    const loader = new GoogleSheetsLoader(sheetId);
    loader.init();

    const loadMoreButton = document.getElementById('loadMore');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            console.log('🖱️ Botão "Carregar mais" clicado');
            loader.loadMorePosts();
        });
    }

    window.debugGoogleSheets = () => {
        console.log('🔍 Informações de Debug:');
        console.log('Sheet ID:', sheetId);
        console.log('CSV URL:', loader.csvUrl);
        console.log('Para testar manualmente, cole esta URL no navegador:', loader.csvUrl);
    };

    window.reloadPosts = () => {
        console.log('🔄 Recarregando matérias...');
        location.reload();
    };

    console.log('⚙️ Event listeners e funções de debug configuradas');
});