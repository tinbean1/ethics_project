/**
 * Real data brokers documented by the Electronic Frontier Foundation (EFF)
 * and referenced in Federal Trade Commission (FTC) reports.
 * Opt-out URLs are the official self-service removal pages as of 2024.
 */
export const BROKERS = [
  { id: 1,  name: "Acxiom",             category: "Behavioral", optOut: "https://isapps.acxiom.com/optout/optout.aspx" },
  { id: 2,  name: "LexisNexis",         category: "Identity",   optOut: "https://optout.lexisnexis.com" },
  { id: 3,  name: "Spokeo",             category: "Identity",   optOut: "https://www.spokeo.com/optout" },
  { id: 4,  name: "WhitePages",         category: "Identity",   optOut: "https://www.whitepages.com/suppression-requests" },
  { id: 5,  name: "BeenVerified",       category: "Identity",   optOut: "https://www.beenverified.com/app/optout/search" },
  { id: 6,  name: "Intelius",           category: "Identity",   optOut: "https://intelius.com/opt-out" },
  { id: 7,  name: "PeopleFinder",       category: "Identity",   optOut: "https://www.peoplefinders.com/opt-out" },
  { id: 8,  name: "MyLife",             category: "Identity",   optOut: "https://www.mylife.com/privacy/remove-my-information.pubview" },
  { id: 9,  name: "Radaris",            category: "Identity",   optOut: "https://radaris.com/page/how-to-remove" },
  { id: 10, name: "TruthFinder",        category: "Identity",   optOut: "https://www.truthfinder.com/opt-out/" },
  { id: 11, name: "Epsilon",            category: "Behavioral", optOut: "https://us.epsilon.com/privacy/email-opt-out" },
  { id: 12, name: "Oracle Data Cloud",  category: "Behavioral", optOut: "https://datacloudoptout.oracle.com/optout" },
  { id: 13, name: "Equifax",            category: "Financial",  optOut: "https://www.equifax.com/personal/privacy/" },
  { id: 14, name: "Experian",           category: "Financial",  optOut: "https://www.experian.com/privacy/center.html" },
  { id: 15, name: "TransUnion",         category: "Financial",  optOut: "https://www.transunion.com/consumer-privacy" },
  { id: 16, name: "Nielsen",            category: "Behavioral", optOut: "https://www.nielsen.com/us/en/legal/privacy-statement/exiting-nielsen-measurement/" },
  { id: 17, name: "Comscore",           category: "Behavioral", optOut: "https://www.comscore.com/About-comScore/Privacy-Policy" },
  { id: 18, name: "LiveRamp",           category: "Behavioral", optOut: "https://liveramp.com/opt_out/" },
  { id: 19, name: "Neustar",            category: "Identity",   optOut: "https://www.home.neustar/privacy" },
  { id: 20, name: "Verisk",             category: "Financial",  optOut: "https://www.verisk.com/privacy-commitment/" },
  { id: 21, name: "CoreLogic",          category: "Financial",  optOut: "https://www.corelogic.com/privacy-center/" },
  { id: 22, name: "Dun & Bradstreet",   category: "Financial",  optOut: "https://www.dnb.com/utility-pages/ccpa.html" },
  { id: 23, name: "ZoomInfo",           category: "Identity",   optOut: "https://www.zoominfo.com/about/privacy/data-deletion" },
  { id: 24, name: "Clearbit",           category: "Behavioral", optOut: "https://clearbit.com/privacy" },
  { id: 25, name: "FullContact",        category: "Identity",   optOut: "https://www.fullcontact.com/privacy/privacy-options/" },
  { id: 26, name: "Kochava",            category: "Location",   optOut: "https://kochchoices.com/" },
  { id: 27, name: "AppsFlyer",          category: "Behavioral", optOut: "https://www.appsflyer.com/legal/services-privacy-policy/" },
  { id: 28, name: "Segment",            category: "Behavioral", optOut: "https://www.twilio.com/en-us/legal/privacy" },
  { id: 29, name: "mParticle",          category: "Behavioral", optOut: "https://www.mparticle.com/privacypolicy" },
  { id: 30, name: "Klaviyo",            category: "Purchase",   optOut: "https://www.klaviyo.com/legal/privacy-notice" },
  { id: 31, name: "Lotame",             category: "Behavioral", optOut: "https://www.lotame.com/about-lotame/privacy/lotames-products-technologies-privacy-policy/opt-out/" },
  { id: 32, name: "Tapad",              category: "Behavioral", optOut: "https://www.tapad.com/privacy" },
  { id: 33, name: "Datalogix",          category: "Purchase",   optOut: "https://datacloudoptout.oracle.com/optout" },
  { id: 34, name: "Sift",              category: "Behavioral", optOut: "https://sift.com/legal/privacy-policy" },
  { id: 35, name: "Rockerbox",          category: "Purchase",   optOut: "https://www.rockerbox.com/legal/privacy" },
  { id: 36, name: "Harte-Hanks",        category: "Purchase",   optOut: "https://www.hartehanks.com/privacy-policy/" },
  { id: 37, name: "Merkle",             category: "Behavioral", optOut: "https://www.merkleinc.com/privacy-policy" },
  { id: 38, name: "InstantCheckmate",   category: "Identity",   optOut: "https://www.instantcheckmate.com/opt-out/" },
  { id: 39, name: "PeopleSmart",        category: "Identity",   optOut: "https://www.peoplesmart.com/opt-out-request" },
  { id: 40, name: "Spokeo (Profile)",   category: "Identity",   optOut: "https://www.spokeo.com/optout" }
];

// Which data classes from a breach map to which broker categories,
// used to highlight "at risk" brokers based on breach results
export const DATA_CLASS_TO_CATEGORY = {
  "Email addresses": ["Behavioral", "Identity"],
  "Phone numbers":   ["Identity"],
  "Names":           ["Identity"],
  "Physical addresses": ["Location", "Identity"],
  "Geographic locations": ["Location"],
  "Financial data":  ["Financial"],
  "Credit cards":    ["Financial"],
  "Bank account numbers": ["Financial"],
  "Purchase history": ["Purchase"],
  "Purchases":       ["Purchase"],
  "Passwords":       ["Identity"],
  "Usernames":       ["Identity"],
  "IP addresses":    ["Behavioral", "Location"],
  "Device information": ["Behavioral"],
  "Browsing histories": ["Behavioral"],
  "Social connections": ["Behavioral"]
};
