#!/usr/bin/env bash
set -euo pipefail
agro_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$agro_root"
sam_commit=2b90b9f5ceec907a1c18123530e92e794ad901a4
mkdir -p .data-cache/deployment
if [[ ! -d .data-cache/sam2/.git ]]; then
  git clone https://github.com/facebookresearch/sam2.git .data-cache/sam2
  git -C .data-cache/sam2 checkout "$sam_commit"
fi
[[ "$(git -C .data-cache/sam2 rev-parse HEAD)" == "$sam_commit" ]] || { echo 'SAM source must match services/model-version.json.' >&2; exit 1; }
if [[ ! -x services/.venv/bin/python ]]; then uv venv --python 3.12 services/.venv; fi
SAM2_BUILD_CUDA=0 uv pip install --python services/.venv/bin/python --extra-index-url https://download.pytorch.org/whl/cu128 --index-strategy unsafe-best-match -r services/requirements-lock.txt
uv run --no-project --python services/.venv/bin/python python - <<'PY'
import hashlib,json,os,secrets
from pathlib import Path
import requests,torch
root=Path.cwd();model=json.loads((root/'services/model-version.json').read_text());checkpoint=root/'.data-cache/sam2.1_hiera_tiny.pt'
if not checkpoint.exists():
    response=requests.get(model['checkpointUrl'],timeout=120);response.raise_for_status();temporary=checkpoint.with_suffix('.tmp');temporary.write_bytes(response.content)
    assert hashlib.sha256(temporary.read_bytes()).hexdigest()==model['checkpointSha256'];temporary.replace(checkpoint)
assert hashlib.sha256(checkpoint.read_bytes()).hexdigest()==model['checkpointSha256']
assert torch.cuda.is_available(),'A CUDA GPU is required for live SAM inference.'
token_file=root/'.data-cache/deployment/service-token'
if not token_file.exists(): token_file.write_text(secrets.token_urlsafe(40)+'\n');token_file.chmod(0o600)
env_file=root/'.data-cache/deployment/service.env'
if not env_file.exists():
    env_file.write_text('AGROCEBADA_SERVICE_TOKEN='+token_file.read_text().strip()+'\nAGROCEBADA_REGISTER_URL=https://agrocebada.datascience-mexico.com/__service/register\n');env_file.chmod(0o600)
print('Fixed checkpoint verified; CUDA service environment prepared.')
PY
uv run --no-project --python services/.venv/bin/python python services/build_manifests.py
