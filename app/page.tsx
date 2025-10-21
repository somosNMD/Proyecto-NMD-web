import { cookies } from "next/headers";
import { HeroExperience } from "@/modules/experience-shell/hero";
import { getActs } from "@/modules/content-connector/sanity/getActs";

const SUPPORTED_LANGUAGES = ["es", "en"];

export default async function Page() {
  const actsEntries = await Promise.all(
    SUPPORTED_LANGUAGES.map(async (language) => [language, await getActs({ language })] as const)
  );

  const actsByLanguage = Object.fromEntries(actsEntries);

  const cookieStore = cookies();
  const storedPreference = cookieStore.get("md_preferences")?.value;
  let initialLanguage = "es";

  if (storedPreference) {
    try {
      const decoded = JSON.parse(decodeURIComponent(storedPreference)) as { language?: string };
      if (decoded.language && SUPPORTED_LANGUAGES.includes(decoded.language)) {
        initialLanguage = decoded.language;
      }
    } catch {
      initialLanguage = "es";
    }
  }

  return (
    <main>
      <HeroExperience actsByLanguage={actsByLanguage} initialLanguage={initialLanguage} />
    </main>
  );
}
