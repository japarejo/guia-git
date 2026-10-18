# Práctica extra · Provoca y resuelve un conflicto

En tu propio repositorio de pruebas (o en el de tu equipo):

1. En `main`, cambia la línea «Usa una rama por tarea.» de `guia.md` y haz commit.
2. Vuelve al commit anterior en una rama: `git switch -c otra HEAD~1`, cambia **la misma línea** de otra forma y haz commit.
3. `git switch main` y `git merge otra`: aparece el conflicto.
4. Abre `guia.md`, elige el texto final y borra las marcas `<<<<<<<`, `=======`, `>>>>>>>`.
5. `git add guia.md` y `git commit`.

Ver: [Conflictos](https://japarejo.github.io/guia-git/animaciones/05-conflictos.html) y [merge y rebase](https://japarejo.github.io/guia-git/animaciones/06-merge-rebase.html).
