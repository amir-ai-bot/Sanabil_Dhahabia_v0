<?php
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend PHP - Sanabel Dhahabia</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            max-width: 600px;
            padding: 40px;
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            border-radius: 5px;
            font-weight: bold;
        }
        .status.ok {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .endpoints {
            margin: 30px 0;
            text-align: left;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
        }
        .endpoints h3 {
            color: #333;
            margin-bottom: 15px;
        }
        .endpoint {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-left: 4px solid #667eea;
            font-family: monospace;
            font-size: 12px;
            word-break: break-all;
        }
        .method {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-weight: bold;
            margin-right: 10px;
            font-size: 11px;
        }
        .post {
            background-color: #ffc107;
            color: white;
        }
        .get {
            background-color: #28a745;
            color: white;
        }
        .put {
            background-color: #17a2b8;
            color: white;
        }
        .delete {
            background-color: #dc3545;
            color: white;
        }
        .info-box {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            text-align: left;
            font-size: 14px;
        }
        .info-box strong {
            color: #1565c0;
        }
        a {
            color: #667eea;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Sanabel Dhahabia - Backend PHP</h1>
        
        <div class="status ok">
            ✓ Serveur PHP fonctionne correctement
        </div>

        <div class="info-box">
            <strong>Adresse du serveur:</strong><br>
            <?php echo "http://" . $_SERVER['HTTP_HOST'] . "/backend/api/"; ?>
        </div>

        <div class="endpoints">
            <h3>📡 Endpoints Disponibles</h3>
            
            <h4 style="margin-top: 15px; color: #667eea;">Authentification</h4>
            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/auth.php?action=login</code>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/auth.php?action=register</code>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/auth.php?action=logout</code>
            </div>

            <h4 style="margin-top: 15px; color: #667eea;">Produits</h4>
            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/products.php</code>
            </div>
            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/products.php?id=1</code>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/products.php</code>
            </div>
            <div class="endpoint">
                <span class="method put">PUT</span>
                <code>/api/products.php?id=1</code>
            </div>
            <div class="endpoint">
                <span class="method delete">DELETE</span>
                <code>/api/products.php?id=1</code>
            </div>

            <h4 style="margin-top: 15px; color: #667eea;">Commandes</h4>
            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/orders.php?userId=1</code>
            </div>
            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/orders.php?id=1</code>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/orders.php</code>
            </div>
            <div class="endpoint">
                <span class="method put">PUT</span>
                <code>/api/orders.php?id=1&action=status</code>
            </div>
        </div>

        <div class="info-box">
            <strong>📚 Documentation:</strong><br>
            Consultez les fichiers de documentation:<br>
            • <a href="../PHP_INTEGRATION.md">PHP_INTEGRATION.md</a><br>
            • <a href="../NEXT_STEPS.md">NEXT_STEPS.md</a><br>
            • <a href="../INSTALLATION_PHP.md">INSTALLATION_PHP.md</a>
        </div>

        <div class="info-box" style="background: #fff3cd; border-left-color: #ffc107;">
            <strong>⚙️ Configuration:</strong><br>
            Modifiez les paramètres dans <code>config/Database.php</code>
        </div>
    </div>
</body>
</html>
