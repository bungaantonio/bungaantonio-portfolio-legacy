# Diretrizes para Agentes de IA (AGENTS.md)

Este documento especifica as regras estritas de estilo, desenvolvimento e comunicação que todos os assistentes de IA devem seguir ao modificar, redigir ou expandir este portfólio.

## O que DEVE ser feito (Do's)

1. **Fidelidade ao Padrão de Design (Clean & Professional):** 
   O portfólio tem uma estética minimalista, elegante e sóbria. Todos os diagramas e elementos gráficos criados devem seguir um padrão arquitetural "BPMN-like" ou técnico: fundo branco/claro, bordas cinza escuro, tipografia legível (Arial/sans-serif), sem floreados desnecessários.
2. **Resumo Arquitetural em vez de Código Massivo:** 
   Ao redigir estudos de caso ou "Extensões" de projetos, não despejes ficheiros ou blocos de código gigantes (`schema.prisma`, `controllers.ts`, etc.). Em vez disso, abstrai as soluções focando nos **trade-offs** e nas decisões de engenharia (ex: "Modelo de Dados Unificado", "Interceção de Gateway", "Concorrência"). Se for imperativo mostrar código, mostra apenas as 3-5 linhas cruciais.
3. **Linguagem Técnica e Profissional:** 
   O tom deve ser sempre corporativo, analítico e focado em engenharia de software (escalabilidade, segurança, fluidez UI/UX). A escrita deve ser em Português de Portugal (PT-PT).
4. **Respeitar o "Frontmatter" dos Ficheiros:**
   Ao criares novos ficheiros Markdown (`.md`) para o blog ou portfólio, garante sempre a presença e preenchimento correto das tags essenciais no cabeçalho (title, description, category, stack, tags, date).
5. **Priorizar Ferramentas Específicas:**
   Usa sempre as ferramentas de sistema mais adequadas e seguras (ex: `view_file` ou `replace_file_content`) em vez de comandos genéricos de terminal quando lidares com ficheiros, seguindo rigorosamente as tuas instruções de sistema.

## O que NÃO DEVE ser feito (Don'ts)

1. **PROIBIDO O USO DE EMOJIS:** 
   É estritamente proibido o uso de qualquer tipo de emoji (🚀, 💻, ⌨️, etc.) quer no Markdown, quer em ficheiros SVG. A comunicação do portfólio deve ser puramente baseada em texto formal e ícones vetoriais técnicos (ex: SVG UI icons).
2. **Sem Títulos Rígidos ou Clichés:** 
   Não utilizes formatações fixas ou engessadas (ex: forçar o título "Evolução do Produto" em todas as extensões). Adapta os títulos de forma natural e invisível à leitura do portfólio (ex: "Decisões Críticas de Arquitetura").
3. **Sem Secções de "Equipa" ou "Responsáveis":** 
   Este é um portfólio pessoal e individual focado nas tuas competências de engenharia. É absolutamente proibido incluir secções que descrevam "Dono do Processo", "Equipa de Condução" ou intervenientes corporativos de terceiros nos casos de estudo.
4. **Sem Estéticas Exageradas:** 
   Não desenhes SVGs com _dark modes_ forçados, gradientes complexos ou estéticas excessivamente lúdicas. O design deve assemelhar-se a relatórios de arquitetura de software (foco na legibilidade e na mensagem técnica).
