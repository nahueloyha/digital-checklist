import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <header>
      <div class="navbar bg-front shadow-sm lg:rounded-xl w-full">
        <div class="flex-1">
          <a href="/" class="btn btn-ghost normal-case text-xl">Digital Checklist</a>
        </div>
      </div>
    </header>
  );
});
