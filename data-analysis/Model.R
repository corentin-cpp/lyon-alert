# ───── LIBRAIRIES ─────
library(rpart)
library(caret)
library(rpart.plot)
library(ggplot2)

# ───── CHARGEMENT DES DONNÉES ─────
load("~/Documents/48h/R project/AnalyseData/data/clean_data.RData")
df <- DN

# ───── PRÉPARATION DES DONNÉES ─────
df$quartier <- as.factor(df$quartier)
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

best_cp   <- model_caret$bestTune$cp
arbre_opt <- prune(model_caret$finalModel, cp = best_cp)

# Visualisation de l’arbre optimisé (statique)
rpart.plot(arbre_opt, type = 2, extra = 104, fallen.leaves = TRUE, main = "Arbre de décision")


# ───── SÉPARATION TRAIN / TEST ─────
set.seed(123)
index <- createDataPartition(df_model$catastrophe_simple, p = 0.8, list = FALSE)
train_data <- df_model[index, ]
test_data  <- df_model[-index, ]

# ───── MODÈLE FINAL SUR ENTRAÎNEMENT ─────
final_model <- rpart(
  catastrophe_simple ~ ., 
  data = train_data, 
  method = "class", 
  control = rpart.control(cp = best_cp)
)

# ───── PRÉDICTION ET ÉVALUATION ─────
pred_test <- predict(final_model, newdata = test_data, type = "class")
confusionMatrix(pred_test, test_data$catastrophe_simple)

# ───── MOYENNE DES ACCURACY ─────
mean_accuracy <- mean(model_caret$results$Accuracy)
print(mean_accuracy)
