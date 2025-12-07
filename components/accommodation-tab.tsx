"use client";

import { useEffect, useState } from "react";

export default function AccommodationTab({ tripData }: { tripData: any }) {
  const [hotels, setHotels] = useState([
    {
      name: "Hampton Inn Los Angeles Int'l Airport/Hawthorne",
      source: "Hampton Inn Los Angeles Int'l Airport/Hawthorne",
      source_icon: "https://www.gstatic.com/travel-hotels/branding/d51ad765-02d7-43c3-a786-1d7a4ec13c4a.png",
      link: "https://www.google.com/aclk?sa=l&ai=DChsSEwiQhr2Eq6qRAxUVb0cBHZUCH_IYACICCAEQARoCcXU&co=1&ase=2&gclid=EAIaIQobChMIkIa9hKuqkQMVFW9HAR2VAh_yEA0YASABEgIYffD_BwE&cid=CAASuwHkaABzO1tBFO8EdSORuoqLwtivVP9DsPWTtTUFOqszSuK5QLlxLbQVae6miat4xdomF9Q-w7leCazZk7I05qZ4OGGEBDJYiVq4Rhgi7dslX7SfVknlFGSH7VI2H6Db10EiQql2YiMpuEp_h4_6Gvxx3ZnFrNY0PEgUtSvuJW3yH4SZX47vD8NKd2rj39B0WJOIuyD2ZEbXJzvRVe6Y2VV37UYeiMfnkxggStq41V8NbcRBLSvZpIEWpzZG&category=acrcp_v1_48&sig=AOD64_1IJGQaKl66_nJLTwuACCynAuRnvw&adurl=",
      property_token: "CgsI7Yiu07Ov1YHaARAB",
      serpapi_property_details_link:
        "https://serpapi.com/search.json?adults=2&check_in_date=2025-12-10&check_out_date=2025-12-15&children=0&currency=USD&engine=google_hotels&gl=us&hl=en&property_token=CgsI7Yiu07Ov1YHaARAB&q=Hotels+near+LAX",
      gps_coordinates: { latitude: 33.930698, longitude: -118.35073100000001 },
      hotel_class: 3,
      thumbnail:
        "https://lh5.googleusercontent.com/proxy/8KVoDN_REjVFVE0S9DPyRjsmbnxK0GPFhhkiLm5ycV5uP9TDeOl9RtjgOYMpxo1pvDdlBlXFV1fmNka2K-iZFx8dWTOcqcXKSl-FMtHAni89OGEEMXyI1DDe-3qgU1AS-PLtrYhKn_rnNEtSOH94xVxcVQJ82w=w225-h150-k-no",
      overall_rating: 4.1,
      reviews: 1923,
      price: "$131",
      extracted_price: 131,
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
      thumbnail:
        "https://lh3.googleusercontent.com/proxy/0WUo5Hik3cbA1WASmek7-6liSzLdCe6xtq_bMvlT_sX9Qu3XlMLi7AEouo775EbBRhuYH079-FV2BfQJeM7KvUmVSe94miUTiSLmVUqjoslt161YCCv-TLfjIcBwkuKiruoPN8JXxP9gAijpo1JIKF9qslPq5Q=w222-h150-k-no",
      overall_rating: 4.5,
      reviews: 685,
      price: "$87",
      extracted_price: 87,
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
      hotel_class: 3,
      thumbnail:
        "https://lh5.googleusercontent.com/proxy/XtGkFXDcV_Fx4wrCYReMomMg1C-KVyulwOpIrBSbOhl8dlo6hxvo2W2ocP6WNtu71iNOBUKoXw0_T8uio9JuTqfFjrOuflfdTVDEH4E49msau04LUP5E__chZ2Dw9eD1UPqo23xM7MZfVFISNBnc2Ud7-__Z6fo=w225-h150-k-no",
      overall_rating: 3.8,
      reviews: 3926,
      price: "$185",
      extracted_price: 185,
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
      hotel_class: 3,
      thumbnail:
        "https://lh3.googleusercontent.com/proxy/bfn9QCHXgskCDIsxYf3TTHSYx0fMDn74T7j9eh8QamKHHefU87xHwQYler_5Oz_euhf99qslJ98WMZ61BHrwrxYx3hZGomGTV75zrvZzX8wjYsyfhbDejqgUothQ3Rd19rQfSHogqDT91XfAkyi0ZrC67Bb3ag=w225-h150-k-no",
      overall_rating: 4.2,
      reviews: 391,
      price: "$158",
      extracted_price: 158,
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
      hotel_class: 3,
      thumbnail:
        "https://lh3.googleusercontent.com/proxy/l3P_O0Bck3XTjDfc0o6P8P8jKaAeJ8xq7QZU5CsBFipTwW_vDZmWzYjOnaur7MOsXkdQDpChIhwEWJJLOxhf4DbfLBHfYwmCGgnR4h3REPZjv12jTpSHBmnd2g7Fq9Ov2HJEzmSbWRgCvhp5SHZA8pbhmDMlEg=w225-h150-k-no",
      overall_rating: 4,
      reviews: 1496,
      price: "$149",
      extracted_price: 149,
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
      hotel_class: 3,
      thumbnail:
        "https://lh6.googleusercontent.com/proxy/1_yp2dJSJTEvfaXPL1WZy5juIoxvaOO-Ujzcja6VaYkn9zusx1OmNNg5k_q0_E8QZhYcof7E_9-Gj_ztyyYKaL8tiuukxN4SZU5FE_WlHeFk5DnFnLwXmTsCd4ztXGQGeXh5p2olX9nvYpjCgthuzW8inQN0XA=w225-h150-k-no",
      overall_rating: 3.7,
      reviews: 4795,
      price: "$126",
      extracted_price: 126,
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
      hotel_class: 3,
      thumbnail:
        "https://lh4.googleusercontent.com/proxy/sGrlJ0QzcLSaljtxBBsZ5mWQKZZh3ECHrM64F8lUWKXOVsFcvl0-gu2Uvv5-TcL3b8U3j_vEd6oLDV-sQsvWosi2ljjxBIRL-RDYl9fnojrTXPZrjiyhXIXRcwwA8_wb2Wy6A7soFdhF3KueO-KI-h3YXRdPkQ=w225-h150-k-no",
      overall_rating: 4.1,
      reviews: 1137,
      price: "$257",
      extracted_price: 257,
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
      hotel_class: 3,
      thumbnail:
        "https://lh6.googleusercontent.com/proxy/eoTS8aH8FEORVBvHKckJpvHY9Qoh1yTvlYRtcoFxtQ9_kz3ibXIainbPfhcISnqZiA1ZxqyNW3HZuR9Hk_xyOQAcZh_lhl21wu_Vj-MsiWnzZAIufuDBL1I0hN1uFwSPyDxBy7a6Sf7CN9vvUMVR-R9nkwcUslk=w225-h150-k-no",
      overall_rating: 4,
      reviews: 1348,
      price: "$146",
      extracted_price: 146,
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
      hotel_class: 3,
      thumbnail:
        "https://lh4.googleusercontent.com/proxy/GUG_sxLbSOLB8iG7Oizmdc8eLLo4NdKIpJC_4jej9KWzE2r4m1N0rUDp68Yc5L7Q3jOwwLKhRYFUj0ENyp8eM_gR-SIDckwPi0SLy1WGZv3Bdgn5thqWaH4WpgxPs_QjO34Sq1Gk9KqmB-V9Psx4GFoTsQWj0A=w300-h150-k-no",
      overall_rating: 3.8,
      reviews: 639,
      price: "$135",
      extracted_price: 135,
      amenities: ["Pet-friendly", "Kid-friendly", "Restaurant", "Fitness center", "Air conditioning"],
      free_cancellation: true,
    },
  ]);

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
      setHotels(data.data);
    };

    // fetchData();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Accommodation Options</h2>
        <p className="text-muted-foreground mb-6">Budget range: ${tripData?.budget / 7} per night (estimated)</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotels.map((hotel) => (
            <div
              key={Math.random()}
              className="border border-border rounded-lg overflow-hidden bg-background hover:shadow-lg transition"
            >
              <div className="h-32 bg-gradient-to-br from-secondary to-accent"></div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">Hotel {hotel.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {hotel.overall_rating}★ • {hotel.reviews} reviews
                </p>
                <p className="text-primary font-semibold mt-3">{hotel.price}/night</p>
                <button className="text-sm text-accent hover:underline mt-2">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
