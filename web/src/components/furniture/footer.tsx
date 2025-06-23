import { component$ } from "@builder.io/qwik";

export default component$(() => {

  const originalGhLink = 'https://github.com/Lissy93/personal-security-checklist/';
  const adaptedGhLink = 'https://github.com/nahueloyha/personal-security-checklist/';
  const licenseLink = 'https://github.com/Lissy93/personal-security-checklist/blob/master/LICENSE';
  const aliciaWebsite = 'https://aliciasykes.com';
  const userWebsite = 'https://nahueloyha.com';

  return (
  <footer class="footer footer-center px-4 py-2 mt-4 text-base-content bg-base-200 bg-opacity-25">
    <aside>
      <p>
        <a href={originalGhLink} class="link link-primary">Original</a> by <a href={aliciaWebsite} class="link link-primary">Alicia Sykes</a> | <a href={adaptedGhLink} class="link link-primary">Adapted</a> by <a href={userWebsite} class="link link-primary">Nahuel Oyha</a> | 
        Licensed under <a href={licenseLink} class="link link-primary">MIT</a>
      </p>
    </aside>
  </footer>
  );
});
