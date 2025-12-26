# Checklist de segurança e integridade (backlinks spam)

Data: 2025-12-26  
Site: https://solarinvest.info/

## Itens verificados
- [ ] Queda de impressões/cliques orgânicos > 20% (comparar últimos 28 dias vs período anterior)
- [ ] Alerta de ação manual ou problema de segurança no GSC
- [ ] URLs spam indexadas (ex.: /casino, /pills, /loan, /viagra, /crypto)
- [ ] Picos anormais de domínios ou links semanais
- [ ] Logs de autenticação/POST suspeitos (ex.: /wp-login.php, /xmlrpc.php)
- [ ] Formulários ou seções de conteúdo aberto sem proteção anti-spam
- [ ] Redirects ou middlewares incomuns no código/deploy

## Recomendações imediatas
1. Exportar CSV completo de “Principais sites com links” no GSC para enriquecer o scoring.
2. Registrar métricas semanais (domínios novos, volume de links, anchors) e armazenar snapshots.
3. Reexecutar o scoring sempre que surgir pico (>3x média semanal) ou anchors tóxicos repetidos.
4. Somente gerar `disavow.txt` se houver >=50 domínios com score ≥70, >=300 links suspeitos, queda de tráfego >20%, ação manual ou anchors tóxicos recorrentes.
5. Reforçar higiene operacional (updates/WAF se WordPress, revisão de middlewares/redirects se Next.js/Vercel).

## Status atual
- Nenhum critério objetivo para disavow foi atendido; apenas monitoramento sugerido.

