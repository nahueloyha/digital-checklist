import { component$ } from "@builder.io/qwik";

import Icon from "~/components/core/icon";

export default component$(() => {
  return (
    <div class="hero mb-8 mx-auto xl:max-w-7xl max-w-6xl w-full xl:px-10">
      <div class="hero-content text-center bg-front shadow-sm lg:rounded-xl w-full flex flex-row items-center justify-center pt-2">
        <Icon class="mr-6" icon="shield" width={70} height={70} />
        <div class="max-w-2xl text-left">
          <h1 class="text-5xl font-bold">Personal Digital Checklist</h1>
          <p class="subtitle">Simple and actionable guide to ensure a baseline of digital best practices</p>
        </div>
      </div>
    </div>
  );
});
