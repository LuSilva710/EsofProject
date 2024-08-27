CREATE SCHEMA hamburgueria;

use hamburgueria;

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `senha` varchar(100) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `celular` varchar(12) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `cpf` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `idusuario_UNIQUE` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tipos_produto`;
CREATE TABLE `tipos_produto` (
  `id_tipos_produto` int NOT NULL AUTO_INCREMENT,
  `tipo_produto` varchar(45) DEFAULT NULL,
  `dth_criacao` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_tipos_produto`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
LOCK TABLES `tipos_produto` WRITE;
INSERT INTO `tipos_produto` VALUES (1,'Hamburguer Artesanal','2024-08-23 01:00:46');
UNLOCK TABLES;

DROP TABLE IF EXISTS `produto`;
CREATE TABLE `produto` (
  `id_produto` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(60) DEFAULT NULL,
  `descricao` varchar(100) DEFAULT NULL,
  `link_imagem` longtext,
  `valor` float DEFAULT NULL,
  `id_tipo` int DEFAULT NULL,
  `dth_criacao` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_produto`),
  KEY `fk_tipo_idx` (`id_tipo`),
  CONSTRAINT `fk_tipo` FOREIGN KEY (`id_tipo`) REFERENCES `tipos_produto` (`id_tipos_produto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='tabela que irá armazenar os produtos do site';
LOCK TABLES `produto` WRITE;
INSERT INTO `produto` VALUES (1,'BytePork','Hamburguer de porco com chedar e bacon defumado','https://cdn.pixabay.com/photo/2020/12/13/22/48/hamburguer-5829560_1280.jpg',27.99,1,'2024-08-23 01:02:13'),(2,'ByteLancheFeliz','Hamburguer bovino com chedar, maionese temperada e muito amor e felicidade','https://cdn.pixabay.com/photo/2017/02/09/14/09/kebab-2052491_1280.jpg',31.5,1,'2024-08-23 01:37:44');
UNLOCK TABLES;

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `valor` float DEFAULT NULL,
  `dth_pedido` timestamp NULL DEFAULT NULL,
  `produtos` json DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `fk_usuario_idx` (`id_usuario`),
  CONSTRAINT `fk_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `carrinho`;
CREATE TABLE `carrinho` (
  `id_carrinho` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_produto` int DEFAULT NULL,
  `add_em` timestamp NULL DEFAULT NULL,
  `finalizado` tinyint DEFAULT NULL,
  PRIMARY KEY (`id_carrinho`),
  KEY `fk_user_idx` (`id_usuario`),
  KEY `fk_produto_idx` (`id_produto`),
  CONSTRAINT `fk_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`),
  CONSTRAINT `fk_user` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
