# Cómo contribuir (y cómo trabajará tu equipo en el hackatón)

## El flujo

1. **Issue.** Cada tarea es una issue con una persona asignada.
2. **Rama.** Crea una rama desde `main` actualizada: `git switch -c 12-login` (número de issue + descripción corta).
3. **Commits.** Pequeños, con un solo cambio lógico y un mensaje que diga qué y por qué.
4. **Push.** `git push -u origin 12-login`.
5. **Pull request.** Base `main`, explica el cambio y escribe `closes #12` para cerrar la issue al fusionar.
6. **Revisión.** Otra persona del equipo revisa *Files changed*, comenta y aprueba.
7. **Fusión.** *Merge pull request*, borra la rama y haz `git pull` en tu `main`.

## Reglas

- Nadie hace push directo a `main`: está protegida.
- Toda pull request la revisa al menos otra persona.
- Las pull requests se revisan en menos de 15 minutos.
- Si aparece un conflicto, lo resuelve quien abrió la pull request; si se atasca, avisa en el canal del equipo.
- Nunca subas tokens, contraseñas ni datos personales.
