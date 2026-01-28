# 🧹 CLEANUP NEEDED - Veraltete Release Notes

## ❌ **DIESE DATEIEN SOLLTEN GELÖSCHT WERDEN:**

Alle Release Notes für v5.0 bis v6.3 sind **veraltet**. Das Projekt ist jetzt bei **v7.3.0+**.

### Zu löschende Dateien:

1. `FINAL_STATUS_v5.0.0.md` - Version 5.0 Status
2. `COMMITS_v6.2.0.md` - v6.2.0 Commit-Liste
3. `RELEASE_NOTES_v6.0.0.md` - v6.0.0 Release Notes
4. `RELEASE_NOTES_v6.1.0.md` - v6.1.0 Release Notes
5. `RELEASE_NOTES_v6.2.0.md` - v6.2.0 Release Notes
6. `RELEASE_NOTES_v6.3.0.md` - v6.3.0 Release Notes

**Insgesamt: 6 Dateien**

---

## ℹ️ **WARUM LÖSCHEN?**

- ✅ Aktuell ist Version **7.3.0+**
- ✅ Release Notes für v5-v6 sind **nicht mehr relevant**
- ✅ Historische Infos bleiben in **Git-History** erhalten
- ✅ Reduziert Verwirrung bei neuen Entwicklern

---

## 📝 **ZUKÜNFTIGE RELEASE NOTES:**

Ab v7.0.0 werden Release Notes direkt auf GitHub als **Releases** veröffentlicht:
- Keine separaten Markdown-Dateien mehr
- GitHub Release-Feature nutzen
- Automatisch mit Tags verknüpft

---

## 👉 **AKTION ERFORDERLICH:**

Bitte lösche diese Dateien manuell:

```bash
cd docs/releases/
rm FINAL_STATUS_v5.0.0.md
rm COMMITS_v6.2.0.md
rm RELEASE_NOTES_v6.0.0.md
rm RELEASE_NOTES_v6.1.0.md
rm RELEASE_NOTES_v6.2.0.md
rm RELEASE_NOTES_v6.3.0.md
rm CLEANUP_NEEDED.md  # Diese Datei auch löschen nach Cleanup

git add -A
git commit -m "🧹 Entferne veraltete Release Notes (v5-v6)"
git push
```

Oder über GitHub Web-Interface jede Datei einzeln löschen.
