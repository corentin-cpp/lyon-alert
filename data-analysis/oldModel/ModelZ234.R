# ───── LIBRAIRIES ─────
library(rpart)
library(caret)
library(rpart.plot)
library(dplyr)

# ───── CHARGEMENT DES DONNÉES ─────
load("~/Documents/48h/R project/AnalyseData/data/clean_data.RData")
df <- DN



df <- df %>%
  filter(quartier %in% c("Zone 2", "Zone 3", "Zone 4"))


# ───── PRÉPARATION DES DONNÉES ─────
# Supposons que la colonne 'catastrophe' contient des chaînes comme :
# "['innondation']", "['innondation', 'seisme']", "['seisme']", "aucun"
df$catastrophe_simple <- factor(
  ifelse(df$catastrophe == "['innondation']", "innondation",
         ifelse(df$catastrophe == "['innondation', 'seisme']", "innondation_seisme",
                ifelse(df$catastrophe == "['seisme']", "seisme", "aucun")))
)

# Convertir quartier en facteur
df$quartier <- as.factor(df$quartier)

# Supprimer colonnes inutiles (X, date, ancienne variable cible)
df_model <- subset(df, select = -c(X, date, catastrophe))

# ───── RECHERCHE DE GRILLE SUR cp ─────
train_control <- trainControl(
  method = "cv",
  number = 5
)

tune_grid <- expand.grid(cp = seq(0.001, 0.05, by = 0.002))

set.seed(123)
model_caret <- train(
  catastrophe_simple ~ .,
  data      = df_model,
  method    = "rpart",
  trControl = train_control,
  tuneGrid  = tune_grid,
  metric    = "Accuracy"
)

print(model_caret)
plot(model_caret)

# Retailler l’arbre avec le meilleur cp
best_cp   <- model_caret$bestTune$cp
arbre_opt <- prune(model_caret$finalModel, cp = best_cp)

# Visualisation de l’arbre optimisé
rpart.plot(arbre_opt, type = 2, extra = 104, fallen.leaves = TRUE)


# ───── PRÉDICTION SUR UNE NOUVELLE LIGNE ─────
# Exemple : créer une ligne avec les mêmes colonnes (sans la cible)
nouvelle_ligne <- data.frame(
  temperature                         = 22.5,
  humidite                            = 65,
  force_moyenne_du_vecteur_de_vent    = 3.2,
  force_du_vecteur_de_vent_max        = 5.8,
  pluie_intensite_max                 = 0.0,
  pluie_totale                        = 0.0,
  sismicite                           = 1,
  concentration_gaz                   = 0.03,
  quartier                            = factor("Zone 2", levels = levels(df_model$quartier))
)

# Prédiction de la classe
prediction <- predict(arbre_opt, nouvelle_ligne, type = "class")
print(prediction)

# Probabilités par classe
probas <- predict(arbre_opt, nouvelle_ligne, type = "prob")
print(probas)
