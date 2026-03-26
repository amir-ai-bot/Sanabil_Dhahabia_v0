-- ═══════════════════════════════════════════════════════════════════════════════
-- BASE DE DONNÉES COMPLÈTE - SANABEL DHAHABIA
-- Version 2.0 - Janvier 2026
-- ═══════════════════════════════════════════════════════════════════════════════

-- Créer la base de données
DROP DATABASE IF EXISTS sanabel_dhahabia;
CREATE DATABASE sanabel_dhahabia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sanabel_dhahabia;

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 1: UTILISATEURS (Users)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    postalCode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'Maroc',
    role ENUM('admin', 'client', 'seller') DEFAULT 'client',
    isActive BOOLEAN DEFAULT 1,
    lastLogin TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_createdAt (createdAt)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 2: CATÉGORIES (Categories)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) UNIQUE,
    description TEXT,
    image VARCHAR(255),
    isActive BOOLEAN DEFAULT 1,
    displayOrder INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_isActive (isActive)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 3: SOUS-CATÉGORIES (Subcategories)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE subcategories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoryId INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150),
    description TEXT,
    isActive BOOLEAN DEFAULT 1,
    displayOrder INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_name (categoryId, name),
    INDEX idx_categoryId (categoryId)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 4: PRODUITS (Products)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description LONGTEXT,
    specifications JSON,
    price DECIMAL(12, 2) NOT NULL,
    discountPrice DECIMAL(12, 2),
    discountPercent INT,
    image VARCHAR(255),
    images JSON,
    categoryId INT NOT NULL,
    subcategoryId INT,
    stock INT DEFAULT 0,
    minStock INT DEFAULT 10,
    manufacturer VARCHAR(100),
    warranty INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    reviewCount INT DEFAULT 0,
    sold INT DEFAULT 0,
    isActive BOOLEAN DEFAULT 1,
    isFeatured BOOLEAN DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (subcategoryId) REFERENCES subcategories(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_categoryId (categoryId),
    INDEX idx_price (price),
    INDEX idx_isActive (isActive),
    INDEX idx_stock (stock),
    FULLTEXT INDEX ft_search (name, description)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 5: IMAGES PRODUITS (Product Images)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    productId INT NOT NULL,
    imagePath VARCHAR(255) NOT NULL,
    displayOrder INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_productId (productId)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 6: COMMANDES (Orders)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    orderNumber VARCHAR(50) UNIQUE NOT NULL,
    totalAmount DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    discountAmount DECIMAL(12, 2) DEFAULT 0,
    shippingCost DECIMAL(10, 2) DEFAULT 0,
    taxAmount DECIMAL(10, 2) DEFAULT 0,
    shippingAddress VARCHAR(255) NOT NULL,
    shippingCity VARCHAR(100) NOT NULL,
    shippingPostalCode VARCHAR(10),
    shippingPhone VARCHAR(20) NOT NULL,
    deliveryDistance INT,
    status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') DEFAULT 'PENDING',
    paymentStatus ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    paymentMethod VARCHAR(50),
    notes TEXT,
    trackingNumber VARCHAR(100),
    estimatedDelivery DATE,
    deliveryDate DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_userId (userId),
    INDEX idx_orderNumber (orderNumber),
    INDEX idx_status (status),
    INDEX idx_createdAt (createdAt),
    INDEX idx_paymentStatus (paymentStatus)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 7: ARTICLES DE COMMANDE (Order Items)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    productName VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unitPrice DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_orderId (orderId),
    INDEX idx_productId (productId)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 8: PANIER (Shopping Cart)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL UNIQUE,
    totalItems INT DEFAULT 0,
    totalPrice DECIMAL(12, 2) DEFAULT 0,
    expiresAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 9: ARTICLES DU PANIER (Cart Items)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cartId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cartId) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cartId, productId),
    INDEX idx_cartId (cartId),
    INDEX idx_productId (productId)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 10: AVIS CLIENTS (Product Reviews)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    productId INT NOT NULL,
    userId INT NOT NULL,
    orderId INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    isVerified BOOLEAN DEFAULT 0,
    isApproved BOOLEAN DEFAULT 1,
    helpfulCount INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_productId (productId),
    INDEX idx_userId (userId),
    INDEX idx_rating (rating),
    UNIQUE KEY unique_review (productId, userId)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 11: ADRESSES DE LIVRAISON (Shipping Addresses)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE shipping_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    type ENUM('home', 'work', 'other') DEFAULT 'home',
    fullName VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postalCode VARCHAR(10),
    country VARCHAR(100),
    isDefault BOOLEAN DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_isDefault (isDefault)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 12: COUPONS (Coupons / Promo Codes)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discountType ENUM('percentage', 'fixed') DEFAULT 'percentage',
    discountValue DECIMAL(10, 2) NOT NULL,
    minOrderAmount DECIMAL(12, 2),
    maxDiscount DECIMAL(10, 2),
    usageLimit INT,
    usagePerUser INT DEFAULT 1,
    validFrom DATE NOT NULL,
    validUntil DATE NOT NULL,
    isActive BOOLEAN DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_isActive (isActive),
    INDEX idx_validUntil (validUntil)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 13: UTILISATION COUPONS (Coupon Usage)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE coupon_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    couponId INT NOT NULL,
    userId INT NOT NULL,
    orderId INT,
    usedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (couponId) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_couponId (couponId),
    INDEX idx_userId (userId)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 14: NOTIFICATIONS (Notifications)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    relatedOrderId INT,
    relatedProductId INT,
    isRead BOOLEAN DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (relatedOrderId) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (relatedProductId) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_userId (userId),
    INDEX idx_isRead (isRead),
    INDEX idx_createdAt (createdAt)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 15: FAVORIS (Wishlist)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    productId INT NOT NULL,
    addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (userId, productId),
    INDEX idx_userId (userId)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 16: LOGS AUDIT (Audit Logs)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    action VARCHAR(100) NOT NULL,
    entityType VARCHAR(50),
    entityId INT,
    oldValue JSON,
    newValue JSON,
    ipAddress VARCHAR(45),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_userId (userId),
    INDEX idx_action (action),
    INDEX idx_createdAt (createdAt)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 17: STATISTIQUES (Statistics)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL UNIQUE,
    totalOrders INT DEFAULT 0,
    totalRevenue DECIMAL(12, 2) DEFAULT 0,
    totalProducts INT DEFAULT 0,
    totalUsers INT DEFAULT 0,
    newUsers INT DEFAULT 0,
    ordersCompleted INT DEFAULT 0,
    ordersShipped INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date (date)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- INSERTION DES DONNÉES D'EXEMPLE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Insérer les utilisateurs
INSERT INTO users (email, password, firstName, lastName, phone, address, city, postalCode, role, lastLogin) VALUES
('stesanabeldhahabia@gmail.com', 'admin123', 'Hamad', 'Admin', '0601234567', '123 Avenue Mohammed V', 'Marrakech', '40000', 'admin', NOW()),
('client1@example.com', 'client123', 'Jean', 'Dupont', '0612345678', '45 Rue de la Paix', 'Casablanca', '20000', 'client', NOW()),
('client2@example.com', 'client123', 'Marie', 'Martin', '0623456789', '78 Boulevard Hassan II', 'Fez', '30000', 'client', NOW()),
('client3@example.com', 'client123', 'Ahmed', 'Hassan', '0634567890', '156 Rue Principale', 'Tangier', '90000', 'client', NOW()),
('client4@example.com', 'client123', 'Fatima', 'Zahra', '0645678901', '234 Avenue Centrale', 'Agadir', '80000', 'client', NULL),
('client5@example.com', 'client123', 'Mohamed', 'Salah', '0656789012', '567 Route Nationale', 'Rabat', '10000', 'client', NULL),
('seller@example.com', 'seller123', 'Pierre', 'Durand', '0667890123', '999 Zone Industrielle', 'Marrakech', '40000', 'seller', NULL);

-- Insérer les catégories
INSERT INTO categories (name, slug, description, displayOrder, isActive) VALUES
('Tracteurs et Motoculteurs', 'tracteurs', 'Tracteurs agricoles et motoculteurs de toutes puissances', 1, 1),
('Moissonneuses et Batteuses', 'moissonneuses', 'Moissonneuses batteuses modernes et efficaces', 2, 1),
('Équipements de Labour', 'equipements-labour', 'Charrues, disques et équipements pour préparer la terre', 3, 1),
('Outils Agricoles', 'outils', 'Outils manuels et motorisés pour l\'agriculture', 4, 1),
('Accessoires et Pièces', 'accessoires', 'Accessoires et pièces détachées pour machines agricoles', 5, 1),
('Équipements d\'Irrigation', 'irrigation', 'Systèmes d\'irrigation et d\'arrosage', 6, 1),
('Serres et Abris', 'serres', 'Serres agricoles et abris de cultures', 7, 1),
('Semences et Engrais', 'semences', 'Semences de qualité et engrais pour cultures', 8, 1);

-- Insérer les sous-catégories
INSERT INTO subcategories (categoryId, name, slug) VALUES
(1, 'Tracteurs 50-75 ch', 'tracteurs-50-75'),
(1, 'Tracteurs 75-100 ch', 'tracteurs-75-100'),
(1, 'Motoculteurs légers', 'motoculteurs'),
(2, 'Moissonneuses battage', 'moissonneuses-battage'),
(2, 'Batteuses fixes', 'batteuses-fixes'),
(3, 'Charrues réversibles', 'charrues'),
(3, 'Disques agricoles', 'disques'),
(4, 'Pelles et fourches', 'pelles'),
(5, 'Pièces détachées', 'pieces'),
(5, 'Courroies et chaînes', 'courroies');

-- Insérer 50 produits variés
INSERT INTO products (name, slug, description, price, discountPrice, discountPercent, categoryId, subcategoryId, stock, manufacturer, rating, isFeatured) VALUES

-- Tracteurs (10 produits)
('Tracteur John Deere 5100', 'tracteur-john-deere-5100', 'Tracteur puissant 100 ch avec cabine climatisée et direction hydraulique', 85000.00, 80000.00, 6, 1, 1, 5, 'John Deere', 4.5, 1),
('Tracteur KUBOTA L3200', 'tracteur-kubota-l3200', 'Tracteur compact 32 ch, parfait pour petites exploitations', 28000.00, NULL, 0, 1, 1, 8, 'KUBOTA', 4.3, 0),
('Tracteur MASSEY FERGUSON 385', 'tracteur-massey-ferguson', 'Puissant tracteur 85 ch avec équipement complet', 72000.00, 68000.00, 5, 1, 2, 4, 'Massey Ferguson', 4.6, 1),
('Motoculteur HONDA F720', 'motoculteur-honda', 'Motoculteur fiable 7 ch pour petits travaux', 8500.00, NULL, 0, 1, 3, 15, 'HONDA', 4.2, 0),
('Tracteur CASE IH Puma', 'tracteur-case-ih', 'Tracteur moderne 110 ch avec technologie GPS', 95000.00, 89000.00, 6, 1, 2, 3, 'CASE IH', 4.7, 1),
('Motoculteur YAMAHA MZ360', 'motoculteur-yamaha', 'Motoculteur puissant et robuste 8 ch', 9500.00, NULL, 0, 1, 3, 12, 'YAMAHA', 4.4, 0),
('Tracteur CLAAS Arion', 'tracteur-claas-arion', 'Tracteur intelligent 120 ch avec système de direction assistée', 105000.00, 98000.00, 7, 1, 2, 2, 'CLAAS', 4.8, 1),
('Tracteur DEUTZ D62', 'tracteur-deutz-d62', 'Tracteur allemand 62 ch très fiable', 52000.00, NULL, 0, 1, 1, 6, 'DEUTZ', 4.1, 0),
('Motoculteur GRILLO G131', 'motoculteur-grillo', 'Motoculteur italien léger et maniable', 7800.00, 7300.00, 6, 1, 3, 18, 'GRILLO', 4.3, 0),
('Tracteur ZETOR FORTERRA', 'tracteur-zetor', 'Tracteur robuste 85 ch de fabrication tchèque', 65000.00, NULL, 0, 1, 1, 5, 'ZETOR', 4.0, 0),

-- Moissonneuses (8 produits)
('Moissonneuse CLAAS Lexion 650', 'moissonneuse-claas-650', 'Moissonneuse batteuse ultra-moderne avec capteurs', 185000.00, 175000.00, 5, 2, 4, 2, 'CLAAS', 4.9, 1),
('Moissonneuse JOHN DEERE S670', 'moissonneuse-jd-s670', 'Système de battage révolutionnaire haute capacité', 195000.00, 185000.00, 5, 2, 4, 2, 'John Deere', 4.8, 1),
('Batteuse AGCO MASSEY 8S', 'batteuse-massey-8s', 'Batteuse fixe polyvalente pour tous types de cultures', 45000.00, NULL, 0, 2, 5, 4, 'Massey Ferguson', 4.2, 0),
('Moissonneuse ROSTSELMASH RSM140', 'moissonneuse-rostselmash', 'Moissonneuse robuste capacité 8 tonnes/heure', 125000.00, 118000.00, 5, 2, 4, 3, 'ROSTSELMASH', 4.3, 0),
('Batteuse URSUS 2-14', 'batteuse-ursus', 'Petite batteuse fixe compacte 6 tonnes/heure', 18000.00, NULL, 0, 2, 5, 6, 'URSUS', 3.9, 0),
('Moissonneuse DEUTZ FAHR 5690', 'moissonneuse-deutz', 'Moissonneuse allemande haute performance', 165000.00, NULL, 0, 2, 4, 2, 'DEUTZ-FAHR', 4.7, 1),
('Batteuse BEIYANGDA BY-200', 'batteuse-beiyangda', 'Batteuse compacte économique pour petites exploitations', 12000.00, 11200.00, 7, 2, 5, 8, 'BEIYANGDA', 3.8, 0),
('Moissonneuse ALLIS CHALMERS', 'moissonneuse-allis', 'Moissonneuse stable et productive 5.5 tonnes/heure', 95000.00, NULL, 0, 2, 4, 3, 'Allis Chalmers', 4.0, 0),

-- Équipements de Labour (12 produits)
('Charrue 4 socs réversible', 'charrue-4-socs', 'Charrue réversible de qualité pour tous types de sols', 8500.00, 8000.00, 6, 3, 6, 12, 'AGRIFAB', 4.4, 1),
('Charrue 5 socs semi-portée', 'charrue-5-socs', 'Charrue semi-portée 5 socs pour tracteur puissant', 12000.00, NULL, 0, 3, 6, 8, 'KUHN', 4.2, 0),
('Disque agricole 20 pouces', 'disque-20-pouces', 'Disque de bonne qualité pour préparation du sol', 2800.00, NULL, 0, 3, 7, 25, 'LANDINI', 3.9, 0),
('Charrue portée 3 socs', 'charrue-3-socs', 'Charrue portée légère 3 socs facile à manœuvrer', 5500.00, 5000.00, 9, 3, 6, 15, 'AGRIFAB', 4.1, 0),
('Disque offset 24 pouces', 'disque-offset-24', 'Disque offset pour labour profond et travail du sol', 4200.00, NULL, 0, 3, 7, 20, 'VICON', 4.3, 0),
('Cultivateur à dents', 'cultivateur-dents', 'Cultivateur à dents pour préparation secondaire', 3500.00, 3200.00, 9, 3, 7, 18, 'AGRIFAB', 4.0, 0),
('Charrue réversible 3 socs', 'charrue-rev-3', 'Charrue réversible compacte pour petites parcelles', 6800.00, NULL, 0, 3, 6, 10, 'NIEMEYER', 3.8, 0),
('Herse rotative 2m', 'herse-rotative-2m', 'Herse rotative pour affinage des mottes', 4500.00, 4200.00, 7, 3, 7, 14, 'AGRIFAB', 4.2, 0),
('Sous-soleur simple', 'sous-soleur', 'Sous-soleur pour desserrage profond du sol', 7000.00, NULL, 0, 3, 7, 8, 'KUHN', 4.1, 0),
('Charrue traînée 2 socs', 'charrue-trainnee-2', 'Charrue traînée simple pour petit matériel', 3800.00, NULL, 0, 3, 6, 12, 'NIEMEYER', 3.7, 0),
('Houe rotative', 'houe-rotative', 'Houe rotative pour binage et écroûtage', 5200.00, 4900.00, 6, 3, 7, 16, 'AGRIFAB', 4.0, 0),
('Chaîne de transport à la demande', 'charrue-variante', 'Variante de charrue avec chaîne de transport', 9500.00, NULL, 0, 3, 6, 6, 'KUHN', 4.3, 0),

-- Outils Agricoles (10 produits)
('Pelle à grain métallique', 'pelle-grain-metal', 'Pelle à grain robuste en acier inoxydable', 450.00, NULL, 0, 4, 8, 80, 'AGRIFAB', 4.1, 0),
('Fourche fourragère 4 dents', 'fourche-4-dents', 'Fourche fourragère en acier galvanisé 4 dents', 350.00, 320.00, 9, 4, 8, 120, 'AGRIFAB', 4.0, 0),
('Fourche bêche dentelée', 'fourche-dentelee', 'Fourche bêche avec dents dentelées pour bêchage', 420.00, NULL, 0, 4, 8, 95, 'SPEAR', 4.2, 0),
('Pelle à ensilage', 'pelle-ensilage', 'Pelle large pour chargement ensilage', 520.00, NULL, 0, 4, 8, 60, 'AGRIFAB', 4.1, 0),
('Rateau à foin 15 dents', 'rateau-foin-15', 'Rateau traditionnel à foin 15 dents', 380.00, 350.00, 8, 4, 8, 100, 'AGRIFAB', 3.9, 0),
('Pioche pointue', 'pioche-pointue', 'Pioche pointue pour travail de la terre', 280.00, NULL, 0, 4, 8, 150, 'SPEAR', 3.8, 0),
('Bêche plate carrée', 'beche-carree', 'Bêche plate carrée pour terre humide', 320.00, NULL, 0, 4, 8, 130, 'SPEAR', 4.0, 0),
('Houe-bêche', 'houe-beche', 'Houe-bêche pour bêchage et labourage', 380.00, 350.00, 8, 4, 8, 90, 'AGRIFAB', 4.1, 0),
('Serpette courbe', 'serpette-courbe', 'Serpette courbe pour élagage et taille', 250.00, NULL, 0, 4, 8, 200, 'FELCO', 4.2, 0),
('Sabre de débardage', 'sabre-debardage', 'Sabre long pour débardage et labour', 450.00, NULL, 0, 4, 8, 70, 'SPEAR', 4.0, 0),

-- Accessoires et Pièces (10 produits)
('Courroie tracteur standard', 'courroie-tracteur', 'Courroie de transmission renforcée pour tracteurs', 1200.00, 1100.00, 8, 5, 9, 45, 'DUNLOP', 4.3, 0),
('Chaîne de traction agricole', 'chaine-traction', 'Chaîne de traction haute résistance', 850.00, NULL, 0, 5, 10, 55, 'RENOLD', 4.2, 0),
('Boulons de charrue acier', 'boulons-charrue', 'Ensemble boulons renforcés pour charrue', 180.00, NULL, 0, 5, 9, 200, 'AGRIFAB', 3.9, 0),
('Courroie crantée moissonneuse', 'courroie-crantee', 'Courroie crantée pour systèmes de battage', 1500.00, 1400.00, 7, 5, 9, 30, 'GATES', 4.4, 0),
('Roulement agricole blindé', 'roulement-blinde', 'Roulement blindé pour machines agricoles', 320.00, NULL, 0, 5, 9, 150, 'SKF', 4.5, 0),
('Palier complet tracteur', 'palier-tracteur', 'Palier de remplacement complet pour tracteur', 750.00, NULL, 0, 5, 9, 40, 'FAG', 4.3, 0),
('Soc de charrue acier manganese', 'soc-charrue', 'Soc de charrue en acier manganèse très résistant', 280.00, 260.00, 7, 5, 9, 180, 'KUHN', 4.2, 0),
('Courroie plate large', 'courroie-plate', 'Courroie plate large pour transmission', 950.00, NULL, 0, 5, 10, 65, 'BANDO', 4.1, 0),
('Pneu agricole 13.6-28', 'pneu-agricole-13-6', 'Pneu agricole robuste pour tracteur', 3500.00, 3300.00, 6, 5, 9, 25, 'MICHELIN', 4.4, 0),
('Filtre à air moteur agricole', 'filtre-air-moteur', 'Filtre à air haute performances pour moteurs', 420.00, NULL, 0, 5, 9, 120, 'MANN', 4.2, 0);

-- Insérer une commande d'exemple
INSERT INTO orders (userId, orderNumber, totalAmount, subtotal, shippingCost, status, paymentStatus, paymentMethod, trackingNumber) VALUES
(2, 'CMD-001-2026', 58500.00, 56000.00, 2500.00, 'DELIVERED', 'PAID', 'bank_transfer', 'TRK-001-2026');

-- Insérer les articles de cette commande
INSERT INTO order_items (orderId, productId, productName, quantity, unitPrice, subtotal) VALUES
(1, 1, 'Tracteur John Deere 5100', 1, 80000.00, 80000.00),
(1, 19, 'Pelle à grain métallique', 10, 450.00, 4500.00),
(1, 25, 'Courroie tracteur standard', 2, 1100.00, 2200.00);

-- Créer les paniers pour les utilisateurs
INSERT INTO cart (userId, totalItems, totalPrice) VALUES
(2, 0, 0.00),
(3, 0, 0.00),
(4, 0, 0.00),
(5, 0, 0.00),
(6, 0, 0.00),
(7, 0, 0.00);

-- Ajouter des avis clients
INSERT INTO product_reviews (productId, userId, orderId, rating, title, comment, isVerified, isApproved) VALUES
(1, 2, 1, 5, 'Excellent tracteur!', 'Très puissant et fiable. Hautement recommandé.', 1, 1),
(19, 2, 1, 4, 'Bonne qualité', 'Pelle solide et ergonomique.', 1, 1),
(3, 3, NULL, 4, 'Très bon', 'Excellent rapport qualité-prix.', 0, 1);

-- Ajouter les adresses de livraison
INSERT INTO shipping_addresses (userId, type, fullName, phone, address, city, postalCode, isDefault) VALUES
(2, 'home', 'Jean Dupont', '0612345678', '45 Rue de la Paix', 'Casablanca', '20000', 1),
(2, 'work', 'Jean Dupont', '0612345678', '123 Zone Industrielle', 'Casablanca', '20001', 0),
(3, 'home', 'Marie Martin', '0623456789', '78 Boulevard Hassan II', 'Fez', '30000', 1);

-- Ajouter des favoris
INSERT INTO wishlist (userId, productId) VALUES
(2, 3),
(2, 5),
(3, 1),
(3, 7),
(4, 10),
(4, 15);

-- Ajouter des coupons
INSERT INTO coupons (code, description, discountType, discountValue, minOrderAmount, validFrom, validUntil, isActive) VALUES
('WELCOME10', 'Réduction bienvenue 10%', 'percentage', 10, 5000, '2026-01-01', '2026-12-31', 1),
('SAVE500', 'Réduction fixe 500 DH', 'fixed', 500, 10000, '2026-01-01', '2026-12-31', 1),
('NEWYEAR', 'Nouvel an 15%', 'percentage', 15, 8000, '2026-01-01', '2026-01-31', 1);

-- Ajouter des notifications
INSERT INTO notifications (userId, title, message, type, relatedOrderId) VALUES
(2, 'Commande livrée', 'Votre commande CMD-001-2026 a été livrée avec succès.', 'order', 1),
(3, 'Nouveau produit', 'Un nouveau tracteur CLAAS Arion est disponible!', 'product', NULL),
(4, 'Réduction spéciale', 'Obtenez 15% de réduction avec le code NEWYEAR', 'promo', NULL);

-- ═══════════════════════════════════════════════════════════════════════════════
-- STATISTIQUES INITIALES
-- ═══════════════════════════════════════════════════════════════════════════════
INSERT INTO statistics (date, totalOrders, totalRevenue, totalProducts, totalUsers, newUsers, ordersCompleted, ordersShipped) VALUES
(CURDATE(), 1, 58500.00, 50, 7, 0, 1, 0);

-- ═══════════════════════════════════════════════════════════════════════════════
-- FIN DES INSERTIONS
-- ═══════════════════════════════════════════════════════════════════════════════
