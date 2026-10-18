# Práctica 3 · Trabaja en una rama

```bash
git switch -c ficha-<tu-usuario>
```

A partir de aquí tus commits van a esa rama y `main` no cambia. Si ya hiciste el commit de la práctica 2 en `main`, no pasa nada: la rama nueva lo incluye.

Añade además un consejo a `guia.md`, en la sección que quieras, y haz otro commit:

```bash
git add guia.md
git commit -m "Añade un consejo sobre ramas"
git log --oneline --graph
```

Ver: [Ramas y HEAD](https://japarejo.github.io/guia-git/animaciones/02-ramas.html).
