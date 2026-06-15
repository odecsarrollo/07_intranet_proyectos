#!/usr/bin/env bash
# Permisos Unix/SELinux para que nginx lea STATIC_ROOT y MEDIA_ROOT por alias en disco.
#
# Recomendado on-prem: Nginx hace proxy de /static/ y /media/ a Gunicorn (ver intranet_proyectos.conf);
# entonces este script solo hace falta si vuelves a usar alias o para backups en el host.
#
# Si reaparece 403 con alias: Podman :U + collectstatic dejan root:root 2770 (drwxrws---).
# Uso: sudo ./deploy/fix-nginx-static-perms.sh
set -euo pipefail

SITE_ROOT="${SITE_ROOT:-/var/www/html/07_intranet_proyectos}"
STATICFILES="${STATIC_ROOT:-$SITE_ROOT/staticfiles}"
MEDIA_DIR="${MEDIA_ROOT:-$SITE_ROOT/media}"
SELINUX_TYPE="${SELINUX_TYPE:-httpd_sys_content_t}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Ejecuta con sudo: sudo $0" >&2
  exit 1
fi

# Nginx debe poder llegar hasta SITE_ROOT/staticfiles; con 750 sin "others" puede dar 403
# incluso si el propio STATIC_ROOT está bien. Solo suma ejecutable para otros (atravesar).
fix_ancestors_traverse() {
  local d="$1"
  while [[ -n "${d:-}" && "${d:-}" != "/" ]]; do
    if [[ -d "$d" ]]; then
      chmod o+x "$d" 2>/dev/null || true
    fi
    d="$(dirname "$d")"
  done
}

apply_unix_and_selinux() {
  local dir="$1"
  [[ -d "$dir" ]] || return 0

  chgrp -R nginx "$dir"
  chmod -R g+rX "$dir"

  if [[ "$(getenforce 2>/dev/null)" == "Enforcing" ]] && command -v chcon >/dev/null 2>&1; then
    chcon -Rt "$SELINUX_TYPE" "$dir"
  fi

  if command -v semanage >/dev/null 2>&1 && command -v restorecon >/dev/null 2>&1; then
    local pat="${dir}(/.*)?"
    if semanage fcontext -a -t "$SELINUX_TYPE" "$pat" 2>/dev/null \
      || semanage fcontext -m -t "$SELINUX_TYPE" "$pat" 2>/dev/null; then
      restorecon -Rv "$dir"
    fi
  fi
}

if [[ ! -d "$STATICFILES" ]]; then
  echo "AVISO: no existe STATIC_ROOT: $STATICFILES (¿collectstatic?)" >&2
fi

fix_ancestors_traverse "$SITE_ROOT"

apply_unix_and_selinux "$STATICFILES"
apply_unix_and_selinux "$MEDIA_DIR"

echo "Hecho. Pruebas:"
echo "  curl -sI \"http://127.0.0.1/static/assets/bundles/dist/app-9aaae67f2ea3ebf9fe53.css\" | head -n 1"
echo "  curl -sI \"http://127.0.0.1/media/test.txt\" | head -n 1"
echo "Nota: GET /media/ (solo la carpeta) suele dar 403 si autoindex está off; prueba un fichero concreto."
