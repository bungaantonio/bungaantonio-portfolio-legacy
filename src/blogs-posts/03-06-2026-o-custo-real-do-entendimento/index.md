---
title: Cinco dias, um sistema e o custo real do entendimento
description: Reflexões sobre a entrega acelerada de sistemas, onde a geração automática de componentes tornou-se barata e a definição precisa do problema continua a ser o principal custo da engenharia.
tags: [sistemas, agentes-llm, engenharia-de-sistemas, processos]
date: 2026-06-03
author: Bunga António
---

## Contexto

Na sexta-feira recebi um problema que, à partida, parecia simples.

Uma solução interna precisava de ser construída para suportar um processo administrativo que até então era manual.

A ideia inicial era apenas chegar a algo funcional. Algo que pudesse ser usado num piloto interno sem grande preparação.

Mas o que aconteceu nos dias seguintes acabou por mudar mais a forma como penso a estruturação e entrega de sistemas do que o próprio sistema em si.

---

## A Mudança de Fluxo

Durante muito tempo associei a entrega de sistemas a um processo bastante linear:
* compreender requisitos;
* desenhar;
* implementar;
* testar;
* e ajustar.

Desta vez esse fluxo deixou de ser o centro. Grande parte da implementação foi acelerada com o uso de agentes LLM. E isso alterou imediatamente onde o trabalho real estava a acontecer.

O gargalo deixou de ser a geração de componentes. Passou a ser conseguir pensar o problema com clareza suficiente para que o sistema gerado fizesse sentido.

Os modelos conseguiam produzir rapidamente estruturas, lógica e configurações completas. Mas isso só era útil quando a base estava bem definida. Se a regra de negócio ou o comportamento esperado do sistema não estivesse claro, o output também não estava.

---

## A Mudança de Foco

A partir daí o meu tempo começou a deslocar-se. Menos execução directa e mais trabalho em tarefas de concepção e modelagem:

* **Definir** exactamente o que estava a ser resolvido;
* **Validar** pressupostos que eu próprio estava a assumir;
* **Identificar** incoerências nas regras de negócio;
* **Quebrar** o problema em partes verificáveis;
* **Transformar** conhecimento implícito em instruções explícitas.

---

## O Ciclo de Definição

Em vários momentos o sistema parecia "pronto". Mas bastava olhar com mais atenção para aparecer outra camada de dúvida:

* o que acontece com concorrência real;
* como lidar com repetição de pedidos;
* como recuperar estado depois de falhas;
* o que fazer quando um serviço externo falha no meio de uma operação.

O ciclo repetiu-se várias vezes. Não porque a ferramenta falhava, mas porque o problema ainda não estava suficientemente bem definido.

Foi aí que ficou claro para mim que o impacto real não estava na velocidade de geração de componentes. Estava na qualidade da definição do problema.

---

## Do Executar ao Traduzir

Em muitos momentos o papel mudou. Deixei de estar apenas a executar.

Passei a estar a traduzir entre regras de negócio, comportamento esperado e aquilo que um sistema consegue executar de forma consistente — independentemente de ser código, uma configuração de rede, ou um fluxo de automação.

No final de poucos dias existia um sistema funcional, com testes, documentação e preparação para piloto. Mas isso deixou de ser a parte mais interessante.

---

## Considerações Finais

O mais relevante foi perceber como o trabalho mudou de natureza.

Quanto mais fácil fica gerar e configurar sistemas, mais difícil fica não errar na compreensão do problema. E, neste caso, foi isso que realmente fez diferença.

> [info] A capacidade de gerar sistemas tornou-se barata. O entendimento preciso do problema continua a ser o custo real.
