import { ProgramItem, UserProfileState, MatchBreakdown, EligibilityResult } from '../types';
import { CAREERS_DATA } from '../data/careersData';

export function calculateProgramMatch(
  program: ProgramItem,
  profile: UserProfileState
): MatchBreakdown {
  const reasons: string[] = [];
  const warnings: string[] = [];

  // 1. Career Relevance (Max 30)
  let careerRelevanceScore = 26; // Default baseline
  if (profile.targetCareerId && program.careerRelevanceScore[profile.targetCareerId]) {
    const rawRelevance = program.careerRelevanceScore[profile.targetCareerId];
    careerRelevanceScore = Math.round((rawRelevance / 100) * 30);
    const targetCareer = CAREERS_DATA.find((c) => c.id === profile.targetCareerId);
    if (careerRelevanceScore >= 25) {
      reasons.push(`High career relevance (${careerRelevanceScore}/30) for ${targetCareer?.title || 'target role'}`);
    } else {
      reasons.push(`Moderate career relevance (${careerRelevanceScore}/30) for ${targetCareer?.title}`);
    }
  } else if (!profile.targetCareerId) {
    careerRelevanceScore = 26;
    reasons.push(`Open exploration mode active: evaluated without career bias (${careerRelevanceScore}/30)`);
  } else {
    careerRelevanceScore = 18;
    reasons.push(`General academic foundation score: ${careerRelevanceScore}/30`);
  }

  // 2. Skill Coverage (Max 20)
  let skillCoverageScore = 16;
  if (profile.targetCareerId) {
    const targetCareer = CAREERS_DATA.find((c) => c.id === profile.targetCareerId);
    if (targetCareer) {
      const requiredSkills = targetCareer.requiredSkills.map((s) => s.skillId);
      const taughtSkills = program.skillsTaught;
      const matched = requiredSkills.filter((s) => taughtSkills.includes(s));
      const ratio = matched.length / Math.max(1, requiredSkills.length);
      skillCoverageScore = Math.round(ratio * 20);
      reasons.push(
        `Covers ${matched.length}/${requiredSkills.length} essential core skills (${skillCoverageScore}/20)`
      );
    }
  } else {
    skillCoverageScore = 17;
    reasons.push(`Comprehensive curriculum covering European Bologna ECTS competencies (${skillCoverageScore}/20)`);
  }

  // 3. Budget Fit (Max 15)
  const tuition =
    profile.passportOrigin === 'EU / EEA'
      ? program.euTuitionEurAnnual
      : program.nonEuTuitionEurAnnual;
  let budgetScore = 15;
  if (tuition <= profile.annualBudgetEur) {
    budgetScore = 15;
    reasons.push(
      `Full budget compatibility: annual tuition €${tuition.toLocaleString()} is within €${profile.annualBudgetEur.toLocaleString()}`
    );
  } else {
    const diff = tuition - profile.annualBudgetEur;
    const overPercent = diff / profile.annualBudgetEur;
    if (overPercent <= 0.2) {
      budgetScore = 8;
      warnings.push(
        `Tuition (€${tuition.toLocaleString()}) slightly exceeds budget by €${diff.toLocaleString()}/yr`
      );
    } else {
      budgetScore = 3;
      warnings.push(
        `Tuition (€${tuition.toLocaleString()}) exceeds stated budget by €${diff.toLocaleString()}/yr`
      );
    }
  }

  // 4. Language (Max 10)
  let languageScore = 10;
  if (program.language === 'English') {
    languageScore = 10;
    reasons.push('Program taught 100% in English (10/10)');
  } else {
    languageScore = 4;
    warnings.push('Program taught in Polish; requires B2 Polish certificate');
  }

  // 5. Location (Max 10)
  let locationScore = 8;
  if (profile.preferredCity && profile.preferredCity !== 'Any') {
    if (program.institutionCity.toLowerCase() === profile.preferredCity.toLowerCase()) {
      locationScore = 10;
      reasons.push(`Located in preferred city: ${program.institutionCity} (10/10)`);
    } else {
      locationScore = 5;
      warnings.push(`Located in ${program.institutionCity}, different from preferred ${profile.preferredCity}`);
    }
  } else {
    locationScore = 8;
  }

  // 6. Eligibility (Max 10)
  let eligibilityScore = 8;
  if (profile.highSchoolPercentage >= program.academicMinPercentage) {
    eligibilityScore = 10;
    reasons.push(
      `Academic percentage (${profile.highSchoolPercentage}%) satisfies program benchmark (${program.academicMinPercentage}%)`
    );
  } else if (profile.highSchoolPercentage >= program.academicMinPercentage - 5) {
    eligibilityScore = 6;
    warnings.push(
      `Academic percentage (${profile.highSchoolPercentage}%) is borderline for published benchmark (${program.academicMinPercentage}%)`
    );
  } else {
    eligibilityScore = 3;
    warnings.push(
      `Academic percentage (${profile.highSchoolPercentage}%) is below published minimum (${program.academicMinPercentage}%)`
    );
  }

  // 7. Preferences & Provenance (Max 5)
  let preferencesScore = 5;
  if (
    program.verificationStatus === 'VERIFIED_EU_OPEN_REGISTER' ||
    program.verificationStatus === 'VERIFIED_NATIONAL_REGISTER' ||
    program.verificationStatus === 'VERIFIED_RAD_ON_OFFICIAL' ||
    program.verificationStatus === 'OFFICIAL_UNIVERSITY_PORTAL'
  ) {
    preferencesScore = 5;
    reasons.push('Verified in European Higher Education Open Dataset (ETER / National Register)');
  }

  const totalScore = Math.min(
    100,
    careerRelevanceScore +
      skillCoverageScore +
      budgetScore +
      languageScore +
      locationScore +
      eligibilityScore +
      preferencesScore
  );

  return {
    programId: program.id,
    totalScore,
    careerRelevanceScore,
    skillCoverageScore,
    budgetScore,
    languageScore,
    locationScore,
    eligibilityScore,
    preferencesScore,
    reasons,
    warnings,
  };
}

export function evaluateEligibility(
  program: ProgramItem,
  profile: UserProfileState
): EligibilityResult {
  const academicMet = profile.highSchoolPercentage >= program.academicMinPercentage;
  
  // English requirement evaluation
  const userIeltsMatch = profile.englishProficiency.match(/(\d+(\.\d+)?)/);
  const userScore = userIeltsMatch ? parseFloat(userIeltsMatch[1]) : 6.0;
  const englishMet = userScore >= 6.0;

  const tuition =
    profile.passportOrigin === 'EU / EEA'
      ? program.euTuitionEurAnnual
      : program.nonEuTuitionEurAnnual;
  const budgetMet = tuition <= profile.annualBudgetEur * 1.15;

  let status: EligibilityResult['status'] = 'Likely Match';
  if (!academicMet && !englishMet) {
    status = 'Requirement Missing';
  } else if (!academicMet || !englishMet) {
    status = 'Potential Match';
  } else if (!budgetMet) {
    status = 'Requires Verification';
  }

  const documentsChecklist: EligibilityResult['documentsChecklist'] = [
    {
      item: 'Secondary School Leaving Certificate (High School Diploma)',
      status: 'Mandatory Apostille',
      note: 'Must bear an Apostille stamp (Hague) or consular legalization from country of issue.',
    },
    {
      item: 'Eligibility Statement / Certificate',
      status: 'Required',
      note: 'Confirms that your school certificate entitles you to apply to university in the country of origin.',
    },
    {
      item: 'Certified Sworn Translation',
      status: 'Required',
      note: 'Translated into Polish by a sworn translator registered with the Polish Ministry of Justice or Consul.',
    },
    {
      item: 'English Language Competence Certificate',
      status: englishMet ? 'Recommended' : 'Required',
      note: program.englishRequirement,
    },
  ];

  let summaryNote = '';
  if (status === 'Likely Match') {
    summaryNote = `Your profile meets the published academic baseline (${program.academicMinPercentage}%) and language expectations for ${program.institutionName}. Note: Official admission decisions rest solely with the faculty admissions committee upon document verification.`;
  } else if (status === 'Potential Match') {
    summaryNote = `You meet certain core criteria, but your academic score (${profile.highSchoolPercentage}%) or English score is close to the cutoff. Consider applying with strong mathematics transcripts.`;
  } else {
    summaryNote = `One or more published baseline criteria are currently unmet. Verification with the international student office is recommended before submitting application fee.`;
  }

  return {
    programId: program.id,
    status,
    academicMet,
    englishMet,
    budgetMet,
    documentsChecklist,
    summaryNote,
  };
}
