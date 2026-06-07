---
title: Sistema de Sequências Documentais Institucionais
description: MVP interno para geração atómica de referências documentais com bloqueio de concorrência no PostgreSQL.
category: corporativo
stack: [NestJS, HTMX, TailwindCSS, PostgreSQL, SMTP]
tags: [SELECT FOR UPDATE, concorrência, MVP, documentos]
date: 2025-09-15
featured: true
---

## O Desafio de Negócio

O departamento de Recursos Humanos gerava referências de documentos (contratos, ofícios, memorandos) manualmente — combinações de prefixo, ano e número sequencial definidas em planilhas ou por convenção verbal. Duplicações eram frequentes, a rastreabilidade era inexistente e corrigir um número repetido consumia tempo de vários intervenientes. Era um processo crítico para conformidade documental, executado com ferramentas inadequadas.

## O Desafio Técnico

Gerar sequências numéricas únicas e incrementais de forma atómica, mesmo quando dois utilizadores com perfil autorizado (ex.: directores) solicitam uma referência ao mesmo tempo. A solução tinha de ser simples o suficiente para adoptar internamente, integrar-se ao SMTP existente e não exigir infraestrutura dedicada além do que a empresa já operava.

## A Solução Desenvolvida

- **Monólito modular com NestJS:** aplicação única com módulos de domínio separados (sequências, utilizadores, notificações), reduzindo complexidade operacional para um MVP interno sem sacrificar fronteiras claras entre responsabilidades.
- **Interface server-driven com HTMX + TailwindCSS:** páginas renderizadas no servidor com interacções parciais via HTMX — menos JavaScript no cliente, ciclo de desenvolvimento mais curto e experiência adequada para utilizadores internos.
- **`SELECT FOR UPDATE` no PostgreSQL para geração de sequências:** transacção explícita com bloqueio pessimista na linha da sequência activa; o segundo pedido concorrente aguarda libertação do lock antes de ler o próximo número — elimina duplicação por condição de corrida.
- **Integração SMTP corporativo:** envio automático da referência gerada por e-mail, ligando o acto de criação à notificação imediata do destinatário, sem passos manuais adicionais.
- **Modelo de sequência configurável por tipo documental:** prefixos, ano fiscal e contador independentes por categoria, permitindo ao RH gerir formatos distintos sem alterar código.

## Resultado

MVP funcional entregue e validado pelo RH — referências geradas de forma consistente, sem duplicação por erro humano, com rastreabilidade básica de quem gerou o quê e quando.
