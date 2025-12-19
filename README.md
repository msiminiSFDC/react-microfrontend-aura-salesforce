# Salesforce React Integration: Micro-frontend Pattern 🚀

Este projeto demonstra como integrar uma aplicação **React (Vite)** dentro do **Salesforce** utilizando **Aura Components** e **Static Resources**.

A arquitetura implementa um padrão de **Micro-frontend**: um único pacote React (Static Resource) é capaz de renderizar diferentes interfaces ("apps") baseadas na configuração definida no **Lightning App Builder**, sem a necessidade de múltiplos builds ou recursos estáticos separados.

---

## 📋 Arquitetura da Solução

1.  **React App (Vite):** Uma Single Page Application compilada.
2.  **Roteamento (MemoryRouter):** Gerencia a navegação internamente sem afetar a URL do navegador do Salesforce.
3.  **Salesforce Static Resource:** Hospeda os arquivos compilados (`.js` e `.css`).
4.  **Aura Component (`ReactContainer`):** Atua como um container que baixa o recurso estático e inicializa o React.
5.  **Comunicação:** O Aura passa um parâmetro (rota) para o React decidir qual componente montar (ex: API View ou List View).

---

## 🛠️ Pré-requisitos

* **Node.js** e **npm** instalados.
* Uma **Salesforce Developer Org** ou Sandbox.
* Editor de código (VS Code recomendado).

---

## 💻 1. Configuração do Projeto React

### Instalação
Clone este repositório (ou crie o projeto) e instale as dependências:

```bash
npm install
npm install react-router-dom

```

### Estrutura de Pastas Recomendada

Certifique-se de que seus arquivos estão organizados desta forma:

```text
src/
├── components/
│   ├── ExternalData.jsx  # Componente que faz fetch na API
│   └── StaticList.jsx    # Componente de lista estática
├── App.jsx               # Roteador principal
├── main.jsx              # Ponto de entrada (Bridge para o Aura)
└── index.css             # Estilos globais (escopados)

```

### Arquivos de Configuração Críticos

**1. `vite.config.js**`
Define caminhos relativos e nomes de arquivos fixos para facilitar a importação no Aura.

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // CRÍTICO: Garante que o Static Resource encontre os assets
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/main.js',
        assetFileNames: 'assets/style.css',
      },
    },
  },
});

```

**2. `src/main.jsx**`
Expõe a função de montagem para o objeto `window`.

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

window.mountReactApp = (elementId, route) => {
  const el = document.getElementById(elementId);
  if (el) {
    const root = ReactDOM.createRoot(el);
    root.render(
      <React.StrictMode>
        <App initialRoute={route} />
      </React.StrictMode>,
    );
  }
};

```

**3. `src/index.css**`
Limpe estilos globais de `body` ou `:root` para não quebrar o layout do Salesforce.

```css
/* Use um ID ou classe específica para não afetar o Salesforce */
#react-root-container {
  font-family: 'Salesforce Sans', Arial, sans-serif;
  background-color: white;
  min-height: 100%;
}

```

---

## ☁️ 2. Configuração no Salesforce

### Passo A: Configurar Segurança (CSP)

Como o React faz chamadas para uma API externa (`jsonplaceholder`), precisamos autorizar o domínio.

1. No Salesforce, vá em **Setup** > **CSP Trusted Sites**.
2. Clique em **New Trust Site**.
* **Name:** `JSONPlaceholder`
* **URL:** `https://jsonplaceholder.typicode.com`
* **Context:** All
* **CSP Directives:** Marque a opção **Allow site for connect-src**.


3. Salve.

### Passo B: Criar o Static Resource

1. Vá em **Setup** > **Static Resources**.
2. Crie um novo recurso chamado: **`ReactApp`**.
3. **Cache Control:** Public.
4. Faça o upload do arquivo `.zip` (instruções de como gerar o zip na seção de Build abaixo).

---

## ⚡ 3. Criação do Aura Component

Crie um componente Aura chamado `ReactContainer`.

**`ReactContainer.cmp`**

```xml
<aura:component implements="flexipage:availableForAllPageTypes,force:appHostable" access="global">
    <aura:attribute name="targetRoute" type="String" default="/" access="global" />
    
    <ltng:require 
        styles="{!$Resource.ReactApp + '/assets/style.css'}"
        scripts="{!$Resource.ReactApp + '/assets/main.js'}"
        afterScriptsLoaded="{!c.initReact}" 
    />

    <div aura:id="react-root" id="{!'react-root-container-' + v.targetRoute}" class="react-container slds-scope">
        <lightning:spinner alternativeText="Carregando React..." size="medium" />
    </div>
</aura:component>

```

**`ReactContainerController.js`**

```javascript
({
    initReact : function(component, event, helper) {
        const route = component.get("v.targetRoute");
        // Cria um ID único baseado na rota
        const targetId = 'react-root-container-' + route;
        
        // Chama a função exposta pelo React no main.jsx
        if (window.mountReactApp) {
            window.mountReactApp(targetId, route);
        }
    }
})

```

**`ReactContainer.design`**

```xml
<design:component label="React Microfrontend">
    <design:attribute name="targetRoute" label="Rota do React" description="Ex: /api-view ou /list-view" />
</design:component>

```

---

## 🚀 4. Workflow de Build e Deploy

Sempre que você alterar o código React, siga este processo:

1. **Gerar o Build:**
```bash
npm run build

```


Isso criará uma pasta `dist/`.
2. **Compactar (Zip):**
Entre na pasta `dist`. Selecione **todos os arquivos dentro dela** (`assets`, `index.html`) e crie um arquivo ZIP chamado `ReactApp.zip`.
> ⚠️ **Atenção:** Não compacte a pasta `dist` em si, apenas o conteúdo dela. O `index.html` deve estar na raiz do zip.


3. **Upload:**
No Salesforce, vá em **Static Resources**, edite o `ReactApp` e faça upload do novo arquivo zip.
4. **Testar:**
Atualize a página do Salesforce. Pode ser necessário limpar o cache do navegador (`Ctrl + F5`) para ver as alterações.

---

## 📱 5. Utilização (Lightning App Builder)

Agora você pode usar o mesmo componente para mostrar telas diferentes.

1. Vá para uma página no Salesforce e clique em **Edit Page** (ícone de engrenagem).
2. Arraste o componente customizado **React Microfrontend** para a tela.
3. No painel de configuração à direita, defina a **Rota do React**:
* Digite **`/api-view`** para exibir o componente de API com botão de Refresh.
* Digite **`/list-view`** para exibir a lista estática.


4. Salve e Ative a página.

---

## 🐛 Solução de Problemas

* **Tela Branca / Spinner Infinito:**
Verifique o Console do navegador (F12). Se houver erros 404 carregando `main.js`, verifique se o nome do Static Resource é `ReactApp` e se você zipou o conteúdo da pasta `dist` corretamente (não a pasta externa).
* **Erro de Conexão (Network Error):**
Certifique-se de que a URL da API está adicionada no **CSP Trusted Sites** e que a caixa `connect-src` está marcada.
* **Estilo do Salesforce ficou escuro:**
Verifique se você removeu as configurações de `body` e `:root` (background color e color) do seu arquivo `index.css` no React.

```

```
