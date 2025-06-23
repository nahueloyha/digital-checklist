import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from "@builder.io/qwik-city";

import Hero from "~/components/furniture/hero";
import SimpleChecklistTable from "~/components/psc/simple-checklist-table";
import { useSimpleChecklist } from "~/store/simple-checklist-store";

export default component$(() => { 
  const { checklist } = useSimpleChecklist();

  return (
    <>
      <Hero />
      {checklist.checklist && (
        <div class="hero mb-8 mx-auto xl:max-w-7xl max-w-6xl w-full xl:px-10">
          <div class="hero-content bg-front shadow-sm lg:rounded-xl w-full flex-col items-start">
            <h3 class="text-2xl font-bold mb-4">Simple Security Checklist</h3>
            <SimpleChecklistTable items={checklist.checklist} />
          </div>
        </div>
      )}
    </>
  );
});

export const head: DocumentHead = {
  title: "Digital Checklist",
  meta: [
    {
      name: "description",
      content: "Personal digital checklist, for securing your digital life.",
    },
  ],
};
