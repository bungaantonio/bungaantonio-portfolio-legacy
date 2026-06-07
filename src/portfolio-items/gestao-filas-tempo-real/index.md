---
title: Sistema Web de Gestão de Filas Seguro em Tempo Real
description: Arquitetura N-Tier com auditoria imutável e concorrência controlada para filas públicas em Angola.
category: academia
stack: [FastAPI, React, PostgreSQL, Docker, C#]
tags: [RLS, hash chaining, SKIP LOCKED, multi-tenant, biometria]
date: 2025-06-01
featured: true
---

## O Desafio de Negócio

Em serviços públicos angolanos, filas físicas são vulneráveis a manipulação: senhas atribuídas fora de ordem, favoritismos difíceis de provar e ausência de trilha de auditoria. O problema não é só operacional — é de confiança institucional. O sistema precisava de garantir equidade perceptível para o cidadão e rastreabilidade verificável para a entidade gestora, sem depender de processos manuais paralelos.

## O Desafio Técnico

Garantir chamada de senhas em tempo real, com centenas de utentes concorrentes, sem colisões nem saltos na ordem de atendimento. Ao mesmo tempo, isolar dados por entidade (multi-tenant), registar cada ação de forma imutável e integrar hardware biométrico heterogéneo sem acoplar a lógica de negócio ao fabricante do dispositivo.

## A Solução Desenvolvida

- **Arquitetura N-Tier containerizada (Docker):** API FastAPI, frontend React e PostgreSQL como camadas separadas, facilitando deploy, testes e evolução independente de cada componente.
- **Middleware C# para abstração biométrica:** camada de integração que normaliza a comunicação com dispositivos de captura, isolando o resto do sistema de diferenças de protocolo e SDK por fabricante.
- **Row-Level Security (RLS) no PostgreSQL:** políticas de acesso ao nível da linha para isolamento multi-tenant — cada entidade vê apenas os seus dados, reforçado na base de dados e não só na aplicação.
- **Hash Chaining para auditoria imutável:** cada evento (emissão de senha, chamada, atendimento) encadeado criptograficamente ao anterior, permitindo detetar adulteração retroactiva do histórico.
- **`SELECT … FOR UPDATE SKIP LOCKED` na chamada de senhas:** mecanismo de concorrência que evita bloqueios em cascata — workers concorrentes saltam registos já bloqueados, eliminando colisões na atribuição de senhas sob carga.
- **Validação sob saturação extrema (ρ = 7,00, 650 utentes):** simulação de stress confirmou manutenção da equidade algorítmica mesmo com fila sobrecarregada face à capacidade de atendimento.

## Resultado

Sistema validado em condições de saturação, com equidade de fila preservada e trilha de auditoria verificável — base técnica para implementação em contexto institucional real.
