library(stringr)

# ───── CHARGEMENT DES DONNÉES ─────
donneesBrute <- read.csv("data/catastrophes_naturelles.csv")

head(donneesBrute)
summary(donneesBrute)
str(donneesBrute)

DN <- donneesBrute

# ───── IDENTIFICATION DES LIGNES BUGUÉES ─────
lignes_buguees_index <- which(!grepl("[0-9]{2,}", donneesBrute[, 10]))

print("Indices des lignes non 'buguées' :")
print(lignes_buguees_index)

donneeBuguees <- donneesBrute[lignes_buguees_index, ]

# ───── CORRECTION DES LIGNES BUGUÉES ─────
for (i in lignes_buguees_index) {
  valeur <- donneesBrute[i, "X"]
  ligne <- str_split(valeur, ",(?![^\\[]*\\])", simplify = TRUE)
  DN[i, ] <- ligne[1:12]
}

# ───── CONVERSION EN NUMÉRIQUE ─────
cols_to_convert <- setdiff(names(DN), c("date", "quartier","catastrophe"))
DN[cols_to_convert] <- lapply(DN[cols_to_convert], function(x) {
  if (is.factor(x) || is.character(x)) {
    as.numeric(as.character(x))
  } else {
    x
  }
})

# ───── NORMALISATION ─────
DN[cols_to_convert] <- lapply(DN[cols_to_convert], function(x) {
  if (is.numeric(x)) {
    (x - min(x, na.rm = TRUE)) / (max(x, na.rm = TRUE) - min(x, na.rm = TRUE))
  } else {
    x
  }
})

DN$catastrophe <- gsub('^"|"$', '', DN$catastrophe)

# ───── CRÉATION D’UNE VARIABLE SIMPLIFIÉE ─────
DN$catastrophe_simple <- factor(
  ifelse(DN$catastrophe == "['innondation']", "innondation",
         ifelse(DN$catastrophe == "['innondation', 'seisme']", "innondation_seisme",
                ifelse(DN$catastrophe == "['seisme']", "seisme", "aucun")))
)

head(DN)

write.csv(DN,file='data/clean_data.csv', row.names=TRUE)
save(DN, file = "data/clean_data.RData")

