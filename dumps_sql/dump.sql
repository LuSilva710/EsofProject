CREATE SCHEMA hamburgueria;

use hamburgueria;

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

CREATE TABLE `produto` (
  `id_produto` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(60) DEFAULT NULL,
  `descricao` varchar(100) DEFAULT NULL,
  `link_imagem` varchar(100) DEFAULT NULL,
  `valor` float DEFAULT NULL,
  `id_tipo` int DEFAULT NULL,
  `dth_criacao` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_produto`),
  KEY `fk_tipo_idx` (`id_tipo`),
  CONSTRAINT `fk_tipo` FOREIGN KEY (`id_tipo`) REFERENCES `tipos_produto` (`id_tipos_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='tabela que irá armazenar os produtos do site';

CREATE TABLE `tipos_produto` (
  `id_tipos_produto` int NOT NULL AUTO_INCREMENT,
  `tipo_produto` varchar(45) DEFAULT NULL,
  `dth_criacao` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_tipos_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `carrinho` (
  `id_carrinho` int NOT NULL,
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

COMMIT;
