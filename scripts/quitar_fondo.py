# Quita el fondo de una imagen (rembg, modelo u2netp libre). Uso: python scripts/quitar_fondo.py entrada.png salida.png [u2netp|u2net]
import sys
from rembg import remove, new_session
from PIL import Image
i, o = sys.argv[1], sys.argv[2]
s = new_session(sys.argv[3] if len(sys.argv) > 3 else 'u2netp')
remove(Image.open(i).convert('RGB'), session=s).save(o)
print('ok', o)
