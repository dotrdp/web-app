"""Export the selected FIRA yield ensemble to public/data/predictions.json.

Reads the fixed 90/10 conservative blend from the sibling final-model package
(out-of-fold predictions for the 138 labelled parcels, fold-averaged predictions
for the 59 reserved parcels) and the official 70/30 split. Nothing is refitted.

    python3 -I scripts/export_predictions.py
"""
import csv
import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FINAL = ROOT.parent / "final-model"
RUN = FINAL / "runs" / "fusion_refinement_20261012" / "conservative_blend"
SPLIT = ROOT.parent / "dataset" / "DATASET_RETO_AGRO_2026" / "ID_area_rendimiento_70_30_Reto_AgroCebada.csv"
OUT = ROOT / "public" / "data" / "predictions.json"


def main() -> int:
    oof = np.load(RUN / "oof.npz", allow_pickle=False)
    metrics = json.loads((RUN / "metrics.json").read_text())
    with open(RUN / "unknown_predictions.csv", newline="") as f:
        unknown = {row["id"]: float(row["prediction"]) for row in csv.DictReader(f)}
    with open(SPLIT, newline="", encoding="utf-8-sig") as f:
        split = {row["ID_POLIGONO"]: row for row in csv.DictReader(f)}

    ids = [str(i) for i in oof["ids"]]
    y, pred, fold = oof["y"], oof["oof"], oof["fold"]
    labelled = ~np.isnan(y)
    resid = pred[labelled] - y[labelled]
    abs_err = np.abs(resid)

    parcels = {}
    for i, pid in enumerate(ids):
        row = split[pid]
        if labelled[i]:
            parcels[pid] = {"set": "train", "observed": round(float(y[i]), 4), "predicted": round(float(pred[i]), 4), "fold": int(fold[i])}
        else:
            parcels[pid] = {"set": "predict", "observed": None, "predicted": round(unknown[pid], 4), "fold": None}
        parcels[pid]["areaHa"] = float(row["AREA_HA"])
    assert sum(p["set"] == "train" for p in parcels.values()) == 138
    assert sum(p["set"] == "predict" for p in parcels.values()) == 59

    # Empirical (split-conformal style) half-widths from the 138 out-of-fold errors.
    quantiles = {str(q): round(float(np.quantile(abs_err, q)), 4) for q in (0.5, 0.8, 0.9)}
    within = {str(t): round(float(np.mean(abs_err <= t)), 4) for t in (0.1, 0.25, 0.5, 0.75, 1.0)}
    hist_edges = np.arange(-2.0, 2.01, 0.25)
    hist, _ = np.histogram(np.clip(resid, -1.999, 1.999), bins=hist_edges)

    out = {
        "model": {
            "name": "Ensamble de atención MMST-ViT + Daily DeepCropNet",
            "procedure": metrics["procedure"],
            "blend": "90 % atención archivada · 10 % refinamiento municipal",
            "evaluation": "Validación cruzada de 5 particiones sobre las 138 parcelas con rendimiento (28/28/28/27/27); cada parcela se evalúa una vez, sin ponderar por superficie.",
            "window": "Ventana de modelado abril–octubre (31 semanas); AlphaEarth de años previos y 46 meses de clima histórico.",
            "cutoff": "31 de octubre del ciclo",
            "target": "RENDIMIENTO_T_HA: grano cosechado pesado en báscula, sin ajuste por humedad, impurezas o mermas.",
            "area": "AREA_HA: superficie del polígono georreferenciado.",
        },
        "metrics": {k: round(float(metrics[k]), 4) for k in ("rmse_t_ha", "mae_t_ha", "r2", "bias_t_ha")} | {"n": int(metrics["n"])},
        "reference": {k: round(float(metrics["reference_aspiring_sota"][k]), 4) for k in ("rmse_t_ha", "mae_t_ha", "r2")},
        "folds": [{k: (round(v, 4) if isinstance(v, float) else v) for k, v in f.items() if k in ("fold", "n", "rmse_t_ha", "mae_t_ha", "r2", "bias_t_ha")} for f in metrics["folds"]],
        "absErrorQuantiles": quantiles,
        "shareWithin": within,
        "residualHistogram": {"edges": [round(float(e), 2) for e in hist_edges], "counts": [int(c) for c in hist]},
        "observedRange": [round(float(np.min(y[labelled])), 2), round(float(np.max(y[labelled])), 2)],
        "observedMean": round(float(np.mean(y[labelled])), 4),
        "parcels": parcels,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
    print(f"wrote {OUT.relative_to(ROOT)}: MAE {out['metrics']['mae_t_ha']} RMSE {out['metrics']['rmse_t_ha']} R2 {out['metrics']['r2']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
