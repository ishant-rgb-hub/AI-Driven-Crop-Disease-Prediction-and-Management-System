// Disease data for Member B's module.
// `name` must exactly match the label returned by the AI model (PlantVillage class names).
// Treatment/prevention info is NOT here; that belongs to Member C's models.

module.exports = [
  {
    name: "Tomato___Early_blight",
    cropName: "Tomato",
    displayName: "Early Blight",
    description:
      "A fungal disease (Alternaria solani) that affects leaves, stems and fruit, usually starting on older leaves.",
    symptoms:
      "Dark brown spots with concentric rings (target-like pattern) on lower leaves, surrounded by yellowing. Leaves may drop early.",
    isHealthy: false,
  },
  {
    name: "Tomato___Late_blight",
    cropName: "Tomato",
    displayName: "Late Blight",
    description:
      "A serious disease caused by Phytophthora infestans that spreads quickly in cool, wet weather.",
    symptoms:
      "Large, irregular water-soaked patches on leaves that turn brown, white fuzzy growth under leaves in humid conditions, and firm brown rot on fruit.",
    isHealthy: false,
  },
  {
    name: "Tomato___Leaf_Mold",
    cropName: "Tomato",
    displayName: "Leaf Mold",
    description:
      "A fungal disease (Passalora fulva) common in humid, poorly ventilated conditions such as greenhouses.",
    symptoms:
      "Pale green or yellow spots on the upper leaf surface with olive-green to brown velvety mold on the underside.",
    isHealthy: false,
  },
  {
    name: "Tomato___Septoria_leaf_spot",
    cropName: "Tomato",
    displayName: "Septoria Leaf Spot",
    description:
      "A fungal disease (Septoria lycopersici) that mainly affects leaves and spreads by water splash.",
    symptoms:
      "Many small circular spots with dark borders and light grey centers, often with tiny black dots, starting on lower leaves.",
    isHealthy: false,
  },
  {
    name: "Tomato___Bacterial_spot",
    cropName: "Tomato",
    displayName: "Bacterial Spot",
    description:
      "A bacterial disease (Xanthomonas species) favoured by warm, wet weather that affects leaves, stems and fruit.",
    symptoms:
      "Small, dark, water-soaked spots on leaves that may have yellow halos, and raised scabby spots on fruit.",
    isHealthy: false,
  },
  {
    name: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    cropName: "Tomato",
    displayName: "Yellow Leaf Curl Virus",
    description:
      "A viral disease spread by whiteflies that stunts plants and greatly reduces yield.",
    symptoms:
      "Upward curling and yellowing of leaf edges, small crumpled leaves, stunted growth and few or no fruit.",
    isHealthy: false,
  },
  {
    name: "Tomato___healthy",
    cropName: "Tomato",
    displayName: "Healthy Tomato",
    description: "No disease detected. The leaf appears healthy.",
    symptoms: "Uniform green color with no spots, curling or mold.",
    isHealthy: true,
  },
  {
    name: "Potato___Early_blight",
    cropName: "Potato",
    displayName: "Early Blight",
    description:
      "A fungal disease (Alternaria solani) that causes leaf damage and can reduce tuber yield.",
    symptoms:
      "Dark brown spots with concentric rings on older leaves, surrounded by yellow tissue.",
    isHealthy: false,
  },
  {
    name: "Potato___Late_blight",
    cropName: "Potato",
    displayName: "Late Blight",
    description:
      "A destructive disease caused by Phytophthora infestans that can destroy a crop within days in wet weather.",
    symptoms:
      "Water-soaked dark lesions on leaves and stems, white mold on the underside of leaves, and rotting tubers.",
    isHealthy: false,
  },
  {
    name: "Potato___healthy",
    cropName: "Potato",
    displayName: "Healthy Potato",
    description: "No disease detected. The leaf appears healthy.",
    symptoms: "Uniform green color with no spots or lesions.",
    isHealthy: true,
  },
];
