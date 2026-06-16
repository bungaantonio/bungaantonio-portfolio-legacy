---
title: Sistema de Gestão de Correspondência Institucional
shortTitle: Correspondência Institucional
description: Aplicação web interna para geração, registo e controlo de correspondências com concorrência atómica e auditoria operacional.
category: corporativo
stack: [NestJS, TypeScript, PostgreSQL, Prisma, HTMX, Handlebars, TailwindCSS, SMTP, Docker]
tags: [SELECT FOR UPDATE, idempotência, auditoria, MVP, correspondência]
date: 2025-09-15
featured: true
---

## O Desafio de Negócio

Num ambiente corporativo de média escala, a emissão de correspondências institucionais (contratos, ofícios, memorandos) dependia de processos manuais e de uma única pessoa para gerar referências. Isso criava gargalos operacionais, risco de duplicação de números sequenciais, dificuldade de consulta histórica e ausência de auditoria sobre quem emitiu o quê. Era um processo crítico para conformidade documental, executado com ferramentas inadequadas.

## O Desafio Técnico

Gerar referências únicas e incrementais de forma atómica, mesmo quando dois utilizadores autorizados solicitam uma sequência em simultâneo. A solução tinha de ser adoptável internamente sem infraestrutura dedicada, integrar-se ao SMTP existente, disponibilizar consulta histórica e indicadores de utilização, com rastreabilidade desde a primeira versão.

## A Solução Desenvolvida

### Modelo operacional

O processo evoluiu de um modelo centralizado (dependência de um único ponto de emissão) para um modelo descentralizado em que cada departamento gera, consulta e audita as suas correspondências de forma autónoma, com regras uniformes de formatação.

### Funcionalidades principais

- **Geração automática de referências institucionais** com prefixos, ano fiscal e contador configuráveis por tipo documental;
- **Registo permanente** de cada correspondência emitida;
- **Consulta histórica** e dashboard de indicadores por departamento;
- **Gestão de utilizadores** com controlo de acesso por perfis;
- **Auditoria obrigatória** de operações críticas;
- **Notificações automáticas por e-mail** via SMTP corporativo.

### Decisões de arquitectura

- **Monólito modular com NestJS + TypeScript:** módulos de domínio separados (sequências, utilizadores, notificações, auditoria), reduzindo complexidade operacional para um MVP interno sem sacrificar fronteiras claras entre responsabilidades.
- **Interface server-driven com HTMX + Handlebars + TailwindCSS:** páginas renderizadas no servidor com interacções parciais, menos JavaScript no cliente, ciclo de desenvolvimento curto e experiência adequada para utilizadores internos.
- **Prisma ORM sobre PostgreSQL:** modelo de dados tipado com migrações versionadas.
- **`SELECT FOR UPDATE` na geração de sequências:** transacção com bloqueio pessimista na linha da sequência activa. O segundo pedido concorrente aguarda libertação do lock antes de ler o próximo número, eliminando duplicação por condição de corrida.
- **Idempotência** na emissão de referências para prevenção adicional de duplicações em reenvios de rede.
- **Health checks operacionais** e procedimentos de backup documentados.
- **Deploy containerizado com Docker** para ambiente de piloto interno.

### Mecanismos de segurança e conformidade

- Autenticação e autorização por perfis;
- Auditoria obrigatória de operações de emissão;
- Rastreabilidade de quem gerou cada referência e quando;
- Backup diário da base de dados.

## Resultado

MVP funcional entregue e validado em ambiente de piloto interno. Referências geradas de forma consistente, sem duplicação por erro humano, com consulta histórica e indicadores operacionais disponíveis. Funcionalidades principais concluídas, testes de integração executados e documentação técnica e de utilizador produzida.

## Limitações conhecidas

- Sem integração com sistemas externos de identidade ou autenticação corporativa (LDAP/SSO);
- Evoluções futuras identificadas: assinaturas digitais e fluxos de workflow/aprovação documental avançados.

---

## Extensão: Automação Documental - ICMS v1.1

### O Contexto da Extensão
O projeto evoluiu para atender à necessidade de transformar o gerador linear de sequências num **Motor de Automação Documental Polimórfico** sob quatro restrições críticas:
1. **Agnosticismo de Infraestrutura:** O código não contém caminhos fixos (*hardcoded*). Utiliza a variável de ambiente `STORAGE_PATH` para isolamento e mock local.
2. **Abstração por Proxy de Segurança:** O backend NestJS atua como uma barreira que valida, intercepta e serve os dados em fluxo (*streaming*), protegendo o File Server de acessos diretos.
3. **Persistência Híbrida:** A base de dados retém os metadados e caminhos relativos, enquanto o Fileserver armazena os blobs binários organizados por partições cronológicas (`Ano/Mês`).
4. **Fluidez UI/UX:** Integração nativa assíncrona com o HTMX, eliminando inputs manuais de identificadores (UUIDs) e tratando transferências binárias sem quebrar a reatividade da página.

### Diagnóstico de Engenharia & Vetores de Risco
Antes da implementação do código, mapeou-se a arquitetura contra potenciais vulnerabilidades:
*   **Concorrência e Escrita no Sistema de Ficheiros:** Mitigado via escrita atómica indireta. O sistema grava os bytes num ficheiro `.tmp` e, apenas após o sucesso, invoca a operação nativa do SO para renomear o ficheiro (`fs.rename`) de forma atómica.
*   **Path Traversal (Invasão de Diretórios):** Sanitização forçada por ancoragem. Os caminhos passam por `path.normalize()` e `path.resolve()`, validando programaticamente se o caminho final começa estritamente com a raiz definida em `STORAGE_PATH`.
*   **Injeção de Código XML & Macros:** Configuração estrita de delimitadores (`cmdDelimiter: ['{', '}']`) no `docx-templates`, injetando dados como nós de texto estático (*Text Nodes*) para neutralizar código malicioso.
*   **Bloqueio de Thread por I/O Massivo (DoS):** Restrição de payloads na borda da aplicação (limite de 10MB por template) e adoção de streams baseados em buffers atómicos.

### Decisões Críticas de Arquitetura

O projeto foi reestruturado de forma modular para isolar responsabilidades e minimizar riscos, evitando o acoplamento direto entre as regras de negócio e o sistema de ficheiros:

- **Modelo de Dados Unificado:** O esquema relacional foi expandido para suportar polimorfia documental. A base de dados atua como a fonte única de verdade para metadados, caminhos relativos de ficheiros e registos de auditoria, garantindo resiliência e rastreabilidade em tempo real.
- **Motor Central de Processamento:** A camada de serviços encapsula todo o pipeline atómico de injeção XML. Através da imposição de um contrato *Flat-Context* (estrutura plana de dados), as variáveis de sistema são mapeadas de forma estrita para os templates base, tornando o processo imune a ataques de injeção.
- **Interceção de Gateway para HTMX:** O motor de renderização parcial exigiu uma solução não-obstrutiva para o download de ficheiros binários. Adotou-se um padrão de interceção, onde o backend processa o documento e emite um cabeçalho de resposta (`HX-Redirect`), forçando o download imediato no cliente sem quebrar a reatividade da interface.
- **Simetria na Camada de Apresentação:** A UI foi desacoplada em componentes parciais focados em largura total e simetria matemática, injetando metadados e recursos estáticos imediatamente após o sucesso de cada operação assíncrona.

### O Manifesto Meta-Arquitetural (A Essência para o Futuro)
Para replicar este comportamento noutros contextos industriais e linguagens de programação, o sistema obedece a **4 Mandamentos Abstratos**:

1.  **O Princípio do Hospedeiro Contextual:** O formulário de automação documental nunca deve ser uma interface isolada ou manual. Ele "parasita" a resposta do registo ativo. Captura os identificadores de forma automática via campos invisíveis (`hidden fields`), blindando o fluxo contra inputs incorretos.
2.  **O Contrato da Tokenização Plana:** Independentemente da complexidade relacional da base de dados, a estrutura de dados que alimenta o template deve ser achatada numa única raiz de chaves diretas (`{chave}`). Isto cria uma camada isoladora que permite alterar tabelas e colunas no futuro sem quebrar o mapeamento dos ficheiros e documentos dos utilizadores.
3.  **O Particionamento Cronológico Automático:** O sistema de ficheiros rege-se pelo tempo do servidor. Calcular os caminhos físicos dinamicamente na execução com o formato `Raiz/Ano/Mês/` garante diretórias com contagem controlada de ficheiros, mantendo a performance de leitura/escrita do Sistema Operativo em velocidade máxima constante ao longo dos anos.
4.  **A Interceção de Gateway para Fluxos AJAX (XHR Binary Bridge):** Motores assíncronos de renderização parcial de páginas rejeitam respostas directas do tipo *StreamableFile*. A separação física em dois endpoints — um focado em processar/salvar e injetar o cabeçalho de redirecionamento (`HX-Redirect`), e outro focado puramente em abrir o stream do ficheiro anexado — garante uma experiência fluida de carregamento instantâneo para o utilizador final sem a necessidade de frameworks pesadas de JavaScript.
