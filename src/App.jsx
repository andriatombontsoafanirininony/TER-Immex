import { useState } from "react";
import "./App.css";
import ModelViewer from "./components/ModelViewer";

function App() {
  const [prompt, setPrompt] = useState("");
  const [meshUrl, setMeshUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null); // le bouton de téléchargement
  const [loading, setLoading] = useState(false);

  // URL Cloudflare 
  const API_URL = "https://gmt-equilibrium-generous-friendship.trycloudflare.com";

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Écris un prompt avant de générer !");
      return;
    }

    setLoading(true);
    setMeshUrl(null);
    setDownloadUrl(null);

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log("Réponse backend:", data);

      if (data.status === "success" && data.file) {
        const fileUrl = `${API_URL}/${data.file}`;
        setMeshUrl(fileUrl);
        setDownloadUrl(fileUrl); // on stocke le lien pour le bouton
      } else {
        alert("Erreur: " + (data.error || "génération échouée"));
      }
    } catch (err) {
      console.error("Erreur connexion API:", err);
      alert("Erreur de connexion au serveur Flask");
    } finally {
      setLoading(false);
    }
  };

  const handleImportLocal = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setMeshUrl(blobUrl);
    setDownloadUrl(blobUrl); // permet de télécharger un modèle local aussi
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">Shap-E Generator</h2>

        <div className="input-group">
          <label htmlFor="prompt">Écris ton prompt :</label>
          <textarea
            id="prompt"
            rows="3"
            placeholder='ex: "a crystal shark in space"'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <button
          className={`generate-btn ${loading ? "loading" : ""}`}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "⏳ Génération..." : "Générer"}
        </button>

        <hr style={{ borderColor: "rgba(148,163,184,0.1)", margin: "1em 0" }} />

        <div className="input-group">
          <label htmlFor="import">
            Importer un modèle local (.glb / .ply / .obj):
          </label>
          <input
            type="file"
            id="import"
            accept=".glb,.gltf,.ply,.obj"
            onChange={handleImportLocal}
          />
        </div>
      </aside>

      <main className="viewer-container">
        {meshUrl ? (
          <div style={{ textAlign: "center" }}>
            {/* BOUTON DE TÉLÉCHARGEMENT */}
            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="download-btn"
              >
                 Télécharger le modèle
              </a>
            )}

            {/* VIEWER 3D */}
            <ModelViewer modelUrl={meshUrl} />
          </div>
        ) : (
          <p>
             Entre un prompt ou importe un modèle local pour afficher le rendu
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
