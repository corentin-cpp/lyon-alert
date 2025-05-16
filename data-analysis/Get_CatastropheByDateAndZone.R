load("~/Documents/48h/R project/AnalyseData/data/clean_data.RData")

# ───── FONCTION POUR RÉCUPÉRER LA CATASTROPHE ─────
get_catastrophe <- function(DN, zone, date) {
  subset_data <- DN[DN$quartier == zone & DN$date == date, ]
  
  if (nrow(subset_data) == 0) {
    return(NA)
  }
  
  return(subset_data$catastrophe)
}

catastrophe <- get_catastrophe(DN, "Zone 2", "2171-02-01")
print(catastrophe)
