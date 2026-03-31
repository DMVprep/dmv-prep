const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function count(keyword) {
  return await prisma.question.count({
    where: { text: { contains: keyword, mode: "insensitive" } }
  });
}

async function main() {
  const topics = [
    // ROAD SIGNS & SIGNALS
    ["Road signs (general)", "sign"],
    ["Stop sign", "stop sign"],
    ["Yield sign", "yield sign"],
    ["Speed limit sign", "speed limit sign"],
    ["Warning signs", "warning sign"],
    ["Regulatory signs", "regulatory sign"],
    ["Construction/work zone signs", "work zone"],
    ["Guide signs (green/blue/brown)", "guide sign"],
    ["Pavement markings", "pavement marking"],
    ["Traffic signals/lights", "traffic signal"],
    ["Flashing lights", "flashing light"],
    ["Lane markings", "lane marking"],
    ["Railroad crossing", "railroad crossing"],
    
    // RIGHT OF WAY
    ["Right of way (general)", "right of way"],
    ["Four-way stop", "four-way stop"],
    ["Uncontrolled intersection", "uncontrolled intersection"],
    ["Pedestrian right of way", "pedestrian"],
    ["Emergency vehicles", "emergency vehicle"],
    ["Roundabout/traffic circle", "roundabout"],
    ["Funeral procession", "funeral"],
    
    // SPEED & DISTANCE
    ["Speed limits (general)", "speed limit"],
    ["School zone speed", "school zone"],
    ["Following distance", "following distance"],
    ["Stopping distance", "stopping distance"],
    ["Reaction time", "reaction time"],
    ["Braking distance", "braking distance"],
    
    // SAFE DRIVING
    ["Lane changing", "lane chang"],
    ["Passing/overtaking", "passing"],
    ["Merging", "merging"],
    ["Blind spots", "blind spot"],
    ["Mirrors", "mirror"],
    ["Turn signals/signaling", "signal"],
    ["U-turns", "u-turn"],
    ["Parking (general)", "parking"],
    ["Parallel parking", "parallel park"],
    ["Hill parking", "parking uphill"],
    ["Night driving", "night driving"],
    ["Fog driving", "fog"],
    ["Rain/wet roads", "rain"],
    ["Snow/ice driving", "snow"],
    ["Hydroplaning", "hydroplan"],
    ["Skidding", "skid"],
    ["Defensive driving", "defensive driv"],
    ["Tailgating", "tailgat"],
    ["Road rage", "road rage"],
    ["Distracted driving", "distracted driv"],
    
    // ALCOHOL & DRUGS
    ["BAC limit", "BAC"],
    ["DUI/DWI", "DUI"],
    ["Implied consent", "implied consent"],
    ["Zero tolerance (under 21)", "zero tolerance"],
    ["Drug impairment", "drug"],
    
    // SAFETY EQUIPMENT & LAWS
    ["Seatbelt/seat belt", "seat belt"],
    ["Child seat/car seat", "child seat"],
    ["Child restraint", "child restraint"],
    ["Booster seat", "booster seat"],
    ["Airbags", "airbag"],
    ["Headlights", "headlight"],
    ["Horn use", "horn"],
    ["Windshield wipers", "windshield wiper"],
    
    // INSURANCE & LEGAL
    ["Insurance", "insurance"],
    ["Financial responsibility", "financial responsibility"],
    ["Registration", "registration"],
    ["Point system", "point system"],
    ["License suspension", "license suspension"],
    ["License revocation", "license revoc"],
    ["Fines/penalties", "fine"],
    ["Hit and run", "hit and run"],
    ["Accident/crash reporting", "accident"],
    
    // SHARING THE ROAD
    ["Motorcycles", "motorcycle"],
    ["Bicycles", "bicycle"],
    ["Large trucks/commercial", "truck"],
    ["School buses", "school bus"],
    ["Pedestrians (crosswalk)", "crosswalk"],
    ["Animals on road", "animal"],
    
    // SPECIAL SITUATIONS
    ["Freeway/highway driving", "freeway"],
    ["Interstate driving", "interstate"],
    ["Expressway entering/exiting", "expressway"],
    ["Construction zones", "construction zone"],
    ["Railroad crossings", "railroad"],
    ["Bridges/tunnels", "bridge"],
    ["Mountain driving", "mountain"],
    
    // VEHICLE & EQUIPMENT
    ["Tire blowout", "tire blowout"],
    ["Brake failure", "brake fail"],
    ["Towing", "towing"],
    ["Vehicle inspection", "vehicle inspection"],
    ["Emissions", "emission"],
    
    // LICENSING
    ["Learner permit", "learner"],
    ["Graduated license", "graduated"],
    ["License renewal", "renewal"],
    ["Organ donor", "organ donor"],
    ["REAL ID", "real id"],
  ];

  console.log("=== COMPREHENSIVE TOPIC AUDIT ===\n");
  console.log("Topic | Count | Status");
  console.log("-".repeat(60));
  
  for (const [name, keyword] of topics) {
    const c = await count(keyword);
    let status = "";
    if (c === 0) status = "MISSING";
    else if (c < 10) status = "LOW";
    else if (c < 50) status = "OK";
    else status = "GOOD";
    
    const pad = " ".repeat(Math.max(0, 40 - name.length));
    console.log(name + pad + c.toString().padStart(5) + "  " + status);
  }
}

main().then(() => prisma.$disconnect());
