# 📸 Carpeta de imágenes de productos

Coloca aquí las imágenes antes de ejecutar `node scripts/upload-images.js`.

## Convención de nombres

El archivo debe llamarse exactamente igual al **slug** del producto en la base de datos.

| Archivo | Descripción |
|---|---|
| `<slug>.jpg` | Imagen principal (posición 1) |
| `<slug>-2.jpg` | Segunda imagen (posición 2) |
| `<slug>-3.jpg` | Tercera imagen (posición 3) |

## Ejemplos

```
fertilizante-granular-10-10-10.jpg       ← imagen principal
fertilizante-granular-10-10-10-2.jpg     ← segunda imagen
semilla-de-maiz-hibrido.webp
semilla-de-maiz-hibrido-2.png
azadon-de-mango-reforzado.jpg
riego-por-goteo-50m.jpg
herbicida-selectivo-pastos.jpg
pienso-concentrado-bovinos.jpg
insecticida-biologico.jpg
manguera-para-riego-30m.jpg
guantes-de-trabajo-reforzados.jpg
semilla-de-tomate-cherry.jpg
```

## Slugs actuales en la DB

```
fertilizante-granular-10-10-10
semilla-de-maiz-hibrido
azadon-de-mango-reforzado
riego-por-goteo-50m
herbicida-selectivo-pastos
pienso-concentrado-bovinos
insecticida-biologico
manguera-para-riego-30m
guantes-de-trabajo-reforzados
semilla-de-tomate-cherry
```

## Formatos soportados

`.jpg` / `.jpeg` / `.png` / `.webp` / `.avif`  
Tamaño máximo: **10 MB** por imagen.

## Recomendación de tamaño

- Resolución: **800 × 600 px** mínimo, **1200 × 900 px** ideal.
- Peso: < 500 KB (usa [Squoosh](https://squoosh.app) para comprimir).

---

> ⚠️ Esta carpeta está en `.gitignore`. Las imágenes NO se suben al repositorio,
> solo se envían a Supabase Storage.
