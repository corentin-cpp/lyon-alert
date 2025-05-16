# ───── LIBRAIRIES ─────
library(rpart)
library(caret)
library(rpart.plot)
library(ggplot2)

# ───── CHARGEMENT DES DONNÉES ─────
load("~/Documents/48h/R project/AnalyseData/data/clean_data.RData")
df <- DN

#───── PRÉPARATION DES DONNÉES ─────
df$catastrophe_simple <- factor(
  ifelse(df$catastrophe == "['innondation']", "innondation",
         ifelse(df$catastrophe == "['innondation', 'seisme']", "innondation_seisme",
                ifelse(df$catastrophe == "['seisme']", "seisme", "aucun")))
)
df$quartier <- as.factor(df$quartier)
# ───── PRÉPARATION DES DONNÉES ─────
# On conserve seulement date et quartier (zone)
df_model <- subset(df, select = c(date, quartier, catastrophe_simple))

# Convertir date en format numérique ou factor (selon la granularité souhaitée)
# Exemple : extraction de l'année depuis la date si format Date
df_model$date <- as.Date(df_model$date)
df_model$annee <- as.factor(format(df_model$date, "%Y"))  # ou numeric : as.numeric(format(df_model$date, "%Y"))

# Garder seulement annee et quartier
df_model <- subset(df_model, select = c(annee, quartier, catastrophe_simple))

# ───── RECHERCHE DE GRILLE SUR cp ─────
train_control <- trainControl(method = "cv", number = 5)
tune_grid <- expand.grid(cp = seq(0.001, 0.05, by = 0.002))

set.seed(123)
model_caret <- train(
  catastrophe_simple ~ annee + quartier,
  data      = df_model,
  method    = "rpart",
  trControl = train_control,
  tuneGrid  = tune_grid,
  metric    = "Accuracy"
)

print(model_caret)
plot(model_caret)

best_cp   <- model_caret$bestTune$cp
arbre_opt <- prune(model_caret$finalModel, cp = best_cp)

rpart.plot(arbre_opt, type = 2, extra = 104, fallen.leaves = TRUE)

# ───── SÉPARATION TRAIN / TEST ─────
set.seed(123)
index <- createDataPartition(df_model$catastrophe_simple, p = 0.8, list = FALSE)
train_data <- df_model[index, ]
test_data  <- df_model[-index, ]

# ───── MODÈLE FINAL SUR ENTRAÎNEMENT ─────
final_model <- rpart(
  catastrophe_simple ~ annee + quartier, 
  data = train_data, 
  method = "class", 
  control = rpart.control(cp = best_cp)
)

# ───── PRÉDICTION ET ÉVALUATION ─────
pred_test <- predict(final_model, newdata = test_data, type = "class")
confusionMatrix(pred_test, test_data$catastrophe_simple)

