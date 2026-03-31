import jsPDF from "jspdf";
import { DietPlan, DayPlan, UserProfile } from "@/types/diet";

export const downloadDietPDF = (plan: DietPlan, days: DayPlan[], profile: UserProfile) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = 0;

  const colors = {
    primary: [99, 102, 241] as [number, number, number],       // indigo
    primaryLight: [129, 140, 248] as [number, number, number],
    accent: [16, 185, 129] as [number, number, number],         // emerald
    bg: [15, 15, 25] as [number, number, number],
    cardBg: [25, 25, 40] as [number, number, number],
    text: [255, 255, 255] as [number, number, number],
    textMuted: [156, 163, 175] as [number, number, number],
    border: [55, 55, 80] as [number, number, number],
  };

  const drawPageBg = () => {
    doc.setFillColor(...colors.bg);
    doc.rect(0, 0, W, H, "F");
    // Decorative circles
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setGState(doc.GState({ opacity: 0.04 }));
    doc.circle(W * 0.85, 40, 60, "F");
    doc.circle(W * 0.1, H * 0.7, 45, "F");
    doc.setGState(doc.GState({ opacity: 1 }));
  };

  const checkPage = (needed: number) => {
    if (y + needed > H - 20) {
      doc.addPage();
      drawPageBg();
      y = margin;
    }
  };

  const drawRoundedRect = (x: number, yPos: number, w: number, h: number, r: number, fill: [number, number, number]) => {
    doc.setFillColor(...fill);
    doc.roundedRect(x, yPos, w, h, r, r, "F");
  };

  // ---- COVER PAGE ----
  drawPageBg();

  // Hero gradient bar
  doc.setFillColor(...colors.primary);
  doc.setGState(doc.GState({ opacity: 0.15 }));
  doc.rect(0, 0, W, 90, "F");
  doc.setGState(doc.GState({ opacity: 1 }));

  // Logo & Title
  y = 35;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(...colors.text);
  doc.text("EVOBITE", W / 2, y, { align: "center" });

  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(...colors.primaryLight);
  doc.text("Eat Smart. Evolve Daily.", W / 2, y, { align: "center" });

  // Divider line
  y += 12;
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.5);
  doc.line(W * 0.3, y, W * 0.7, y);

  // User info card
  y += 12;
  drawRoundedRect(margin, y, W - margin * 2, 44, 4, colors.cardBg);
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, W - margin * 2, 44, 4, 4, "S");

  const infoY = y + 10;
  doc.setFontSize(9);
  doc.setTextColor(...colors.textMuted);
  doc.text("YOUR PROFILE", margin + 8, infoY);

  doc.setFontSize(10);
  doc.setTextColor(...colors.text);
  const col1 = margin + 8;
  const col2 = W / 2 + 4;

  doc.text(`Age: ${profile.age} yrs`, col1, infoY + 8);
  doc.text(`Height: ${profile.height} cm`, col1, infoY + 15);
  doc.text(`Weight: ${profile.weight} kg`, col1, infoY + 22);
  doc.text(`Gender: ${profile.gender}`, col1, infoY + 29);

  doc.text(`Activity: ${profile.activityLevel.replace("_", " ")}`, col2, infoY + 8);
  doc.text(`Goal: ${profile.goal.replace("_", " ")}`, col2, infoY + 15);
  doc.text(`Diet: ${profile.dietType.replace("_", "-")}`, col2, infoY + 22);
  doc.text(`Duration: ${profile.duration} days`, col2, infoY + 29);

  // Stats cards row
  y += 56;
  const statsW = (W - margin * 2 - 12) / 4;
  const stats = [
    { label: "Daily Cal", value: `${plan.dailyCalories}` },
    { label: "BMR", value: `${plan.bmr}` },
    { label: "TDEE", value: `${plan.tdee}` },
    { label: "Diet Score", value: `${plan.dietScore}/100` },
  ];

  stats.forEach((s, i) => {
    const sx = margin + i * (statsW + 4);
    drawRoundedRect(sx, y, statsW, 28, 3, colors.cardBg);
    doc.setDrawColor(...colors.border);
    doc.roundedRect(sx, y, statsW, 28, 3, 3, "S");

    doc.setFontSize(15);
    doc.setTextColor(...colors.primaryLight);
    doc.setFont("helvetica", "bold");
    doc.text(s.value, sx + statsW / 2, y + 13, { align: "center" });

    doc.setFontSize(7);
    doc.setTextColor(...colors.textMuted);
    doc.setFont("helvetica", "normal");
    doc.text(s.label, sx + statsW / 2, y + 21, { align: "center" });
  });

  // Macro section
  y += 38;
  drawRoundedRect(margin, y, W - margin * 2, 28, 3, colors.cardBg);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(margin, y, W - margin * 2, 28, 3, 3, "S");

  const macros = [
    { label: "Protein", value: `${plan.proteinGrams}g`, color: colors.accent },
    { label: "Carbs", value: `${plan.carbsGrams}g`, color: colors.primaryLight },
    { label: "Fats", value: `${plan.fatsGrams}g`, color: [244, 114, 182] as [number, number, number] },
  ];

  const macroW = (W - margin * 2) / 3;
  macros.forEach((m, i) => {
    const mx = margin + i * macroW + macroW / 2;
    doc.setFontSize(14);
    doc.setTextColor(...m.color);
    doc.setFont("helvetica", "bold");
    doc.text(m.value, mx, y + 12, { align: "center" });
    doc.setFontSize(8);
    doc.setTextColor(...colors.textMuted);
    doc.setFont("helvetica", "normal");
    doc.text(m.label, mx, y + 20, { align: "center" });
  });

  // ---- MEAL PLAN PAGES ----
  days.forEach((day) => {
    doc.addPage();
    drawPageBg();
    y = margin;

    // Day header
    drawRoundedRect(margin, y, W - margin * 2, 16, 3, colors.primary);
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(`Day ${day.day}`, margin + 8, y + 10.5);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`${day.totalCalories} kcal`, W - margin - 8, y + 10.5, { align: "right" });

    y += 22;

    day.meals.forEach((meal) => {
      const ingredientLines = doc.splitTextToSize(`Ingredients: ${meal.ingredients.join(", ")}`, W - margin * 2 - 20);
      const cardH = 36 + ingredientLines.length * 4;
      checkPage(cardH + 4);

      drawRoundedRect(margin, y, W - margin * 2, cardH, 3, colors.cardBg);
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, y, W - margin * 2, cardH, 3, 3, "S");

      // Meal type badge
      const typeColors: Record<string, [number, number, number]> = {
        breakfast: [251, 191, 36],
        lunch: [52, 211, 153],
        dinner: [129, 140, 248],
        snack: [244, 114, 182],
      };
      const tc = typeColors[meal.type] || colors.primaryLight;
      doc.setFillColor(...tc);
      doc.setGState(doc.GState({ opacity: 0.15 }));
      const badgeText = meal.type.toUpperCase();
      const badgeW = doc.getStringUnitWidth(badgeText) * 6 * 0.352778 + 6;
      doc.roundedRect(margin + 6, y + 5, badgeW, 7, 2, 2, "F");
      doc.setGState(doc.GState({ opacity: 1 }));

      doc.setFontSize(6);
      doc.setTextColor(...tc);
      doc.setFont("helvetica", "bold");
      doc.text(badgeText, margin + 6 + badgeW / 2, y + 9.8, { align: "center" });

      // Calories
      doc.setFontSize(9);
      doc.setTextColor(...colors.primaryLight);
      doc.text(`${meal.calories} cal`, W - margin - 8, y + 10, { align: "right" });

      // Meal name
      doc.setFontSize(11);
      doc.setTextColor(...colors.text);
      doc.setFont("helvetica", "bold");
      doc.text(meal.name, margin + 8, y + 19);

      // Description
      doc.setFontSize(8);
      doc.setTextColor(...colors.textMuted);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(meal.description, W - margin * 2 - 16);
      doc.text(descLines.slice(0, 2), margin + 8, y + 25);

      // Ingredients
      doc.setFontSize(7);
      doc.setTextColor(...colors.textMuted);
      doc.text(ingredientLines, margin + 8, y + 32);

      // Vegan/Veg badge
      if (meal.isVegan) {
        doc.setFontSize(6);
        doc.setTextColor(...colors.accent);
        doc.text("VEGAN", W - margin - 8, y + 19, { align: "right" });
      } else if (meal.isVeg) {
        doc.setFontSize(6);
        doc.setTextColor(...colors.accent);
        doc.text("VEG", W - margin - 8, y + 19, { align: "right" });
      }

      y += cardH + 4;
    });
  });

  // Footer on last page
  y = H - 14;
  doc.setFontSize(7);
  doc.setTextColor(...colors.textMuted);
  doc.text("Generated by Evobite — Eat Smart. Evolve Daily.", W / 2, y, { align: "center" });

  doc.save("evobite-diet-plan.pdf");
};
