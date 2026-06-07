---
title: Sistema Web de Gestão de Filas em Tempo Real com Autenticação Biométrica para Atendimento Público Seguro
shortTitle: Gestão de Filas com Biometria
description: Arquitetura N-Tier com autenticação biométrica de utentes, auditoria imutável, equidade algorítmica e concorrência controlada para filas públicas.
category: academia
stack: [FastAPI, React, PostgreSQL, Docker, C#]
tags: [RLS, hash chaining, SKIP LOCKED, SSE, multi-tenant, biometria]
date: 2025-06-01
featured: true
---

## O Desafio de Negócio

Em serviços públicos angolanos, filas físicas são vulneráveis a manipulação: senhas atribuídas fora de ordem, favoritismos difíceis de provar e ausência de trilha de auditoria. O problema não é só operacional; é de confiança institucional. O sistema precisava de garantir equidade perceptível para o cidadão e rastreabilidade verificável para a entidade gestora, sem depender de processos manuais paralelos.

## O Desafio Técnico

Garantir chamada de senhas em tempo real, com centenas de utentes concorrentes, sem colisões nem saltos na ordem de atendimento. Ao mesmo tempo, isolar dados por entidade (multi-tenant), registar cada ação de forma imutável, identificar utentes por biometria na entrada na fila e integrar hardware heterogéneo sem acoplar a lógica de negócio ao fabricante do dispositivo.

## A Solução Desenvolvida

### Arquitetura e infraestrutura

- **Arquitetura N-Tier containerizada (Docker Compose):** NGINX como reverse proxy, API FastAPI (Uvicorn + SQLAlchemy), frontends React (utente e backoffice), PostgreSQL 16 e volume persistente, com camadas separadas para deploy, testes e evolução independente.
- **Middleware C# (.NET) para utentes:** abstracção do hardware biométrico via SDK nativo, com identificação 1:N, registo de novos utentes, cache de templates em memória e consumo de eventos SSE para sincronização com a API.

![Arquitetura N-Tier containerizada: Docker Compose com NGINX, API FastAPI, React, PostgreSQL e middleware biométrico](/case-study-gestao-filas/arquitectura.png)

### Fluxo operacional

O processo de atendimento foi modelado em BPMN, cobrindo três actores: utente, operador e sistema. O fluxo inclui leitura biométrica do utente na entrada, verificação de cadastro, atribuição de prioridade legal e chamada de senhas com validação de integridade.

![Diagrama BPMN: fluxo de atendimento com verificação biométrica do utente e gestão de fila](/case-study-gestao-filas/diagram.svg)

### Comunicação em tempo real

Actualizações de estado propagam-se via **Server-Sent Events (SSE)**: acção do operador no painel, API FastAPI, canal SSE, clientes (painéis públicos, backoffice) e middleware C# de integração.

![Fluxo SSE: acção do operador propagada em tempo real via FastAPI](/case-study-gestao-filas/comunicacao-sse.png)

### Equidade algorítmica

A fila consolida utentes de diferentes perfis (idosos ≥ 60, gestantes, PcD e FIFO normal) numa única fila operacional com **fairness score**. As prioridades legais reflectem-se no algoritmo, não na discrição do operador.

![Modelo de prioridades: perfis de utente com fairness score integrado na fila](/case-study-gestao-filas/algoritmo-fairness-score.png)

![Fila operacional: prioridades visíveis com score, tempo de espera e estado PRÓXIMO](/case-study-gestao-filas/organizacao-fila.png)

### Concorrência, isolamento e auditoria

- **Row-Level Security (RLS) no PostgreSQL:** isolamento multi-tenant reforçado na base de dados.
- **Hash Chaining:** cada evento encadeado criptograficamente ao anterior, com trilha imutável e verificação de integridade operacional.
- **`SELECT … FOR UPDATE SKIP LOCKED`:** chamada de senhas sem colisões sob carga concorrente.

![Painel de integridade operacional: verificação criptográfica de eventos auditados](/case-study-gestao-filas/integridade-auditoria.png)

### Interfaces implementadas

**Backoffice operacional:** centro de comando com KPIs em tempo real (utentes em espera, operadores activos, integridade de registos) e métricas de desempenho.

![Dashboard backoffice: KPIs operacionais e métricas de fila](/case-study-gestao-filas/dashboard-backoffice.png)

**Painel público:** visualização da fila para o utente, com senha em atendimento, próximos na fila, QR code para acompanhamento mobile e ticker informativo.

![Painel público: chamada de senhas, fila de espera e acompanhamento via QR code](/case-study-gestao-filas/painel-publico-fila.png)

**Middleware biométrico:** captura e identificação de utentes na entrada (1:N e registo), cache de templates e simulador mock para desenvolvimento sem hardware físico.

![Middleware biométrico C#: identificação de utentes, cache de templates e integração SSE](/case-study-gestao-filas/middleware-biometrico.png)

## Resultado

Simulação validada sob saturação extrema (ρ = 7,00, 650 utentes) com equidade algorítmica preservada. Sistema funcional com trilha de auditoria verificável, comunicação em tempo real e arquitectura preparada para contexto institucional real.

### Validação quantitativa da equidade

O heatmap abaixo compara a espera média (minutos) por tipo de atendimento (Urgente, Prioritário, Normal) em três cenários de carga progressiva (A, B e C):

![Heatmap de espera média por tipo e cenário: validação da equidade algorítmica sob carga](/case-study-gestao-filas/heatmap-espera-tipo-cenario.png)

| Tipo | Cenário A | Cenário B | Cenário C |
|------|-----------|-----------|-----------|
| Urgente | 0,09 min | 1,46 min | 68,28 min |
| Prioritário | 0,46 min | 11,28 min | 174,64 min |
| Normal | 1,98 min | 84,07 min | 357,76 min |

**O que estes dados demonstram:**

1. **Hierarquia preservada em todos os cenários.** Em nenhum ponto Urgente espera mais que Prioritário, nem Prioritário mais que Normal. Mesmo no Cenário C (saturação extrema), a ordenação relativa mantém-se: 68 < 175 < 358 minutos.

2. **Equidade não é ausência de espera, é ausência de inversão.** Sob ρ = 7,00 todos esperam mais, mas ninguém com prioridade legal fica atrás de quem não a tem. O algoritmo de fairness score cumpre a regra de negócio quando a fila colapsa.

3. **Degradação previsível.** Do Cenário A (carga normal, todos abaixo de 2 min) ao C (saturação), o aumento é proporcional ao tipo: Normal absorve 180x mais espera que Urgente no pior caso, reflectindo a política de prioridades definida, não favoritismo operacional.

4. **Argumento verificável.** Os tempos não são declarados; são medidos e visualizados. Um auditor ou recrutador técnico consegue validar a claim de equidade directamente no gráfico, sem confiar apenas na descrição.
