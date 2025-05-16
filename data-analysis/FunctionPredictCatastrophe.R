# ───── FONCTION DE NORMALISATION ET PRÉDICTION ─────
predict_catastrophe_newline <- function(new_raw, orig_df, df_model, final_model) {
  num_cols <- c(
    "temperature", "humidite",
    "force_moyenne_du_vecteur_de_vent",
    "force_du_vecteur_de_vent_max",
    "pluie_intensite_max", "sismicite",
    "concentration_gaz", "pluie_totale"
  )
  
  if (!all(c(num_cols, "quartier") %in% names(new_raw))) {
    stop("new_raw doit contenir : ", paste(c(num_cols, "quartier"), collapse = ", "))
  }
  
  mins <- sapply(orig_df[num_cols], min, na.rm = TRUE)
  maxs <- sapply(orig_df[num_cols], max, na.rm = TRUE)
  
  new_norm <- data.frame(matrix(nrow = 1, ncol = length(num_cols)))
  names(new_norm) <- num_cols
  
  for (col in num_cols) {
    new_norm[[col]] <- (new_raw[[col]] - mins[col]) / (maxs[col] - mins[col])
  }
  
  new_norm$quartier <- factor(new_raw$quartier, levels = levels(df_model$quartier))
  if (any(is.na(new_norm$quartier))) {
    stop("Quartier non reconnu ; niveaux possibles : ",
         paste(levels(df_model$quartier), collapse = ", "))
  }
  
  proba <- predict(final_model, newdata = new_norm, type = "prob")
  return(proba)
}

# ───── CHARGEMENT DES DONNÉES ─────
orig_df     <- read.csv("~/Documents/48h/R project/AnalyseData/data/catastrophes_naturelles.csv")
load("~/Documents/48h/R project/AnalyseData/data/clean_data.RData")  # df_model, DN

# ───── EXEMPLE DE DONNÉES BRUTES ─────
new_raw <- data.frame(
  temperature                      = 15.2,
  humidite                        = 72,
  force_moyenne_du_vecteur_de_vent = 4.3,
  force_du_vecteur_de_vent_max     = 7.8,
  pluie_intensite_max              = 1.9,
  sismicite                       = 0.12,
  concentration_gaz               = 120,
  pluie_totale                    = 12.5,
  quartier                        = "Zone 2"
)

# ───── PRÉDICTION DES PROBABILITÉS ─────
proba <- predict_catastrophe_newline(
  new_raw     = new_raw,
  orig_df     = orig_df,
  df_model    = df_model,
  final_model = final_model
)

print(proba)
