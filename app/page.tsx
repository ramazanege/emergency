"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  HeartPulse,
  ShieldCheck,
  Users,
  RotateCcw,
  Play,
  ArrowRight,
  Scale,
  Stethoscope,
  Image as ImageIcon,
  Skull,
  Building2,
  Globe,
  School,
  Syringe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Scores = {
  ethics: number;
  safety: number;
  career: number;
  publicTrust: number;
};

type OptionEffect = Partial<Scores>;

type Choice = {
  id: string;
  label: string;
  description: string;
  effects?: OptionEffect;
  next: string;
  outcome?: string;
};

type Scene = {
  id: string;
  title: string;
  subtitle?: string;
  text: string;
  icon?: React.ComponentType<{ className?: string }>;
  choices?: Choice[];
  ending?: boolean;
};

const initialScores: Scores = {
  ethics: 50,
  safety: 50,
  career: 50,
  publicTrust: 50,
};

const scenes: Record<string, Scene> = {
  intro: {
    id: "intro",
    title: "Ethics & Emergency Medicine Simulation",
    subtitle: "Choose a case to begin",
    text:
      "Select one of the three scenario tracks from the buttons above. Each scenario explores crisis decision-making, stigma, triage, ethics, and public health pressure.",
    icon: AlertTriangle,
  },

  // AIDS-1
  aids1_start: {
    id: "aids1_start",
    title: "AIDS-1",
    subtitle: "1980s ER scenario",
    text:
      "1980s: A severely ill patient presents to the ER and you have reason to believe he might have AIDS. You are the only doctor on call that night in the ER. You, unfortunately, just cut your hand that morning. The next physician is not on call for another 6 hours. What do you do?",
    icon: Stethoscope,
    choices: [
      {
        id: "aids1-help",
        label: "Help the patient",
        description: "Treat the patient now.",
        effects: { ethics: 20, safety: -15, publicTrust: 10 },
        next: "aids1_test_choice",
      },
      {
        id: "aids1-wait",
        label: "Wait for the next physician",
        description: "Delay care until the next physician arrives.",
        effects: { ethics: -20, safety: 10, publicTrust: -15, career: -5 },
        next: "aids1_wait_outcome",
      },
    ],
  },

  aids1_test_choice: {
    id: "aids1_test_choice",
    title: "AIDS-1",
    subtitle: "After helping the patient",
    text:
      "After several days, you begin to feel ill. You think you might need to get tested, but you are aware that if you test positive, you’ll lose your job, your friends, and your family. Do you choose to be tested?",
    icon: HeartPulse,
    choices: [
      {
        id: "aids1-test-yes",
        label: "Yes",
        description: "Get tested.",
        effects: { ethics: 10, safety: 10, career: -10 },
        next: "aids1_positive_after_test",
      },
      {
        id: "aids1-test-no",
        label: "No",
        description: "Do not get tested yet.",
        effects: { safety: -20, ethics: -5, publicTrust: -5 },
        next: "aids1_positive_after_delay",
      },
    ],
  },

  aids1_positive_after_test: {
    id: "aids1_positive_after_test",
    title: "AIDS-1",
    subtitle: "You test positive",
    text:
      "You test positive. Your world is turned upside down because you are aware of the health and social consequences of having the disease. Do you choose to reveal the results of your test to your employer?",
    icon: AlertTriangle,
    choices: [
      {
        id: "aids1-reveal-yes",
        label: "Yes",
        description: "Reveal the results of your test to your employer.",
        effects: { ethics: 15, safety: 5, career: -20, publicTrust: 5 },
        next: "aids1_reveal_yes_end",
      },
      {
        id: "aids1-reveal-no",
        label: "No",
        description: "Do not reveal the results of your test to your employer.",
        effects: { ethics: -15, safety: -10, career: 5, publicTrust: -10 },
        next: "aids1_reveal_no_end",
      },
    ],
  },

  aids1_positive_after_delay: {
    id: "aids1_positive_after_delay",
    title: "AIDS-1",
    subtitle: "You delayed testing",
    text:
      "You get worse and can no longer go to work. Your partner recommends you get a test, so you get a test. You are positive. Do you choose to reveal the results of your test to your employer?",
    icon: HeartPulse,
    choices: [
      {
        id: "aids1-reveal-delayed-yes",
        label: "Yes",
        description: "Reveal the results of your test to your employer.",
        effects: { ethics: 10, safety: 5, career: -20, publicTrust: 5 },
        next: "aids1_delayed_reveal_yes_end",
      },
      {
        id: "aids1-reveal-delayed-no",
        label: "No",
        description: "Do not reveal the results of your test to your employer.",
        effects: { ethics: -10, safety: -10, career: 5, publicTrust: -10 },
        next: "aids1_delayed_reveal_no_end",
      },
    ],
  },

  aids1_wait_outcome: {
    id: "aids1_wait_outcome",
    title: "AIDS-1",
    subtitle: "After waiting",
    text:
      "Patient’s lab work came and tested positive for influenza and their immune system is very weak. The doctor in the next shift arrives and patient is still alive but there is irreversible damage on their lungs due to late treatment. Patient sues hospital. How do you defend yourself?",
    icon: Scale,
    choices: [
      {
        id: "aids1-defend-safety",
        label: "I was protecting my own safety",
        description: "Defend yourself by arguing that you were protecting your own safety.",
        effects: { ethics: -10, safety: 5, publicTrust: -10, career: -5 },
        next: "aids1_defend_safety_end",
      },
      {
        id: "aids1-defend-waiting",
        label: "I believed waiting was safer",
        description:
          "Defend yourself by arguing that waiting for the next physician was safer.",
        effects: { ethics: -5, career: -10, publicTrust: -10 },
        next: "aids1_defend_policy_end",
      },
      {
        id: "aids1-defend-fear",
        label: "I made the wrong decision under fear",
        description: "Admit that fear shaped your decision.",
        effects: { ethics: 5, career: -10, publicTrust: 0 },
        next: "aids1_defend_admit_end",
      },
    ],
  },

  aids1_reveal_yes_end: {
    id: "aids1_reveal_yes_end",
    title: "AIDS-1 Ending",
    text: "You chose to reveal the results of your test to your employer. Why?",
    icon: Scale,
    ending: true,
  },

  aids1_reveal_no_end: {
    id: "aids1_reveal_no_end",
    title: "AIDS-1 Ending",
    text:
      "You chose not to reveal the results of your test to your employer. Why?",
    icon: AlertTriangle,
    ending: true,
  },

  aids1_delayed_reveal_yes_end: {
    id: "aids1_delayed_reveal_yes_end",
    title: "AIDS-1 Ending",
    text:
      "You delayed testing, then chose to reveal the results of your test to your employer. Why?",
    icon: HeartPulse,
    ending: true,
  },

  aids1_delayed_reveal_no_end: {
    id: "aids1_delayed_reveal_no_end",
    title: "AIDS-1 Ending",
    text:
      "You delayed testing, then chose not to reveal the results of your test to your employer. Why?",
    icon: AlertTriangle,
    ending: true,
  },

  aids1_defend_safety_end: {
    id: "aids1_defend_safety_end",
    title: "AIDS-1 Ending",
    text:
      "You defended yourself by saying you were protecting your own safety.",
    icon: ShieldCheck,
    ending: true,
  },

  aids1_defend_policy_end: {
    id: "aids1_defend_policy_end",
    title: "AIDS-1 Ending",
    text:
      "You defended yourself by saying you believed waiting for the next physician was safer.",
    icon: Scale,
    ending: true,
  },

  aids1_defend_admit_end: {
    id: "aids1_defend_admit_end",
    title: "AIDS-1 Ending",
    text: "You admitted that fear shaped your decision.",
    icon: AlertTriangle,
    ending: true,
  },

  // AIDS-2
  aids2_start: {
    id: "aids2_start",
    title: "AIDS-2",
    subtitle: "Attending bias scenario",
    text:
      "A patient has come in and they are suspected to have AIDS. Your attending refuses to treat the patients who he perceives is homosexual (and he often does this unfairly) or otherwise thinks might have AIDS. Because there are so many patients in the ER, he can always find another patient to treat or relegates his ‘unwanted’ patients to you. Most days, the patient distribution does not make this a problem, but one day, you lose a patient as a result of the attending’s refusal to care. The hospital investigates for negligence and you have the opportunity to report this doctor’s bias. What do you do?",
    icon: Users,
    choices: [
      {
        id: "aids2-report",
        label: "Report doctor",
        description: "Report the doctor’s bias.",
        effects: { ethics: 20, publicTrust: 10, career: -20, safety: -5 },
        next: "aids2_report_end",
      },
      {
        id: "aids2-silent",
        label: "Keep silent",
        description: "Do not report the doctor.",
        effects: { ethics: -20, publicTrust: -15, career: -10 },
        next: "aids2_silent_end",
      },
    ],
  },

  aids2_report_end: {
    id: "aids2_report_end",
    title: "AIDS-2 Ending",
    text:
      "You fail to persuade the hospital and you’ve antagonized your attending, who will likely try to remove you from the residency program.",
    icon: Scale,
    ending: true,
  },

  aids2_silent_end: {
    id: "aids2_silent_end",
    title: "AIDS-2 Ending",
    text:
      "The hospital concludes that you are responsible after the attending points out that the patient was in your care.",
    icon: AlertTriangle,
    ending: true,
  },

  // MANIC-26
  manic26_start: {
    id: "manic26_start",
    title: "MANIC-26",
    subtitle: "Stage 1",
    text: "You are in the ER and you have three patients. Which do you choose to treat?",
    icon: Stethoscope,
    choices: [
      {
        id: "manic26-patient-unhoused",
        label: "First",
        description:
          "A 26-year-old unhoused male presents with hallucinations and mental distress. They show mild flu-like symptoms and claim they need treatment right away.",
        effects: { ethics: 10, safety: 5, publicTrust: 5 },
        next: "manic26_stage2",
        outcome:
          "Treat the unhoused man but he still shows symptoms and doesn’t seem to be getting better. After a few days, one of his nurses starts to show the same symptoms. On a premonition, you send a blood sample from the man for testing.",
      },
      {
        id: "manic26-patient-heart",
        label: "Second",
        description:
          "A 35-year-old father of two toddlers comes in with chest pain at 11 am and a history of two strokes. He states that he felt the pain last night but was on father duty so he couldn’t come in. Preliminary EKG shows a heart attack.",
        effects: { ethics: 5, safety: 0, publicTrust: 0 },
        next: "manic26_stage2",
        outcome:
          "Treat the 35-year-old father and he makes a full recovery. However, his ward neighbour, the unhoused man, shows mild flu-like symptoms and worsens. On a premonition, you send a blood sample from the man for testing.",
      },
      {
        id: "manic26-patient-spine",
        label: "Third",
        description:
          "A 70-year-old woman shows up to the ER with a traumatic injury in spinal cord. They fell down the balcony while watering the plants. X-ray shows several fractures and a metal stuck right next to the spinal cord. They need urgent trauma surgery.",
        effects: { ethics: 5, safety: 0, publicTrust: 0 },
        next: "manic26_stage2",
        outcome:
          "Treat the 70-year-old woman and she makes a full recovery. However, his ward neighbour, the unhoused man, shows mild flu-like symptoms and worsens. On a premonition, you send a blood sample from the man for testing.",
      },
    ],
  },

  manic26_stage2: {
    id: "manic26_stage2",
    title: "MANIC-26",
    subtitle: "Stage 2",
    text:
      "A nurse begins to develop flu-like symptoms but angrily insists that she is fine and can continue working. Since the world has recently recovered from the COVID-19 pandemic, you wonder if she should take off work to avoid infecting patients. However, your ER is severely short-staffed and you cannot afford to lose another staff member. What do you do?",
    icon: ShieldCheck,
    choices: [
      {
        id: "manic26-send-home",
        label: "Send the nurse home",
        description: "",
        effects: { ethics: 10, safety: 15, career: -5, publicTrust: 5 },
        next: "manic26_stage3",
        outcome:
          "The nurse goes home and still feels sick. She tells you that she is getting worse and will not be able to return to work for the rest of the week. She also informs you that her kids are coming down with flu symptoms… You notice more infected patients come to ER but the staff are not getting the infection as much.",
      },
      {
        id: "manic26-keep-working",
        label: "Keep nurse on staff",
        description: "",
        effects: { ethics: -10, safety: -15, career: 5, publicTrust: -5 },
        next: "manic26_stage3",
        outcome:
          "The nurse gets worse as she sees all of her patients. She gets increasingly irritable and you shockingly need to send her home anyway after she gets into an alteration with a patient. The PPE doesn’t seem to be enough to stop the spread as some of her patients and even co-workers develop some severe flu-like symptoms.",
      },
    ],
  },

  manic26_stage3: {
    id: "manic26_stage3",
    title: "MANIC-26",
    subtitle: "Stage 3",
    text:
      "The lab results come back and the pathologist indicates that this disease has never been observed in humans; only mice. She concludes that the disease must be zoonotic. You eerily recall the COVID-19 pandemic and the unhoused man…",
    icon: Building2,
    choices: [
      {
        id: "manic26-expand-testing",
        label: "Test staff and everyone being admitted",
        description:
          "With the experience from COVID-19 pandemic, the hospital decides to test the staff and everyone being admitted. However, this will significantly slow down patient intake and add yet another test to the endless amount of tests in the ER.",
        effects: { ethics: 15, safety: 15, career: -10, publicTrust: 10 },
        next: "manic26_stage4",
        outcome:
          "The hospital expands precautions and testing, but patient intake slows significantly.",
      },
      {
        id: "manic26-avoid-testing",
        label: "Do not waste time with testing precautions",
        description:
          "The hospital decides that the number of patients with the symptom is relatively low so decides not to waste time with testing precautions.",
        effects: { ethics: -10, safety: -10, career: 5, publicTrust: -10 },
        next: "manic26_stage4",
        outcome:
          "The hospital keeps intake moving, but the lack of precautions increases future risk.",
      },
    ],
  },

  manic26_stage4: {
    id: "manic26_stage4",
    title: "MANIC-26",
    subtitle: "Stage 4",
    text:
      "The unhoused man passes away from organ failure and the nurse’s children are hospitalized, all in severe condition. Pathologists conduct an autopsy and investigate the body. They discover an archaea species in their gut which is usually seen in the gut. They receive a stool sample from the nurse and see the same archaea species. Pathologists suspect that this archaea species somehow evolved to live in the human gut microbiome, especially in children, and the gut-brain axis influences the patient's mood and induces hallucinations. Also they discover the replication speed of the archaea is 1 minute/division.",
    icon: Skull,
    choices: [
      {
        id: "manic26-report-gov",
        label: "Report to the Government",
        description:
          "Let the infectious disease control center of the government know about this potential infectious disease.",
        effects: { ethics: 15, safety: 10, career: -5, publicTrust: 10 },
        next: "manic26_stage5",
      },
      {
        id: "manic26-manage-internally",
        label: "Hospital tries to manage the disease",
        description:
          "Pathologist decides to publish the results in a Nature paper (potential for a lot of citation and fame). The Nature journal schedules the publication for 6 months later. Hospital decides to control the disease internally and sees no reason to report the government agencies.",
        effects: { ethics: -10, safety: -10, career: 5, publicTrust: -10 },
        next: "manic26_stage5",
      },
    ],
  },

  manic26_stage5: {
    id: "manic26_stage5",
    title: "MANIC-26",
    subtitle: "Stage 5",
    text:
      "Reports of infections explode across Halu city, ED, USA., with infections mainly from unhoused and low-income folks but the fatality rate is alarmingly high for young children. The news media begins to call the disease the homeless disease and businesses across the city begin to enforce stricter measures to keep unhoused individuals off their property to protect themselves from infection. Your own hospital staff pressures you to evict all unhoused or seemingly unhoused people from the ER, fearing the risk of infection. Patients in the ER also begin to complain more and more ferociously about the risk of getting the “homeless disease.”\n\n*DEBATE STYLE* Use readings 1, 2, and 3 to justify your policy.",
    icon: Globe,
    choices: [
      {
        id: "manic26-support-restrictive",
        label: "You choose to design this policy",
        description: "What will be your justification and how will you design it?",
        effects: { ethics: -20, safety: 5, publicTrust: -10, career: 5 },
        next: "manic26_stage6",
      },
      {
        id: "manic26-refuse-restrictive",
        label: "You choose not to adopt this policy",
        description: "How do you justify this to angry patients?",
        effects: { ethics: 20, safety: -5, publicTrust: 5, career: -5 },
        next: "manic26_stage6",
      },
    ],
  },

  manic26_stage6: {
    id: "manic26_stage6",
    title: "MANIC-26",
    subtitle: "Stage 6",
    text:
      "The disease becomes an official epidemic named Multiple Archaea Novel Infectious Condition (MANIC-26). No effective treatment has been developed. You learn that the disease is highly infectious, but debate rages about how transmissible it is. Reports of severe fatality rates among young children headline the news, causing extreme fear in the city. Parents pressure schools to close after reports of a class of hospitalized kindergarteners breaks out. The mayor, KFR Sr., says that there is nothing to worry about and this is just the flu. He recommends that people take Tylenol. The school district does not offer online classes and indicates that it is safe to bring children to school.",
    icon: School,
    choices: [
      {
        id: "manic26-pull-children",
        label: "Pull your children from school",
        description:
          "You decide to pull your children (6, 7 and 11) from school but each day they miss school counts as a truancy and you are aware that your kids will get more and more behind.",
        effects: { ethics: 0, safety: 10, publicTrust: -5 },
        next: "manic26_stage7",
      },
      {
        id: "manic26-keep-children",
        label: "Keep your children in school",
        description: "You keep your children in school.",
        effects: { ethics: 5, safety: -10, publicTrust: 5 },
        next: "manic26_stage7",
      },
    ],
  },

  manic26_stage7: {
    id: "manic26_stage7",
    title: "MANIC-26",
    subtitle: "Stage 7",
    text:
      "The Balhara lab develops an antiarchaeobiotic (BALHARA - Biologic Agent Lowering Hallucinatory Archaeal Risk Acuity), which disrupts the monolayer lipid membrane of the archaea. It’s an effective treatment, but everyone is fighting to access it. You are contacted by the World Health Organization to make a recommendation about how to distribute the limited treatment. The main question is whether to distribute it mainly to countries with higher amounts of low-income folks, who seem to be more likely to contract the disease, or to hold it in reserve for children, for whom the disease is much more fatal.\n\nWhat is your recommendation?",
    icon: Syringe,
    choices: [
      {
        id: "manic26-prioritize-low-income",
        label: "Prioritize countries with higher amounts of low-income folks",
        description:
          "Distribute treatment mainly to countries with higher amounts of low-income folks, who seem to be more likely to contract the disease.",
        effects: { ethics: 15, publicTrust: 10, safety: 0, career: -5 },
        next: "manic26_stage8",
      },
      {
        id: "manic26-prioritize-children",
        label: "Hold it in reserve for children",
        description:
          "Reserve treatment for children, for whom the disease is much more fatal.",
        effects: { ethics: 10, publicTrust: 5, safety: 5, career: 0 },
        next: "manic26_stage8",
      },
    ],
  },

  manic26_stage8: {
    id: "manic26_stage8",
    title: "MANIC-26",
    subtitle: "Stage 8",
    text:
      "The MANIC-26 pandemic recedes as more drugs are developed, but the lasting social damage and stigma to the low-income and unhoused echoes throughout Halu City. Your hospital staff showed increased resistance to treating unhoused people or seemingly unhoused people. You feel generally confident about the decisions that you made during the pandemic but wonder what more could have been done.\n\nReflection: How did that make you feel? What was surprising?",
    icon: AlertTriangle,
    ending: true,
  },
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function applyEffects(current: Scores, effects?: OptionEffect): Scores {
  if (!effects) return current;
  return {
    ethics: current.ethics + (effects.ethics ?? 0),
    safety: current.safety + (effects.safety ?? 0),
    career: current.career + (effects.career ?? 0),
    publicTrust: current.publicTrust + (effects.publicTrust ?? 0),
  };
}

function getScenarioImage(sceneId: string) {
  if (sceneId.startsWith("aids1") || sceneId.startsWith("aids2")) {
    return {
      src: "/hiv.jpeg",
      alt: "HIV/AIDS scenario image",
    };
  }

  if (sceneId === "manic26_start") {
    return { src: "/er.png", alt: "Emergency room scene" };
  }
  if (sceneId === "manic26_stage2") {
    return { src: "/nurse.jpeg", alt: "Nurse image" };
  }
  if (sceneId === "manic26_stage3") {
    return { src: "/test.png", alt: "Testing image" };
  }
  if (sceneId === "manic26_stage4") {
    return { src: "/autopsy.jpg", alt: "Autopsy image" };
  }
  if (sceneId === "manic26_stage5") {
    return { src: "/unhoused.jpg", alt: "Unhoused image" };
  }
  if (sceneId === "manic26_stage6") {
    return { src: "/school.jpeg", alt: "School image" };
  }
  if (sceneId === "manic26_stage7") {
    return { src: "/treatment.jpeg", alt: "Treatment image" };
  }
  if (sceneId === "manic26_stage8") {
    return { src: "/arcaea.jpeg", alt: "Archaea image" };
  }

  return null;
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardContent className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Icon className="h-4 w-4" />
            {label}
          </div>
          <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs">
            {value}
          </Badge>
        </div>
        <Progress value={clamp(value)} className="h-2" />
      </CardContent>
    </Card>
  );
}

function getOutcomeLabel(scores: Scores) {
  const total = scores.ethics + scores.safety + scores.career + scores.publicTrust;
  if (total >= 240) return "Principled but difficult path";
  if (total >= 180) return "Mixed consequences";
  return "Fear, pressure, and crisis dominated the outcome";
}

function startLabel(sceneId: string) {
  if (sceneId.startsWith("aids1")) return "AIDS-1";
  if (sceneId.startsWith("aids2")) return "AIDS-2";
  if (sceneId.startsWith("manic26")) return "MANIC-26";
  return "Intro";
}

export default function EthicsDecisionGame() {
  const [currentSceneId, setCurrentSceneId] = useState<string>("intro");
  const [scores, setScores] = useState<Scores>(initialScores);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  const currentScene = scenes[currentSceneId];
  const currentIcon = currentScene.icon ?? AlertTriangle;
  const summaryLabel = useMemo(() => getOutcomeLabel(scores), [scores]);
  const currentImage = getScenarioImage(currentSceneId);

  const resetGame = () => {
    setCurrentSceneId("intro");
    setScores(initialScores);
    setSelectedChoice(null);
  };

  const startScenario = (sceneId: string) => {
    setCurrentSceneId(sceneId);
    setScores(initialScores);
    setSelectedChoice(null);
  };

  const chooseOption = (choice: Choice) => {
    if (selectedChoice) return;
    setScores((prev) => applyEffects(prev, choice.effects));
    setSelectedChoice(choice);
  };

  const goNext = () => {
    if (!selectedChoice) return;
    setCurrentSceneId(selectedChoice.next);
    setSelectedChoice(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-rose-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <Card className="overflow-hidden rounded-[24px] border-0 bg-slate-950 text-white shadow-xl">
            <CardContent className="p-6 md:p-7">
              <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-rose-300">
                Emergency Medicine Student Activity
              </div>

              <h1 className="max-w-3xl text-2xl font-bold leading-tight md:text-4xl">
                Ethics Decision Game
              </h1>

              <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
                Choose a scenario track and guide the class through difficult clinical and ethical decisions.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={() => startScenario("aids1_start")}
                  size="lg"
                  className="rounded-2xl bg-white px-5 text-black hover:bg-slate-200"
                >
                  AIDS-1 Scenario
                </Button>
                <Button
                  onClick={() => startScenario("aids2_start")}
                  size="lg"
                  className="rounded-2xl bg-white px-5 text-black hover:bg-slate-200"
                >
                  AIDS-2 Scenario
                </Button>
                <Button
                  onClick={() => startScenario("manic26_start")}
                  size="lg"
                  className="rounded-2xl bg-white px-5 text-black hover:bg-slate-200"
                >
                  MANIC-26 Scenario
                </Button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge className="rounded-full bg-white/10 px-3 py-1.5 text-white hover:bg-white/10">
                  Current track: {startLabel(currentSceneId)}
                </Badge>
                <Badge className="rounded-full bg-white/10 px-3 py-1.5 text-white hover:bg-white/10">
                  Branching + sequential play
                </Badge>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={resetGame}
                  size="lg"
                  className="rounded-2xl border border-white/20 bg-transparent px-5 text-white hover:bg-white/10"
                >
                  {currentSceneId === "intro" ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Restart from Intro
                    </>
                  ) : (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset Game
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <StatCard label="Ethics" value={scores.ethics} icon={Scale} />
            <StatCard label="Safety" value={scores.safety} icon={ShieldCheck} />
            <StatCard label="Career" value={scores.career} icon={Users} />
            <StatCard label="Public Trust" value={scores.publicTrust} icon={HeartPulse} />
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSceneId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="rounded-[24px] border-0 shadow-xl">
                <CardHeader className="pb-3">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3">
                      {React.createElement(currentIcon, {
                        className: "h-6 w-6 text-slate-700",
                      })}
                    </div>
                    <div>
                      <CardTitle className="text-3xl leading-tight">
                        {currentScene.title}
                      </CardTitle>
                      {currentScene.subtitle ? (
                        <p className="mt-1 text-base text-slate-500">
                          {currentScene.subtitle}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-6 whitespace-pre-line rounded-2xl bg-slate-50 p-6 text-lg leading-8 text-slate-700 md:text-xl md:leading-9">
                    {currentScene.text}
                  </div>

                  {!currentScene.ending && currentScene.choices ? (
                    <div className="grid gap-4">
                      {currentScene.choices.map((choice) => {
                        const isChosen = selectedChoice?.id === choice.id;
                        const locked = !!selectedChoice;

                        return (
                          <motion.button
                            whileHover={!locked ? { y: -2 } : {}}
                            whileTap={!locked ? { scale: 0.995 } : {}}
                            key={choice.id}
                            disabled={locked}
                            onClick={() => chooseOption(choice)}
                            className={`rounded-[24px] border p-6 text-left transition-all ${
                              isChosen
                                ? "border-slate-900 bg-slate-900 text-white shadow-xl"
                                : locked
                                  ? "border-slate-200 bg-slate-100 text-slate-400"
                                  : "border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md"
                            }`}
                          >
                            <div className="mb-2 text-xl font-semibold md:text-2xl">
                              {choice.label}
                            </div>
                            {choice.description ? (
                              <p
                                className={`text-base leading-7 md:text-lg ${
                                  isChosen ? "text-slate-200" : "text-slate-600"
                                }`}
                              >
                                {choice.description}
                              </p>
                            ) : null}
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : null}

                  <AnimatePresence>
                    {selectedChoice && !currentScene.ending && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="mt-6 rounded-[24px] bg-emerald-50 p-6"
                      >
                        <div className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                          Choice locked in
                        </div>
                        <p className="text-lg font-semibold text-slate-800 md:text-xl">
                          {selectedChoice.label}
                        </p>

                        {selectedChoice.outcome ? (
                          <p className="mt-3 text-base leading-7 text-slate-700 md:text-lg">
                            {selectedChoice.outcome}
                          </p>
                        ) : selectedChoice.description ? (
                          <p className="mt-3 text-base leading-7 text-slate-700 md:text-lg">
                            {selectedChoice.description}
                          </p>
                        ) : null}

                        {selectedChoice.effects ? (
                          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                            {"ethics" in selectedChoice.effects && (
                              <Badge
                                variant="secondary"
                                className="justify-center rounded-full py-2 text-sm"
                              >
                                Ethics{" "}
                                {(selectedChoice.effects.ethics ?? 0) >= 0 ? "+" : ""}
                                {selectedChoice.effects.ethics}
                              </Badge>
                            )}
                            {"safety" in selectedChoice.effects && (
                              <Badge
                                variant="secondary"
                                className="justify-center rounded-full py-2 text-sm"
                              >
                                Safety{" "}
                                {(selectedChoice.effects.safety ?? 0) >= 0 ? "+" : ""}
                                {selectedChoice.effects.safety}
                              </Badge>
                            )}
                            {"career" in selectedChoice.effects && (
                              <Badge
                                variant="secondary"
                                className="justify-center rounded-full py-2 text-sm"
                              >
                                Career{" "}
                                {(selectedChoice.effects.career ?? 0) >= 0 ? "+" : ""}
                                {selectedChoice.effects.career}
                              </Badge>
                            )}
                            {"publicTrust" in selectedChoice.effects && (
                              <Badge
                                variant="secondary"
                                className="justify-center rounded-full py-2 text-sm"
                              >
                                Public Trust{" "}
                                {(selectedChoice.effects.publicTrust ?? 0) >= 0 ? "+" : ""}
                                {selectedChoice.effects.publicTrust}
                              </Badge>
                            )}
                          </div>
                        ) : null}

                        <div className="mt-5 flex justify-end">
                          <Button onClick={goNext} className="rounded-2xl px-5 text-base">
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {currentScene.ending ? (
                    <div className="mt-6 rounded-[24px] bg-amber-50 p-6">
                      <div className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
                        Ending reached
                      </div>
                      <p className="text-lg text-slate-800 md:text-xl">
                        Outcome summary: <span className="font-semibold">{summaryLabel}</span>
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Button onClick={resetGame} className="rounded-2xl px-5 text-base">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Back to Intro
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <Card className="rounded-[24px] border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImageIcon className="h-5 w-5" />
                Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-[24px] border-2 border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="overflow-hidden rounded-[20px] bg-white">
                  {currentImage ? (
                    <div className="relative h-[260px] w-full">
                      <Image
                        src={currentImage.src}
                        alt={currentImage.alt}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-[220px] flex-col items-center justify-center text-center text-slate-500">
                      <ImageIcon className="mb-3 h-10 w-10 text-slate-400" />
                      <p className="text-base font-medium">Image Placeholder</p>
                      <p className="mt-1 text-sm">
                        Choose a scenario to display an image
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}