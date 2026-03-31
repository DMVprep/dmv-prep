const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const UPDATES = {
  // ALCOHOL - use existing sign
  "The Legal BAC Limit for Adults Is 0.08%": "/signs/no-symbol.png",
  "BAC 0.08% = Illegal for Adults": "/signs/no-symbol.png",
  
  // RIGHT OF WAY
  "Turning Left: Always Yield to Oncoming Traffic": "/signs/yield.png",
  "Roundabout: Yield Before Entering": "/handbook-illustrations/roundabouts.png",
  "Emergency Vehicles: Pull Over and Stop": "/signs/emergency-vehicle.png",
  "Merging: Highway Traffic Has Priority": "/signs/merging-traffic.png",
  "School Bus: Stop When Red Lights Flash": "/handbook-illustrations/school-bus-two-lanes.png",
  "Pedestrians Have the Right of Way": "/signs/pedestrian-crossing.png",
  "Florida Roundabout: Yield to Traffic Already Inside": "/handbook-illustrations/roundabouts.png",
  "4-Way Stop: Who Goes First?": "/signs/all-way-stop.png",
  "Four-Way Stop: First to Arrive Goes First": "/signs/all-way-stop.png",
  "Texas 4-Way Stop: First to Stop, First to Go": "/signs/all-way-stop.png",
  "Cyclists Have Full Lane Rights": "/handbook-illustrations/bicycle-lane.png",
  
  // SAFE DRIVING
  "Hydroplaning: Slow Down on Wet Roads": "/signs/slippery-surface.png",
  "Hydroplaning: What to Do": "/signs/slippery-surface.png",
  "Always Check Blind Spots Before Changing Lanes": "/handbook-illustrations/blind-spots.png",
  "Distracted Driving Kills": "/signs/no-symbol.png",
  "Skid Recovery: Steer Where You Want to Go": "/signs/slippery-surface.png",
  "Move Over Law: Give Space to Stopped Vehicles": "/signs/emergency-vehicle.png",
  "Florida Following Distance Is 4 Seconds Minimum": "/handbook-illustrations/following-distance-trucks.png",
  "California Following Distance Is 3 Seconds Minimum": "/handbook-illustrations/following-distance-trucks.png",
  "Maintain at Least 3 Seconds of Following Distance": "/handbook-illustrations/following-distance-trucks.png",
  "Texas Uses the 2-Second Following Distance Rule": "/handbook-illustrations/following-distance-trucks.png",
  
  // SPEED LIMITS
  "School Zones Have Reduced Speed Limits": "/signs/school-zone.png",
  "Florida School Zone Speed Limit Is 20 mph": "/signs/school-speed-limit.png",
  "California School Zone Speed Limit Is 25 mph": "/signs/school-speed-limit.png",
  "Pennsylvania School Zone Speed Limit Is 15 mph": "/signs/school-speed-limit.png",
  "Illinois School Zone Is 20 mph on School Days": "/signs/school-speed-limit.png",
  "Fines Are Doubled in Work and School Zones": "/signs/work-zone.png",
  "Basic Speed Law: Safe for Conditions": "/signs/speed-limit.png",
  "Driving Too Slowly Is Also Illegal": "/signs/speed-limit.png",
  "Florida Freeway Speed Limit Is 70 mph": "/signs/speed-limit.png",
  "California Maximum Freeway Speed Is 65 mph": "/signs/speed-limit.png",
  "Texas Urban Speed Limit Is 30 mph": "/signs/speed-limit.png",
  "New York City Default Speed Limit Is 25 mph": "/signs/speed-limit.png",

  // LICENSING
  "Child Safety Seats Save Lives": "/signs/school-bus-stop.png",
  "Hit and Run: You Must Stop": "/signs/stop.png",
};

async function main() {
  let updated = 0;
  for (const [title, imageUrl] of Object.entries(UPDATES)) {
    const result = await prisma.microLesson.updateMany({
      where: { title, imageUrl: null },
      data: { imageUrl },
    });
    if (result.count > 0) { updated++; }
  }
  
  const withImages = await prisma.microLesson.count({ where: { imageUrl: { not: null } } });
  const noImages = await prisma.microLesson.count({ where: { imageUrl: null } });
  console.log("Updated " + updated + " lessons with images");
  console.log("With images: " + withImages + ", Without: " + noImages);
}

main().then(() => prisma.$disconnect());
