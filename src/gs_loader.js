/**
IEPUC na Mídia - Carregador Automático do Google Sheets
Este script carrega matérias de um Google Sheets público e as exibe automaticamente na página HTML mantendo o layout existente.
Data: Setembro 2025
*/

// ============================================================================
// CLASSE PRINCIPAL - GoogleSheetsLoader
// ============================================================================
class GoogleSheetsLoader {
  /**
 * Construtor da classe
 * @param {string} sheetId - ID do Google Sheets (extraído da URL)
 * @param {string} sheetName - Nome da aba/sheet (padrão: 'Sheet1')
 */
constructor(sheetId, sheetName = 'Sheet1') {
    // Configurações básicas
    this.sheetId = sheetId;
    this.sheetName = sheetName;
    this.postsPerPage = 6; // Quantas matérias mostrar por vez
    this.currentPage = 0;  // Página atual (começando do 0)
    this.allPosts = [];    // Array para armazenar todas as matérias

    // URL para acessar o Google Sheets como CSV
    // Esta URL pública permite baixar os dados sem autenticação
    this.csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
}

// ========================================================================
// MÉTODO PARA CARREGAR DADOS DO GOOGLE SHEETS
// ========================================================================

/**
 * Carrega os dados do Google Sheets via fetch API
 * @returns {Promise<Array>} - Promise com array de objetos contendo os dados
 */
async loadData() {
    try {
        console.log('🔄 Iniciando carregamento do Google Sheets...');

        // Faz a requisição HTTP para obter o CSV
        const response = await fetch(this.csvUrl);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        // Converte a resposta para texto (formato CSV)
        const csvText = await response.text();
        console.log('✅ Dados CSV carregados com sucesso');

        // Processa o texto CSV e retorna os dados estruturados
        return this.parseCSV(csvText);

    } catch (error) {
        console.error('❌ Erro ao carregar dados do Google Sheets:', error);
        throw error; // Relança o erro para ser tratado por quem chama o método
    }
}

// ========================================================================
// MÉTODO PARA PROCESSAR DADOS CSV
// ========================================================================

/**
 * Converte texto CSV em array de objetos JavaScript
 * @param {string} csvText - Texto no formato CSV
 * @returns {Array} - Array de objetos com os dados estruturados
 */
parseCSV(csvText) {
    console.log('🔧 Processando dados CSV...');

    // Divide o texto em linhas
    const lines = csvText.split('\\n');

    // A primeira linha contém os cabeçalhos (nomes das colunas)
    const headers = this.parseCSVLine(lines[0]);
    console.log('📋 Cabeçalhos encontrados:', headers);

    const data = [];

    // Processa cada linha de dados (pula a linha 0 que são os cabeçalhos)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();

        // Pula linhas vazias
        if (!line) continue;

        // Processa a linha atual
        const values = this.parseCSVLine(line);

        // Só processa se tiver dados suficientes
        if (values.length >= headers.length) {
            const row = {};

            // Cria um objeto combinando cabeçalhos com valores
            headers.forEach((header, index) => {
                // Converte o cabeçalho para minúsculo e remove espaços
                const cleanHeader = header.toLowerCase().trim();
                // Atribui o valor correspondente (ou string vazia se não existir)
                row[cleanHeader] = values[index] || '';
            });

            data.push(row);
        }
    }

    console.log(`✅ Processados ${data.length} registros`);
    return data;
}

// ========================================================================
// MÉTODO PARA PROCESSAR LINHA CSV
// ========================================================================

/**
 * Processa uma linha individual do CSV, tratando aspas e vírgulas
 * @param {string} line - Linha do CSV para processar
 * @returns {Array} - Array com os valores da linha
 */
parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    // Processa caractere por caractere
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            // Trata aspas duplas consecutivas (aspas literais dentro do texto)
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++; // Pula o próximo caractere
            } else {
                // Alterna entre dentro/fora de aspas
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Vírgula fora de aspas = separador de colunas
            result.push(current);
            current = '';
        } else {
            // Caractere normal, adiciona ao valor atual
            current += char;
        }
    }

    // Adiciona o último valor
    result.push(current);
    return result;
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
    // Se não há data, retorna string vazia
    if (!dateString) return '';

    try {
        // Aceita formatos: DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY
        const parts = dateString.split(/[\\/\\.\\-]/);

        if (parts.length === 3) {
            const [day, month, year] = parts;
            // Garante 2 dígitos para dia e mês
            return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
        }
    } catch (error) {
        console.error('❌ Erro ao formatar data:', error);
    }

    // Se não conseguir formatar, retorna a data original
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
    // Converte para minúsculo e remove espaços para comparação
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

    // Busca a cor correspondente ou usa cinza como padrão
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
    console.log('🏗️ Criando HTML para matéria:', post.titulo);

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

    // Template HTML da matéria (mantém o layout TailwindCSS original)
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
                            <!-- ${titulo} -->
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

    // Busca os elementos HTML necessários
    const blogContainer = document.getElementById('blogue');
    const loadMoreContainer = document.getElementById('loadMoreContainer');

    if (posts.length === 0) {
        // Se não há matérias, mostra mensagem
        blogContainer.innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-600">Nenhuma matéria encontrada.</p>
            </div>
        `;
    } else {
        // Gera HTML para todas as matérias e insere na página
        blogContainer.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
    }

    // Torna o container visível (remove classe 'hidden')
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

    // Avança para a próxima página
    this.currentPage++;

    // Calcula quais matérias mostrar
    const startIndex = this.currentPage * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const newPosts = this.allPosts.slice(startIndex, endIndex);

    if (newPosts.length > 0) {
        // Adiciona as novas matérias ao final da lista existente
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
 * É chamado quando a página termina de carregar
 */
async init() {
    console.log('🚀 Inicializando carregador do Google Sheets');

    try {
        // 1. Carrega os dados do Google Sheets
        const data = await this.loadData();

        // 2. Filtra e ordena os dados
        console.log('🔄 Processando e ordenando dados...');

        this.allPosts = data
            // Remove linhas vazias (sem título)
            .filter(post => post.titulo && post.titulo.trim())
            // Ordena por data (mais recente primeiro)
            .sort((a, b) => {
                // Converte data DD/MM/YYYY para YYYYMMDD para comparação
                const dateA = a.data ? a.data.split(/[\\/\\.]/).reverse().join('') : '';
                const dateB = b.data ? b.data.split(/[\\/\\.]/).reverse().join('') : '';
                return dateB.localeCompare(dateA);
            });

        console.log(`📊 Total de matérias processadas: ${this.allPosts.length}`);

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

// ============================================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================================================

/**
Configuração e inicialização automática quando a página carrega
*/
document.addEventListener('DOMContentLoaded', () => {
console.log('📄 Página carregada, iniciando script...');

// ID do seu Google Sheets (extraído da URL)
const sheetId = '1KtKF2EMfuzPlr3p6g5fc0x5bZ43DYSR3W9XB6PSyPCk';

// Cria uma instância do carregador
const loader = new GoogleSheetsLoader(sheetId);

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
Função para debug - mostra informações do Google Sheets no console
Use no console do navegador: debugGoogleSheets()
*/
function debugGoogleSheets() {
const sheetId = '1KtKF2EMfuzPlr3p6g5fc0x5bZ43DYSR3W9XB6PSyPCk';
const csvUrl = https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=materias_iepuc_completo;
console.log('🔍 Informações de Debug:');
console.log('Sheet ID:', sheetId);
console.log('CSV URL:', csvUrl);
console.log('Para testar manualmente, cole esta URL no navegador:', csvUrl);
}
/**
Função para recarregar as matérias manualmente
Use no console do navegador: reloadPosts()
*/
function reloadPosts() {
console.log('🔄 Recarregando matérias...');
location.reload();
}
