"use client";

import React, { useMemo, useState } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Scores = {
  ethics: number;
  safety: number;
  capacity: number;
  publicTrust: number;
};

type OptionEffect = Partial<Scores>;

type Choice = {
  id: string;
  label: string;
  description: string;
  effects?: OptionEffect;
  next: string;
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
  capacity: 50,
  publicTrust: 50,
};

const scenes: Record<string, Scene> = {
  intro: {
    id: "intro",
    title: "MANIC-26",
    subtitle: "Multiple Archaea Novel Infectious Condition",
    text:
      "You are in the ER at noon and you have three patients. Which patient do you choose to treat?",
    icon: AlertTriangle,
    choices: [
      {
        id: "choose-unhoused",
        label: "First: treat the 26-year-old unhoused male",
        description:
          "He presents with hallucinations and mental distress. He shows mild flu-like symptoms and claims he needs treatment right away.",
        effects: { ethics: 10, safety: -5, capacity: -5, publicTrust: 5 },
        next: "patient_unhoused",
      },
      {
        id: "choose-father",
        label: "Second: treat the 35-year-old father",
        description:
          "He has chest pain, a history of two strokes, and a preliminary EKG showing a heart attack.",
        effects: { ethics: 8, safety: 0, capacity: -5, publicTrust: 5 },
        next: "patient_father",
      },
      {
        id: "choose-woman",
        label: "Third: treat the 70-year-old woman",
        description:
          "She has a traumatic spinal injury, several fractures, and needs urgent trauma surgery.",
        effects: { ethics: 8, safety: 0, capacity: -5, publicTrust: 5 },
        next: "patient_woman",
      },
    ],
  },

  patient_unhoused: {
    id: "patient_unhoused",
    title: "The Unhoused Man",
    text:
      "You treat the unhoused man but he still shows symptoms and does not seem to be getting better. After a few days, one of his nurses starts to show the same symptoms. On a premonition, you send a blood sample from the man for testing.",
    icon: Stethoscope,
    choices: [
      {
        id: "continue-to-nurse",
        label: "Continue",
        description: "Several days later, a nurse begins to show symptoms.",
        next: "nurse_scene",
      },
    ],
  },

  patient_father: {
    id: "patient_father",
    title: "The Father of Two",
    text:
      "You treat the 35-year-old father and he makes a full recovery. However, his ward neighbour, the unhoused man, shows mild flu-like symptoms and worsens. On a premonition, you send a blood sample from the man for testing.",
    icon: HeartPulse,
    choices: [
      {
        id: "continue-to-nurse",
        label: "Continue",
        description: "Several days later, a nurse begins to show symptoms.",
        next: "nurse_scene",
      },
    ],
  },

  patient_woman: {
    id: "patient_woman",
    title: "The 70-Year-Old Woman",
    text:
      "You treat the 70-year-old woman and she makes a full recovery. However, her ward neighbour, the unhoused man, shows mild flu-like symptoms and worsens. On a premonition, you send a blood sample from the man for testing.",
    icon: HeartPulse,
    choices: [
      {
        id: "continue-to-nurse",
        label: "Continue",
        description: "Several days later, a nurse begins to show symptoms.",
        next: "nurse_scene",
      },
    ],
  },

  nurse_scene: {
    id: "nurse_scene",
    title: "The Symptomatic Nurse",
    text:
      "A nurse begins to develop flu-like symptoms after several days but angrily insists that she is fine and can continue working. Since the world has recently recovered from the COVID-19 pandemic, you wonder if she should take off work to avoid infecting patients. The ER is often jam-packed. However, the ER is severely short-staffed and you cannot afford to lose another staff member. What do you do?",
    icon: Users,
    choices: [
      {
        id: "send-home",
        label: "Send the nurse home",
        description:
          "The nurse goes home and still feels sick. She tells you she is getting worse and will not be able to return to work for the rest of the week. She also informs you that her kids are coming down with flu symptoms. You notice more patients coming to the ER lately with flu-like symptoms even though it is no longer flu season.",
        effects: { ethics: 10, safety: 10, capacity: -15, publicTrust: 0 },
        next: "testing_policy",
      },
      {
        id: "keep-staff",
        label: "Keep the nurse on staff",
        description:
          "The nurse gets worse throughout the day as she sees all of her patients. She gets increasingly irritable and you need to intervene after she gets into an altercation with a patient. The PPE does not seem to be enough to stop the spread as some of her patients and even co-workers develop severe flu-like symptoms, and you cannot tell if this was nosocomial transmission.",
        effects: { ethics: -10, safety: -15, capacity: 10, publicTrust: -10 },
        next: "testing_policy",
      },
    ],
  },

  testing_policy: {
    id: "testing_policy",
    title: "Testing Policy",
    text:
      "The lab results come back and the pathologist indicates that this disease has never been observed in humans; only mice. She preliminarily hints that the disease might be zoonotic. You eerily recall the COVID-19 pandemic and the unhoused man. With the experience from COVID-19, one option is for the hospital to test the staff and everyone being admitted. However, this will significantly slow down patient intake and add yet another test to the endless amount of tests in the ER. The other option is not to waste time with testing precautions because the number of patients with the symptom is relatively low and it could just be the flu.",
    icon: ShieldCheck,
    choices: [
      {
        id: "test-everyone",
        label: "Test staff and everyone being admitted",
        description:
          "Adopt broad testing precautions despite the burden on intake and ER workflow.",
        effects: { ethics: 10, safety: 15, capacity: -20, publicTrust: 5 },
        next: "autopsy_results",
      },
      {
        id: "no-testing",
        label: "Do not implement testing precautions",
        description:
          "Avoid slowing down the ER because the number of infections still seems relatively low.",
        effects: { ethics: -10, safety: -15, capacity: 10, publicTrust: -5 },
        next: "autopsy_results",
      },
    ],
  },

  autopsy_results: {
    id: "autopsy_results",
    title: "Autopsy Findings",
    text:
      "The unhoused man passes away from organ failure and the nurse’s children are hospitalized, all in severe condition. Pathologists conduct an autopsy and investigate the body. They discover an archaea species in his gut which is usually seen in the gut of mice. They receive a stool sample from the nurse and see the same archaea species. Pathologists suspect that this archaea species somehow evolved to live in the human gut microbiome, especially in children, and the gut-brain axis influences the patient’s mood and induces hallucinations. They also discover that the replication speed of the archaea is 1 minute per division. What do you do next?",
    icon: AlertTriangle,
    choices: [
      {
        id: "report-government",
        label: "Report to the government",
        description:
          "Let the infectious disease control center know about this potential infectious disease.",
        effects: { ethics: 15, safety: 15, capacity: -5, publicTrust: 10 },
        next: "policy_debate",
      },
      {
        id: "manage-internally",
        label: "Let the hospital manage the disease internally",
        description:
          "A pathologist decides to publish the results in a Nature paper, scheduled for 6 months later. The hospital sees no reason to report government agencies.",
        effects: { ethics: -15, safety: -10, capacity: 5, publicTrust: -10 },
        next: "policy_debate",
      },
    ],
  },

  policy_debate: {
    id: "policy_debate",
    title: "The 'Homeless Disease' Debate",
    subtitle: "Debate style",
    text:
      "Reports of infections explode across Halu City, ED, USA, with infections mainly from unhoused and low-income folks, but the fatality rate is alarmingly high for young children. The media begins to call the disease the 'homeless disease' and businesses across the city begin to enforce stricter measures to keep unhoused individuals off their property. Your own hospital staff pressures you to evict all unhoused or seemingly unhoused people from the ER, fearing the risk of infection. Patients in the ER also begin to complain more and more ferociously about the risk of getting the 'homeless disease.' You choose to design this policy. How will you respond?",
    icon: Scale,
    choices: [
      {
        id: "adopt-policy",
        label: "Adopt the exclusion policy",
        description:
          "Support stricter exclusion of unhoused or seemingly unhoused patients from the ER in the name of infection control.",
        effects: { ethics: -25, safety: 5, capacity: 10, publicTrust: -15 },
        next: "school_decision",
      },
      {
        id: "reject-policy",
        label: "Do not adopt the policy",
        description:
          "Reject the exclusion policy and justify that decision to angry patients and hospital staff.",
        effects: { ethics: 20, safety: -5, capacity: -5, publicTrust: 10 },
        next: "school_decision",
      },
    ],
  },

  school_decision: {
    id: "school_decision",
    title: "School or Home?",
    text:
      "The disease becomes an official epidemic named Multiple Archaea Novel Infectious Condition (MANIC-26). No effective treatment has been developed. You learn that the disease is highly infectious, but debate rages about how transmissible it is. Reports of severe fatality rates among young children headline the news, causing extreme fear in the city. Parents pressure schools to close after reports of a class of hospitalized kindergarteners breaks out. The mayor, KFR Sr., says that there is nothing to worry about and this is just the flu. He recommends that people take Tylenol. The school district declines to offer online classes and indicates that it is safe to bring children to school. You have children ages 6, 7, and 11. What do you do?",
    icon: Users,
    choices: [
      {
        id: "pull-children",
        label: "Pull your children from school",
        description:
          "Each day they miss school counts as truancy, and you know they will fall behind.",
        effects: { ethics: 5, safety: 15, capacity: -5, publicTrust: 0 },
        next: "drug_allocation",
      },
      {
        id: "keep-school",
        label: "Keep your children in school",
        description:
          "You accept the risk of infection in order to keep them in class.",
        effects: { ethics: 0, safety: -15, capacity: 5, publicTrust: 0 },
        next: "drug_allocation",
      },
    ],
  },

  drug_allocation: {
    id: "drug_allocation",
    title: "BALHARA Allocation",
    subtitle: "Debate style",
    text:
      "The Balhara lab develops an antiarchaeobiotic, BALHARA (Biologic Agent Lowering Hallucinatory Archaeal Risk Acuity), which disrupts the monolayer lipid membrane of the archaea. It is an effective treatment, but everyone is fighting to access it. You are contacted by the World Health Organization to make a recommendation about how to distribute the limited treatment. The main question is whether to distribute it mainly to areas with higher amounts of low-income folks, who seem more likely to contract the disease, or to hold it in reserve for children, for whom the disease is much more fatal. What is your recommendation?",
    icon: Scale,
    choices: [
      {
        id: "allocate-low-income",
        label: "Prioritize areas with higher amounts of low-income folks",
        description:
          "Focus on the populations that appear most likely to contract the disease.",
        effects: { ethics: 10, safety: 5, capacity: -5, publicTrust: 10 },
        next: "reflection_end",
      },
      {
        id: "allocate-children",
        label: "Hold the treatment in reserve for children",
        description:
          "Prioritize those with the highest fatality risk.",
        effects: { ethics: 10, safety: 10, capacity: -5, publicTrust: 5 },
        next: "reflection_end",
      },
    ],
  },

  reflection_end: {
    id: "reflection_end",
    title: "Reflection",
    text:
      "The MANIC-26 pandemic recedes as more drugs are developed, but the lasting social damage and stigma toward low-income and unhoused people echoes throughout Halu City. Your hospital staff showed increased resistance to treating unhoused people or seemingly unhoused people. You feel generally confident about the decisions that you made during the pandemic but wonder what more could have been done. Reflection: How did that make you feel? What was surprising?",
    icon: HeartPulse,
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
    capacity: current.capacity + (effects.capacity ?? 0),
    publicTrust: current.publicTrust + (effects.publicTrust ?? 0),
  };
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
    <Card className="rounded-2xl border-0 shadow-md">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Icon className="h-4 w-4" />
            {label}
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
            {value}
          </Badge>
        </div>
        <Progress value={clamp(value)} className="h-2" />
      </CardContent>
    </Card>
  );
}

function getOutcomeLabel(scores: Scores) {
  const total =
    scores.ethics + scores.safety + scores.capacity + scores.publicTrust;

  if (total >= 240) return "Principled but difficult path";
  if (total >= 180) return "Mixed consequences";
  return "Fear, overload, and stigma dominated the outcome";
}

export default function MANIC26DecisionGame() {
  const [currentSceneId, setCurrentSceneId] = useState<string>("intro");
  const [scores, setScores] = useState<Scores>(initialScores);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  const currentScene = scenes[currentSceneId];
  const currentIcon = currentScene.icon ?? AlertTriangle;
  const summaryLabel = useMemo(() => getOutcomeLabel(scores), [scores]);

  const resetGame = () => {
    setCurrentSceneId("intro");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-rose-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]"
        >
          <Card className="overflow-hidden rounded-[28px] border-0 bg-slate-950 text-white shadow-2xl">
            <CardContent className="p-8 md:p-10">
              <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-rose-300">
                Emergency Medicine Student Activity
              </div>
              <h1 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
                MANIC-26 Decision Game
              </h1>
              <p className="mt-4 max-w-3xl text-base text-slate-300 md:text-lg">
                A branching classroom simulation based on triage, outbreak response,
                stigma, and public health decisions during a fictional epidemic.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/10">
                  Branching scenarios
                </Badge>
                <Badge className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/10">
                  Debate decisions
                </Badge>
                <Badge className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/10">
                  Social consequences
                </Badge>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={resetGame} size="lg" className="rounded-2xl px-6">
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <StatCard label="Ethics" value={scores.ethics} icon={Scale} />
            <StatCard label="Safety" value={scores.safety} icon={ShieldCheck} />
            <StatCard label="Capacity" value={scores.capacity} icon={Users} />
            <StatCard label="Public Trust" value={scores.publicTrust} icon={HeartPulse} />
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSceneId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="rounded-[28px] border-0 shadow-xl">
                <CardHeader className="pb-3">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3">
                      {React.createElement(currentIcon, {
                        className: "h-6 w-6 text-slate-700",
                      })}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{currentScene.title}</CardTitle>
                      {currentScene.subtitle ? (
                        <p className="mt-1 text-sm text-slate-500">
                          {currentScene.subtitle}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-5 rounded-2xl bg-slate-50 p-5 text-slate-700">
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
                            className={`rounded-[24px] border p-5 text-left transition-all ${
                              isChosen
                                ? "border-slate-900 bg-slate-900 text-white shadow-xl"
                                : locked
                                ? "border-slate-200 bg-slate-100 text-slate-400"
                                : "border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md"
                            }`}
                          >
                            <div className="mb-2 text-lg font-semibold">{choice.label}</div>
                            <p
                              className={`text-sm ${
                                isChosen ? "text-slate-200" : "text-slate-600"
                              }`}
                            >
                              {choice.description}
                            </p>
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
                        className="mt-6 rounded-[24px] bg-emerald-50 p-5"
                      >
                        <div className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                          Choice locked in
                        </div>
                        <p className="text-slate-800">{selectedChoice.label}</p>

                        {selectedChoice.effects ? (
                          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                            {"ethics" in selectedChoice.effects && (
                              <Badge variant="secondary" className="justify-center rounded-full py-2">
                                Ethics {(selectedChoice.effects.ethics ?? 0) >= 0 ? "+" : ""}
                                {selectedChoice.effects.ethics}
                              </Badge>
                            )}
                            {"safety" in selectedChoice.effects && (
                              <Badge variant="secondary" className="justify-center rounded-full py-2">
                                Safety {(selectedChoice.effects.safety ?? 0) >= 0 ? "+" : ""}
                                {selectedChoice.effects.safety}
                              </Badge>
                            )}
                            {"capacity" in selectedChoice.effects && (
                              <Badge variant="secondary" className="justify-center rounded-full py-2">
                                Capacity {(selectedChoice.effects.capacity ?? 0) >= 0 ? "+" : ""}
                                {selectedChoice.effects.capacity}
                              </Badge>
                            )}
                            {"publicTrust" in selectedChoice.effects && (
                              <Badge variant="secondary" className="justify-center rounded-full py-2">
                                Public Trust {(selectedChoice.effects.publicTrust ?? 0) >= 0 ? "+" : ""}
                                {selectedChoice.effects.publicTrust}
                              </Badge>
                            )}
                          </div>
                        ) : null}

                        <div className="mt-5 flex justify-end">
                          <Button onClick={goNext} className="rounded-2xl px-5">
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {currentScene.ending ? (
                    <div className="mt-6 rounded-[24px] bg-amber-50 p-5">
                      <div className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
                        Ending reached
                      </div>
                      <p className="text-slate-800">
                        Outcome summary: <span className="font-semibold">{summaryLabel}</span>
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Button onClick={resetGame} className="rounded-2xl px-5">
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

          <Card className="rounded-[28px] border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ImageIcon className="h-5 w-5" />
                Image Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] border-2 border-dashed border-slate-300 bg-slate-50 p-6">
                <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[20px] bg-white text-center text-slate-500">
                  <ImageIcon className="mb-3 h-10 w-10 text-slate-400" />
                  <p className="text-base font-medium">Image Placeholder 1</p>
                  <p className="mt-1 text-sm">Replace this with your downloaded image</p>
                </div>
              </div>

              <div className="rounded-[24px] border-2 border-dashed border-slate-300 bg-slate-50 p-6">
                <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[20px] bg-white text-center text-slate-500">
                  <ImageIcon className="mb-3 h-10 w-10 text-slate-400" />
                  <p className="text-base font-medium">Image Placeholder 2</p>
                  <p className="mt-1 text-sm">Replace this with your downloaded image</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}