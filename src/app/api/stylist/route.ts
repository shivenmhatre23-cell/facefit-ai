import { NextRequest, NextResponse } from 'next/server';
import { geminiClient, hasValidGeminiKey } from '@/lib/gemini';
import { buildStylistSystemPrompt } from '@/lib/prompts';
import { StyleProfile, ChatMessage } from '@/lib/types';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, messages, userMessage } = body as {
      profile: StyleProfile;
      messages: ChatMessage[];
      userMessage: string;
    };

    if (!userMessage && (!messages || messages.length === 0)) {
      return NextResponse.json({ error: 'User message is required.' }, { status: 400 });
    }

    const currentPrompt = userMessage || messages[messages.length - 1].content;
    const systemInstruction = profile ? buildStylistSystemPrompt(profile) : 'You are FaceFit AI Stylist.';

    // If Gemini key is available, use streaming API
    if (geminiClient && hasValidGeminiKey) {
      // Build conversation history for Gemini
      const conversationHistory = (messages || [])
        .slice(-6) // keep recent context
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

      // Append current message if not already included
      if (!messages || messages[messages.length - 1]?.content !== currentPrompt) {
        conversationHistory.push({
          role: 'user',
          parts: [{ text: currentPrompt }],
        });
      }

      const streamResponse = await geminiClient.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: conversationHistory,
        config: {
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          temperature: 0.7,
        },
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamResponse) {
              const text = chunk.text;
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    }

    // Fallback contextual response engine for mock / offline mode
    const mockReply = generateOfflineStylistReply(currentPrompt, profile);
    return new Response(mockReply, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown internal error';
    console.error('[API /api/stylist] Handler error:', message);
    return NextResponse.json(
      { error: 'Failed to generate stylist response: ' + message },
      { status: 500 }
    );
  }
}

/**
 * High-quality contextual fallback responses matching user queries
 */
function generateOfflineStylistReply(prompt: string, profile: StyleProfile): string {
  const query = prompt.toLowerCase();
  const faceShape = profile?.faceGeometry?.shape || 'Oval';
  const palette = profile?.colorPalette?.seasonName || 'Warm Autumn';
  const topColors = profile?.colorPalette?.colorsToWear?.slice(0, 3).join(', ') || 'Olive, Terracotta, and Espresso';

  if (query.includes('3000') || query.includes('budget') || query.includes('cheap') || query.includes('affordable')) {
    return `### 💡 Curated Campus Outfit under ₹3,000

Based on your **${faceShape}** facial structure and **${palette}** palette, here is a high-impact, budget-optimized combination:

1. **Top**: Relaxed Heavyweight Boxy Cotton Tee in **Oatmeal or Washed Olive** (~₹699)
   * *Fit Tip:* Choose a drop-shoulder cut with a thick ribbed collar band. This frames your neck cleanly and grounds the upper torso.
2. **Bottom**: Straight-Leg Cotton Chinos or Relaxed Indigo Denim (~₹1,299)
   * *Fit Tip:* Wear with a clean single cuff. Avoid skin-tight skinny cuts; straight silhouettes offer superior proportion balance.
3. **Layer**: Lightweight Unbuttoned Cotton Overshirt in **Deep Espresso or Slate** (~₹899)
   * *Styling Tip:* Keep it open to create clean vertical slimming lines that complement your face symmetry.

**Estimated Total**: ~₹2,897  
*Stylist Note:* Pair this with clean white or chalk sneakers and a minimalist canvas or leather watch for an elevated, effortless collegiate vibe!`;
  }

  if (query.includes('college') || query.includes('tomorrow') || query.includes('casual')) {
    return `### 🎓 Tomorrow's College Style Recommendation

For a confident, laid-back campus aesthetic:

* **The Core Look:** A **Camp-Collar Textured Linen/Cotton Shirt** in **${topColors}** worn over an off-white tank or tee, paired with relaxed pleated charcoal trousers.
* **Why it works with your features:** The open camp-collar elongates the neckline while balancing your **${faceShape}** jawline.
* **Footwear & Accessories:** Minimal retro gum-sole trainers and a subtle 2mm silver box chain.
* **Grooming touch:** Add 2 sprays of a warm woody/citrus fragrance on pulse points before heading out.`;
  }

  if (query.includes('hair') || query.includes('barber') || query.includes('cut')) {
    const topHair = profile?.hairstyles?.[0];
    return `### ✂️ Low-Maintenance Hairstyle Guide: ${topHair?.name || 'Textured Crop'}

* **Why it suits your ${faceShape} face:** ${topHair?.whyItWorks || 'Creates vertical balance and sharpens jawline profile without adding excessive roundness.'}
* **Maintenance Level:** ${topHair?.maintenanceLevel || 'Low'} (Daily styling: ~${topHair?.stylingEffortMinutes || 4} mins).
* **Exact Barber Instructions to show:**
  * **Sides & Back:** ${topHair?.barberInstructions?.sidesAndBack || 'Low taper fade starting from #0.5 guard, blending into #2.'}
  * **Top Length:** ${topHair?.barberInstructions?.topLength || '2 to 2.5 inches, textured point-cut.'}
  * **Finish:** Matte finish with natural forward texture.
* **Recommended Product:** Use a nickel-sized amount of **Matte Styling Clay** worked into slightly damp or towel-dried hair.`;
  }

  if (query.includes('color') || query.includes('palette') || query.includes('shade')) {
    return `### 🎨 Your Optimal Color Direction

Your undertones align with the **${palette}** family:

* **Power Colors to Wear:** **${profile?.colorPalette?.colorsToWear?.join(', ') || 'Terracotta, Olive Forest, Warm Sand, Espresso'}**
* **Accent Metals:** ${profile?.colorPalette?.metalsRecommended?.join(', ') || 'Brushed Antique Brass, Warm Silver'}
* **Tones to Sidestep:** ${profile?.colorPalette?.colorsToAvoid?.join(', ') || 'Harsh Neon Green, Icy Blue'}

*Pro-Stylist Tip:* Wear your deepest neutrals (like Espresso or Charcoal) for jackets and outerwear, and use warm accents (like Terracotta or Amber) closer to your face to bring out natural warmth.`;
  }

  if (query.includes('presentation') || query.includes('formal') || query.includes('interview')) {
    return `### 👔 Campus Presentation & Placement Ready Look

When presenting, authority and comfort must work hand-in-hand:

1. **Top:** Crisp Cream or French Slate Knit Polo with a structured ribbed collar. (Avoid flimsy tees or overly stiff boardroom dress shirts).
2. **Trousers:** Tailored single-pleat ankle trousers in Dark Mocha or Deep Slate.
3. **Footwear:** Dark Chocolate Suede Loafers or clean minimalist leather dress sneakers.
4. **Detail:** A neat watch with a leather strap matching your shoes.
5. **Grooming:** Clean up your neckline and cheekline stubble the evening before for crisp definition.`;
  }

  return `### ✨ Stylist Insights for You

Based on your **${faceShape}** face geometry and **${palette}** color harmony:

* **Key Silhouette Principle:** Aim for structured shoulders with relaxed, drape-friendly fabrics (linen, heavy cotton, fine knits). This creates an effortless, tailored silhouette.
* **Top Color Palette:** Wear **${topColors}** to illuminate your skin's natural undertones.
* **Immediate Upgrade:** Focus on collar structure—camp collars and open overshirts frame your jawline with modern precision.

*Feel free to ask me for specific scenarios: college presentation, dates, weekend party looks, or budget breakdowns!*`;
}
