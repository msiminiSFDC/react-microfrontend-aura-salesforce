({
    initReact : function(component, event, helper) {
        // Pega o valor configurado no App Builder
        const route = component.get("v.targetRoute");

        // Gera o ID único baseado na rota (ou poderia usar globalId)
        // IMPORTANTE: O ID aqui deve bater com o ID da DIV no .cmp
        // Uma prática melhor para IDs únicos é usar o Global ID do Aura
        // Mas para simplificar, vamos usar o que definimos no cmp:
        const targetId = 'react-root-container-' + route;

        if (window.mountReactApp) {
            // Passa o ID e a ROTA para o React
            window.mountReactApp(targetId, route);
        }
    }
})