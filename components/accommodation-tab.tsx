"use client";

import { useEffect, useState, useMemo } from "react";
import HotelDetails from "@/components/hotel-details";
import { formatLocationForDisplay } from "@/lib/utils/format-location";

// Hardcoded hotels database by city
const HOTELS_BY_CITY: Record<string, any[]> = {
  "Los Angeles": [
    {
      name: "Hampton Inn Los Angeles Int'l Airport/Hawthorne",
      source: "Hampton Inn Los Angeles Int'l Airport/Hawthorne",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/d51ad765-02d7-43c3-a786-1d7a4ec13c4a.png",
      link: "https://www.google.com/aclk?sa=l&ai=DChsSEwiQhr2Eq6qRAxUVb0cBHZUCH_IYACICCAEQARoCcXU&co=1&ase=2&gclid=EAIaIQobChMIkIa9hKuqkQMVFW9HAR2VAh_yEA0YASABEgIYffD_BwE&cid=CAASuwHkaABzO1tBFO8EdSORuoqLwtivVP9DsPWTtTUFOqszSuK5QLlxLbQVae6miat4xdomF9Q-w7leCazZk7I05qZ4OGGEBDJYiVq4Rhgi7dslX7SfVknlFGSH7VI2H6Db10EiQql2YiMpuEp_h4_6Gvxx3ZnFrNY0PEgUtSvuJW3yH4SZX47vD8NKd2rj39B0WJOIuyD2ZEbXJzvRVe6Y2VV37UYeiMfnkxggStq41V8NbcRBLSvZpIEWpzZG&category=acrcp_v1_48&sig=AOD64_1IJGQaKl66_nJLTwuACCynAuRnvw&adurl=",
      property_token: "CgsI7Yiu07Ov1YHaARAB",
      serpapi_property_details_link:
        "https://serpapi.com/search.json?adults=2&check_in_date=2025-12-10&check_out_date=2025-12-15&children=0&currency=USD&engine=google_hotels&gl=us&hl=en&property_token=CgsI7Yiu07Ov1YHaARAB&q=Hotels+near+LAX",
      gps_coordinates: { latitude: 33.930698, longitude: -118.35073100000001 },
      address: "Placeholder Address - Hampton Inn Los Angeles Int'l Airport/Hawthorne",
      hotel_class: 3,
      thumbnail:
        "https://lh5.googleusercontent.com/proxy/8KVoDN_REjVFVE0S9DPyRjsmbnxK0GPFhhkiLm5ycV5uP9TDeOl9RtjgOYMpxo1pvDdlBlXFV1fmNka2K-iZFx8dWTOcqcXKSl-FMtHAni89OGEEMXyI1DDe-3qgU1AS-PLtrYhKn_rnNEtSOH94xVxcVQJ82w=w225-h150-k-no",
      overall_rating: 4.1,
      reviews: 1923,
      price: "$262",
      extracted_price: 262,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Pet-friendly",
        "Kid-friendly",
        "Airport shuttle",
        "Fitness center",
        "Free breakfast",
        "Air conditioning",
      ],
    },
    {
      name: "Studio 6 Suites Los Angeles, CA - Los Angeles - LAX",
      source: "Expedia.com",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/ac238c97-1652-4830-8da8-bb8d8883af88.png",
      link: "https://www.google.com/aclk?sa=l&ai=DChsSEwiQhr2Eq6qRAxUVb0cBHZUCH_IYACICCAEQDRoCcXU&co=1&ase=2&gclid=EAIaIQobChMIkIa9hKuqkQMVFW9HAR2VAh_yEA0YAiABEgIdDvD_BwE&cid=CAASuwHkaABzO1tBFO8EdSORuoqLwtivVP9DsPWTtTUFOqszSuK5QLlxLbQVae6miat4xdomF9Q-w7leCazZk7I05qZ4OGGEBDJYiVq4Rhgi7dslX7SfVknlFGSH7VI2H6Db10EiQql2YiMpuEp_h4_6Gvxx3ZnFrNY0PEgUtSvuJW3yH4SZX47vD8NKd2rj39B0WJOIuyD2ZEbXJzvRVe6Y2VV37UYeiMfnkxggStq41V8NbcRBLSvZpIEWpzZG&category=acrcp_v1_48&sig=AOD64_1VXz6Xvhwh77BGmEQG3QUZcuwp1A&adurl=",
      property_token: "CgsI7vDA3Z2z3oHYARAB",
      serpapi_property_details_link:
        "https://serpapi.com/search.json?adults=2&check_in_date=2025-12-10&check_out_date=2025-12-15&children=0&currency=USD&engine=google_hotels&gl=us&hl=en&property_token=CgsI7vDA3Z2z3oHYARAB&q=Hotels+near+LAX",
      gps_coordinates: { latitude: 33.945938, longitude: -118.367185 },
      address: "Placeholder Address - Studio 6 Suites Los Angeles, CA - Los Angeles - LAX",
      thumbnail:
        "https://lh3.googleusercontent.com/proxy/0WUo5Hik3cbA1WASmek7-6liSzLdCe6xtq_bMvlT_sX9Qu3XlMLi7AEouo775EbBRhuYH079-FV2BfQJeM7KvUmVSe94miUTiSLmVUqjoslt161YCCv-TLfjIcBwkuKiruoPN8JXxP9gAijpo1JIKF9qslPq5Q=w222-h150-k-no",
      overall_rating: 4.5,
      reviews: 685,
      price: "$174",
      extracted_price: 174,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: ["Pet-friendly"],
      free_cancellation: true,
    },
    {
      name: "Embassy Suites by Hilton Los Angeles International Airport South",
      source: "Embassy Suites by Hilton Los Angeles International Airport South",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/652835ce-0417-49a4-8ed9-f7ae1795aab8.png",
      link: "https://www.google.com/aclk?sa=l&ai=DChsSEwiQhr2Eq6qRAxUVb0cBHZUCH_IYACICCAEQERoCcXU&co=1&ase=2&gclid=EAIaIQobChMIkIa9hKuqkQMVFW9HAR2VAh_yEA0YAyABEgK-8PD_BwE&cid=CAASuwHkaABzO1tBFO8EdSORuoqLwtivVP9DsPWTtTUFOqszSuK5QLlxLbQVae6miat4xdomF9Q-w7leCazZk7I05qZ4OGGEBDJYiVq4Rhgi7dslX7SfVknlFGSH7VI2H6Db10EiQql2YiMpuEp_h4_6Gvxx3ZnFrNY0PEgUtSvuJW3yH4SZX47vD8NKd2rj39B0WJOIuyD2ZEbXJzvRVe6Y2VV37UYeiMfnkxggStq41V8NbcRBLSvZpIEWpzZG&category=acrcp_v1_48&sig=AOD64_0Bfi-li91FpcAXsfysLwpP4Q1r2Q&adurl=",
      property_token: "CgsIqZ7LjIy9nMuZARAB",
      serpapi_property_details_link:
        "https://serpapi.com/search.json?adults=2&check_in_date=2025-12-10&check_out_date=2025-12-15&children=0&currency=USD&engine=google_hotels&gl=us&hl=en&property_token=CgsIqZ7LjIy9nMuZARAB&q=Hotels+near+LAX",
      gps_coordinates: { latitude: 33.930515, longitude: -118.400708 },
      address: "Placeholder Address - Embassy Suites by Hilton Los Angeles International Airport South",
      hotel_class: 3,
      thumbnail:
        "https://lh5.googleusercontent.com/proxy/XtGkFXDcV_Fx4wrCYReMomMg1C-KVyulwOpIrBSbOhl8dlo6hxvo2W2ocP6WNtu71iNOBUKoXw0_T8uio9JuTqfFjrOuflfdTVDEH4E49msau04LUP5E__chZ2Dw9eD1UPqo23xM7MZfVFISNBnc2Ud7-__Z6fo=w225-h150-k-no",
      overall_rating: 3.8,
      reviews: 3926,
      price: "$370",
      extracted_price: 370,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Pet-friendly",
        "Kid-friendly",
        "Casino",
        "Restaurant",
        "Bar",
        "Room service",
        "Airport shuttle",
        "Fitness center",
        "Wi-Fi",
        "Free breakfast",
        "Air conditioning",
      ],
    },
    {
      name: "Hampton Inn by Hilton Los Angeles Airport",
      source: "Hampton Inn by Hilton Los Angeles Airport",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/d51ad765-02d7-43c3-a786-1d7a4ec13c4a.png",
      link: "https://www.google.com/aclk?sa=l&ai=DChsSEwiQhr2Eq6qRAxUVb0cBHZUCH_IYACICCAEQCxoCcXU&co=1&ase=2&gclid=EAIaIQobChMIkIa9hKuqkQMVFW9HAR2VAh_yEA0YBCABEgK9jfD_BwE&cid=CAASuwHkaABzO1tBFO8EdSORuoqLwtivVP9DsPWTtTUFOqszSuK5QLlxLbQVae6miat4xdomF9Q-w7leCazZk7I05qZ4OGGEBDJYiVq4Rhgi7dslX7SfVknlFGSH7VI2H6Db10EiQql2YiMpuEp_h4_6Gvxx3ZnFrNY0PEgUtSvuJW3yH4SZX47vD8NKd2rj39B0WJOIuyD2ZEbXJzvRVe6Y2VV37UYeiMfnkxggStq41V8NbcRBLSvZpIEWpzZG&category=acrcp_v1_48&sig=AOD64_01dUwoYwM5PSOqgULByWqYaLjVVg&adurl=",
      property_token: "CgoI7-6Z1t2w57VZEAE",
      serpapi_property_details_link:
        "https://serpapi.com/search.json?adults=2&check_in_date=2025-12-10&check_out_date=2025-12-15&children=0&currency=USD&engine=google_hotels&gl=us&hl=en&property_token=CgoI7-6Z1t2w57VZEAE&q=Hotels+near+LAX",
      gps_coordinates: { latitude: 33.942733, longitude: -118.369621 },
      address: "Placeholder Address - Hampton Inn by Hilton Los Angeles Airport",
      hotel_class: 3,
      thumbnail:
        "https://lh3.googleusercontent.com/proxy/bfn9QCHXgskCDIsxYf3TTHSYx0fMDn74T7j9eh8QamKHHefU87xHwQYler_5Oz_euhf99qslJ98WMZ61BHrwrxYx3hZGomGTV75zrvZzX8wjYsyfhbDejqgUothQ3Rd19rQfSHogqDT91XfAkyi0ZrC67Bb3ag=w225-h150-k-no",
      overall_rating: 4.2,
      reviews: 391,
      price: "$316",
      extracted_price: 316,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: ["Pet-friendly", "Kid-friendly", "Fitness center", "Free breakfast", "Air conditioning"],
    },
    {
      name: "Holiday Inn Express & Suites Los Angeles Airport Hawthorne by IHG",
      source: "Holiday Inn Express & Suites Los Angeles Airport Hawthorne by IHG",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/2905805132092915444.png",
      link: "https://www.google.com/aclk?sa=l&ai=DChsSEwiQhr2Eq6qRAxUVb0cBHZUCH_IYACICCAEQCRoCcXU&co=1&ase=2&gclid=EAIaIQobChMIkIa9hKuqkQMVFW9HAR2VAh_yEA0YBSABEgJLzfD_BwE&cid=CAASuwHkaABzO1tBFO8EdSORuoqLwtivVP9DsPWTtTUFOqszSuK5QLlxLbQVae6miat4xdomF9Q-w7leCazZk7I05qZ4OGGEBDJYiVq4Rhgi7dslX7SfVknlFGSH7VI2H6Db10EiQql2YiMpuEp_h4_6Gvxx3ZnFrNY0PEgUtSvuJW3yH4SZX47vD8NKd2rj39B0WJOIuyD2ZEbXJzvRVe6Y2VV37UYeiMfnkxggStq41V8NbcRBLSvZpIEWpzZG&category=acrcp_v1_48&sig=AOD64_0wJSpP4-GPPeH_c1IdGHncUxklvw&adurl=",
      property_token: "CgoImKOKx_zMkqJKEAE",
      serpapi_property_details_link:
        "https://serpapi.com/search.json?adults=2&check_in_date=2025-12-10&check_out_date=2025-12-15&children=0&currency=USD&engine=google_hotels&gl=us&hl=en&property_token=CgoImKOKx_zMkqJKEAE&q=Hotels+near+LAX",
      gps_coordinates: { latitude: 33.930133999999995, longitude: -118.351886 },
      address: "Placeholder Address - Holiday Inn Express & Suites Los Angeles Airport Hawthorne by IHG",
      hotel_class: 3,
      thumbnail:
        "https://lh3.googleusercontent.com/proxy/l3P_O0Bck3XTjDfc0o6P8P8jKaAeJ8xq7QZU5CsBFipTwW_vDZmWzYjOnaur7MOsXkdQDpChIhwEWJJLOxhf4DbfLBHfYwmCGgnR4h3REPZjv12jTpSHBmnd2g7Fq9Ov2HJEzmSbWRgCvhp5SHZA8pbhmDMlEg=w225-h150-k-no",
      overall_rating: 4,
      reviews: 1496,
      price: "$298",
      extracted_price: 298,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Hot tub",
        "Pool",
        "Kid-friendly",
        "Restaurant",
        "Fitness center",
        "Outdoor pool",
        "Free breakfast",
        "Air conditioning",
      ],
      free_cancellation: true,
    },
    {
      name: "Holiday Inn Los Angeles - LAX Airport by IHG",
      source: "Holiday Inn Los Angeles - LAX Airport by IHG",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/4864225593847480026.png",
      link: "https://www.google.com/aclk?sa=l&ai=DChsSEwiQhr2Eq6qRAxUVb0cBHZUCH_IYACICCAEQBxoCcXU&co=1&ase=2&gclid=EAIaIQobChMIkIa9hKuqkQMVFW9HAR2VAh_yEA0YBiABEgKh0_D_BwE&cid=CAASuwHkaABzO1tBFO8EdSORuoqLwtivVP9DsPWTtTUFOqszSuK5QLlxLbQVae6miat4xdomF9Q-w7leCazZk7I05qZ4OGGEBDJYiVq4Rhgi7dslX7SfVknlFGSH7VI2H6Db10EiQql2YiMpuEp_h4_6Gvxx3ZnFrNY0PEgUtSvuJW3yH4SZX47vD8NKd2rj39B0WJOIuyD2ZEbXJzvRVe6Y2VV37UYeiMfnkxggStq41V8NbcRBLSvZpIEWpzZG&category=acrcp_v1_48&sig=AOD64_1XARzfKWqyHzR6ikvd7-O7Qgjy8Q&adurl=",
      property_token: "CgsI09bUqvnU56SjARAB",
      serpapi_property_details_link:
        "https://serpapi.com/search.json?adults=2&check_in_date=2025-12-10&check_out_date=2025-12-15&children=0&currency=USD&engine=google_hotels&gl=us&hl=en&property_token=CgsI09bUqvnU56SjARAB&q=Hotels+near+LAX",
      gps_coordinates: { latitude: 33.946200999999995, longitude: -118.37091900000001 },
      address: "Placeholder Address - Holiday Inn Los Angeles - LAX Airport by IHG",
      hotel_class: 3,
      thumbnail:
        "https://lh6.googleusercontent.com/proxy/1_yp2dJSJTEvfaXPL1WZy5juIoxvaOO-Ujzcja6VaYkn9zusx1OmNNg5k_q0_E8QZhYcof7E_9-Gj_ztyyYKaL8tiuukxN4SZU5FE_WlHeFk5DnFnLwXmTsCd4ztXGQGeXh5p2olX9nvYpjCgthuzW8inQN0XA=w225-h150-k-no",
      overall_rating: 3.7,
      reviews: 4795,
      price: "$252",
      extracted_price: 252,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Kid-friendly",
        "Restaurant",
        "Bar",
        "Room service",
        "Airport shuttle",
        "Fitness center",
        "Outdoor pool",
        "Air conditioning",
      ],
      free_cancellation: true,
    },
    {
      name: "The Belamar Hotel Manhattan Beach, Tapestry Collection by Hilton",
      source: "The Belamar Hotel Manhattan Beach, Tapestry Collection by Hilton",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/f5339802-22c8-497c-96c2-c0c2f079ff5b.png",
      link: "https://www.google.com/aclk?sa=l&ai=DChsSEwiQhr2Eq6qRAxUVb0cBHZUCH_IYACICCAEQAxoCcXU&co=1&ase=2&gclid=EAIaIQobChMIkIa9hKuqkQMVFW9HAR2VAh_yEA0YByABEgJjm_D_BwE&cid=CAASuwHkaABzO1tBFO8EdSORuoqLwtivVP9DsPWTtTUFOqszSuK5QLlxLbQVae6miat4xdomF9Q-w7leCazZk7I05qZ4OGGEBDJYiVq4Rhgi7dslX7SfVknlFGSH7VI2H6Db10EiQql2YiMpuEp_h4_6Gvxx3ZnFrNY0PEgUtSvuJW3yH4SZX47vD8NKd2rj39B0WJOIuyD2ZEbXJzvRVe6Y2VV37UYeiMfnkxggStq41V8NbcRBLSvZpIEWpzZG&category=acrcp_v1_48&sig=AOD64_11SO0T43KF0Zz4sgZDxcqPriSnSQ&adurl=",
      property_token: "CgoIr5Oenvr9yqpAEAE",
      serpapi_property_details_link:
        "https://serpapi.com/search.json?adults=2&check_in_date=2025-12-10&check_out_date=2025-12-15&children=0&currency=USD&engine=google_hotels&gl=us&hl=en&property_token=CgoIr5Oenvr9yqpAEAE&q=Hotels+near+LAX",
      gps_coordinates: { latitude: 33.900601, longitude: -118.396829 },
      address: "Placeholder Address - The Belamar Hotel Manhattan Beach, Tapestry Collection by Hilton",
      hotel_class: 3,
      thumbnail:
        "https://lh4.googleusercontent.com/proxy/sGrlJ0QzcLSaljtxBBsZ5mWQKZZh3ECHrM64F8lUWKXOVsFcvl0-gu2Uvv5-TcL3b8U3j_vEd6oLDV-sQsvWosi2ljjxBIRL-RDYl9fnojrTXPZrjiyhXIXRcwwA8_wb2Wy6A7soFdhF3KueO-KI-h3YXRdPkQ=w225-h150-k-no",
      overall_rating: 4.1,
      reviews: 1137,
      price: "$514",
      extracted_price: 514,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Hot tub",
        "Pool",
        "Kid-friendly",
        "Restaurant",
        "Bar",
        "Room service",
        "Fitness center",
        "Outdoor pool",
        "Air conditioning",
      ],
    },
    {
      name: "Hilton Garden Inn Los Angeles/Redondo Beach",
      source: "Hilton Garden Inn Los Angeles/Redondo Beach",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/c95285be-0488-4a6a-96f6-6e5737184c6c.png",
      link: "https://www.google.com/aclk?sa=l&ai=DChsSEwiQhr2Eq6qRAxUVb0cBHZUCH_IYACICCAEQBRoCcXU&co=1&ase=2&gclid=EAIaIQobChMIkIa9hKuqkQMVFW9HAR2VAh_yEA0YCCABEgJQefD_BwE&cid=CAASuwHkaABzO1tBFO8EdSORuoqLwtivVP9DsPWTtTUFOqszSuK5QLlxLbQVae6miat4xdomF9Q-w7leCazZk7I05qZ4OGGEBDJYiVq4Rhgi7dslX7SfVknlFGSH7VI2H6Db10EiQql2YiMpuEp_h4_6Gvxx3ZnFrNY0PEgUtSvuJW3yH4SZX47vD8NKd2rj39B0WJOIuyD2ZEbXJzvRVe6Y2VV37UYeiMfnkxggStq41V8NbcRBLSvZpIEWpzZG&category=acrcp_v1_48&sig=AOD64_3oBSCWczrXZ-jo7dF0VmevjT6sfg&adurl=",
      property_token: "CgsIjLLpytn-_MGpARAB",
      serpapi_property_details_link:
        "https://serpapi.com/search.json?adults=2&check_in_date=2025-12-10&check_out_date=2025-12-15&children=0&currency=USD&engine=google_hotels&gl=us&hl=en&property_token=CgsIjLLpytn-_MGpARAB&q=Hotels+near+LAX",
      gps_coordinates: { latitude: 33.893803, longitude: -118.366573 },
      address: "Placeholder Address - Hilton Garden Inn Los Angeles/Redondo Beach",
      hotel_class: 3,
      thumbnail:
        "https://lh6.googleusercontent.com/proxy/eoTS8aH8FEORVBvHKckJpvHY9Qoh1yTvlYRtcoFxtQ9_kz3ibXIainbPfhcISnqZiA1ZxqyNW3HZuR9Hk_xyOQAcZh_lhl21wu_Vj-MsiWnzZAIufuDBL1I0hN1uFwSPyDxBy7a6Sf7CN9vvUMVR-R9nkwcUslk=w225-h150-k-no",
      overall_rating: 4,
      reviews: 1348,
      price: "$292",
      extracted_price: 292,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Hot tub",
        "Pool",
        "Pet-friendly",
        "Kid-friendly",
        "Restaurant",
        "Bar",
        "Room service",
        "Fitness center",
        "Outdoor pool",
        "Air conditioning",
      ],
    },
    {
      name: "Candlewood Suites LAX Hawthorne by IHG",
      source: "Candlewood Suites LAX Hawthorne by IHG",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/11506893065567301188.png",
      link: "https://www.google.com/aclk?sa=l&ai=DChsSEwiQhr2Eq6qRAxUVb0cBHZUCH_IYACICCAEQDxoCcXU&co=1&ase=2&gclid=EAIaIQobChMIkIa9hKuqkQMVFW9HAR2VAh_yEA0YCSABEgKZe_D_BwE&cid=CAASuwHkaABzO1tBFO8EdSORuoqLwtivVP9DsPWTtTUFOqszSuK5QLlxLbQVae6miat4xdomF9Q-w7leCazZk7I05qZ4OGGEBDJYiVq4Rhgi7dslX7SfVknlFGSH7VI2H6Db10EiQql2YiMpuEp_h4_6Gvxx3ZnFrNY0PEgUtSvuJW3yH4SZX47vD8NKd2rj39B0WJOIuyD2ZEbXJzvRVe6Y2VV37UYeiMfnkxggStq41V8NbcRBLSvZpIEWpzZG&category=acrcp_v1_48&sig=AOD64_0ivQO88POEsnhj8PTt4b5ThelPFA&adurl=",
      property_token: "CgoInt7H1N6sm4xhEAE",
      serpapi_property_details_link:
        "https://serpapi.com/search.json?adults=2&check_in_date=2025-12-10&check_out_date=2025-12-15&children=0&currency=USD&engine=google_hotels&gl=us&hl=en&property_token=CgoInt7H1N6sm4xhEAE&q=Hotels+near+LAX",
      gps_coordinates: { latitude: 33.93049, longitude: -118.351879 },
      address: "Placeholder Address - Candlewood Suites LAX Hawthorne by IHG",
      hotel_class: 3,
      thumbnail:
        "https://lh4.googleusercontent.com/proxy/GUG_sxLbSOLB8iG7Oizmdc8eLLo4NdKIpJC_4jej9KWzE2r4m1N0rUDp68Yc5L7Q3jOwwLKhRYFUj0ENyp8eM_gR-SIDckwPi0SLy1WGZv3Bdgn5thqWaH4WpgxPs_QjO34Sq1Gk9KqmB-V9Psx4GFoTsQWj0A=w300-h150-k-no",
      overall_rating: 3.8,
      reviews: 639,
      price: "$270",
      extracted_price: 270,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: ["Pet-friendly", "Kid-friendly", "Restaurant", "Fitness center", "Air conditioning"],
      free_cancellation: true,
    },
  ],
  "Tokyo": [
    {
      name: "Park Hyatt Tokyo",
      source: "Park Hyatt Tokyo",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/f5339802-22c8-497c-96c2-c0c2f079ff5b.png",
      link: "https://www.hyatt.com/en-US/hotel/japan/park-hyatt-tokyo/tyoph",
      property_token: "CgsI7Yiu07Ov1YHaARAB",
      serpapi_property_details_link: "https://serpapi.com/search.json?engine=google_hotels&q=Hotels+near+Tokyo",
      gps_coordinates: { latitude: 35.6586, longitude: 139.7454 },
      address: "Placeholder Address - Park Hyatt Tokyo",
      hotel_class: 5,
      thumbnail: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2025/08/22/0556/TYOPH-P0659-DeluxeRoom-Two.jpg/TYOPH-P0659-DeluxeRoom-Two.16x9.jpg",
      overall_rating: 4.6,
      reviews: 2847,
      price: "$900",
      extracted_price: 900,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Spa",
        "Restaurant",
        "Bar",
        "Room service",
        "Fitness center",
        "Wi-Fi",
        "Air conditioning",
        "Concierge",
      ],
      free_cancellation: true,
    },
    {
      name: "The Ritz-Carlton Tokyo",
      source: "The Ritz-Carlton Tokyo",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/c95285be-0488-4a6a-96f6-6e5737184c6c.png",
      link: "https://www.ritzcarlton.com/en/hotels/japan/tokyo",
      property_token: "CgsI7vDA3Z2z3oHYARAB",
      serpapi_property_details_link: "https://serpapi.com/search.json?engine=google_hotels&q=Hotels+near+Tokyo",
      gps_coordinates: { latitude: 35.6586, longitude: 139.7454 },
      address: "Placeholder Address - The Ritz-Carlton Tokyo",
      hotel_class: 5,
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL-cHI4DPudEjAP3508DvRxZOkDZ3B9fDwvQ&s",
      overall_rating: 4.7,
      reviews: 1923,
      price: "$1,040",
      extracted_price: 1040,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Spa",
        "Pet-friendly",
        "Restaurant",
        "Bar",
        "Room service",
        "Fitness center",
        "Wi-Fi",
        "Air conditioning",
        "Concierge",
      ],
      free_cancellation: true,
    },
    {
      name: "Grand Hyatt Tokyo",
      source: "Grand Hyatt Tokyo",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/652835ce-0417-49a4-8ed9-f7ae1795aab8.png",
      link: "https://www.hyatt.com/en-US/hotel/japan/grand-hyatt-tokyo/tyogh",
      property_token: "CgsIqZ7LjIy9nMuZARAB",
      serpapi_property_details_link: "https://serpapi.com/search.json?engine=google_hotels&q=Hotels+near+Tokyo",
      gps_coordinates: { latitude: 35.6586, longitude: 139.7454 },
      address: "Placeholder Address - Grand Hyatt Tokyo",
      hotel_class: 5,
      thumbnail: "https://secure.s.forbestravelguide.com/img/properties/grand-hyatt-tokyo/Grand-Hyatt-Tokyo-diplomat-suite.jpg",
      overall_rating: 4.5,
      reviews: 3421,
      price: "$760",
      extracted_price: 760,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Spa",
        "Kid-friendly",
        "Restaurant",
        "Bar",
        "Room service",
        "Fitness center",
        "Wi-Fi",
        "Free breakfast",
        "Air conditioning",
      ],
      free_cancellation: true,
    },
    {
      name: "Hotel Okura Tokyo",
      source: "Hotel Okura Tokyo",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/d51ad765-02d7-43c3-a786-1d7a4ec13c4a.png",
      link: "https://www.okura.com/en/hotels/okura-tokyo/",
      property_token: "CgoI7-6Z1t2w57VZEAE",
      serpapi_property_details_link: "https://serpapi.com/search.json?engine=google_hotels&q=Hotels+near+Tokyo",
      gps_coordinates: { latitude: 35.6586, longitude: 139.7454 },
      address: "Placeholder Address - Hotel Okura Tokyo",
      hotel_class: 5,
      thumbnail: "https://d3g2yh83to8qa2.cloudfront.net/wp-content/uploads/sites/119/2016/04/12235117/hr990%C3%97590.jpg",
      overall_rating: 4.4,
      reviews: 2156,
      price: "$640",
      extracted_price: 640,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Spa",
        "Restaurant",
        "Bar",
        "Room service",
        "Fitness center",
        "Wi-Fi",
        "Air conditioning",
        "Concierge",
      ],
      free_cancellation: true,
    },
    {
      name: "Imperial Hotel Tokyo",
      source: "Imperial Hotel Tokyo",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/2905805132092915444.png",
      link: "https://www.imperialhotel.co.jp/e/tokyo/",
      property_token: "CgoImKOKx_zMkqJKEAE",
      serpapi_property_details_link: "https://serpapi.com/search.json?engine=google_hotels&q=Hotels+near+Tokyo",
      gps_coordinates: { latitude: 35.6586, longitude: 139.7454 },
      address: "Placeholder Address - Imperial Hotel Tokyo",
      hotel_class: 5,
      thumbnail: "https://static-new.lhw.com/HotelImages/Final/LW1822/lw1822_148662974_720x450.jpg",
      overall_rating: 4.5,
      reviews: 3892,
      price: "$700",
      extracted_price: 700,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Spa",
        "Kid-friendly",
        "Restaurant",
        "Bar",
        "Room service",
        "Fitness center",
        "Wi-Fi",
        "Air conditioning",
        "Concierge",
      ],
      free_cancellation: true,
    },
    {
      name: "Shangri-La Tokyo",
      source: "Shangri-La Tokyo",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/4864225593847480026.png",
      link: "https://www.shangri-la.com/tokyo/shangrila/",
      property_token: "CgsI09bUqvnU56SjARAB",
      serpapi_property_details_link: "https://serpapi.com/search.json?engine=google_hotels&q=Hotels+near+Tokyo",
      gps_coordinates: { latitude: 35.6586, longitude: 139.7454 },
      address: "Placeholder Address - Shangri-La Tokyo",
      hotel_class: 5,
      thumbnail: "https://media.cntraveler.com/photos/61e12014abc79c35233fa52a/16:9/w_2560%2Cc_limit/Shangri-La-Hotel%2C-Tokyo.jpg",
      overall_rating: 4.6,
      reviews: 1654,
      price: "$840",
      extracted_price: 840,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Spa",
        "Pet-friendly",
        "Restaurant",
        "Bar",
        "Room service",
        "Fitness center",
        "Wi-Fi",
        "Air conditioning",
        "Concierge",
      ],
      free_cancellation: true,
    },
    {
      name: "Conrad Tokyo",
      source: "Conrad Tokyo",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/c95285be-0488-4a6a-96f6-6e5737184c6c.png",
      link: "https://www.hilton.com/en/hotels/tyocici-conrad-tokyo/",
      property_token: "CgoIr5Oenvr9yqpAEAE",
      serpapi_property_details_link: "https://serpapi.com/search.json?engine=google_hotels&q=Hotels+near+Tokyo",
      gps_coordinates: { latitude: 35.6586, longitude: 139.7454 },
      address: "Placeholder Address - Conrad Tokyo",
      hotel_class: 5,
      thumbnail: "https://content.r9cdn.net/rimg/himg/92/d2/b6/ice-102304-119207082-810355.jpg?width=1366&height=768&crop=true",
      overall_rating: 4.5,
      reviews: 2234,
      price: "$780",
      extracted_price: 780,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Spa",
        "Kid-friendly",
        "Restaurant",
        "Bar",
        "Room service",
        "Fitness center",
        "Wi-Fi",
        "Air conditioning",
        "Concierge",
      ],
      free_cancellation: true,
    },
    {
      name: "The Peninsula Tokyo",
      source: "The Peninsula Tokyo",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/f5339802-22c8-497c-96c2-c0c2f079ff5b.png",
      link: "https://www.peninsula.com/en/tokyo",
      property_token: "CgsIjLLpytn-_MGpARAB",
      serpapi_property_details_link: "https://serpapi.com/search.json?engine=google_hotels&q=Hotels+near+Tokyo",
      gps_coordinates: { latitude: 35.6586, longitude: 139.7454 },
      address: "Placeholder Address - The Peninsula Tokyo",
      hotel_class: 5,
      thumbnail: "https://cdn.kiwicollection.com/media/property/PR005510/ll/The-Peninsula-Tokyo-005510-01-The-Lobby-Table-Set-up.jpg?cb=1463609109",
      overall_rating: 4.7,
      reviews: 1876,
      price: "$960",
      extracted_price: 960,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Spa",
        "Restaurant",
        "Bar",
        "Room service",
        "Fitness center",
        "Wi-Fi",
        "Air conditioning",
        "Concierge",
      ],
      free_cancellation: true,
    },
    {
      name: "Aman Tokyo",
      source: "Aman Tokyo",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/11506893065567301188.png",
      link: "https://www.aman.com/resorts/aman-tokyo",
      property_token: "CgoInt7H1N6sm4xhEAE",
      serpapi_property_details_link: "https://serpapi.com/search.json?engine=google_hotels&q=Hotels+near+Tokyo",
      gps_coordinates: { latitude: 35.6586, longitude: 139.7454 },
      address: "Placeholder Address - Aman Tokyo",
      hotel_class: 5,
      thumbnail: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/31/a8/20/aman-tokyo-suite.jpg?w=900&h=500&s=1",
      overall_rating: 4.8,
      reviews: 892,
      price: "$1,300",
      extracted_price: 1300,
      rooms: 2,
      room_configuration: "2 connected rooms (automatically selected for family of 4)",
      amenities: [
        "Pool",
        "Spa",
        "Restaurant",
        "Bar",
        "Room service",
        "Fitness center",
        "Wi-Fi",
        "Air conditioning",
        "Concierge",
      ],
      free_cancellation: true,
    },
  ],
};

// Placeholder hotels for other cities
const PLACEHOLDER_HOTELS = [
  {
    name: "Sample Hotel",
    source: "Booking.com",
    source_icon: "https://www.gstatic.com/travel-hotels/branding/ac238c97-1652-4830-8da8-bb8d8883af88.png",
    link: "#",
    property_token: "placeholder",
    serpapi_property_details_link: "#",
    gps_coordinates: { latitude: 0, longitude: 0 },
    hotel_class: 3,
    thumbnail: "https://via.placeholder.com/225x150?text=Hotel+Image",
    overall_rating: 4.0,
    reviews: 100,
    price: "$200",
    extracted_price: 200,
    rooms: 2,
    room_configuration: "2 connected rooms (automatically selected for family of 4)",
    amenities: ["Wi-Fi", "Air conditioning"],
    free_cancellation: false,
  },
];

export default function AccommodationTab({ tripData }: { tripData: any }) {
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  // Determine which city's hotels to show
  const destinationCity = useMemo(() => {
    if (!tripData?.destinations || tripData.destinations.length === 0) return null;
    const firstDest = tripData.destinations[0];
    const destFormatted = formatLocationForDisplay(firstDest);
    
    // Check if it's Los Angeles or Tokyo
    if (destFormatted.includes("Los Angeles")) return "Los Angeles";
    if (destFormatted.includes("Tokyo")) return "Tokyo";
    return null;
  }, [tripData?.destinations]);

  // Get hotels for the destination city
  const hotels = useMemo(() => {
    if (destinationCity && HOTELS_BY_CITY[destinationCity]) {
      return HOTELS_BY_CITY[destinationCity];
    }
    return PLACEHOLDER_HOTELS;
  }, [destinationCity]);

  // Calculate budget range from actual hotel prices
  const budgetRange = useMemo(() => {
    if (hotels.length === 0) return null;
    const prices = hotels.map((h) => h.extracted_price || 0).filter((p) => p > 0);
    if (prices.length === 0) return null;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { min: minPrice, max: maxPrice };
  }, [hotels]);

  useEffect(() => {
    const fetchData = async () => {
      // ! change with tripdata
      const { arrival_id, check_in_date, check_out_date, adults, currency } = {
        arrival_id: "LAX",
        check_in_date: "2025-12-10",
        check_out_date: "2025-12-15",
        adults: 2,
        currency: "USD",
      };
      const res = await fetch("http://localhost:3001/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          arrival_id: arrival_id,
          check_in_date: check_in_date,
          check_out_date: check_out_date,
          adults: adults,
          currency: currency,
        }),
      });
      const data = await res.json();
      console.log(JSON.stringify(data.data.ads));
      // Note: Using hardcoded hotels instead of API data
    };

    // fetchData();
  }, []);
  // Show hotel details if one is selected
  if (selectedHotel) {
    return (
      <HotelDetails
        hotel={selectedHotel}
        tripData={tripData}
        onBack={() => setSelectedHotel(null)}
        onBookWithAI={() => {
          // TODO: Implement AI booking flow
          console.log("Book with AI Agent for:", selectedHotel.name);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Accommodation Options</h2>
        {budgetRange ? (
          <p className="text-muted-foreground mb-6">
            Budget range: ${budgetRange.min} - ${budgetRange.max} per night
          </p>
        ) : (
        <p className="text-muted-foreground mb-6">Budget range: ${tripData?.budget / 7} per night (estimated)</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotels.map((hotel, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden bg-background hover:shadow-lg transition"
            >
              {hotel.thumbnail ? (
                <div className="relative h-32 w-full">
                <img
                  src={hotel.thumbnail}
                  alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-secondary to-accent"></div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{hotel.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {hotel.overall_rating}★ • {hotel.reviews} reviews
                </p>
                <p className="text-primary font-semibold mt-3">{hotel.price}/night (2 rooms)</p>
                {hotel.room_configuration && (
                  <p className="text-xs text-muted-foreground mt-1">{hotel.room_configuration}</p>
                )}
                <button
                  onClick={() => setSelectedHotel(hotel)}
                  className="text-sm text-accent hover:underline mt-2"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
