<?php
/**
 * IEPUC na Mídia - API Backend MySQL
 * 
 * API REST para fornecer dados das matérias do banco MySQL
 * 
 * Autor: Assistant Claude
 * Data: Setembro 2025
 */

// Configurações de CORS para permitir requisições do frontend
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responde a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================================================
// CONFIGURAÇÕES DO BANCO DE DADOS
// ============================================================================

define('DB_HOST', 'localhost');           // Host do banco de dados
define('DB_NAME', 'iepuc_na_midia_cp');  // Nome do banco de dados
define('DB_USER', 'seu_usuario');         // ALTERE: Seu usuário MySQL
define('DB_PASS', 'sua_senha');           // ALTERE: Sua senha MySQL
define('DB_CHARSET', 'utf8mb4');

// ============================================================================
// CLASSE DE CONEXÃO COM O BANCO
// ============================================================================

class Database {
    private $conn = null;
    
    /**
     * Estabelece conexão com o banco de dados
     */
    public function connect() {
        if ($this->conn !== null) {
            return $this->conn;
        }
        
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->conn = new PDO($dsn, DB_USER, DB_PASS, $options);
            
            return $this->conn;
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro de conexão com o banco de dados',
                'message' => $e->getMessage()
            ]);
            exit();
        }
    }
}

// ============================================================================
// CLASSE DE MATÉRIAS
// ============================================================================

class Materias {
    private $db;
    private $table = 'materias'; // ALTERE se o nome da tabela for diferente
    
    public function __construct($database) {
        $this->db = $database->connect();
    }
    
    /**
     * Busca todas as matérias ordenadas por data (mais recente primeiro)
     * 
     * @param int $limit Número máximo de registros (0 = todos)
     * @param int $offset Deslocamento para paginação
     * @return array Array com as matérias
     */
    public function getAll($limit = 0, $offset = 0) {
        try {
            $query = "SELECT 
                        titulo,
                        url,
                        veiculo,
                        data,
                        resumo,
                        categoria,
                        imagem
                      FROM {$this->table}
                      WHERE titulo IS NOT NULL 
                        AND titulo != ''
                      ORDER BY STR_TO_DATE(data, '%d/%m/%Y') DESC";
            
            if ($limit > 0) {
                $query .= " LIMIT :limit OFFSET :offset";
            }
            
            $stmt = $this->db->prepare($query);
            
            if ($limit > 0) {
                $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            }
            
            $stmt->execute();
            $results = $stmt->fetchAll();
            
            return [
                'success' => true,
                'data' => $results,
                'count' => count($results)
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'error' => 'Erro ao buscar matérias',
                'message' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Conta o total de matérias no banco
     * 
     * @return int Total de matérias
     */
    public function count() {
        try {
            $query = "SELECT COUNT(*) as total 
                      FROM {$this->table}
                      WHERE titulo IS NOT NULL 
                        AND titulo != ''";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $result = $stmt->fetch();
            
            return $result['total'];
            
        } catch (PDOException $e) {
            return 0;
        }
    }
    
    /**
     * Busca matérias por categoria
     * 
     * @param string $categoria Nome da categoria
     * @return array Array com as matérias
     */
    public function getByCategory($categoria) {
        try {
            $query = "SELECT 
                        titulo,
                        url,
                        veiculo,
                        data,
                        resumo,
                        categoria,
                        imagem
                      FROM {$this->table}
                      WHERE categoria LIKE :categoria
                        AND titulo IS NOT NULL 
                        AND titulo != ''
                      ORDER BY STR_TO_DATE(data, '%d/%m/%Y') DESC";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':categoria', "%{$categoria}%", PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll();
            
            return [
                'success' => true,
                'data' => $results,
                'count' => count($results)
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'error' => 'Erro ao buscar matérias por categoria',
                'message' => $e->getMessage()
            ];
        }
    }
}

// ============================================================================
// ROTEAMENTO DA API
// ============================================================================

// Obtém o método HTTP e a ação
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'getAll';

// Somente permite requisições GET
if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Método não permitido'
    ]);
    exit();
}

// Inicializa banco e classe de matérias
$database = new Database();
$materias = new Materias($database);

// Processa a ação solicitada
switch ($action) {
    
    case 'getAll':
        // Busca todas as matérias
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 0;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        
        $response = $materias->getAll($limit, $offset);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        break;
    
    case 'count':
        // Conta total de matérias
        $total = $materias->count();
        echo json_encode([
            'success' => true,
            'total' => $total
        ], JSON_UNESCAPED_UNICODE);
        break;
    
    case 'getByCategory':
        // Busca por categoria
        $categoria = isset($_GET['categoria']) ? $_GET['categoria'] : '';
        
        if (empty($categoria)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Categoria não informada'
            ]);
            exit();
        }
        
        $response = $materias->getByCategory($categoria);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        break;
    
    default:
        // Ação não encontrada
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Ação não encontrada'
        ]);
        break;
}

// ============================================================================
// SCRIPT SQL PARA CRIAR A TABELA (SE NECESSÁRIO)
// ============================================================================

/*
CREATE TABLE IF NOT EXISTS `materias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(500) NOT NULL,
  `url` varchar(1000) NOT NULL,
  `veiculo` varchar(200) DEFAULT NULL,
  `data` varchar(20) DEFAULT NULL,
  `resumo` text,
  `categoria` varchar(100) DEFAULT NULL,
  `imagem` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_data` (`data`),
  KEY `idx_categoria` (`categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/
?>