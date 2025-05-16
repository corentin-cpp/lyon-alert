# ───── LIBRAIRIES ─────
library(rpart)
library(caret)
library(rpart.plot)
library(ggplot2)

# ───── CHARGEMENT DES DONNÉES ─────
load("~/Documents/48h/R project/AnalyseData/data/clean_data.RData")
df <- DN

# ───── NETTOYAGE DES FACTEURS ─────
# Remplacer les espaces par des underscores dans les niveaux de quartier
df$quartier <- factor(gsub(" ", "_", df$quartier))

# ───── PRÉPARATION DES DONNÉES ─────
df_model <- subset(df, select = -c(X, date, catastrophe))

# ───── SÉPARATION TRAIN / TEST ─────
set.seed(123)
index <- createDataPartition(df_model$catastrophe_simple, p = 0.8, list = FALSE)
train_data <- df_model[index, ]
test_data  <- df_model[-index, ]

# ───── RECHERCHE DE GRILLE SUR cp AVEC CARET ─────
train_control <- trainControl(
  method = "cv",
  number = 5
)

tune_grid <- expand.grid(cp = seq(0.001, 0.05, by = 0.002))

set.seed(123)
model_caret <- train(
  catastrophe_simple ~ .,       # formule
  data      = train_data,      # données originales (sans normalisation)
  method    = "rpart",
  trControl = train_control,
  tuneGrid  = tune_grid,
  metric    = "Accuracy"
)

print(model_caret)
plot(model_caret)

best_cp   <- model_caret$bestTune$cp

# Modèle optimisé et pruned
final_model <- rpart(
  catastrophe_simple ~ ., 
  data    = train_data,
  method  = "class",
  control = rpart.control(cp = best_cp)
)
arbre_opt <- prune(final_model, cp = best_cp)

# ───── VISUALISATION DE L’ARBRE ─────
rpart.plot(arbre_opt, type = 2, extra = 104, fallen.leaves = TRUE)

# ───── ÉVALUATION SUR LE TEST ─────
pred_test <- predict(arbre_opt, newdata = test_data, type = "class")
confusionMatrix(pred_test, test_data$catastrophe_simple)

# Moyenne des accuracies cross-validées
mean_accuracy <- mean(model_caret$results$Accuracy)
print(mean_accuracy)

# ______________ UNE LIGNE TEST ______________
# Créer la nouvelle ligne
nouvelle_ligne <- data.frame(
  quartier = "Zone 2",
  surface = 85,
  temperature = 13,
  nb_pieces = 3,
  humidite = 40,
  annee_construction = 1995,
  valeur_fonciere = 250000,
  risque_inondation = 0.3,
  risque_seisme = 0.1,
  force_moyenne_du_vecteur_de_vent = 6,
  force_du_vecteur_de_vent_max = 8,
  pluie_intensite_max = 0,
  sismicite = 0.5,
  concentration_gaz = 0.2,
  pluie_totale = 0.1
)

# Nettoyage du facteur quartier (underscore)
nouvelle_ligne$quartier <- factor(
  gsub(" ", "_", nouvelle_ligne$quartier),
  levels = levels(df_model$quartier)
)

# Prédiction
prediction <- predict(arbre_opt, newdata = nouvelle_ligne, type = "class")
print(prediction)

