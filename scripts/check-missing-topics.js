const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const seatbelt = await prisma.question.count({
    where: { text: { contains: "seatbelt", mode: "insensitive" } }
  });
  const seatBelt2 = await prisma.question.count({
    where: { text: { contains: "seat belt", mode: "insensitive" } }
  });
  const childSeat = await prisma.question.count({
    where: { text: { contains: "child seat", mode: "insensitive" } }
  });
  const carSeat = await prisma.question.count({
    where: { text: { contains: "car seat", mode: "insensitive" } }
  });
  const insurance = await prisma.question.count({
    where: { text: { contains: "insurance", mode: "insensitive" } }
  });
  const stoppingDistance = await prisma.question.count({
    where: { text: { contains: "stopping distance", mode: "insensitive" } }
  });
  const reactionTime = await prisma.question.count({
    where: { text: { contains: "reaction time", mode: "insensitive" } }
  });
  const brakingDistance = await prisma.question.count({
    where: { text: { contains: "braking distance", mode: "insensitive" } }
  });

  console.log("=== Missing topic coverage ===");
  console.log("Seatbelt: " + seatbelt);
  console.log("Seat belt: " + seatBelt2);
  console.log("Child seat: " + childSeat);
  console.log("Car seat: " + carSeat);
  console.log("Insurance: " + insurance);
  console.log("Stopping distance: " + stoppingDistance);
  console.log("Reaction time: " + reactionTime);
  console.log("Braking distance: " + brakingDistance);
}

main().then(() => prisma.$disconnect());
