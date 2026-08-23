export const site = {
  name: "ZynReach",
  tagline: "AI-Powered Enterprise Growth & Operations Platform",
  url: "https://www.zynreach.com",
  appUrl: "https://app.zynreach.com",
  loginUrl: "https://app.zynreach.com/login",
  trialUrl: "https://app.zynreach.com/signup",
  description:
    "Unify CRM, marketing, AI automation, operations, and business intelligence in one enterprise platform. See why growing teams switch to ZynReach.",
  social: {
    linkedin: "https://www.linkedin.com/company/zynreach",
    x: "https://x.com/zynreach",
    youtube: "https://www.youtube.com/@zynreach",
  },
  contact: {
    email: "info@zynreach.com",
    whatsapp: "+20 150 590 0090",
    phone: "+20 155 553 8858",
    address: "63J Al Ashgar Street, Al Haram, Giza Governorate 12556, Egypt",
    addressParts: {
      street: "63J Al Ashgar Street",
      district: "Al Haram",
      region: "Giza Governorate",
      postalCode: "12556",
      country: "Egypt",
      countryCode: "EG",
    },
    // Verified Google Maps location for ZYNTRA DIGITAL HQ — used as-is for every
    // "clickable address" / "View on Map" / "Get Directions" action so they all
    // resolve to the exact same confirmed place, never an approximate re-geocode.
    mapsUrl:
      "https://www.google.com/maps/dir//ZYNTRA+DIGITAL%D8%8C+63+%D8%AC%D8%8C+%D8%B4%D8%A7%D8%B1%D8%B9+%D8%A7%D9%84%D8%A7%D8%B4%D8%AC%D8%A7%D8%B1,+Al+Haram,+Giza+Governorate+12556%E2%80%AD/@29.9716299,31.1137538,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x14584f51e91884eb:0xcc4f5cede38dff1f!2m2!1d31.1109013!2d29.978765?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D",
    // Coordinates parsed from the verified maps URL's place data (1d=lng, 2d=lat),
    // not re-geocoded — kept in sync with mapsUrl so the embedded map and the
    // clickable address always point to the identical pin.
    geo: { lat: 29.978765, lng: 31.1109013 },
  },
} as const;
