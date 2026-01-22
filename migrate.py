#!/usr/bin/env python3
"""
MIGRATION SCRIPT v5.0
Verschiebt alle Dateien in neue Ordnerstruktur via GitHub API
"""

import os
import requests
import base64
import json
from typing import Dict, List, Tuple

# GitHub Config
OWNER = "Polizei1234"
REPO = "Dispatcher-Simulator"
BRANCH = "main"
TOKEN = os.environ.get("GITHUB_TOKEN", "")  # GitHub Personal Access Token

BASE_URL = f"https://api.github.com/repos/{OWNER}/{REPO}/contents"
HEADERS = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

# Migration Map: alte_datei -> neuer_pfad
MIGRATION_MAP: Dict[str, str] = {
    # CORE
    "js/game.js": "js/core/game.js",
    "js/main.js": "js/core/main.js",
    "js/config.js": "js/core/config.js",
    "js/bridge.js": "js/core/bridge.js",
    
    # SYSTEMS
    "js/vehicle-movement.js": "js/systems/vehicle-movement.js",
    "js/call-system.js": "js/systems/call-system.js",
    "js/ai-incident-generator.js": "js/systems/ai-incident-generator.js",
    "js/escalation-system.js": "js/systems/escalation-system.js",
    "js/weather-system.js": "js/systems/weather-system.js",
    "js/mission-timer.js": "js/systems/mission-timer.js",
    "js/groq-validator.js": "js/systems/groq-validator.js",
    
    # UI
    "js/tabs.js": "js/ui/tabs.js",
    "js/ui.js": "js/ui/ui.js",
    "js/ui-helpers.js": "js/ui/ui-helpers.js",
    "js/assignment-ui.js": "js/ui/assignment-ui.js",
    "js/manual-incident.js": "js/ui/manual-incident.js",
    "js/protocol-form.js": "js/ui/protocol-form.js",
    "js/keywords-dropdown.js": "js/ui/keywords-dropdown.js",
    "js/draggable.js": "js/ui/draggable.js",
    
    # DATA
    "js/data.js": "js/data/data.js",
    "js/hospitals.js": "js/data/hospitals.js",
    "js/fms-codes.json": "js/data/fms-codes.json",
    "js/incidents.js": "js/data/incidents.js",
    
    # UTILS
    "js/notification-system.js": "js/utils/notification-system.js",
    "js/scoring-system.js": "js/utils/scoring-system.js",
    "js/incident-numbering.js": "js/utils/incident-numbering.js",
    "js/location-generator.js": "js/utils/location-generator.js",
    "js/address-service.js": "js/utils/address-service.js",
    "js/vehicle-analyzer.js": "js/utils/vehicle-analyzer.js",
    "js/version-manager.js": "js/utils/version-manager.js",
    "js/tutorial.js": "js/utils/tutorial.js",
}

def get_file_content(path: str) -> Tuple[str, str]:
    """Holt Dateiinhalt und SHA von GitHub"""
    url = f"{BASE_URL}/{path}"
    response = requests.get(url, headers=HEADERS, params={"ref": BRANCH})
    
    if response.status_code != 200:
        raise Exception(f"Fehler beim Laden von {path}: {response.status_code}")
    
    data = response.json()
    content = base64.b64decode(data["content"]).decode("utf-8")
    sha = data["sha"]
    
    return content, sha

def create_file(path: str, content: str, message: str) -> None:
    """Erstellt eine neue Datei"""
    url = f"{BASE_URL}/{path}"
    encoded_content = base64.b64encode(content.encode("utf-8")).decode("utf-8")
    
    payload = {
        "message": message,
        "content": encoded_content,
        "branch": BRANCH
    }
    
    response = requests.put(url, headers=HEADERS, json=payload)
    
    if response.status_code not in [200, 201]:
        raise Exception(f"Fehler beim Erstellen von {path}: {response.status_code} - {response.text}")
    
    print(f"  ✅ {path} erstellt")

def delete_file(path: str, sha: str, message: str) -> None:
    """Löscht eine Datei"""
    url = f"{BASE_URL}/{path}"
    
    payload = {
        "message": message,
        "sha": sha,
        "branch": BRANCH
    }
    
    response = requests.delete(url, headers=HEADERS, json=payload)
    
    if response.status_code != 200:
        raise Exception(f"Fehler beim Löschen von {path}: {response.status_code}")
    
    print(f"  🗑️ {path} gelöscht")

def move_file(old_path: str, new_path: str) -> None:
    """Verschiebt eine Datei (kopieren + löschen)"""
    try:
        # 1. Hole Inhalt
        content, sha = get_file_content(old_path)
        
        # 2. Erstelle an neuem Ort
        create_file(new_path, content, f"refactor: Move {old_path} to {new_path}")
        
        # 3. Lösche alten Ort
        delete_file(old_path, sha, f"refactor: Remove old {old_path}")
        
        print(f"✅ {old_path} -> {new_path}")
        
    except Exception as e:
        print(f"❌ Fehler bei {old_path}: {e}")

def main():
    print("🚀 STARTE MIGRATION ZU v5.0...")
    print()
    
    if not TOKEN:
        print("❌ ERROR: GITHUB_TOKEN Umgebungsvariable nicht gesetzt!")
        print("Nutze: export GITHUB_TOKEN='dein_token'")
        return
    
    # Phase 1: CORE
    print("🔵 Phase 1/5: Core Files")
    for old, new in [(k, v) for k, v in MIGRATION_MAP.items() if "/core/" in v]:
        move_file(old, new)
    print()
    
    # Phase 2: SYSTEMS
    print("🔴 Phase 2/5: Systems")
    for old, new in [(k, v) for k, v in MIGRATION_MAP.items() if "/systems/" in v]:
        move_file(old, new)
    print()
    
    # Phase 3: UI
    print("🟡 Phase 3/5: UI Components")
    for old, new in [(k, v) for k, v in MIGRATION_MAP.items() if "/ui/" in v]:
        move_file(old, new)
    print()
    
    # Phase 4: DATA
    print("🟢 Phase 4/5: Data Files")
    for old, new in [(k, v) for k, v in MIGRATION_MAP.items() if "/data/" in v]:
        move_file(old, new)
    print()
    
    # Phase 5: UTILS
    print("🟪 Phase 5/5: Utils")
    for old, new in [(k, v) for k, v in MIGRATION_MAP.items() if "/utils/" in v]:
        move_file(old, new)
    print()
    
    print("✅ MIGRATION KOMPLETT!")
    print()
    print("⚠️  NÄCHSTE SCHRITTE:")
    print("1. index.html aktualisieren (Script-Pfade anpassen)")
    print("2. Testen dass alles funktioniert")
    print("3. Cache leeren (Strg+Shift+R)")
    print()

if __name__ == "__main__":
    main()
