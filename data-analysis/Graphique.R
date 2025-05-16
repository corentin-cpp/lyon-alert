library(ggplot2)
library(vcd)

load("~/Documents/48h/R project/AnalyseData/data/clean_data.RData")
df <- DN[DN$catastrophe != "aucun", ]
# 3) Table de comptage réel
tab <- df %>%
  count(quartier, catastrophe, name = "n")

max_n <- max(tab$n, na.rm = TRUE)

# 4) Graphiques



# a) Répartition des catastrophes PAR quartier
ggplot(tab, aes(x = catastrophe, y = n, fill = catastrophe)) +
  geom_col() +
  geom_text(aes(label = n), vjust = -0.3, size = 3) +
  facet_wrap(~ quartier, drop = TRUE) +
  coord_cartesian(ylim = c(0, max_n)) +
  labs(
    title = "Catastrophes par quartier",
    x     = "Type de catastrophe",
    y     = "Nombre d’occurrences",
    fill  = "Catastrophe"
  ) +
  theme_minimal() +
  theme(
    axis.text.x     = element_text(angle = 45, hjust = 1),
    legend.position = "bottom"
  )

# b) Répartition des quartiers PAR type de catastrophe
ggplot(tab, aes(x = quartier, y = n, fill = quartier)) +
  geom_col() +
  geom_text(aes(label = n), vjust = -0.3, size = 3) +
  facet_wrap(~ catastrophe, drop = TRUE) +
  coord_cartesian(ylim = c(0, max_n)) +
  labs(
    title = "Quartiers par type de catastrophe",
    x     = "Quartier",
    y     = "Nombre d’occurrences",
    fill  = "Quartier"
  ) +
  theme_minimal() +
  theme(
    axis.text.x     = element_text(angle = 90, vjust = 0.5, hjust = 1),
    legend.position = "bottom",
    plot.margin     = margin(5, 5, 20, 5)
  )


# tab doit contenir quartier, catastrophe et n
ggplot(tab, aes(x = catastrophe, y = quartier, fill = n)) +
  geom_tile(color = "white") +
  geom_text(aes(label = n), size = 3) +
  scale_fill_viridis_c(name = "Occurences") +
  labs(
    title = "Heatmap des catastrophes par quartier",
    x     = "Type de catastrophe",
    y     = "Quartier"
  ) +
  theme_minimal() +
  theme(
    axis.text.x = element_text(angle = 45, hjust = 1),
    legend.position = "bottom"
  )

ggplot(tab, aes(x = n, y = quartier)) +
  geom_point(aes(size = n, color = catastrophe), alpha = 0.7) +
  labs(
    title = "Dot‑plot : nombre d’événements par quartier",
    x     = "Nombre d’occurrences",
    y     = "Quartier",
    color = "Catastrophe",
    size  = "Occurrences"
  ) +
  theme_minimal() +
  theme(legend.position = "bottom")

ggplot(tab, aes(x = reorder(quartier, n), y = n)) +
  geom_segment(aes(xend = quartier, yend = 0), color = "grey60") +
  geom_point(aes(color = catastrophe), size = 3) +
  facet_wrap(~ catastrophe, scales = "free_y") +
  coord_flip() +
  labs(
    title = "Lollipop : occurrences par quartier et par catastrophe",
    x     = "Quartier",
    y     = "Nombre d’occurrences",
    color = "Catastrophe"
  ) +
  theme_minimal() +
  theme(legend.position = "bottom")
# Nécessite le package vcd


# Transformer tab en table
t <- xtabs(n ~ catastrophe + quartier, data = tab)
mosaic(t, shade = TRUE, legend = TRUE,
       main = "Mosaic plot : catastrophes vs quartiers")

