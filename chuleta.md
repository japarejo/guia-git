# Chuleta de comandos

| Para… | Comando |
|---|---|
| Configurar tu identidad | `git config --global user.name "Tu Nombre"` · `git config --global user.email "correo"` |
| Copiar un repositorio | `git clone https://github.com/japarejo/guia-git.git` |
| Ver el estado | `git status` |
| Preparar cambios | `git add <archivo>` · `git add .` |
| Sacar del área de preparación | `git reset <archivo>` |
| Descartar cambios de un archivo | `git restore <archivo>` |
| Guardar una instantánea | `git commit -m "Mensaje"` |
| Ver el historial | `git log --oneline --graph` |
| Crear una rama y cambiar a ella | `git switch -c <rama>` |
| Cambiar de rama | `git switch <rama>` |
| Fusionar una rama en la actual | `git merge <rama>` |
| Publicar una rama nueva | `git push -u origin <rama>` |
| Publicar más commits | `git push` |
| Descargar sin tocar tus archivos | `git fetch` |
| Descargar e integrar | `git pull` |
| Borrar una rama ya fusionada | `git branch -d <rama>` |

**Orden habitual:** commit (una o varias veces) → push → pull request → revisión → fusión → pull.
