#!/usr/bin/env bash
# Repara cotización atascada en ENV sin PDF y reconstruye el contenedor web.
# Uso: sudo ./deploy/repair-cotizacion-enviar.sh 14038
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ID="${1:?Indica el id de cotización, ej: 14038}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Ejecuta con sudo: sudo $0 $ID" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
source "$ROOT/.env"
set +a

DB_HOST="${DB_HOST:-127.0.0.1}"
if [[ "$DB_HOST" == "db" ]]; then
  DB_HOST="127.0.0.1"
fi

echo "==> Reparando cotización $ID en MariaDB..."
podman run --rm docker.io/library/mariadb:10.11 mariadb \
  -h "host.containers.internal" \
  -u "${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" <<SQL
START TRANSACTION;
DELETE FROM cotizaciones_componentes_cotizacioncomponenteseguimiento
  WHERE cotizacion_componente_id=${ID} AND tipo_seguimiento='ENV';
DELETE FROM envios_emails_cotizacioncomponenteenvio
  WHERE cotizacion_componente_id=${ID};
DELETE FROM cotizaciones_componentes_cotizacioncomponentedocumento
  WHERE cotizacion_componente_id=${ID}
    AND (pdf_cotizacion IS NULL OR pdf_cotizacion = '');
UPDATE cotizaciones_componentes_cotizacioncomponente
  SET estado='INI' WHERE id=${ID} AND estado IN ('ENV','REC');
COMMIT;
SELECT id, estado, nro_consecutivo FROM cotizaciones_componentes_cotizacioncomponente WHERE id=${ID};
SQL

echo "==> Permisos media/cotizaciones..."
"$ROOT/deploy/fix-media-cotizaciones-perms.sh"

echo "==> Reconstruyendo contenedor web..."
cd "$ROOT"
podman-compose up -d --build --force-recreate web

echo "Listo. Prueba enviar la cotización $ID desde la intranet."
