// Hardcoded Tokyo location coordinates
export interface TokyoLocation {
  name: string
  coordinates: [number, number] // [lat, lng]
  aliases?: string[] // Alternative names that might appear in itinerary
}

export const TOKYO_LOCATIONS: Record<string, TokyoLocation> = {
  "Shinjuku Granbell Hotel": {
    name: "Shinjuku Granbell Hotel",
    coordinates: [35.6938, 139.7034],
    aliases: ["Shinjuku", "hotel", "Shinjuku Granbell"],
  },
  "Tokyo Station": {
    name: "Tokyo Station",
    coordinates: [35.6812, 139.7671],
    aliases: ["Tokyo Station", "JR Tokyo Station"],
  },
  "T's Tantan": {
    name: "T's Tantan",
    coordinates: [35.6812, 139.7671], // Tokyo Station area
    aliases: ["T's Tantan", "Tantan"],
  },
  "Tsukiji Fish Market": {
    name: "Tsukiji Fish Market",
    coordinates: [35.6654, 139.7706],
    aliases: ["Tsukiji", "Tsukiji Market", "Fish Market"],
  },
  "Edo Tokyo Museum": {
    name: "Edo Tokyo Museum",
    coordinates: [35.6961, 139.7964],
    aliases: ["Edo Tokyo Museum", "Edo Museum"],
  },
  "Gonpachi Nishiazabu": {
    name: "Gonpachi Nishiazabu",
    coordinates: [35.6586, 139.7314], // Roppongi area
    aliases: ["Gonpachi", "Gonpachi Nishiazabu"],
  },
  "Tokyo Disneyland": {
    name: "Tokyo Disneyland",
    coordinates: [35.6329, 139.8804],
    aliases: ["Disneyland", "Tokyo Disneyland", "Disney"],
  },
  "Tokyo DisneySea": {
    name: "Tokyo DisneySea",
    coordinates: [35.6274, 139.8889],
    aliases: ["DisneySea", "Tokyo DisneySea"],
  },
  "Ain Soph.Soar": {
    name: "Ain Soph.Soar",
    coordinates: [35.6329, 139.8804], // Near Disneyland
    aliases: ["Ain Soph", "Ain Soph.Soar"],
  },
  "Meiji Shrine": {
    name: "Meiji Shrine",
    coordinates: [35.6764, 139.6993],
    aliases: ["Meiji Shrine", "Meiji Jingu"],
  },
  "Yoyogi Park": {
    name: "Yoyogi Park",
    coordinates: [35.6712, 139.6969],
    aliases: ["Yoyogi Park", "Yoyogi"],
  },
  "Soranoiro NIPPON": {
    name: "Soranoiro NIPPON",
    coordinates: [35.6764, 139.6993], // Shibuya area
    aliases: ["Soranoiro", "Soranoiro NIPPON"],
  },
  "Mount Fuji": {
    name: "Mount Fuji",
    coordinates: [35.3606, 138.7274],
    aliases: ["Mount Fuji", "Mt. Fuji", "Fuji"],
  },
  "Ueno Zoo": {
    name: "Ueno Zoo",
    coordinates: [35.7132, 139.7732],
    aliases: ["Ueno Zoo", "Ueno Park", "Ueno"],
  },
  "Botanica Tokyo": {
    name: "Botanica Tokyo",
    coordinates: [35.6586, 139.7314], // Roppongi area
    aliases: ["Botanica", "Botanica Tokyo"],
  },
  "Tokyo Skytree": {
    name: "Tokyo Skytree",
    coordinates: [35.7101, 139.8107],
    aliases: ["Skytree", "Tokyo Skytree", "Sky Tree"],
  },
  "Sky Restaurant 634": {
    name: "Sky Restaurant 634",
    coordinates: [35.7101, 139.8107], // In Skytree
    aliases: ["Sky Restaurant", "Restaurant 634"],
  },
  "KFC": {
    name: "KFC",
    coordinates: [35.6764, 139.6993], // Shibuya area (many locations)
    aliases: ["KFC", "Kentucky Fried Chicken"],
  },
  "Akihabara": {
    name: "Akihabara",
    coordinates: [35.6984, 139.7731],
    aliases: ["Akihabara", "Akiba"],
  },
  "Coco Ichibanya": {
    name: "Coco Ichibanya",
    coordinates: [35.6984, 139.7731], // Akihabara area
    aliases: ["Coco Ichibanya", "Coco Curry", "Ichibanya"],
  },
  "Asakusa": {
    name: "Asakusa",
    coordinates: [35.7148, 139.7967],
    aliases: ["Asakusa"],
  },
  "Senso-ji Temple": {
    name: "Senso-ji Temple",
    coordinates: [35.7148, 139.7967], // Asakusa
    aliases: ["Senso-ji", "Sensoji Temple", "Senso-ji"],
  },
  "Nakamise Shopping Street": {
    name: "Nakamise Shopping Street",
    coordinates: [35.7148, 139.7967], // Asakusa
    aliases: ["Nakamise", "Nakamise Shopping Street"],
  },
  "Sometaro Okonomiyaki Asakusa": {
    name: "Sometaro Okonomiyaki Asakusa",
    coordinates: [35.7148, 139.7967], // Asakusa
    aliases: ["Sometaro", "Sometaro Okonomiyaki"],
  },
  "Sumida River": {
    name: "Sumida River",
    coordinates: [35.7101, 139.8107], // Near Skytree
    aliases: ["Sumida River", "Sumida"],
  },
  "Ghibli Museum": {
    name: "Ghibli Museum",
    coordinates: [35.6962, 139.5704], // Mitaka
    aliases: ["Ghibli Museum", "Ghibli", "Studio Ghibli Museum"],
  },
  "Straw Hat Cafe": {
    name: "Straw Hat Cafe",
    coordinates: [35.6962, 139.5704], // In Ghibli Museum
    aliases: ["Straw Hat Cafe", "Straw Hat"],
  },
  "Roppongi Hills": {
    name: "Roppongi Hills",
    coordinates: [35.6586, 139.7314],
    aliases: ["Roppongi Hills", "Roppongi"],
  },
  "Harajuku": {
    name: "Harajuku",
    coordinates: [35.6702, 139.7026],
    aliases: ["Harajuku"],
  },
  "Tokyo Haneda Airport": {
    name: "Tokyo Haneda Airport",
    coordinates: [35.5494, 139.7798],
    aliases: ["Haneda Airport", "Airport", "Tokyo Airport"],
  },
}

/**
 * Find a location by name (fuzzy matching with aliases)
 */
export function findTokyoLocation(locationName: string): TokyoLocation | null {
  const searchName = locationName.toLowerCase().trim()
  
  for (const [key, location] of Object.entries(TOKYO_LOCATIONS)) {
    if (key.toLowerCase().includes(searchName) || searchName.includes(key.toLowerCase())) {
      return location
    }
    if (location.aliases) {
      for (const alias of location.aliases) {
        if (alias.toLowerCase().includes(searchName) || searchName.includes(alias.toLowerCase())) {
          return location
        }
      }
    }
  }
  
  return null
}

/**
 * Get default Tokyo center coordinates
 */
export function getTokyoCenter(): [number, number] {
  return [35.6762, 139.6503] // Central Tokyo
}

