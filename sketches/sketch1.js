// Start coding with P5 here!
// Have a look at the P5 Reference: https://p5js.org/reference/
// Click the P5 button at the top to run your sketch! ⤴
let HSRData;
let characterData = [];
let totalRev = 0;
let maleTotalRev = 0;
let femaleTotalRev = 0;
let sustainRev = 0;
let subDPSRev = 0;
let supportRev = 0;
let DPSRev = 0;

function preload() {
  HSRData = loadJSON(MEDIA_FOLDER + '/hsr.json');
} 

let myFont;
let backgroundImage;

//main pie chart variables
let pieCenter = { x: 400, y: 330 };
let pieRadius = 250;
let pieGrowDelta = 10;

//gender pie chart variables
let genderPieCenter = { x: 145, y: 685 };
let genderPieRadius = 82;

let positionPieCenter = { x: 655, y: 685 };
let positionPieRadius = 82; 

async function setup() {
  createCanvas(800, 800);

  myFont = await loadFont(MEDIA_FOLDER + '/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf');
  backgroundImage = await loadImage(MEDIA_FOLDER + '/HSRDATABackground.png');

  for (let banner of HSRData.banners) {
    if (banner.rerun) {
      continue;
    }
    let character = {};
    character.agent = banner.agents[0];
    character.rev = banner.rev * 0.0063 * 100; //convert from yen to USD
    character.icon = await loadImage(banner.icons[0]);
    character.accent = banner.accent;
    characterData.push(character);
    totalRev += (banner.rev * 0.0063 * 100); //convert from yen to USD
    character.gender = banner.gender; // Add gender property to character object
    if (character.gender === "male") {
      maleTotalRev += banner.rev * 0.0063 * 100;
    } else if (character.gender === "female") {
      femaleTotalRev += banner.rev * 0.0063 * 100;
    }
    character.position = banner.position; // Add position property to character object
    if (character.position === "sustain") {
      sustainRev += banner.rev * 0.0063 * 100;
    } else if (character.position === "sub-DPS") {
      subDPSRev += banner.rev * 0.0063 * 100;
    } else if (character.position === "support") {
      supportRev += banner.rev * 0.0063 * 100;
    } else if (character.position === "DPS") {
      DPSRev += banner.rev * 0.0063 * 100;
    }
  }

  characterData.sort((a, b) => b.rev - a.rev); //sorts the character data by revenue in descending order

}



function draw() {
  background("black");
  image(backgroundImage, 0, 0);

  noStroke();
  textSize(30);
  textFont(myFont);
  text("Honkai Star Rail Character Revenue Chart", 80, 40); 
  textSize(20);
  text("Revenue By Character", 285, 610);
  text("Revenue By Gender", 45, 790);
  text("Revenue By Position", 550, 790);

  //mouse interaction for the main pie chart
  let theta = -PI / 2; // Start from the top
  let mouseTheta = atan2(mouseY - pieCenter.y, mouseX - pieCenter.x);
  if (mouseTheta < -PI / 2) {
    mouseTheta += TWO_PI;
  }
  let mouseDistance = dist(mouseX, mouseY, pieCenter.x, pieCenter.y);
  let mouseIndex = -1;

  for (let character of characterData) {
    if (mouseDistance < pieRadius + pieGrowDelta && mouseTheta >= theta && mouseTheta < theta + (character.rev / totalRev) * TWO_PI) {
      mouseIndex = characterData.indexOf(character);
    }

    theta += (character.rev / totalRev) * TWO_PI;
  }

  //main pie chart for character revenue
  stroke("white");
  strokeWeight(5);
  theta = -PI / 2;
  for (let character of characterData) {
    fill(character.accent);
    let radius = characterData[mouseIndex] === character ? pieRadius + pieGrowDelta : pieRadius;
    arc(pieCenter.x, pieCenter.y, radius * 2, radius * 2, theta, theta + (character.rev / totalRev) * TWO_PI);
    theta += (character.rev / totalRev) * TWO_PI;
  }

  strokeWeight(2);
  theta = -PI / 2; // Reset theta for the second loop
  for (let character of characterData) {
    let radius = characterData[mouseIndex] === character ? pieRadius + pieGrowDelta : pieRadius;
    if (characterData[mouseIndex] === character) {
      strokeWeight(5);
    }
    else {
      strokeWeight(2);
    }
    line(pieCenter.x, pieCenter.y, pieCenter.x + cos(theta) * radius, pieCenter.y + sin(theta) * radius);
    theta += (character.rev / totalRev) * TWO_PI;
    line(pieCenter.x, pieCenter.y, pieCenter.x + cos(theta) * radius, pieCenter.y + sin(theta) * radius);
  }




  //mouse interaction for the second pie chart for gender distribution in revenue
  mouseTheta = atan2(mouseY - genderPieCenter.y, mouseX - genderPieCenter.x);
  if (mouseTheta < -PI / 2) {
    mouseTheta += TWO_PI;
  }
  mouseDistance = dist(mouseX, mouseY, genderPieCenter.x, genderPieCenter.y);
  if (mouseDistance < genderPieRadius + pieGrowDelta) {
    if (mouseTheta >= -PI / 2 && mouseTheta < -PI / 2 + (maleTotalRev / totalRev) * TWO_PI) {
      mouseIndex = -2;
    }
    else {
      mouseIndex = -3;
    }
  }

  //second pie chart for gender distribution in revenue 
  let maleRadius = genderPieRadius + (mouseIndex == -2 ? pieGrowDelta : 0);
  let femaleRadius = genderPieRadius + (mouseIndex == -3 ? pieGrowDelta : 0);

  stroke("white");
  strokeWeight(5);
  fill("steelblue");
  let maleAngle = (maleTotalRev / totalRev) * TWO_PI;
  arc(genderPieCenter.x, genderPieCenter.y, maleRadius * 2, maleRadius * 2, -PI / 2, -PI / 2 + maleAngle);
  fill("pink");
  arc(genderPieCenter.x, genderPieCenter.y, femaleRadius * 2, femaleRadius * 2, -PI / 2 + maleAngle, -PI / 2 + TWO_PI);

  if (mouseIndex >= -1) {
    strokeWeight(2);
  }
  let genderLineRadius = genderPieRadius + (mouseIndex < -1 ? pieGrowDelta : 0);
  line(genderPieCenter.x, genderPieCenter.y, genderPieCenter.x + cos(-PI / 2) * genderLineRadius, genderPieCenter.y + sin(-PI / 2) * genderLineRadius);
  line(genderPieCenter.x, genderPieCenter.y, genderPieCenter.x + cos(-PI / 2 + maleAngle) * genderLineRadius, genderPieCenter.y + sin(-PI / 2 + maleAngle) * genderLineRadius);


  //mouse interaction for the third pie chart for character positions in a team
  mouseTheta = atan2(mouseY - positionPieCenter.y, mouseX - positionPieCenter.x);
  if (mouseTheta < -PI / 2) {
    mouseTheta += TWO_PI;
  }
  mouseDistance = dist(mouseX, mouseY, positionPieCenter.x, positionPieCenter.y);
  if (mouseDistance < positionPieRadius + pieGrowDelta) {
    if (mouseTheta >= -PI / 2 && mouseTheta < -PI / 2 + (DPSRev / totalRev) * TWO_PI) {
      mouseIndex = -4;
    }
    else if (mouseTheta >= -PI / 2 + (DPSRev / totalRev) * TWO_PI && mouseTheta < -PI / 2 + (DPSRev / totalRev) * TWO_PI + (subDPSRev / totalRev) * TWO_PI) {
      mouseIndex = -5;
    }
    else if (mouseTheta >= -PI / 2 + (DPSRev / totalRev) * TWO_PI + (subDPSRev / totalRev) * TWO_PI && mouseTheta < -PI / 2 + (DPSRev / totalRev) * TWO_PI + (subDPSRev / totalRev) * TWO_PI + (supportRev / totalRev) * TWO_PI) {
      mouseIndex = -6;
    }
    else {
      mouseIndex = -7;
    }
  }

  //lets make our third pie chart for characters position in a team (DPS, sub-DPS, support, sustain)
  let DPSRadius = positionPieRadius + (mouseIndex == -4 ? pieGrowDelta : 0);
  let subDPSRadius = positionPieRadius + (mouseIndex == -5 ? pieGrowDelta : 0);
  let supportRadius = positionPieRadius + (mouseIndex == -6 ? pieGrowDelta : 0);
  let sustainRadius = positionPieRadius + (mouseIndex == -7 ? pieGrowDelta : 0);

  stroke("white");
  strokeWeight(5);
  fill("indianred");
  let DPSAngle = (DPSRev / totalRev) * TWO_PI;
  arc(positionPieCenter.x, positionPieCenter.y, DPSRadius * 2, DPSRadius * 2, -PI / 2, -PI / 2 + DPSAngle);
  fill("lightblue");
  let subDPSAngle = (subDPSRev / totalRev) * TWO_PI;
  arc(positionPieCenter.x, positionPieCenter.y, subDPSRadius * 2, subDPSRadius * 2, -PI / 2 + DPSAngle, -PI / 2 + DPSAngle + subDPSAngle);
  fill("lightgreen");
  let supportAngle = (supportRev / totalRev) * TWO_PI;
  arc(positionPieCenter.x, positionPieCenter.y, supportRadius * 2, supportRadius * 2, -PI / 2 + DPSAngle + subDPSAngle, -PI / 2 + DPSAngle + subDPSAngle + supportAngle);
  fill("darkorchid");
  let sustainAngle = (sustainRev / totalRev) * TWO_PI;
  arc(positionPieCenter.x, positionPieCenter.y, sustainRadius * 2, sustainRadius * 2, -PI / 2 + DPSAngle + subDPSAngle + supportAngle, -PI / 2 + TWO_PI);

  strokeWeight(mouseIndex == -4 || mouseIndex == -7 ? 5 : 2);
  let positionLineRadius = positionPieRadius + (mouseIndex == -4 || mouseIndex == -7 ? pieGrowDelta : 0);
  line(positionPieCenter.x, positionPieCenter.y, positionPieCenter.x + cos(-PI / 2) * positionLineRadius, positionPieCenter.y + sin(-PI / 2) * positionLineRadius);
  strokeWeight(mouseIndex == -4 || mouseIndex == -5 ? 5 : 2);
  positionLineRadius = positionPieRadius + (mouseIndex == -4 || mouseIndex == -5 ? pieGrowDelta : 0);
  line(positionPieCenter.x, positionPieCenter.y, positionPieCenter.x + cos(-PI / 2 + DPSAngle) * positionLineRadius, positionPieCenter.y + sin(-PI / 2 + DPSAngle) * positionLineRadius);
  strokeWeight(mouseIndex == -5 || mouseIndex == -6 ? 5 : 2);
  positionLineRadius = positionPieRadius + (mouseIndex == -5 || mouseIndex == -6 ? pieGrowDelta : 0);
  line(positionPieCenter.x, positionPieCenter.y, positionPieCenter.x + cos(-PI / 2 + DPSAngle + subDPSAngle) * positionLineRadius, positionPieCenter.y + sin(-PI / 2 + DPSAngle + subDPSAngle) * positionLineRadius);
  strokeWeight(mouseIndex == -6 || mouseIndex == -7 ? 5 : 2);
  positionLineRadius = positionPieRadius + (mouseIndex == -6 || mouseIndex == -7 ? pieGrowDelta : 0);
  line(positionPieCenter.x, positionPieCenter.y, positionPieCenter.x + cos(-PI / 2 + DPSAngle + subDPSAngle + supportAngle) * positionLineRadius, positionPieCenter.y + sin(-PI / 2 + DPSAngle + subDPSAngle + supportAngle) * positionLineRadius);
  strokeWeight(2);

  //create box for when you hover over a character in the main pie chart to display data about the character
  let boxX = mouseX;
  let boxY = mouseY - 100;
  if (boxX > width - 220) {
    boxX = width - 220;
  }
  if (boxY < 0) {
    boxY = 0;
  }
  if (mouseIndex > -1) {
    drawCharacterData(characterData[mouseIndex], boxX, boxY);

  }
  else if (mouseIndex == -2 || mouseIndex == -3) {
    drawGenderData(mouseIndex == -2, boxX, boxY);
  }

  else if (mouseIndex == -4) {
    drawPositionData("DPS", boxX, boxY);
  }
  else if (mouseIndex == -5) {
    drawPositionData("sub-DPS", boxX, boxY);
  }
  else if (mouseIndex == -6) {
    drawPositionData("support", boxX, boxY);
  }
  else if (mouseIndex == -7) {
    drawPositionData("sustain", boxX, boxY);
  }

}



function drawCharacterData(character, x, y) {
  stroke("black");
  fill("white");
  rect(x, y, 220, 100);
  fill(character.accent);
  rect(x + 10, y + 11, 80, 80);
  noStroke();
  textSize(12);
  textFont(myFont);
  fill(red(character.accent) / 2, green(character.accent) / 2, blue(character.accent) / 2);
  textWrap(WORD);
  text(character.agent, x + 100, y + 20, 100);
  text("Revenue: " + "$" + round(character.rev, 2) + " Mil", x + 100, y + 70, 100);
  image(character.icon, x + 10, y + 10, 80, 80);
}

function drawGenderData(male, x, y) {
  stroke("black");
  fill("white");
  rect(x, y, 180, 100);
  noStroke();
  textSize(15);
  textFont(myFont);
  if (male) {
    fill("steelblue");
    text("Male", x + 70, y + 40);
    text("Revenue: " + "$" + round(maleTotalRev, 2) + " Mil", x + 7, y + 70);
  }
  else {
    fill("pink");
    text("Female", x + 60, y + 40);
    text("Revenue: " + "$" + round(femaleTotalRev, 2) + " Mil", x + 7, y + 70);
  }
}

function drawPositionData(position, x, y) {
  stroke("black");
  fill("white");
  rect(x, y, 180, 100);
  noStroke();
  textSize(15);
  textFont(myFont);

  if (position == "DPS") {
    fill("indianred");
    text("DPS", x + 70, y + 40);
    text("Revenue: " + "$" + round(DPSRev, 2) + " Mil", x + 6, y + 70);
  }
  else if (position == "sub-DPS") {
    fill("lightblue");
    text("Sub-DPS", x + 55, y + 40);
    text("Revenue: " + "$" + round(subDPSRev, 2) + " Mil", x + 10, y + 70);
  }
  else if (position == "support") {
    fill("lightgreen");
    text("Support", x + 55, y + 40);
    text("Revenue: " + "$" + round(supportRev, 2) + " Mil", x + 8, y + 70);
  }
  else {
    fill("darkorchid");
    text("Sustain", x + 60, y + 40);
    text("Revenue: " + "$" + round(sustainRev, 2) + " Mil", x + 17, y + 70);
  }
}
