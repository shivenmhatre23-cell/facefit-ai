'use client';

import { StyleProfile, StyleDnaProfile } from '../types';
import { getSavedQuizAnswers } from '../styleQuiz/quizStore';
import { getUserPreferences } from '../recommendations/preferencesStore';

/**
 * Computes an individualized Style DNA Profile.
 * IMPORTANT: This represents aesthetic affinities and optical balance principles.
 * It is STRICTLY non-judgmental and NEVER scores attractiveness or physical beauty.
 */
export function computeStyleDna(profile?: StyleProfile): StyleDnaProfile {
  const quiz = getSavedQuizAnswers();
  const prefs = getUserPreferences();

  // Baseline affinities based on stated style preference
  let minimalScore = 78;
  let smartCasualScore = 74;
  let streetwearScore = 52;
  let classicScore = 65;
  let traditionalScore = 40;

  if (quiz.preferredStyle === 'Minimal') {
    minimalScore = 88;
    smartCasualScore = 75;
    classicScore = 70;
  } else if (quiz.preferredStyle === 'Smart Casual') {
    smartCasualScore = 89;
    minimalScore = 82;
    classicScore = 68;
  } else if (quiz.preferredStyle === 'Streetwear') {
    streetwearScore = 86;
    smartCasualScore = 65;
    minimalScore = 60;
  } else if (quiz.preferredStyle === 'Classic') {
    classicScore = 88;
    smartCasualScore = 80;
    minimalScore = 75;
  } else if (quiz.preferredStyle === 'Traditional/Fusion') {
    traditionalScore = 85;
    smartCasualScore = 78;
  }

  // Adjust for occasion preferences
  if (quiz.primaryOccasions.includes('College') || quiz.primaryOccasions.includes('Everyday')) {
    smartCasualScore = Math.min(95, smartCasualScore + 4);
    streetwearScore = Math.min(90, streetwearScore + 5);
  }
  if (quiz.primaryOccasions.includes('Interview') || quiz.primaryOccasions.includes('Presentation')) {
    classicScore = Math.min(95, classicScore + 6);
    minimalScore = Math.min(95, minimalScore + 4);
  }

  const faceShape = profile?.faceGeometry?.shape || 'Oval';
  const paletteName = profile?.colorPalette?.seasonName || 'Warm Autumn';
  const preferredColors = quiz.preferredColors.length > 0
    ? quiz.preferredColors
    : (profile?.colorPalette?.colorsToWear?.slice(0, 4) || ['Navy', 'Espresso', 'Olive', 'Warm Sand']);

  const signatureStyle = quiz.preferredStyle || 'Clean Minimal Smart Casual';

  const recommendedFits = [
    'Drop-shoulder boxy tees with thick collar bands',
    'Straight-leg cotton trousers with gentle ankle break',
    'Camp-collar open overshirts to frame the jawline',
    'Structured minimalist knit polos for presentations',
  ];

  const styleKeywords = [
    'Proportion Balanced',
    'Subtle Color Contrast',
    'Effortless Structure',
    'Collegiate Contemporary',
    'Clean Lines',
  ];

  const statement = `Your visual identity centers on ${signatureStyle.toLowerCase()} foundations. We balance clean vertical silhouettes with rich ${paletteName.toLowerCase()} hues to harmonize effortlessly with your natural features.`;

  return {
    breakdown: {
      minimal: minimalScore,
      smartCasual: smartCasualScore,
      streetwear: streetwearScore,
      classic: classicScore,
      traditionalFusion: traditionalScore,
    },
    signatureStyle,
    preferredColors,
    recommendedFits,
    preferredHairMaintenance: quiz.hairStylingTime || '5 minutes daily',
    commonOccasions: quiz.primaryOccasions || ['College', 'Social', 'Everyday'],
    styleKeywords,
    statement,
  };
}
