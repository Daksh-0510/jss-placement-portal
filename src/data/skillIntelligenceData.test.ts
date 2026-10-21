import { describe, expect, it } from "vitest";
import {
  DEFAULT_12_SKILLS,
  proficiencyToBloom,
  scoreToCriticality,
  transformCompanySkills,
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

  describe("transformCompanySkills", () => {
    it("returns empty array when company is null or undefined", () => {
      expect(transformCompanySkills(null)).toEqual([]);
      expect(transformCompanySkills(undefined)).toEqual([]);
    });

    it("returns empty array when company has empty skill levels", () => {
      expect(transformCompanySkills({ company_skill_levels: [] })).toEqual([]);
      expect(transformCompanySkills({ name: "Acme Corp" })).toEqual([]);
    });

    it("correctly maps and sorts dynamic company skill levels", () => {
      const mockCompany = {
        company_name: "Tech Corp",
        company_skill_levels: [
          {
            skill_set_id: 1,
            skill: "Coding",
            required_level: 8,
            proficiency: "Evaluate",
            proficiency_code: "EV",
          },
          {
            skill_set_id: 2,
            skill: "Operating System",
            required_level: 4,
            proficiency: "Apply",
            proficiency_code: "AP",
          },
          {
            skill_set_id: 3,
            skill: "AI Native Engineering",
            required_level: 9,
            proficiency: "Create",
            proficiency_code: "CR",
          },
        ],
      };

      const result = transformCompanySkills(mockCompany);
      expect(result).toHaveLength(3);

      // Verify sorting descending by requiredScore: 9, 8, 4
      expect(result[0]?.name).toBe("AI Native Engineering");
      expect(result[0]?.requiredScore).toBe(9);
      expect(result[0]?.category).toBe("Data Science & AI");
      expect(result[0]?.roadmap).toHaveLength(10);

      expect(result[1]?.name).toBe("Coding");
      expect(result[1]?.requiredScore).toBe(8);
      expect(result[1]?.category).toBe("Software Engineering");
      expect(result[1]?.roadmap).toHaveLength(10);

      expect(result[2]?.name).toBe("Operating System");
      expect(result[2]?.requiredScore).toBe(4);
      expect(result[2]?.category).toBe("Low-Level & OS");
      expect(result[2]?.roadmap).toHaveLength(10);
    });
  });
});
