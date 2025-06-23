import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import { useLocalStorage } from "~/hooks/useLocalStorage";
import { useSimpleChecklist } from "~/store/simple-checklist-store";

/**
 * Component for client-side user progress metrics.
 * Calculates percentage completion for the simplified checklist.
 */
export default component$(() => {

  const { checklist } = useSimpleChecklist();
  const [checkedItems] = useLocalStorage('PSC_PROGRESS', {});
  const totalProgress = useSignal({ completed: 0, outOf: 0 });

  const updateProgress = $(() => {
    if (checklist.checklist) {
      const total = checklist.checklist.length;
      let completed = 0;
      
      checklist.checklist.forEach(item => {
        const id = item.point.toLowerCase().replace(/ /g, '-');
        if (checkedItems.value && checkedItems.value[id]) {
          completed++;
        }
      });
      
      totalProgress.value = { completed, outOf: total };
    }
  });

  // Update when checklist loads or checkedItems changes
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => checklist.checklist);
    track(() => checkedItems.value);
    updateProgress();
  });

  return (
    <div class="hero mb-8 mx-auto xl:max-w-7xl max-w-6xl w-full xl:px-10">
      <div class="hero-content bg-front shadow-sm lg:rounded-xl w-full flex-col items-start">
        <h3 class="text-2xl font-bold">Your Progress</h3>
        <p>You've completed {totalProgress.value.completed} out of {totalProgress.value.outOf} items</p>
        <progress
          class="progress progress-primary w-full mt-2"
          value={totalProgress.value.completed}
          max={totalProgress.value.outOf}
        ></progress>
      </div>
    </div>
  );
});

