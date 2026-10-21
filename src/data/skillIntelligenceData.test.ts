import { describe, expect, it } from "vitest";
import {
  DEFAULT_12_SKILLS,
  proficiencyToBloom,
  scoreToCriticality,
} from "./skillIntelligenceData";

describe("Skill Intelligence Engine", () => {
  it("maps proficiency scores to Bloom taxonomy correctly according to specification", () => {
    // 1-2 -> CU
    expect(proficiencyToBloom(1).code).toBe("CU");
    expect(proficiencyToBloom(2).code).toBe("CU");

    // 3-4 -> AP
    expect(proficiencyToBloom(3).code).toBe("AP");
    expect(proficiencyToBloom(4).code).toBe("AP");

    // 5-6 -> AS
    expect(proficiencyToBloom(5).code).toBe("AS");
    expect(proficiencyToBloom(6).code).toBe("AS");

    // 7-8 -> EV
    expect(proficiencyToBloom(7).code).toBe("EV");
    expect(proficiencyToBloom(8).code).toBe("EV");

    // 9-10 -> CR
    expect(proficiencyToBloom(9).code).toBe("CR");
    expect(proficiencyToBloom(10).code).toBe("CR");
  });

  it("maps scores to criticality tiers correctly", () => {
    // >= 7 -> Critical
    expect(scoreToCriticality(10).level).toBe("Critical");
    expect(scoreToCriticality(7).level).toBe("Critical");

    // >= 5 and < 7 -> Important
    expect(scoreToCriticality(6).level).toBe("Important");
    expect(scoreToCriticality(5).level).toBe("Important");

    // < 5 -> Baseline
    expect(scoreToCriticality(4).level).toBe("Baseline");
    expect(scoreToCriticality(1).level).toBe("Baseline");
  });

  it("contains exactly 12 skills with 10 roadmap levels each", () => {
    expect(DEFAULT_12_SKILLS).toHaveLength(12);

    for (const skill of DEFAULT_12_SKILLS) {
      expect(skill.requiredScore).toBeGreaterThanOrEqual(1);
      expect(skill.requiredScore).toBeLessThanOrEqual(10);
      expect(skill.roadmap).toHaveLength(10);

      // Verify level numbering and stage division
      skill.roadmap.forEach((step, idx) => {
        expect(step.level).toBe(idx + 1);
        if (step.level <= 3) {
          expect(step.stage).toBe("Fundamentals");
        } else if (step.level <= 7) {
          expect(step.stage).toBe("Intermediate");
        } else {
          expect(step.stage).toBe("Advanced");
        }
      });
    }
  });
});
