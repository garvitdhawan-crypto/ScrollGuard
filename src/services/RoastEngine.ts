export type RoastIntensity = 'Friendly' | 'Funny' | 'Savage' | 'Nuclear';

export interface RoastInput {
  appName: string;
  reelsScrolled: number;
  screenTimeSeconds: number;
  intensity: RoastIntensity;
}

export interface RoastResult {
  message: string;
  escalationLevel: 'mild' | 'moderate' | 'high' | 'critical';
  roastStyle: 'flicker' | 'zombie' | 'overload' | 'calm';
}

/**
 * RoastEngine
 *
 * Escalating offline template roast generator that distinguishes:
 * 1. "Flickers" (High scroll count in brief time -> mindless slot machine thumb flicking).
 * 2. "Zombies" (High time spent with low scroll count -> hypnotic trance on whole videos).
 * 3. "Overload" (Both high reels count and heavy screen time -> total dopamine meltdown).
 * 4. "Calm" (Low count and controlled time -> positive reinforcement).
 */
export class RoastEngine {
  /**
   * Evaluates usage metrics and produces an escalating roast message.
   */
  static generateRoast(input: RoastInput): RoastResult {
    const { appName, reelsScrolled, screenTimeSeconds, intensity } = input;
    const minutes = Math.floor(screenTimeSeconds / 60);

    // Classification
    const isOverload = reelsScrolled >= 40 && minutes >= 25;
    const isFastFlicker = reelsScrolled >= 30 && minutes < 15;
    const isZombieTrance = minutes >= 20 && reelsScrolled < 15;

    let escalationLevel: 'mild' | 'moderate' | 'high' | 'critical' = 'mild';
    let roastStyle: 'flicker' | 'zombie' | 'overload' | 'calm' = 'calm';

    if (isOverload || reelsScrolled >= 60 || minutes >= 45) {
      escalationLevel = 'critical';
      roastStyle = 'overload';
    } else if (isFastFlicker) {
      escalationLevel = 'high';
      roastStyle = 'flicker';
    } else if (isZombieTrance) {
      escalationLevel = 'moderate';
      roastStyle = 'zombie';
    } else if (reelsScrolled > 15 || minutes > 10) {
      escalationLevel = 'moderate';
      roastStyle = 'flicker';
    }

    const templates = this.getTemplates(intensity, roastStyle, escalationLevel);
    const randomIndex = Math.floor(Math.random() * templates.length);
    const selectedTemplate = templates[randomIndex] || templates[0];

    const message = selectedTemplate
      .replace('{appName}', appName)
      .replace('{count}', reelsScrolled.toString())
      .replace('{minutes}', minutes.toString())
      .replace('{seconds}', (screenTimeSeconds % 60).toString());

    return {
      message,
      escalationLevel,
      roastStyle,
    };
  }

  private static getTemplates(
    intensity: RoastIntensity,
    style: 'flicker' | 'zombie' | 'overload' | 'calm',
    _level: 'mild' | 'moderate' | 'high' | 'critical',
  ): string[] {
    switch (intensity) {
      case 'Friendly':
        if (style === 'calm') {
          return [
            'Great focus! Only {count} reels and {minutes}m on {appName}. Keep protecting your time.',
            'Light browsing today. Your focus fortress remains strong.',
          ];
        }
        if (style === 'flicker') {
          return [
            'Your thumb is moving quickly! That was {count} {appName} videos in just {minutes}m. Maybe take a stretch?',
            'Flicking fast today! {count} short videos already. Take a breath and hydrate.',
          ];
        }
        if (style === 'zombie') {
          return [
            '{minutes} minutes spent watching {appName}. Time flies when videos loop! How about stepping away?',
            'You have been resting in {appName} for {minutes}m. A quick break would feel refreshing.',
          ];
        }
        return [
          'You have watched {count} reels over {minutes} minutes on {appName}. Let us get back to your real goals!',
          'Notice how fast {minutes}m passed? {count} clips watched. Time to close {appName} for now.',
        ];

      case 'Funny':
        if (style === 'flicker') {
          return [
            'You flicked through {count} clips in {minutes}m. Is your thumb training for the Olympic speed-scrolling team on {appName}?',
            'Average attention span: 3 seconds. {count} reels skipped like stones on a dopamine lake.',
          ];
        }
        if (style === 'zombie') {
          return [
            '{minutes} minutes on just {count} clips. Did the video loop 40 times while you stared into the void?',
            'Watching complete strangers dance for {minutes} straight minutes. Truly high-yield investment.',
          ];
        }
        if (style === 'overload') {
          return [
            'Ding ding! {count} reels and {minutes} minutes gone into {appName}. Your future self is tapping you on the shoulder asking for a refund.',
            'Breaking news: {count} short videos watched. Zero life problems solved.',
          ];
        }
        return [
          'Under control so far on {appName}. Do not let the algorithm hypnotize you.',
          'Just {count} clips. The algorithm is currently scheming to drag you in deeper.',
        ];

      case 'Savage':
        if (style === 'flicker') {
          return [
            '{count} reels flicked in {minutes}m. Your attention span is now officially shorter than a goldfish on espresso.',
            'Thumb running faster than your life ambitions: {count} meaningless clips scrolled in {minutes}m.',
          ];
        }
        if (style === 'zombie') {
          return [
            '{minutes} minutes frozen staring at {appName}. The algorithm owns your brainwaves right now.',
            'You sat paralyzed for {minutes}m watching looped nonsense. Your goals are collecting dust.',
          ];
        }
        if (style === 'overload') {
          return [
            '{count} reels and {minutes} minutes sacrificed to the dopamine gods. Was any single one of them worth remembering?',
            'You just flushed {minutes} minutes and {count} reels down the toilet. Put the phone down.',
          ];
        }
        return [
          'Only {count} clips on {appName}. Keep it that way or face the wrath.',
        ];

      case 'Nuclear':
        if (style === 'flicker') {
          return [
            '🚨 BRAIN ROT ALERT: {count} reels flicked! Your dopamine receptors are completely fried. Close {appName} right now!',
            'CRITICAL OVER-SCROLL: {count} micro-doses of trash consumed in {minutes}m. Put down the device before your neurons collapse.',
          ];
        }
        if (style === 'zombie') {
          return [
            '🚨 CATATONIC STATE DETECTED: {minutes} minutes wasted sitting motionless on {appName}. Wake up!',
            'EMERGENCY LOCKDOWN RECOMMENDED: {minutes} full minutes drained. You are literally being farmed for ad revenue.',
          ];
        }
        if (style === 'overload') {
          return [
            '☠️ FULL ADDICTION DETECTED: {count} reels over {minutes} minutes! Total loss of willpower. Step away from {appName} immediately!',
            '☠️ SHUTDOWN IMMINENT: {minutes} minutes burnt, {count} reels consumed. Delete the app or delete your ambitions.',
          ];
        }
        return [
          'DEFCON 4: {count} reels on {appName}. Dangerously close to an escalated lock out.',
        ];
    }
  }

  /**
   * Extension point for future LLM integration (Gemini, Claude, or local on-device models).
   * Falls back to offline templates if network or API key is absent.
   */
  static async generateLLMRoast(
    input: RoastInput,
    apiKey?: string,
  ): Promise<RoastResult> {
    if (!apiKey) {
      // Offline fallback
      return this.generateRoast(input);
    }

    try {
      // Future integration: call Gemini / LLM endpoint here
      // e.g. fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey)
      return this.generateRoast(input);
    } catch {
      return this.generateRoast(input);
    }
  }
}
