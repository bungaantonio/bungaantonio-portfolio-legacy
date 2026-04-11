---
title: Configuração de Múltiplas Chaves SSH para Git
description: Passo a passo para gerenciar duas contas diferentes (pessoal e profissional) com chaves SSH separadas e configurá-las para uso com GitHub (ou GitLab).
tags: [git, github, desenvolvimento, chaves-ssh]
date: 2025-05-16
---

Quando você trabalha com múltiplas contas no GitHub (ou GitLab), como uma conta pessoal e outra profissional, é essencial manter separadas suas credenciais de acesso. O uso de chaves SSH distintas para cada conta é uma maneira segura e eficaz de gerenciar esse cenário. Abaixo está um passo a passo completo para configurar e usar múltiplas chaves SSH com o Git.

## Pré-requisitos

    Git instalado (`git --version`)
    Acesso ao terminal (Linux, macOS, ou Git Bash no Windows)
    Contas configuradas no GitHub ou GitLab

## Passo 1: Gerar Chaves SSH distintas

Primeiro, você precisa gerar duas chaves SSH separadas. Abra o terminal e execute os seguintes comandos:

Conta pessoal:

```bash
ssh-keygen -t ed25519 -C "seu-email-pessoal@example.com" -f ~/.ssh/id41999_pessoal
```

+ Comentário/email: `bunga.antonio@safari.com`
+ chave privada: `~/.ssh/id41999_pessoal`
+ chave pública: `~/.ssh/id41999_pessoal.pub`

Conta profissional:

```bash
ssh-keygen -t ed25519 -C "bunga.antonio@empresa.com" -f ~/.ssh/id_ed25519_trabalho
```

+ Comentário/email: `seu-email-pessoal@example.com`
+ chave privada: `~/.ssh/id41999_profissional`
+ chave pública: `~/.ssh/id41999_profissional.pub`

> **Dica**: Quando solicitado, você pode definir uma passphrase para maior segurança.

## Passo 2: Associar as chaves nas plataformas (GitHub, GitLab, etc.)

1. Acesse sua conta no GitHub ou GitLab.
2. Vá para **Configurações** (Settings).
3. Selecione **SSH and GPG keys**.
4. Clique em **New SSH key**.
5. Cole o conteúdo da chave pública (`~/.ssh/id41999_pessoal.pub`) e dê um nome descritivo (ex: "Pessoal").
6. Repita o processo para a chave profissional (`~/.ssh/id41999_profissional.pub`), nomeando-a de forma apropriada (ex: "Profissional").
7. Salve as alterações.

## Passo 3: Configurar o arquivo config (`~/.ssh/config`) do SSH

Crie ou edite esse arquivo para mapear cada chave a um host:

```bash
code ~/.ssh/config
```

ou

```bash
nano ~/.ssh/config
```

ou

```bash
notepad ~/.ssh/config
```

Adicione o seguinte conteúdo:

```ssh
# Conta Pessoal
Host github-pessoal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id41999_pessoal

# Conta Profissional
Host github-profissional
    HostName github.com
    User git
    IdentityFile ~/.ssh/id41999_profissional

```
## Passo 4: Clonando repositórios com a chave correta

Pessoal
```bash
git clone git@github-pessoal:usuario/repositorio.git
```
Profissional
```bash
git clone git@github-profissional:usuario/repositorio.git
```

## Passo 5: Testar a configuração
Para verificar se tudo está funcionando corretamente, execute o seguinte comando:

```bash
ssh -T git@github-pessoal
```

ou
```bash
ssh -T git@github-profissional
```

## Passo 6: Configurar user.name e user.email por conta

Para garantir que os commits sejam feitos com o nome e email corretos, você pode configurar isso por repositório:

```bash
git config user.name "Seu Nome"
git config user.email "seu@email.com"
```

### Verificar configurações
```bash
git config user.name
git config user.email
git config --list
```