# Guía de Git del Hackatón Momentum CSIC 2026

Repositorio del taller **Git y GitHub** (Granada, 2026). Durante la sesión, cada participante lleva un cambio propio desde su ordenador hasta `main`: clona, crea una rama, hace commits, publica la rama, abre una pull request, la revisa otra persona y se fusiona.

## Antes del taller

Sigue el bloque 00 de las diapositivas («Prepara tu ordenador»):

1. Instala Git y comprueba `git --version`.
2. Crea tu cuenta de GitHub y configura tu nombre y correo:
   ```bash
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu-correo@ejemplo.com"
   git config --global init.defaultBranch main
   git config --global pull.rebase false
   ```
3. Genera un token personal (*Settings › Developer settings › Personal access tokens*) con permiso `repo`. Lo pegarás como contraseña en tu primer `git push`. **Nunca lo compartas en el chat.**
4. Pega tu usuario de GitHub en el chat al empezar la sesión para recibir permiso de escritura.

## Durante el taller

| Paso | Qué haces | Dónde |
|---|---|---|
| 1 | `git clone` de este repositorio | [practicas/01-clonar.md](practicas/01-clonar.md) |
| 2 | Crea tu ficha en `participantes/` y haz commit | [practicas/02-commit.md](practicas/02-commit.md) |
| 3 | Trabaja en una rama propia | [practicas/03-rama.md](practicas/03-rama.md) |
| 4 | Publica la rama y abre una pull request | [practicas/04-pull-request.md](practicas/04-pull-request.md) |
| 5 | Revisa la pull request que te asigne el docente | [practicas/04-pull-request.md](practicas/04-pull-request.md) |
| 6 | Actualiza tu `main` con `git pull` | [practicas/05-sincronizar.md](practicas/05-sincronizar.md) |
| Extra | Provoca y resuelve un conflicto | [practicas/06-conflictos.md](practicas/06-conflictos.md) |

## Animaciones interactivas

Se abren en el navegador, sin instalar nada: **https://japarejo.github.io/guia-git/animaciones/**

| Animación | Bloque |
|---|---|
| [Las tres zonas de Git](https://japarejo.github.io/guia-git/animaciones/01-tres-zonas.html) | 03 · Commits |
| [Ramas y HEAD](https://japarejo.github.io/guia-git/animaciones/02-ramas.html) | 04 · Ramas |
| [Del issue a main](https://japarejo.github.io/guia-git/animaciones/03-pull-request.html) | 05 y 08 · Pull requests y equipos |
| [push, fetch y pull](https://japarejo.github.io/guia-git/animaciones/04-push-fetch-pull.html) | 06 · Sincronizar |
| [Conflictos](https://japarejo.github.io/guia-git/animaciones/05-conflictos.html) | 09 · Resolver conflictos |
| [merge y rebase](https://japarejo.github.io/guia-git/animaciones/06-merge-rebase.html) | 09 · Resolver conflictos |

## Para el hackatón

- [CONTRIBUTING.md](CONTRIBUTING.md): el flujo de trabajo y las reglas del equipo.
- [equipos/](equipos/): cómo preparar el repositorio de tu equipo y una plantilla de README.
- [chuleta.md](chuleta.md): los comandos del taller en una página.

## Contenido

```
README.md            este archivo
guia.md              la guía que mejoramos entre todos durante el taller
chuleta.md           comandos del taller
CONTRIBUTING.md      flujo issue → rama → pull request → revisión → fusión
participantes/       una ficha por participante
practicas/           enunciados de los ejercicios
equipos/             preparación de los equipos del hackatón
docs/animaciones/    animaciones interactivas (publicadas con GitHub Pages)
```

Material docente: J. A. Parejo. Licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es).
Espero que os guste :-D
