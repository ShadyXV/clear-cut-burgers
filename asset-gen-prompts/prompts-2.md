# Burger Ingredient Image Generation Prompts

## Purpose

These prompts generate photorealistic image versions of all 30 SVG burger ingredients used in the burger-stats app. Each prompt produces one image containing **6 ingredients arranged in a 3-column × 2-row grid** on a solid **magenta (#FF00FF)** background, which enables clean, automated asset extraction (e.g. via Python + PIL chroma-key removal) into individual transparent PNGs.

## Viewing angle & visual style

All ingredients in this app are rendered as **flat elliptical layers viewed from a slight diagonal overhead angle** (approximately 25° above horizontal, looking down). Each layer has a visible top face and a thin visible front edge showing depth/thickness. The perspective is consistent across all ingredients — like looking at a stack of burger components from a fixed camera slightly above and to the side. This flat-disc isometric style must be consistent across all 6 prompts so assets can be layered together seamlessly.

---

## Full Ingredient List (30 total)

| # | ID | Name | Category |
|---|-----|------|----------|
| 1 | brioche | Brioche Bun | Bun |
| 2 | sesame | Sesame Bun | Bun |
| 3 | paprika | Paprika Bun | Bun |
| 4 | cheeseTopped | Cheese Topped Bun | Bun |
| 5 | chiveSesame | Chive & Sesame Bun | Bun |
| 6 | beefPatty | 100% Beef Patty | Protein |
| 7 | grilledChicken | Grilled Chicken | Protein |
| 8 | crispyChicken | Crispy Chicken | Protein |
| 9 | blackBeanPatty | Black Bean Patty | Protein |
| 10 | chickpeaPatty | Chickpea Patty | Protein |
| 11 | mushroomPatty | Mushroom Patty | Protein |
| 12 | cheddar | Cheddar | Cheese |
| 13 | emmental | Emmental | Cheese |
| 14 | mozzarella | Mozzarella | Cheese |
| 15 | pepperCheese | Pepper Cheese | Cheese |
| 16 | cashewCheese | Cashew Cheese | Cheese |
| 17 | veganSmoked | Vegan Smoked | Cheese |
| 18 | tomato | Tomato | Topping |
| 19 | redOnion | Red Onion | Topping |
| 20 | whiteOnion | White Onion | Topping |
| 21 | friedOnion | Fried Onions | Topping |
| 22 | pickles | Pickles | Topping |
| 23 | bacon | Bacon | Topping |
| 24 | pineapple | Pineapple | Topping |
| 25 | guacamole | Guacamole | Topping |
| 26 | jalapeno | Jalapeños | Topping |
| 27 | peppers | Sweet Peppers | Topping |
| 28 | sauceMayo | Pepper Mayo | Sauce |
| 29 | sauceHabanero | Habanero | Sauce |
| 30 | saucePiri | Piri-Piri | Sauce |

---

## Extraction notes

- Background: solid pure magenta `#FF00FF` (RGB 255, 0, 255) — no food ingredient contains this color
- Grid: 3 columns × 2 rows, each cell equal size, with 20px white separator lines between cells
- Each ingredient is horizontally centered and vertically centered within its cell, occupying roughly 70% of the cell area
- A white sans-serif label (16pt) appears at the bottom center of each cell showing the ingredient name
- Suggested output resolution: **3000 × 2000 px** (each cell ~980 × 960 px)
- To extract PNGs: crop each cell, then replace `#FF00FF` pixels with transparency

---

## Prompt 1 — Buns & Beef Patty

**Ingredients covered:** Brioche Bun, Sesame Bun, Paprika Bun, Cheese Topped Bun, Chive & Sesame Bun, 100% Beef Patty

---

Create a photorealistic food product image at 3000×2000 pixels. The entire image background is solid pure magenta (#FF00FF). The image contains a 3-column by 2-row grid of 6 burger ingredients, separated by 20-pixel white divider lines. Each ingredient is centered in its cell and rendered in a consistent isometric perspective: viewed from approximately 25 degrees above horizontal, slightly from the front-left, so that both the top face and a thin front edge are visible — like a flat oval disc of food photographed from a slightly elevated angle.

Each bun is rendered as the TOP HALF of a burger bun only (the dome-shaped top half, no bottom). The beef patty is a single flat round patty.

**Cell 1 (top-left) — Brioche Bun Top:**
A glossy, golden-yellow brioche bun top, perfectly round dome shape, smooth shiny surface with a deep golden-brown glaze. Rich egg-washed finish, soft and pillowy. Slight sheen catching studio light. Viewed from the isometric angle showing the rounded top surface and a thin bottom edge.

**Cell 2 (top-center) — Sesame Bun Top:**
A classic sesame seed burger bun top, medium golden-brown color, matte surface densely covered with white sesame seeds scattered across the dome. Soft, lightly toasted appearance. Isometric angle showing the seeded top and thin bottom rim.

**Cell 3 (top-right) — Paprika Bun Top:**
A burger bun top dusted with paprika, pale wheat-colored dough with visible reddish-orange paprika powder coating the surface. Slightly rustic, artisan bakery feel, matte finish. Isometric angle showing the paprika-dusted dome and thin bottom edge.

**Cell 4 (bottom-left) — Cheese Topped Bun Top:**
A burger bun top with a layer of melted orange cheddar cheese baked onto the surface. Golden-brown bun base under a thin, slightly bubbly, caramelized cheese crust on top. The cheese drapes slightly over the edges of the dome. Isometric angle showing the cheese-covered top and thin bottom edge.

**Cell 5 (bottom-center) — Chive & Sesame Bun Top:**
A burger bun top flecked with visible green chive pieces mixed into the dough and topped with sesame seeds. Light golden bun color with green herb specks throughout the surface, sesame seeds dotting the top. Artisan bakery style. Isometric angle showing herb-specked dome and thin bottom edge.

**Cell 6 (bottom-right) — 100% Beef Patty:**
A single cooked beef burger patty, round and flat, charred dark brown exterior with grill marks across the top face. Rich, dark mahogany-brown color with slightly irregular edges and a charred, slightly crispy surface texture. Thin side edge visible showing the cooked meat interior. Isometric angle, patty occupies full cell width.

Each cell has a white label at the bottom center reading the ingredient name in clean 16pt sans-serif black text on a white pill background. No other elements outside the grid. Entire background is #FF00FF magenta.

---

## Prompt 2 — Proteins & Cheddar

**Ingredients covered:** Grilled Chicken, Crispy Chicken, Black Bean Patty, Chickpea Patty, Mushroom Patty, Cheddar

---

Create a photorealistic food product image at 3000×2000 pixels. The entire image background is solid pure magenta (#FF00FF). The image contains a 3-column by 2-row grid of 6 burger ingredients, separated by 20-pixel white divider lines. Each ingredient is centered in its cell using a consistent isometric perspective: viewed from approximately 25 degrees above horizontal, front-left vantage point, so both the top face and a thin front edge are visible — like a flat oval disc of food photographed from a slightly elevated angle. All patties and the cheese slice are rendered as flat, wide, elliptical layers in this perspective.

**Cell 1 (top-left) — Grilled Chicken:**
A grilled chicken breast patty, flattened to burger-patty shape. Golden-amber surface with visible dark brown grill marks running diagonally across the top face. Moist-looking, tender texture, warm orange-brown color. Thin side edge visible. Isometric angle.

**Cell 2 (top-center) — Crispy Chicken:**
A crispy fried chicken burger patty, flat and round. Deep golden-orange breaded exterior with a visibly crunchy, irregular bumpy texture from the batter coating. The surface has a fried, crackled appearance with darker brown spots where the breading crisped up. Thin side edge shows the fried crust. Isometric angle.

**Cell 3 (top-right) — Black Bean Patty:**
A black bean veggie burger patty, flat and round. Very dark brown to near-black surface with visible whole black beans pressed into the surface, giving it a slightly rough, studded texture. Matte, earthy appearance with subtle dark bean shapes embedded throughout. Thin side edge visible. Isometric angle.

**Cell 4 (bottom-left) — Chickpea Patty:**
A chickpea veggie burger patty, flat and round. Warm tan-to-golden-brown surface with a slightly grainy, textured appearance from ground chickpeas. Faint herb flecks (parsley, cumin) visible on the surface. Matte finish, wholesome earthy look. Thin side edge visible. Isometric angle.

**Cell 5 (bottom-center) — Mushroom Patty:**
A mushroom burger patty, flat and round. Deep earthy brown surface with visible mushroom fiber texture and small herb flecks. The surface has a slightly moist, dense appearance with the natural grain of compressed mushrooms. Dark, umami-rich coloring with slightly irregular edges. Thin side edge visible. Isometric angle.

**Cell 6 (bottom-right) — Cheddar:**
A single slice of cheddar cheese, flat and slightly wider than it is tall, viewed in the isometric perspective. Vivid orange-yellow color, smooth surface with a slight waxy sheen. The thin slice has very slight droop/melt at the corners suggesting it has been warmed. Clean, simple, bright cheddar orange. Thin side edge visible showing the slice thickness.

Each cell has a white label at the bottom center reading the ingredient name in clean 16pt sans-serif black text on a white pill background. No other elements outside the grid. Entire background is #FF00FF magenta.

---

## Prompt 3 — Cheeses & Tomato

**Ingredients covered:** Emmental, Mozzarella, Pepper Cheese, Cashew Cheese, Vegan Smoked, Tomato

---

Create a photorealistic food product image at 3000×2000 pixels. The entire image background is solid pure magenta (#FF00FF). The image contains a 3-column by 2-row grid of 6 burger ingredients, separated by 20-pixel white divider lines. Each ingredient is centered in its cell using a consistent isometric perspective: viewed from approximately 25 degrees above horizontal, front-left vantage, so both the top face and a thin front edge are visible — a flat oval disc photographed from a slightly elevated angle. All cheese slices are rendered as thin flat layers; the tomato is a single flat round cross-section slice.

**Cell 1 (top-left) — Emmental:**
A single thin slice of emmental cheese, round cut to burger-patty shape. Pale yellow color with a smooth, slightly shiny surface. Several characteristic round holes (eyes) are visible on the top face of the slice — the hallmark of emmental. Slight waxy texture. Thin side edge showing the pale yellow interior. Isometric angle.

**Cell 2 (top-center) — Mozzarella:**
A single thin round slice of fresh mozzarella cheese. Pure white to very pale ivory color, smooth and slightly moist-looking surface with a soft, elastic appearance. Slightly glossy from moisture. Thin side edge shows the white, stretchy-looking interior. Isometric angle.

**Cell 3 (top-right) — Pepper Cheese:**
A single thin round slice of pepper cheese (pepperjack style). Pale cream/off-white color with visible flecks and small pieces of crushed black pepper and red pepper bits scattered throughout the surface. Slightly speckled appearance. Thin side edge visible. Isometric angle.

**Cell 4 (bottom-left) — Cashew Cheese:**
A single thin round slice of cashew-based vegan cheese. Pale cream to very light tan color, smooth and slightly matte surface. More uniform in color than dairy cheese, with a clean, minimal appearance. Slightly denser-looking texture than traditional cheese. Thin side edge visible. Isometric angle.

**Cell 5 (bottom-center) — Vegan Smoked:**
A single thin round slice of vegan smoked cheese. Slightly darker cream to pale tan color with a subtle smoky tint. The surface has faint smoky coloration, slightly more amber than plain vegan cheese, suggesting a smoked rind or smoked flavor infusion. Clean matte surface. Thin side edge visible. Isometric angle.

**Cell 6 (bottom-right) — Tomato:**
A single fresh tomato cross-section slice, round and flat, approximately 6mm thick. Bright red flesh with visible pale yellow-white seed compartments arranged radially around the center. The seeds and gel are glossy and moist. Thin reddish skin visible around the edge. The top face shows the full cross-section pattern. Thin side edge reveals the slice thickness. Isometric angle matching all other cells.

Each cell has a white label at the bottom center reading the ingredient name in clean 16pt sans-serif black text on a white pill background. No other elements outside the grid. Entire background is #FF00FF magenta.

---

## Prompt 4 — Toppings Set 1

**Ingredients covered:** Red Onion, White Onion, Fried Onions, Pickles, Bacon, Pineapple

---

Create a photorealistic food product image at 3000×2000 pixels. The entire image background is solid pure magenta (#FF00FF). The image contains a 3-column by 2-row grid of 6 burger ingredients, separated by 20-pixel white divider lines. Each ingredient is centered in its cell using a consistent isometric perspective: viewed from approximately 25 degrees above horizontal, front-left vantage point, so both the top face and a thin front edge are visible. All toppings are rendered as flat, oval layers in this perspective — as they would appear when layered inside a burger.

**Cell 1 (top-left) — Red Onion:**
A flat, single-layer arrangement of thinly sliced red onion rings, arranged in a round patty-shaped cluster to fit the burger layer shape. The rings are translucent purple-red with visible ring lines. Slightly glistening, raw and crisp-looking. The overall shape is an oval flat disc of loosely overlapping red onion slices. Thin side edge visible. Isometric angle.

**Cell 2 (top-center) — White Onion:**
A flat, single-layer arrangement of thinly sliced white onion rings, arranged in a round patty-shaped cluster. The rings are translucent white to pale cream with visible ring lines. Slightly glistening, raw and crisp. The shape is an oval flat disc of overlapping white onion slices. Thin side edge visible. Isometric angle.

**Cell 3 (top-right) — Fried Onions:**
A flat, generously piled layer of crispy fried onion strings/straws, arranged loosely in a round patty-shaped mound. Golden-brown to amber color, visibly crunchy and irregular in shape. Thin, lacy, crispy texture with slight grease sheen. The pile is relatively low-profile. Isometric angle showing the golden fried top face and thin side edge.

**Cell 4 (bottom-left) — Pickles:**
A flat, single-layer arrangement of round dill pickle slices, arranged to cover a burger-patty-shaped area. The slices are bright green with darker green skin edge and pale interior flesh showing visible seed cavities. Slightly glistening from brine. Overlapping slightly to form a cohesive round layer. Thin side edge visible. Isometric angle.

**Cell 5 (bottom-center) — Bacon:**
A flat layer of cooked bacon strips arranged to form a round burger-layer shape — two or three strips criss-crossed or folded to fit the oval. Deep reddish-brown and white marbled strips, visibly crispy at the edges with slightly caramelized, shiny surface. Grill/pan-cooked look. The arrangement fills the oval layer footprint. Isometric angle showing top face and thin side edge.

**Cell 6 (bottom-right) — Pineapple:**
A single round pineapple ring, flat and burger-sized, grilled. Bright yellow-gold pineapple flesh with visible fibrous texture and slightly caramelized grill marks across the top face. The ring hole is visible in the center — a clean round hole through the yellow disc. Thin side edge showing the slice thickness. Isometric angle matching all other cells.

Each cell has a white label at the bottom center reading the ingredient name in clean 16pt sans-serif black text on a white pill background. No other elements outside the grid. Entire background is #FF00FF magenta.

---

## Prompt 5 — Toppings Set 2 & Sauces

**Ingredients covered:** Guacamole, Jalapeños, Sweet Peppers, Pepper Mayo, Habanero Sauce, Piri-Piri Sauce

---

Create a photorealistic food product image at 3000×2000 pixels. The entire image background is solid pure magenta (#FF00FF). The image contains a 3-column by 2-row grid of 6 burger ingredients, separated by 20-pixel white divider lines. Each ingredient is centered in its cell using a consistent isometric perspective: viewed from approximately 25 degrees above horizontal, front-left vantage point, so both the top face and a thin front edge are visible. Toppings are rendered as flat oval layers; sauces are rendered as a thin glossy oval puddle/smear layer as they would appear spread on the inside of a bun.

**Cell 1 (top-left) — Guacamole:**
A flat, scooped layer of guacamole spread into a round burger-patty-shaped oval mound, approximately 8mm thick. Rich, creamy avocado green color with visible texture — slightly chunky, with small darker green flecks of cilantro and tiny white onion bits visible on the surface. Matte, fresh-looking. Isometric angle showing the spread top face and thin side edge.

**Cell 2 (top-center) — Jalapeños:**
A flat, single-layer arrangement of thinly sliced jalapeño pepper rings, arranged in a round patty-shaped cluster. Bright medium green, pickled-style slices with visible pale seed cross-sections in each ring. Slightly glistening from pickling brine. The layer is an oval disc of overlapping jalapeño rings. Isometric angle showing the green top face and thin side edge.

**Cell 3 (top-right) — Sweet Peppers:**
A flat, single-layer arrangement of thinly sliced sweet bell pepper strips in mixed colors — red, yellow, and orange — arranged in a round patty-shaped oval. The strips are gently curved, glossy, and slightly softened from being lightly cooked. Vibrant mixed colors create a colorful layer. Isometric angle showing the colorful top face and thin side edge.

**Cell 4 (bottom-left) — Pepper Mayo:**
A thin, flat oval layer of pepper mayo sauce spread smoothly into a burger-bun-shaped oval smear, approximately 3mm thick. Creamy off-white to pale cream color with very fine black pepper flecks visible throughout. Smooth, glossy surface with soft edges that taper slightly at the perimeter, like sauce spread on a bun. No hard edge — organic spread shape. Isometric angle showing the glossy top face and thin side edge.

**Cell 5 (bottom-center) — Habanero Sauce:**
A thin, flat oval layer of habanero hot sauce spread smoothly in a burger-shaped oval smear, approximately 3mm thick. Deep vibrant orange-red color, translucent and glossy. Smooth surface with a slight sheen. Organic spread shape with soft edges tapering at the perimeter. A single small slice of habanero pepper visible within the sauce. Isometric angle showing the glossy top face and thin side edge.

**Cell 6 (bottom-right) — Piri-Piri Sauce:**
A thin, flat oval layer of piri-piri sauce spread smoothly in a burger-shaped oval smear, approximately 3mm thick. Bright fiery red color, slightly deeper and more opaque than habanero sauce, with tiny visible herb/spice flecks. Glossy surface. Organic spread shape with soft tapering edges. A tiny dried red chili pepper visible within or beside the sauce. Isometric angle showing the glossy top face and thin side edge.

Each cell has a white label at the bottom center reading the ingredient name in clean 16pt sans-serif black text on a white pill background. No other elements outside the grid. Entire background is #FF00FF magenta.
