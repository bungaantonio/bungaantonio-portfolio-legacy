---
title: Instalando SSD NVMe Gen4 no Dell Latitude 7480
description: Passo a passo para usar um SSD Kingston NV2 PCIe 4.0 em um Latitude 7480, contornando limitações de compatibilidade.
tags: [hardware, compatibilidade, SSD, Dell, NVMe]
date: 2025-04-09
---

Atualizar o armazenamento de um notebook antigo pode ser mais simples do que parece — mesmo em modelos que, à primeira vista, não reconhecem SSDs NVMe modernos. Neste guia, descrevo como instalar com sucesso um **Kingston NV2 PCIe 4.0** em um **Dell Latitude 7480**, modelo que não detectava o disco inicialmente por conta da configuração padrão da BIOS.

## O problema

Ao inserir o NV2 no Latitude 7480, o SSD:

- Não aparecia na BIOS
- Não era listado no instalador do sistema operacional
- Funcionava normalmente em outros modelos mais recentes

Tudo indicava um problema de compatibilidade, não com o SSD em si, mas com a forma como a BIOS do Latitude lida com controladores NVMe.

## Diagnóstico

- O Latitude 7480 utiliza chipsets Intel de 6ª ou 7ª geração, com suporte máximo a **PCIe Gen3**
- A BIOS vem configurada com o modo **RAID On**, o que pode impedir o reconhecimento de alguns SSDs NVMe
- O NV2 utiliza um controlador **Phison E21**, que funciona melhor com acesso direto via **modo AHCI**

## O que funcionou

### 1. Atualize a BIOS

Vá até o [site de suporte da Dell](https://www.dell.com/support/home/pt-br/product-support/product/latitude-14-7480-laptop/drivers) e baixe:

- A última versão da **BIOS**
- Drivers de **chipset**
- (Opcional) Intel RST — apenas necessário se mantiver RAID

### 2. Altere o modo SATA para AHCI

No boot, pressione **F2** e acesse:

> `System Configuration > SATA Operation`

Mude de `RAID On` para `AHCI`. Salve e reinicie.

> ⚠️ Importante: se o sistema já estiver instalado com RAID, a mudança pode impedir o boot. Faça backup.

### 3. Instale fisicamente o SSD

- Insira o NV2 no slot M.2
- Aperte o parafuso de fixação
- Ligue o notebook e verifique na BIOS se o SSD aparece

## Resultado

Após os ajustes:

- O NV2 foi reconhecido normalmente
- A instalação do sistema ocorreu sem problemas
- A taxa de leitura ficou em torno de **3000 MB/s**, limitada pela interface Gen3
- Nenhum erro ou instabilidade foi detectado após várias horas de uso

## Testes complementares

Ferramentas úteis para validar a instalação:

| Sistema | Ferramenta         | Verificações principais        |
| ------- | ------------------ | ------------------------------ |
| Windows | CrystalDiskInfo    | Interface, temperatura, health |
| Linux   | `nvme-cli`, `lshw` | Capacidade, link speed, status |


## Conclusão

Mesmo com limitações de geração e interface, é possível aproveitar SSDs modernos em máquinas como o Latitude 7480. A troca de RAID para AHCI foi a chave — um ajuste simples que pode dar anos extras de vida útil ao equipamento.

## Recomendações finais

- Compartilhe com colegas que lidam com hardware legado
- Consulte nosso repositório [no GitHub](#) com mais testes e documentação
