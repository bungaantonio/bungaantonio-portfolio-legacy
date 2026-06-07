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

- Sem gestão documental com anexos (PDF/Word);
- Sem integração com sistemas externos ou autenticação corporativa (LDAP/SSO);
- Evoluções futuras identificadas: anexos, modelos de documento, assinaturas digitais e gestão documental completa.
