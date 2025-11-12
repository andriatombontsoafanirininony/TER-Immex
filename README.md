# 🧊 Shap-E 3D Viewer  
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/andriatombontsoafanirininony/TER-Immex/blob/main/API-ShapE.ipynb)

> Génération et visualisation d’objets 3D à partir d’un **prompt texte**, grâce au modèle **Shap-E d’OpenAI**.  
> Projet développé dans le cadre du **TER (Travaux d’Étude et de Recherche)** – Université de La Réunion 🏝️

---

##  Aperçu du projet

L’application est composée de deux parties :
1. **Frontend React + Three.js** :  
   Interface web interactive permettant de saisir un *prompt texte*, de visualiser et télécharger le modèle 3D généré.
2. **Backend Flask (hébergé sur Google Colab)** :  
   Exécute le modèle Shap-E et retourne le fichier `.glb` ou `.ply`.

🦈 Exemple de prompt :  
> `"a crystal shark"`

Résultat : un requin 3D généré par IA, affiché et animé directement dans le navigateur.

---

## 🚀 Démarrage rapide

###  1. Lancer l’API sur Google Colab

Clique sur le bouton ci-dessous pour ouvrir le notebook :  
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/andriatombontsoafanirininony/TER-Immex/blob/main/API-ShapE.ipynb)

Ensuite :
1. Exécute les cellules une par une.
2. Copie l’URL publique affichée par **Cloudflared** (ex : `https://xxxx.trycloudflare.com`).
3. Change le lien **API_URL** dans App.jsx sur notre frontend fait avec React.

---

###  2. Lancer le front React

```bash
# Installation des dépendances
npm install

# Lancement du serveur local
npm run dev
