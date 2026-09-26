"""Generate 8 MiB plus 5 bytes of synthetic upload bytes; never includes patient data."""
from pathlib import Path
import hashlib,json
p=Path(__file__).parent/'generated';p.mkdir(exist_ok=True)
data=b'G'*8388608+b'HELLO'
(p/'synthetic_upload.bin').write_bytes(data)
r={'total_bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'parts':[{'index':i,'size':len(b),'sha256':hashlib.sha256(b).hexdigest()} for i,b in enumerate([data[:8388608],data[8388608:]])]}
(p/'media_manifest.json').write_text(json.dumps(r,indent=2))
print(json.dumps(r))
