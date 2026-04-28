const RAW_INGREDIENTS = [

  // Fruits
  "apple", "apricot", "avocado", "banana", "blackberry", "blueberry", "boysenberry",
  "cantaloupe", "cherry", "cranberry", "currant", "coconut", "date", "dragon fruit",
  "durian", "elderberry", "fig", "gooseberry", "grapefruit", "grapes", "guava",
  "honeydew", "jackfruit", "kiwi", "kumquat", "lemon", "lime", "lychee", "mango",
  "melon", "nectarine", "orange", "papaya", "passion fruit", "peach", "pear",
  "persimmon", "pineapple", "plum", "pomegranate", "pomelo", "raspberry",
  "star fruit", "strawberry", "tangerine", "watermelon", "yuzu", "ugli fruit",
  "quince", "rhubarb", "mulberry",

  // Vegetables
  "artichoke", "arugula", "asparagus", "beet", "beet greens", "broccoli", "broccolini",
  "brussels sprouts", "bok choy", "butternut squash", "cabbage", "carrot",
  "cauliflower", "celeriac", "celery", "chard", "chayote", "collard greens",
  "corn", "cucumber", "daikon", "edamame", "eggplant", "endive", "fennel",
  "garlic", "green beans", "jalapeno", "jicama", "kale", "kohlrabi", "leek",
  "lettuce", "mushroom", "mustard greens", "okra", "onion", "parsnip", "peas",
  "bell pepper", "poblano", "radish", "red cabbage", "rocket", "rutabaga",
  "shallot", "spinach", "spring onion", "squash", "sweet potato", "swiss chard",
  "tomatillo", "tomato", "turnip", "watercress", "yam", "zucchini", "cherry tomato",
  "pumpkin", "snow peas", "snap peas", "radicchio", "water spinach", "salsify",
  "jerusalem artichoke", "cress", "celery root", "baby corn",

  // Herbs and Spices
  "allspice", "anise", "annatto", "asafoetida", "basil", "bay leaf", "black pepper",
  "caraway", "cardamom", "cayenne pepper", "chervil", "chili powder", "cinnamon",
  "clove", "coriander seed", "coriander leaf", "cumin", "curry powder", "dill",
  "fennel seed", "fenugreek", "galangal", "garam masala", "garlic powder", "ginger",
  "herbes de provence", "juniper berry", "lavender", "lemon balm", "lemongrass",
  "marjoram", "mint", "mace", "mustard seed", "nutmeg", "oregano", "paprika",
  "parsley", "poppy seed", "rosemary", "saffron", "sage", "salt", "savory",
  "sesame seed", "star anise", "sumac", "tarragon", "thyme", "turmeric",
  "vanilla bean", "wasabi", "white pepper", "za'atar", "Chinese five spice",
  "bouquet garni", "sichuan pepper", "dried chiles", "smoked paprika",

  // Legumes and Beans
  "adzuki beans", "black beans", "black-eyed peas", "borlotti beans", "broad beans",
  "butter beans", "cannellini beans", "chickpeas", "fava beans", "kidney beans",
  "lima beans", "lentils", "green lentils", "red lentils", "mung beans",
  "navy beans", "pinto beans", "soybeans", "yellow split peas", "peanuts",
  "white beans", "chana dal", "toor dal", "urad dal", "split chickpeas", "black gram",

  // Grains and Cereals
  "amaranth", "barley", "basmati rice", "black rice", "brown rice", "buckwheat",
  "bulgur", "couscous", "cornmeal", "farro", "freekeh", "kamut", "millet", "oats",
  "quinoa", "red rice", "risotto rice", "rye", "sorghum", "spelt", "teff", "wheat",
  "white rice", "wild rice", "semolina", "triticale", "vermicelli", "polenta",
  "sticky rice", "arborio rice", "orzo", "barley flakes", "steel-cut oats", "rolled oats",
  "graham flour", "self-rising flour", "corn grits",

  // Pasta and Noodles
  "angel hair", "macaroni", "lasagna", "linguine", "fettuccine", "spaghetti",
  "penne", "rigatoni", "fusilli", "farfalle", "rotini", "ravioli", "tortellini",
  "tagliatelle", "gnocchi", "udon", "soba", "ramen", "rice noodles", "glass noodles",
  "egg noodles", "cappellini", "vermicelli noodles", "rice vermicelli",

  // Nuts and Seeds
  "acorn", "almond", "brazil nut", "cashew", "chestnut", "hazelnut",
  "macadamia", "peanut", "pecan", "pine nut", "pistachio", "walnut",
  "sunflower seeds", "pumpkin seeds", "chia seeds", "flax seeds", "sesame seeds",
  "poppy seeds", "hemp seeds", "watermelon seeds", "lotus seeds", "safflower seeds",
  "sacha inchi", "tiger nuts", "soy nuts", "quinoa seeds", "melon seeds",

  // Dairy and Eggs
  "milk", "whole milk", "skim milk", "buttermilk", "cream", "heavy cream", "half-and-half",
  "evaporated milk", "condensed milk", "yogurt", "greek yogurt", "butter", "ghee",
  "clarified butter", "cream cheese", "cottage cheese", "ricotta", "cheddar cheese",
  "mozzarella", "parmesan", "feta", "goat cheese", "blue cheese", "monterey jack",
  "provolone", "swiss cheese", "paneer", "queso fresco", "sour cream", "ice cream",
  "whipped cream", "egg", "egg whites", "egg yolk", "powdered milk", "almond milk",
  "soy milk", "oat milk", "rice milk", "coconut milk", "cashew milk", "cream fraiche",
  "kefir", "clotted cream", "yolk powder",

  // Oils and Fats
  "olive oil", "extra virgin olive oil", "vegetable oil", "canola oil", "sunflower oil",
  "peanut oil", "sesame oil", "corn oil", "coconut oil", "avocado oil", "grapeseed oil",
  "safflower oil", "palm oil", "walnut oil", "flaxseed oil", "lard", "margarine",
  "shortening", "duck fat", "tallow", "schmaltz",
  "vegetable shortening", "beef drippings",

  // Meat and Poultry
  "bacon", "beef", "steak", "ground beef", "beef brisket", "veal", "pork",
  "pork loin", "pork chops", "ham", "sausage", "chorizo", "prosciutto", "salami",
  "pancetta", "lamb", "lamb chops", "mutton", "goat meat", "venison", "bison",
  "elk", "rabbit", "guinea fowl", "chicken", "chicken breast", "chicken thighs",
  "chicken wings", "turkey", "duck", "goose", "pheasant", "quail", "emu",
  "ostrich", "corned beef", "pastrami", "hot dog", "turkey breast", "turkey legs",
  "smoked turkey", "roast beef", "chicken liver", "bone marrow",

  // Seafood and Fish
  "anchovy", "barramundi", "bass", "bluefish", "catfish", "clams", "cod", "crab",
  "crawfish", "eel", "flounder", "grouper", "haddock", "halibut", "herring",
  "lobster", "mackerel", "mahi mahi", "mussels", "octopus", "oysters", "perch",
  "prawns", "sardines", "salmon", "scallops", "shrimp", "snapper", "sole",
  "squid", "tilapia", "trout", "tuna", "walleye", "king crab", "scampi",
  "monkfish", "swordfish",

  // Condiments, Sauces and Sweeteners
  "agave nectar", "aioli", "apple cider vinegar", "balsamic vinegar",
  "barbecue sauce", "black bean sauce", "brown sugar", "buffalo sauce",
  "caramel sauce", "catsup", "ketchup", "chili sauce", "chutney", "cocktail sauce",
  "coconut sugar", "coleslaw dressing", "cranberry sauce", "cream sauce",
  "dijon mustard", "fish sauce", "garlic sauce", "gravy", "guacamole", "harissa",
  "honey", "horseradish", "hot sauce", "hoisin sauce", "hummus", "jam", "jelly",
  "kimchi", "lemon juice", "lime juice", "maple syrup", "mayonnaise", "mirin",
  "miso paste", "molasses", "mustard", "nutella", "oyster sauce", "peanut butter",
  "pesto", "pickles", "pickle relish", "pico de gallo", "ranch dressing", "relish",
  "rice vinegar", "salsa", "soy sauce", "sriracha", "stevia",
  "sweet chili sauce", "tabasco", "tahini", "tartar sauce", "teriyaki sauce",
  "tomato paste", "tomato sauce", "vinegar", "white sugar", "wine vinegar",
  "worcestershire sauce", "almond butter", "vegetable broth", "apple butter",
  "blackstrap molasses", "brown butter", "butterscotch sauce", "cane syrup",
  "caramelized onions", "chocolate syrup", "chipotle sauce", "curry paste",
  "date syrup", "demerara sugar", "duck sauce", "garlic chili sauce", "ginger syrup",
  "green goddess dressing", "honey mustard", "katsu sauce", "lemon curd",
  "maggi seasoning", "marmalade", "mushroom sauce", "pancake syrup",
  "peach preserves", "pepper jelly", "pomegranate molasses", "ponzu", "raspberry jam",
  "rice syrup", "simple syrup", "soybean paste", "strawberry jam",
  "teriyaki glaze", "tomato ketchup", "vinaigrette", "yuzu juice",

  // Baking and Cooking Ingredients
  "all-purpose flour", "almond flour", "baking powder", "baking soda", "bread flour",
  "cake flour", "caster sugar", "chocolate chips", "cocoa powder",
  "cornstarch", "cream of tartar", "gelatin", "gluten", "graham crackers",
  "powdered sugar",
  "semolina flour", "sprinkles", "sugar", "vanilla extract",
  "water", "yeast", "active dry yeast", "instant yeast", "bread crumbs",
  "gelato", "espresso powder", "icing sugar", "rice flour", "tapioca flour",
  "xanthan gum", "yeast extract", "almond meal", "coconut flour",

  // Dried Fruit, Snacks and Others
  "banana chips", "biscuit", "breadcrumbs", "cashew butter", "coconut flakes",
  "cornflakes", "cranberries", "dates", "dried apricots", "dried cherries",
  "dried mango", "dried pineapple", "dried plums", "dried strawberries",
  "granola", "graham cracker crumbs", "muesli", "oatmeal", "popcorn", "prunes",
  "raisins", "rice cakes", "sultanas", "trail mix", "apple chips", "fig bars",
  "fruit leather", "jerky", "nut mix", "pretzels", "rice crackers", "sesame sticks",

  // Beverages and Miscellaneous
  "black tea", "green tea", "coffee", "espresso", "herbal tea", "chai", "matcha",
  "hot chocolate", "lemonade", "orange juice", "sparkling water",
  "tonic water", "iced tea", "cold brew coffee", "coconut water", "ginger ale",
  "kombucha",

  // Additional ingredients and misc
  "anchovy paste", "baking chocolate", "beef broth", "bouillon cubes", "broth",
  "chicken broth", "butterscotch chips",
  "capers", "canned corn", "canned beans", "coconut cream", "cream of mushroom soup",
  "egg substitute", "graham cracker crust", "herb mix",
  "marinara sauce", "nut milk", "peppercorns", "pickle juice", "roasted red peppers",
  "soy yogurt", "stock", "sun-dried tomatoes", "tempeh", "tofu", "vine leaves",
  "rice paper", "phyllo dough", "puff pastry", "sourdough starter", "tamari", "miso",
  "bouillon powder", "sherbet", "sorbet", "quark", "mascarpone", "custard",
  "pudding", "icing", "fondant", "marzipan", "nougat", "caramel", "truffle",
  "protein powder", "chia gel", "nutritional yeast", "agar agar", "psyllium husk",
  "spice blend", "herb blend", "sea salt", "pink salt", "black salt", "kosher salt",
  "rock salt", "smoked salt", "anchovies", "vegetarian bacon", "plant-based burger",
  "seitan", "hearts of palm", "artichoke hearts",
];

export const normalizeIngredientName = (ingredient: string) =>
  ingredient.trim().replace(/\s+/g, " ").toLowerCase();

const titleCaseWord = (word: string) =>
  word
    .split("-")
    .map((part) =>
      part ? part.charAt(0).toUpperCase() + part.slice(1) : part
    )
    .join("-");

export const formatIngredientName = (ingredient: string) =>
  normalizeIngredientName(ingredient)
    .split(" ")
    .map(titleCaseWord)
    .join(" ");

export const INGREDIENTS = Array.from(
  new Set(RAW_INGREDIENTS.map(normalizeIngredientName))
).sort((a, b) => a.localeCompare(b));
